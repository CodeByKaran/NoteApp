import React, { useState } from 'react'
import Otp from './OtpStep/Otp'
import VerifyForgetOtp from './VerifyPage/VerifyForgetOtp'
import { Outlet, Route, Routes } from 'react-router-dom'


export default function Forget() {
   

  return (
    <div className='h-[100vh] w-[80%] md:w-[50%] sm:w-[50%] lg:w-[40%] flex justify-center items-center'>
        <Outlet/>   
    </div>
  )
}
