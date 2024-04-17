import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteImageOnCloudinary, getPublicId, uploadOnCloudinary } from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";
import { generateOtp } from "../utils/OtpGen.js";
import {sendEmail} from "../utils/SendEmail.js"
import bcrypt from "bcryptjs"


const options={
  httpOnl:true,
  secured:true
}


const genRefreshAndAccessToken=async(userId)=>{
  try {
    const user = await User.findById(userId)

    const accessToken =  user.genAccessToken()
    const refreshToken =  user.genRefreshToken()

    user.refreshToken=refreshToken
    user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}
  } catch (error) {
     throw new ApiError(500,error.message)
  }
}


const signUp = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(402).send(new ApiError(402, "fields Are required"));
    }

    const isUserAlready = await User.find({ email });

    if (isUserAlready.length) {
      return res
        .status(402)
        .send(new ApiError(409, "User is already registered"));
    }

    const registerOtp =  generateOtp()

    const otpExpirey = Date.now() + (60000 * 5);

    const isSent = await sendEmail(username,email,registerOtp)
    console.log(isSent);
    if(!isSent){
      return res
      .status(500)
      .send("server error please signup again")
    }

    const signedUpuser = await User.create({
      username,
      email,
      password,
      registerOtp,
      otpExpirey,
    });
    
    return res
      .status(200)
      .json(new ApiResponse(200, signedUpuser, "user SignUp Succesfuly")); 

  } catch (err) {
    return res.status(500).send(new ApiError(500, err.message));
  }

};


//verify user through Otp
const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { userOTP } = req.body;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(402).send(new ApiError(409, "Id is not defined"));
    }

    if(user.isVerified){
      return res
      .status(404)
      .send("user is alerady verified")
    }
     
    const isOtpValid = user.otpExpirey > Date.now();

    if (!isOtpValid) {
      return res.status(404).send(new ApiError(404, "Otp is Expired"));
    }
     
    
    if (user.registerOtp != userOTP) {
      return res.status(402).send(new ApiError(402, "Wrong Otp"));
    }
     
    user.isVerified=true;
    user.otpExpirey = null;
    await user.save({validateBeforeSave:false})

    return res
      .status(200)
      .json(new ApiResponse(200, user, "successfully verifed"));

  } catch (err) {
   return res.status(500).send(new ApiError(500, err.message));
  }
};


//refresh Otp 
const refreshOtp = async (req, res) => {
  try {
    const {id} = req.params;

    const user = await User.findById(id).select("-password")

    if(!user){
        return res.status(404).send(new ApiError(404, "user not found"));
    }

    if(user.isVerified){
      return res
      .status(404)
      .send("user is alerady verified")
    } 

    user.registerOtp=null;
    user.otpExpirey=null;
    await user.save({validateBeforeSave:false})


    const newOtp = generateOtp();
    const newotpExpirey = Date.now() + (60000*5)

    user.registerOtp=newOtp;
    user.otpExpirey=newotpExpirey;
    await user.save({validateBeforeSave:false})
    
    await sendEmail(user.username,user.email,newOtp)

    return res.status(200).json(
        new ApiResponse(200,user,"otp refreshed")
    );

  } catch (err) {
    return res.status(500).send(new ApiError(500, err.message));
  }    
};


//loging in user
const loginUser= async(req,res)=>{

  try {
    const {username,email,password} = req.body
    
    if(!password){
      return res
      .status(402)
      .send(new ApiError(402,"password is required"))
    }
    
    if(!username && !email){
      return res
      .status(402)
      .send(new ApiError(402,"email or username is required"))
    }
    
    let user = null

    if(email)
    user = await User.findOne({email}).select("-refreshToken")
    else
    user = await User.findOne({username}).select("-refreshToken")

    if(!user){
      return res
      .status(402)
      .send(new ApiError(409,"username is incorrect"))
    }

    const isValidPass = await user.isCorrectPassword(password)

    if(!isValidPass){
      return res
      .status(402)
      .send(new ApiError(402,"password is wrong!"))

    }

    const {accessToken,refreshToken} = await genRefreshAndAccessToken(user._id)

    if(!accessToken || !refreshToken){
      return res
      .status(500)
      .send(new ApiError(500,"something went wrong while generating tokens"))

    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,user,"logged in"))

  } catch (err) {
    return res
    .status(500)
    .send(new ApiError(500,err))
  }

}


