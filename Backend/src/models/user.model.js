import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username should be  provided"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "email should be provided"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password should be provided"],
    },
    avatar: {
      type: String,
      default:null
    },
    registerOtp:{
      type:Number
    },
    resetOtp:{
      type : Number
    },
    otpExpirey:{
      type:Number
    },
    isVerified:{
      type:Boolean,
      default: false
    },
    refreshToken:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next()
   this.password = await bcrypt.hash(this.password,10)
   next()
})


userSchema.methods.isCorrectPassword=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.genRefreshToken=function(){
  return jwt.sign(
    {
      _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

userSchema.methods.genAccessToken=function(){
  return jwt.sign(
    {
      _id:this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}


export const User = mongoose.model("User",userSchema);