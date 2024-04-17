import axios from "axios"


export const GET_USER = async()=>{
  return new Promise(async(resolve, reject) => {
  try {
    const {data} = await axios.get("/api/v1/users/fetch-user")
    resolve(data)
  } catch (error) {
    reject(error)
  }
  })
}  

