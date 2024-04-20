
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"



export const Authentication=async(req,res,next)=>{
  try {
    const token = await req.cookies.refreshToken || req.header("Authorization")?.replace("Bearer ","")
    
    console.log("req.cookie",req.cookies.refreshToken)
    console.log("header",req.header("Authorization"))
    console.log(token)
    
    if(!token){
        return res
        .status(500)
        .send(new ApiError(500,"token not found or expired"))
    }

    const decodedToken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
    if(!user){
       return res
       .status(500)
       .send(new ApiError(500,"user not found by token"))
  
    }
    
    req.user = await user
    next()

  } catch (error) {
    return res
    .status(500)
    .send(new ApiError(500,"authentication failure"))
  }
}