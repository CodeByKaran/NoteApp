import React,{useRef,useState,useEffect} from 'react'
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { showAlert } from '../../Hooks/useShowAlert'
import { FaRegEyeSlash } from 'react-icons/fa'
import { togglEye } from '../../Hooks/usePassHS'
import { FiLoader } from "react-icons/fi";
import { GET_USER } from '../../helper/getCurrentUser.js';


export default function SignUp() {
  
  const navigate = useNavigate()
  const usernameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const [logging,setLogging] = useState(false)
  const [isSearching,setIsSearching]=useState(false)

  const signUpuser=async(e)=>{
    e.preventDefault()
    console.log("run")
    setLogging(true)

    let userCredentials={
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    
    try {

    const res = await fetch("https://noteapp-aznr.onrender.com/api/v1/users/signup",
        {
          method: "POST",
          body: JSON.stringify(userCredentials),
          headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
         },
          mode: "cors",
          redirect: "follow", 
        }
      )
      const data = await res.json()
      setLogging(false)
      if(data.statusCode===200){
        navigate(`/verify/${data.data._id}`)
      }else{
        showAlert(data.message)
        setLogging(false)
      }
    } catch (error) {
      showAlert(error.message)
      setLogging(false)
    }
  }
  
  useEffect(()=>{
     setIsSearching(true)
    GET_USER()
    .then(res=>{
      navigate(`/home/${res.data._id}`)
      setIsSearching(false)
    })
    .catch(error=>setIsSearching(false))
  },[])
   
  return (
    <div className='h-[100vh] w-full flex justify-center items-center select-none'>
    {
       isSearching?<FiLoader className="animate-spin text-3xl text-orange-600"/>:
      <div className='p-2 rounded-lg h-fit w-[300px] border border-gray-400/50 md:w-[350px] flex flex-col items-center px-7 shadow-md bg-white'>
       <h1 className='w-full text-center cursor-default'>SignUp</h1>
       <form className=' w-full mt-5'>
        <div className='flex flex-col items-center'>
        <label htmlFor="signupusername" className='text-[13px] text-gray-500 ml-[2px] mt-2 flex w-full pl-[2px]'>Username</label>
        <input type="text" name="username" className='border-gray-700 border-b mt-1 outline-none text-[14px] focus:scale-110 transition-all duration-300 placeholder:text-gray-300 w-full' placeholder='karan12u' ref={usernameRef} spellCheck="false" id='signupusername' autoComplete='true'/>
        <label htmlFor="signupemail" className='text-[13px] text-gray-500 ml-[2px] mt-2 flex w-full pl-[2px]'>Email</label>
        <input type="email" name="email" className='border-gray-700 border-b mt-1 outline-none text-[14px] focus:scale-110 transition-all duration-300 placeholder:text-gray-300 w-full' placeholder='example@gmail.com' ref={emailRef} spellCheck="false" id='signupemail' autoComplete='true'/>
        <label htmlFor="signUpPass" className='text-[13px] text-gray-500 ml-[2px] mt-2 flex w-full pl-[2px]'>Password</label>
        <div className='relative w-full flex items-center mt-1 '>
          <input type="password" name="password" className='border-gray-700 border-b outline-none text-[14px] focus:scale-110 transition-all duration-300 placeholder:text-gray-300 w-full' placeholder='#gs#@gs' ref={passwordRef} id='signUpPass' spellCheck="false"/>
          <FaRegEyeSlash className='absolute  top-0 right-2 text-[14px]' onClick={()=>togglEye("signUpPass")}/>
      </div> 
        </div>
         <button type="submit" className="text-[15px] bg-gradient-to-tr from-orange-400 to-yellow-200 rounded-md mt-5 text-gray-700 font-[500] w-[100px] flex justify-center items-center h-[35px] pb-[2px]  transition-all duration-300 hover:shadow-lg select-none" onClick={signUpuser} disabled={logging?true:false}>{logging?<FiLoader className='text-[18px] animate-spin'/>:"sign up"}</button>
       </form>
       <p className='text-gray-500 text-[12px] mt-7 cursor-default'>Already registered ? <Link to="/login" className='text-indigo-600 underline-offset-2 hover:underline select-none'>Login</Link></p>
      </div>
    }
    </div>
  )
}
