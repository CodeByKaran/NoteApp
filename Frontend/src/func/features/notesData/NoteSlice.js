import {createSlice} from '@reduxjs/toolkit'

const initialState={
    Notes:null
}



export const noteSlice = createSlice({
    name:"note",
    initialState,
    reducers:{
        setNotes:(state,action)=>{
         state.Notes = action.payload
        }
    }
})



export const {setNotes} = noteSlice.actions

export default noteSlice.reducer