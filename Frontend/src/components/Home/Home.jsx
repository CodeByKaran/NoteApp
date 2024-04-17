import React, { useCallback, useEffect } from 'react'
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

export default function Home() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getAllNotes=useCallback(async()=>{
    try {
      const {data} = await axios.get("/api/v1/logged/note/all")
      if(data.statusCode==200){
        setNotes(dispatch(setNotes(data.data)))
      }else{
        showAlert(data.message)
      }
    } catch (error) {
      showAlert(error.response.data.message)
    }
  })

  useEffect(useCallback(()=>{
    getAllNotes()
  },[]))

  const {Notes} = useSelector(state=>state.note)

  const id = getUserId()

  const clearNoteInfo=async()=>{
    dispatch(clearInfo())
    navigate(`/home/${id}/Edit`)
  }
  
  return (
    <div className='md:w-[75%] relative min-h-[90vh] sm:min-h-[80vh]'>
      <div className='flex flex-wrap p-2 mt-7 justify-between md:w-[75%] sm:w-[80%] '>
        {
          Notes?.map((e,i)=><Note key={i} title={e.title} content={e.content} id={e._id} refreshNote={getAllNotes}/>)
        }
      </div>
      
      <button className='bg-orange-400 w-[40px] h-[40px] flex justify-center items-center rounded-full absolute bottom-6 right-6 hover:shadow-lg hover:shadow-orange-500 transition-all duration-300' onClick={clearNoteInfo}>
       <IoMdAddCircleOutline className='text-slate-900 hover:scale-125 transition-all duration-300'/>
      </button>
    </div>
  )
}
