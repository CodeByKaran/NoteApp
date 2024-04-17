import {v2 as cloudinary} from 'cloudinary'
import fs from "fs"



cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


const uploadOnCloudinary=async(LocalFilePath)=>{
    try {
      const avatar = await cloudinary.uploader
        .upload(LocalFilePath,{
            resource_type:"image"
        })
        fs.unlinkSync(LocalFilePath)
        return avatar
    } catch (error) {
        fs.unlinkSync(LocalFilePath)
        return null
    }
}


const getPublicId=(url)=>{
  return url.split("/").pop().split(".")[0]
}


const deleteImageOnCloudinary=async(localFilePath)=>{
  try {
   const acko = await cloudinary.api.delete_resources([localFilePath],{
        type:"upload",
        resource_type:"image"
    })
    .catch((err)=>console.log)
    return acko
  } catch (error) {
    return error
  }
}


export {
    uploadOnCloudinary,
    getPublicId,
    deleteImageOnCloudinary
}