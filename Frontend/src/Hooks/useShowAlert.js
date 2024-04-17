import toast from "react-hot-toast"

export const showAlert=(msg)=>{
   toast.error(msg,{
    duration:2500,
    style:{
        width:"wrap-content",
       fontSize:"14px"
    }
   })
}


export const showSuccessMessage=(msg)=>{
   toast.success(msg,{
      style:{
         width:"wrap-content",
        fontSize:"14px"
     }
   })
}