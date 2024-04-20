import axios from "axios"
import {setCookie , getCookie} from "./cookie.js"


export const GET_USER = async()=>{
  return new Promise(async(resolve, reject) => {
  try {
    const refToken = getCookie("refreshToken")
    const res = await fetch("https://noteapp-aznr.onrender.com/api/v1/users/fetch-user",{
        headers:{
          'Authorization': `Bearer ${refToken}`
        }
      })
      const data = await res.json()
      resolve(data)
  } catch (error) {
    reject(error)
  }
  })
}  

