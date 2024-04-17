import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getUserIdInDelApi, getUserIdInEditPage } from '../../Hooks/useGetId'
import { showAlert, showSuccessMessage } from '../../Hooks/useShowAlert'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'

export default function EditPage() {
    
    const navigate = useNavigate()
    const userId = getUserIdInEditPage()
    const userIdInEdit = getUserIdInDelApi()
    const titleRef = useRef()
    const contentRef = useRef()
    const [isDeleteAble,setIsDeleteAble]= useState()
    
    const {title,content,id} = useSelector(state=>state.edit)

    useEffect(()=>{
      if(title && content){
        titleRef.current.value = title
        contentRef.current.value = content
        setIsDeleteAble(true)
      }else{
        setIsDeleteAble(false)
      }
    },[])

    const makeNote = async()=>{
      try {
        const title = titleRef.current.value
        const content = contentRef.current.value
        const {data} = await axios.post("/api/v1/logged/note/create",{title,content})
        if(data.statusCode==200){
          showSuccessMessage(data.message)
          navigate(`/home/${userId}`)
        }else{
          showAlert(data.message)
        }
      } catch (error) {
        showAlert(error.response.data.message)
      }
    }
    
    const EditNote = async()=>{
      try {
        const title = titleRef.current.value        
        const content = contentRef.current.value
        if(!title ||  !content){
          showAlert("title and content is required!")
          return
        }
        const {data} = await axios.put(`/api/v1/logged/note/edit/${id}`,{title,content})
        if(data.statusCode==200){
          
          navigate(`/home/${userIdInEdit}`)
          showSuccessMessage("Note Edit Successfully")
        }else{
          showAlert(data.message)
        }
      } catch (error) {
        showAlert(error.response.data.message)
      }
    }

    const CreateOrEditNote=async()=>{     
     if(title && content){
       EditNote()
     }else{
      makeNote()
     }

    }

    const handleKeyDown = (e) => {
      if(e.key==="Enter"){
        CreateOrEditNote()
      }
    }
    
    const ClearText =()=>{
     contentRef.current.value = ""
    }

    const ToUpper =()=>{
      contentRef.current.value = contentRef.current.value.toUpperCase()
    }

    const ToLower=()=>{
      contentRef.current.value = contentRef.current.value.toLowerCase()
    }

    const CopyText=()=>{
      window.navigator.clipboard.writeText(contentRef.current.value)
      showSuccessMessage("text copied")
    }
    
    const deleteNote=async()=>{
      try {
        const {data} = await axios.delete(`/api/v1/logged/note/delete/${id}`)
        if(data.statusCode==200){
          console.log(userIdInEdit);
          navigate(`/home/${userIdInEdit}`)
          showSuccessMessage(data.message)
        }else{
           showAlert(data.message)
        }
       } catch (error) {
           showAlert(error.response.data.message)
       }
    }
    
    const cancel=()=>{
     if(title || content){
      navigate(`/home/${userIdInEdit}`)
     }else{
      navigate(`/home/${userId}`)
     }
    }

  return (
    <div className='w-[80%] md:w-[60%] bg-white rounded-md shadow-lg mt-11 p-3 flex flex-col relative'>

     
      <div className='absolute top-2 left-2 h-[18px] w-[18px] rounded-full  shadow shadow-gray-500 hover:bg-gray-300 hover:text-red-500 transition-all duration-150 text-center text-[13px] flex items-center justify-center font-mono font-semibold cursor-default bg-gray-200 p-1' onClick={cancel}>x</div>

      <div className='my-2 flex justify-end'>

       <button className='text-[14px] mx-1 bg-gradient-to-br from-indigo-400 to-orange-100 p-[7px] rounded-full text-slate-800 font-medium' onClick={ClearText}>Clear</button>
       <button className='text-[14px] mx-1 bg-gradient-to-br from-indigo-400 to-orange-100 p-[7px] rounded-full text-slate-800 font-medium' onClick={ToUpper}>UpperCase</button>      
       <button className='text-[14px] mx-1 bg-gradient-to-br from-indigo-400 to-orange-100 p-[7px] rounded-full text-slate-800 font-medium' onClick={ToLower}>LowerCase</button>
       <button className='text-[14px] mx-1 bg-gradient-to-br from-indigo-400 to-orange-100 p-[7px] rounded-full text-slate-800 font-medium' onClick={CopyText}>Copy</button>

      </div>

      <div className='my-2'>
      <textarea cols="30" rows="10" className=' hideScroll outline-none  p-2 text-[14px] min-w-[95%]  border-t border-b ' autoCorrect='false' spellCheck="false" ref={contentRef}></textarea>
      </div>
      
      <div className='flex justify-end items-center my-2'>
        <label htmlFor="title" className='text-[16px] mr-2 text-slate-600 font-medium'>Title : </label>
        <input type="text" className='border rounded-md outline-none hover:bg-gray-100 transition-all duration-300 cursor-default px-2 w-[160px] text-[15px] focus:border-gray-800 h-[35px] focus:bg-gray-100' ref={titleRef} spellCheck="false" onKeyDown={handleKeyDown} placeholder='press enter to save'/>
      </div>

      <div className='flex my-2 bg-gray-200 p-2 rounded-md'>
      <button className={`w-[50%] border-r border-r-gray-700 hover:text-red-700 text-sm font-bold font-mono text-red-500 ${!isDeleteAble&& "text-red-300 pointer-events-none"}`} disabled={isDeleteAble?false:true} onClick={deleteNote}>Delete</button>
      <button className='w-[50%] border-l border-l-gray-700 text-sm font-bold font-mono text-blue-500 hover:text-blue-700' onClick={CreateOrEditNote}>Save</button>
      </div>
    </div>
  ) 
}


