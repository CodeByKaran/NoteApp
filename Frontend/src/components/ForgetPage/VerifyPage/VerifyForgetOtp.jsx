import React, { useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { getItem } from '../../../helper/localStorage'
import { showAlert, showSuccessMessage } from '../../../Hooks/useShowAlert'
import axios from 'axios'

export default function VerifyForgetOtp() {

   const navigate = useNavigate()
   const otpRef = useRef()

   const VerifyResetPass=async(e)=>{
    e.preventDefault()
    try {
      const config = {
        email: getItem("email"),
        otp : otpRef.current.value
      }

      if(!config.otp){
        showAlert("otp is required")
        return
      }

      const {data} = await axios.post('/api/v1/users/reset-password/otp/verify',config)

      if(data.statusCode==200){
        showSuccessMessage("otp is verified")       
        navigate("/forget/change-pass")
      }else{
        showAlert(data.message)
      }     

    } catch (error) {
      showAlert(error.response.data.message || "something went wrong")
    }
   }

  return (
    <div className='w-fit bg-white rounded-lg shadow-xl flex flex-col p-2 px-6 py-3 items-center'>
      <h2 className='text-start text-sm font-mono font-semibold'>Step-2</h2>
      <form className='flex flex-col mt-[32px] items-center' onSubmit={VerifyResetPass}>
        <label htmlFor="forgetEmail" className='text-start text-[14px] w-full px-[2px]'>OTP</label>
        <input type="number" className='border  mt-1 rounded placeholder:text-[14px] p-1 text-[15px] outline-none focus-within:border-gray-600 remove_Num_Pad' placeholder='xxxx' spellCheck="false" maxLength="4" ref={otpRef}/>
      </form>
      <button className='mt-[50px] text-[16px] bg-gradient-to-br from-orange-400 to-orange-300 p-1 rounded-full w-[90px] font-semibold text-slate-800 shadow-md hover:scale-95' onClick={VerifyResetPass}>Verify</button>
    </div>
  )
}
