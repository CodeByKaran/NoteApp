import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { showAlert, showSuccessMessage } from '../../../Hooks/useShowAlert'
import axios from "axios"
import { setAnyLocal } from '../../../helper/localStorage'

export default function Otp() {

   const navigate = useNavigate()
   const emailRef = useRef()

  const sendOtp=async(e)=>{
    e.preventDefault()
    try {
      const email = emailRef.current.value
      if(!email){
        showAlert("email is required")
        return
      }
      const {data} = await axios.post('/api/v1/users/reset-password/otp',{email})
      if(data.statusCode==200){
        setAnyLocal("email",email)
        showSuccessMessage("otp has been sent to email")       
        navigate("/forget/verify")
      }else{
        showAlert(data.message)
      }     
    } catch (error) {
      showAlert(error.response.data.message || "something went wrong")
    }
    
  }

  return (
    <div className='w-fit bg-white rounded-lg shadow-xl flex flex-col p-2 px-6 py-3 items-center select-none'>
      <h2 className='text-start text-sm font-mono font-semibold'>Step-1</h2>
      <form className='flex flex-col mt-[32px] items-center' onSubmit={sendOtp}>
        <label htmlFor="forgetEmail" className='text-start text-[14px] w-full px-[2px]'>Email</label>
        <input type="email" className='border  mt-1 rounded placeholder:text-[14px] p-1 text-[15px] outline-none focus-within:border-gray-600' placeholder='example@gmail.com' spellCheck="false" id='forgetEmail' ref={emailRef}/>
      </form>
      <button className='mt-[50px] text-[16px] bg-gradient-to-br from-orange-400 to-orange-300 p-1 rounded-full w-[90px] font-semibold text-slate-800 shadow-md hover:scale-95' onClick={sendOtp}>Next</button>
    </div>
  )
}
