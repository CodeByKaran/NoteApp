import React,{useState} from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";
import { showAlert, showSuccessMessage } from '../../Hooks/useShowAlert';
import axios from 'axios';
import { getUserId } from '../../Hooks/useGetId';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setInfo } from '../../func/features/noteEditInfo/noteEditSlice';

export default function Note({title,content,id,refreshNote}) {

    const navigate = useNavigate()
    const dispatch = useDispatch()
   const [isMenuClicked,setisMenuClicked] = useState(false)

   const deleteNote=async(id)=>{
    try {
     const {data} = await axios.delete(`/api/v1/logged/note/delete/${id}`)
     if(data.statusCode==200){
       showSuccessMessage(data.message)
       refreshNote()
     }else{
        showAlert(data.message)
     }
    } catch (error) {
        showAlert(error.response.data.message)
    }
   }
   
   const userId = getUserId()

   const GotoEdit=()=>{
    dispatch(setInfo({title,content,id}))
    navigate(`/home/${userId}/Edit/${id}`)
   }

  return (
        <div className='h-[220px] bg-gray-300 w-[45%] rounded-lg shadow-xl relative hover:bg-gray-400 transition-all duration-500 hover:text-gray-100 my-4' onMouseLeave={()=>setisMenuClicked(false)}
         >
            <h3 className='absolute left-3 top-2 text-sm font-medium cursor-default' >{title}</h3>

            <div className='absolute bg-red-400 w-fit right-1'>

            <BsThreeDotsVertical className='absolute top-2 right-1 hover:bg-gray-700 p-1 text-xl rounded-full transition-all duration-300 text-black hover:text-gray-100' onClick={()=>setisMenuClicked(!isMenuClicked)} onMouseMove={()=>setisMenuClicked(true)}/>

            <span className={`absolute text-[13px] top-5 right-5 bg-red-400  rounded ${isMenuClicked?'w-[60px] h-fit':'w-0 h-0'} overflow-hidden text-center transition-all duration-300 cursor-pointer hover:text-black`} onClick={()=>deleteNote(id)}>
                Delete
            </span>
            
            </div>

            <p className='text-[14px] mt-[45px]  text-start p-2 cursor-default break-words' onClick={GotoEdit}> 
                {content.length>140?content.toString().slice(0,140):content}
            </p>
        </div>
  )
}


