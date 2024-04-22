import React, { useRef,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showAlert, showSuccessMessage } from '../../../Hooks/useShowAlert'
import { clearLocal, getItem, setAnyLocal } from '../../../helper/localStorage'
import axios from 'axios'
import { FiLoader } from "react-icons/fi";


export default function Pass() {

 const navigate = useNavigate() 
 const newPassRef = useRef()
 const confirmPassRef = useRef()
 const [loading,setLoading] = useState(false)


  const changePass=async(e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      if(newPassRef.current.value!==confirmPassRef.current.value){
        showAlert("password should be match")
        setLoading(false)
        return
      }

      const config={
        email: getItem("email"),
        newPass : newPassRef.current.value
      }

      if(!config.newPass){
        showAlert("password is required")
        return
      }

      
      const res = await fetch("https://noteapp-aznr.onrender.com/api/v1/users/reset-password/otp/verify/pass",{
        method:"POST",
        body: JSON.stringify(config),
        headers:{
         "Content-Type": "application/json",
        }
      })
      
      const data = await res.json() 
      
  
      if(data.statusCode==200){
        clearLocal("email")
        showSuccessMessage("password changed")       
        navigate("/login")
      }else{
        showAlert(data.message)
      }     
    } catch (error) {
      showAlert(error.response.data.message || "something went wrong")
    } finally {
      setLoadind(false)
    }
  }

  return (
    <div>
        <div className='w-fit bg-white rounded-lg shadow-xl flex flex-col p-2 px-6 py-3 items-center'>
      <h2 className='text-start text-sm font-mono font-semibold'>Step-3</h2>
      <form className='flex flex-col mt-[32px] items-center' >
        <label htmlFor="newPass" className='text-start text-[14px] w-full px-[2px]'>New Password</label>
        <input type="text" className='border  mt-1 rounded placeholder:text-[14px] p-1 text-[15px] outline-none focus-within:border-gray-600' placeholder='@kksg#sk' spellCheck="false" ref={newPassRef}/>
        <label htmlFor="ConfirmPass" className='text-start text-[14px] w-full px-[2px] mt-4'>Confirm Password</label>
        <input type="text" className='border mt-1 rounded placeholder:text-[14px] p-1 text-[15px] outline-none focus-within:border-gray-600' placeholder='@kksg#sk' spellCheck="false" ref={confirmPassRef}/>
      </form>
      <button className='mt-[50px] text-[16px] bg-gradient-to-br from-orange-400 to-orange-300 p-1 rounded-full w-[90px] font-semibold text-slate-800 shadow-md hover:scale-95' onClick={changePass} disabled={loading}>
      {
        !loading?"Reset":<FiLoader className='text-[18px] animate-spin'/>
        }</button>
    </div>
    </div>
  )
}