const updateAvatar=async(req,res)=>{

  try {
    const avatar = req.file?.path
    
    const user = await User.findById(req.user?._id)

    if(!avatar){
      return res
      .status(402)
      .send(new ApiError(402,"avatar not provided"))
    }

    if(user.avatar){
     const publicId =  getPublicId(user.avatar)
     await deleteImageOnCloudinary(publicId)
    }

    const avatarURI = await uploadOnCloudinary(avatar)
    user.avatar = avatarURI.secure_url
    user.save({validateBeforeSave:false})
   
    return res
    .status(200)
    .json(new ApiResponse(200,user,"update successsfully"))

  } catch (error) {
    return res
    .status(500)
    .send(new ApiError(500,error.message))
  }

}


const resetPassswordSendOtp=async(req,res)=>{
  try {
    const { email } = req.body

    if(!email){
     return res
     .status(402)
     .send(new ApiError(402,"provide an email!"))
    }

    const user = await User.findOne({email:email})

    if(!user){
      return res
      .status(409)
      .send(new ApiError(409,"email is not registered"))
    }
    
    const otp =  generateOtp()
    user.resetOtp=otp;
    user.otpExpirey = Date.now() + (60000 * 5)
    user.save({validateBeforeSave:false})

    await sendEmail(user.username,email,otp)

    return res
    .status(200)
    .json(
      new ApiResponse(200,{},"rset code sent successfully")
    )

  } catch (error) {
    return res
    .status(500)
    .send(new ApiError(500,"something went wrong"))
  }
}

const verifyOtp=async(req,res)=>{
  try {
     const {otp,email} = req.body
     
     if(!otp || !email){
      return res
      .status(402)
      .send(new ApiError(402,"something you not providen!"))
     }

     const user = await User.findOne({email:email})

     const isValidOtp = user.otpExpirey > Date.now();

     if(!isValidOtp){
      return res
      .status(400)
      .send(new ApiError(400,"otp expired"))
     }

     if(user.resetOtp!=otp){
      return res
      .status(402)
      .send(new ApiError(402,"wrong credentials!"))
     }

     return res
     .status(200)
     .json(
      new ApiResponse(200,{},"otp verified")
     )
  } catch (error) {
    return res
    .status(500)
    .send(new ApiError(500,"something went wrong"))
  }
}

const changePassword=async(req,res)=>{
  try {
    const {newPass,email} = req.body
   
    const user = await User.findOne({email})

    user.password = newPass
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(
      new ApiResponse(200,{},"password reset successfully")
    )

  } catch (error) {
    return res
    .status(500)
    .send(new ApiError(500,"something went wrong"))
  }
}

const logOut = async(req,res)=>{
  try {
    const loggedUser = req.user

    if(!loggedUser){
      return res
      .status(409)
      .send(new ApiError(409,"something went wrong"))
    }

    const user = await User.findById(loggedUser._id)

    user.refreshToken=null
    user.save({validateBeforeSave:false})

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"logged out"))

  } catch (error) {
    console.log(error);
    return res
    .status(500)
    .send(new ApiError(500,"something went wrong"))
  }
}


const getCurrentUser=async(req,res)=>{
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken -registerOtp -otpExpirey -resetOtp')

    if(!user){
      return res
      .status(404)
      .send(new ApiError(404,"Session has expired"))
    }
     
    return res
    .status(200)
    .json(
      new ApiResponse(200,user,"user fetched successfully")
    )

  } catch (error) {
    return res
    .status(500)
    .send(new ApiError(500,err))
  }

}

export {
     signUp,
     verifyUser,
     refreshOtp,
     loginUser,
     updateAvatar,
     resetPassswordSendOtp,
     verifyOtp,
     changePassword,
     logOut,
     getCurrentUser
};
