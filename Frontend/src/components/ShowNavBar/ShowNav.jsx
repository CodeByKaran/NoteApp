import React,{ useEffect, useState } from "react"
import {useLocation} from "react-router-dom"


export default function ShowNav({children}) {
  
  const location = useLocation()
  
  useEffect(()=>{
    let locArr = location.pathname.split("/")
    console.log(locArr)
  },[location])
  
  return(
   <>
     {children}
   </>
  )
}