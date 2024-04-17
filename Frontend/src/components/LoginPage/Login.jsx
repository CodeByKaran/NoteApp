import React,{useEffect, useRef, useState} from 'react'
import axios from 'axios'
import { FaRegEyeSlash } from "react-icons/fa";
import {useNavigate,Link} from "react-router-dom" 
import { showAlert, showSuccessMessage } from '../../Hooks/useShowAlert'
import {useDispatch} from "react-redux"
import {setUser} from "../../func/features/loginData/loginSlice.js"
import { togglEye } from '../../Hooks/usePassHS.js';
import { FiLoader } from "react-icons/fi";
import { GET_USER } from '../../helper/getCurrentUser.js';
import { getItem } from '../../helper/localStorage.js';


export default function Login({userLogged}) {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const usernameRef = useRef()
  const passRef = useRef()

  const [loading,setLoading] = useState(false)
 
  const login=async(e)=>{
    e.preventDefault()
    setLoading(true)
    const username = usernameRef.current.value
    const email = usernameRef.current.value
    const password = passRef.current.value
    const credentials = {
      username,password,email
    }

    try {
      const {data} = await axios.post("/api/v1/users/login",credentials)   
      if(data.data.isVerified){
        if(data.statusCode==200){
          setLoading(false)
          dispatch(setUser(data.data))
          userLogged(true)
          navigate(`/home/${data.data._id}`)
          showSuccessMessage("logged In")
        }else{
          showAlert(data.response.data.message)
          setLoading(false)
        }
    }else{
       showAlert("please verify YourSelf")
    }
    } catch (error) {
       showAlert(error.response.data.message);
       setLoading(false)
    }
  }

  useEffect(()=>{
    const isUserLogged = getItem("isLogged")
    if(isUserLogged==="false"){
      return
    }
    GET_USER()
    .then(res=>{
      navigate(`/home/${res.data._id}`)
    })
    .catch(error=>console.log(error))
  },[])

  return (
    <div className='h-[100vh] w-full flex justify-center items-center select-none'>
    <div className='p-2 rounded-lg h-fit w-[300px] border border-gray-400/50 md:w-[350px] flex flex-col items-center px-7 shadow-lg bg-white'>
     <h1 className='w-full text-center cursor-default'>Login</h1>
     <form className=' w-full mt-5'>
      <div className='flex flex-col items-start'>
      <label htmlFor="username" className='text-[13px] text-gray-500 ml-[2px] mt-2 flex w-full pl-[2px]'>Username,Email</label>
      <input type="text" name="username" className='border-gray-700 border-b mt-1 outline-none text-[14px] focus:scale-110 transition-all duration-300 placeholder:text-gray-300 w-full' placeholder='karan12u' ref={usernameRef} autoComplete='false' spellCheck="false" id='username'/>
      <label htmlFor="loginPass" className='text-[13px] text-gray-500 ml-[2px] mt-2 flex w-full pl-[2px]'>Password</label>
      <div className='relative w-full flex items-center mt-1 '>
      <input type="password" name="password" className='border-gray-700 border-b outline-none text-[14px] focus:scale-110 transition-all duration-300 placeholder:text-gray-300 w-full' placeholder='#gs#@gs' ref={passRef} id='loginPass' spellCheck="false"/>
      <FaRegEyeSlash className='absolute  top-0 right-2 text-[14px]' onClick={()=>togglEye("loginPass")}/>
      </div> 
      <Link to="/forget/otp" className='text-[12px] text-start mt-4 text-blue-800 underline underline-offset-2'>forget pasword?</Link>
      </div>
       <button type="submit" className="text-[15px] bg-gradient-to-tr from-orange-400 to-yellow-200 rounded-md mt-5 text-gray-700 font-[500] w-[100px] flex justify-center items-center h-[35px] pb-[2px]  transition-all duration-300 hover:shadow-lg select-none" onClick={login}>
        {
          !loading?"Login":<FiLoader className='text-[18px] animate-spin'/>
        }
        </button>
     </form>
     <p className='text-gray-500 text-[12px] mt-7 cursor-default'>Not registered ? <Link to="/" className='text-indigo-600 underline-offset-2 hover:underline select-none'>SignUp</Link></p>
    </div>
  </div>
  )
}
