import {createSlice} from '@reduxjs/toolkit'


const initialState={
    userData:null
}


export const loginSlice= createSlice({
    name:"login",
    initialState,
    reducers:{
        setUser:(state,action)=>{
          state.userData = action.payload
        }
    }
})


export const {setUser} = loginSlice.actions

export default loginSlice.reducer