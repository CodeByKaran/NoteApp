import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    title:null,
    content:null,
    id:null
}

export const editSlice = createSlice({
    name:"edit",
   initialState,
   reducers:{
    setInfo:(state,action)=>{
      state.title = action.payload.title
      state.content = action.payload.content
      state.id = action.payload.id
    },
    clearInfo:(state)=>{
        state.title = null
        state.content = null
        state.id = null
    }
   }
})


export const {setInfo,clearInfo} = editSlice.actions

export default editSlice.reducer