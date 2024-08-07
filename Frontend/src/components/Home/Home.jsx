import React, { useCallback, useEffect , useState} from 'react'
import Note from '../Note/Note'
import { IoMdAddCircleOutline } from "react-icons/io";
import axios from "axios"
import { showAlert } from '../../Hooks/useShowAlert';
import {  setNotes } from '../../func/features/notesData/NoteSlice';
import { useDispatch,useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserId } from '../../Hooks/useGetId';
import { clearInfo, setInfo } from '../../func/features/noteEditInfo/noteEditSlice';
import { useNavigate } from 'react-router-dom';
import {setCookie , getCookie} from "../../helper/cookie.js"
import { FiLoader } from "react-icons/fi";

export default function Home() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading,setLoading]=useState(false)

  const { userData } = useSelector(state=>state.login)
  

  const getAllNotes=useCallback(async()=>{
    try {
       setLoading(true)
      const refToken = getCookie("refreshToken")
      const res = await fetch("https://noteapp-aznr.onrender.com/api/v1/logged/note/all",{
        headers:{
          'Authorization': `Bearer ${refToken}`
        }
      })
      const data = await res.json()
      setLoading(false)
      if(data.statusCode==200){
        dispatch(setNotes(data.data))
      }else{
        showAlert(data.message)
      }
    } catch (error) {
      showAlert(error.response.data.message)
    }
  })

  useEffect(()=>{
    getAllNotes()
  },[])

  const {Notes} = useSelector(state=>state.note)

  
  const id = getUserId()

  const clearNoteInfo=async()=>{
    dispatch(clearInfo())
    navigate(`/home/${id}/Edit`)
  }
  
  return (
    <div className='md:w-[75%] relative min-h-[85vh] sm:min-h-[80vh]'>
      <div className='flex flex-wrap p-2 mt-7 justify-between md:w-[75%] sm:w-[80%] '>
        {
          loading?<div className="min-h-[241px] h-fit bg-gray-300 w-[45%] rounded-lg shadow-xl relative hover:bg-gray-400 transition-all duration-500 hover:text-gray-100 my-4 pb-3 animate-pulse"></div>:
          Notes?.map((e,i)=><Note key={i} title={e.title} content={e.content} id={e._id} refreshNote={getAllNotes}/>)
        }
      </div>
      <button className='bg-orange-400 w-[40px] h-[40px] flex justify-center items-center rounded-full fixed bottom-6 right-6 hover:shadow-lg hover:shadow-orange-500 transition-all duration-300' onClick={clearNoteInfo}>
       <IoMdAddCircleOutline className='text-slate-900 hover:scale-125 transition-all duration-300'/>
      </button>
    </div>
  )
}
