import React,{useState} from 'react'
import axios from 'axios'
import { useNavigate,Link } from 'react-router-dom'
import { getUserId } from '../../Hooks/useGetId'
import { showAlert } from '../../Hooks/useShowAlert'

export default function VerifyPage() {
  
  const navigate = useNavigate()
  const [otp,setotp] = useState("")
  const [next,setNext] = useState(2)

  const handleNextInput=(e)=>{
    setotp(str=>str+e.target.value)
    try{
    var nextElm = document.getElementById(`i${next}`)
    nextElm.focus()
    setNext(next=>next+1)
    }catch(error){
      nextElm = document.getElementById(`i${next-1}`)
      if(nextElm != document.body) nextElm.blur()
    }  
  }

  const verifyUser=async()=>{
    let id = getUserId()
    try {
     let {data} = await axios.post(`/api/v1/users/verify/${id}`,{userOTP:Number(otp)})
     if(data.statusCode===200){
      navigate("/login")
     }else{
      showAlert(data.response.data.message)
     }
    } catch (error) {
      showAlert(error.response.data.message)
    }
  }

  const clearOtp=()=>{    
    for(let i=1;i<=4;++i){
      let elm = document.getElementById(`i${i}`)
      elm.value = ""
    }
    setNext(2)
    setotp("")
  }

  return (
    <div className='h-[100vh] w-full flex justify-center items-center'>
        <div className='bg-white p-3 rounded-lg shadow-xl w-[50%] flex flex-col items-center md:w-[300px] sm:w-[300px]'>
          <h1 className='font-medium'>Verify</h1>
          <div className='flex w-full justify-start flex-col mt-7'>
          <label htmlFor="otp" className=' text-start pl-2 text-[13px] text-gray-400'>OTP</label>
          <div className='flex w-full justify-start'>
           <input name="otp" className='border rounded-lg p-1 w-[35px] m-1  transition-all duration-300 outline-none focus:border-gray-500 text-center' onInput={handleNextInput} id='i1' />
           <input name="otp" className='border rounded-lg p-1 w-[35px] m-1  transition-all duration-300 outline-none focus:border-gray-500 text-center' onInput={handleNextInput} id='i2' />
           <input name="otp" className='border rounded-lg p-1 w-[35px] m-1  transition-all duration-300 outline-none focus:border-gray-500 text-center' onInput={handleNextInput} id='i3' />
           <input name="otp" className='border rounded-lg p-1 w-[35px] m-1  transition-all duration-300 outline-none focus:border-gray-500 text-center' onInput={handleNextInput} id='i4' />
           {next>2&&
           <input name="clear" type='button' className='shadow-lg rounded w-fit m-1 h-fit px-1 pb-[2px] ml-4 bg-red-400 text-white text-[13px] transition-all duration-300 outline-none hover:bg-red-300 hover:text-gray-800' value="x" onClick={clearOtp}/>
           }
          </div>
          <a className='text-[13px] text-start  py-2 pl-1 text-blue-500 underline-offset-2 hover:underline cursor-default'>resend otp?</a>
           <button type="button" className='text-[15px] bg-gradient-to-bl from-orange-500 via-orange-400 to-yellow-200 w-[70px] rounded-md text-gray-100 p-1 font-medium mt-3 hover:shadow-lg transition-all duration-300 ml-[2px]' onClick={verifyUser}>verify</button>
          </div>    
          <p className='text-[13px] text-gray-500 mt-8'>Go Back To <Link to="/" className='text-blue-800 underline-offset-2 underline hover:text-blue-500'>SignUp</Link></p>
        </div>
    </div>
  )
}
