import { configureStore } from '@reduxjs/toolkit'
import loginReducer from "./features/loginData/loginSlice.js"
import noteReducer from "./features/notesData/NoteSlice.js"
import editReducer from "./features/noteEditInfo/noteEditSlice.js"

export const store = configureStore({
  reducer: {
    login: loginReducer,
    note : noteReducer,
    edit : editReducer
  },
})