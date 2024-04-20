import React,{ useEffect, useState } from "react"
import {useLocation} from "react-router-dom"


export default function ShowNav({children}) {
  
  const location = useLocation()
  
  useEffect(()=>{
    console.log("this is location",location)
  },[location])
  
  return(
   <>
     {children}
   </>
  )
}