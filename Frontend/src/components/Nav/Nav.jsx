import React, { useEffect, useState } from 'react'
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useSelector } from "react-redux"
import {useDispatch} from "react-redux"
import {useNavigate} from "react-router-dom"
import { setUser } from '../../func/features/loginData/loginSlice';
import { showAlert, showSuccessMessage } from '../../Hooks/useShowAlert';
import axios from "axios"
import { getItem } from '../../helper/localStorage';


export default function Nav({userLogged}) {
  
  // const [isUser,setIsUsr] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userData } = useSelector(state=>state.login)

  const getCurrentUSer = async()=>{  
  const isLog = getItem("isLogged")
  
   if(isLog==="false"){
    userLogged(false)
    return
   }

     try {
      const {data} = await axios.get("/api/v1/users/fetch-user")
      if(data.statusCode==200){
        dispatch(setUser(data.data))
        // setIsUsr(true)
        //navigate(`/home/${data.data._id}`)
      }else{
        //showAlert(data.response.data.message);
        navigate("/login")
        // setIsUsr(false)
        userLogged(false)
      }
    } catch (error) {
      //showAlert(error.response.data.message);
      navigate("/login")
      // setIsUsr(false)
      userLogged(false)
    }

  }

  useEffect(()=>{
      getCurrentUSer()  
  },[])

   
   const logOut=async()=>{
    try {
      const {data} = await axios.get("/api/v1/users/log-out")
      if(data.statusCode==200){
        userLogged(false)
        // setIsUsr(false)
        setUser(null)
        navigate("/login")
        showSuccessMessage(data.message)
      }else{
        // setIsUsr(true)
        showSuccessMessage(data.response.data.message)
      }
    } catch (error) {
      //  setIsUsr(true)
        showSuccessMessage(error.response.data.message)
    }
   }

   
  return (
    <div className='md:w-[60%] m-3 sm:w[60%] bg-slate-200 sm:rounded-full shadow-lg rounded-full flex justify-center items-center relative cursor-default'>

        <span className='absolute left-3 bg-gray-300 rounded-full w-[30px] h-[30px] overflow-hidden flex items-center justify-center shadow-md object-cover'>
           {
            userData?.avatar?<img src={userData.avatar} alt="img" />:userData?.username[0]
           }
        </span>

      <h2 className='p-2 font-semibold text-slate-700'>Your Notes</h2>

      <RiLogoutBoxRLine className='absolute right-3 hover:bg-gray-300 transition-all duration-300 p-1 text-2xl rounded-full cursor-pointer' onClick={logOut}/>

    </div>
  )
}
