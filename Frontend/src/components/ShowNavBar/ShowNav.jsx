import React,{ useEffect, useState } from "react"
import {useLocation} from "react-router-dom"


export default function ShowNav({children}) {
  
  const location = useLocation()
  
  const [isNav,setIsNav]= useState(false)
  
  useEffect(()=>{
    let locArr = location.pathname.split("/")
    if(locArr[1]==="home"){
      setIsNav(true)
    }else{
      setIsNav(false)
    }
  },[location])
  
  return(
   <>
     {isNav && children}
   </>
  )
}