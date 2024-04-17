import React, { useEffect, useState } from 'react'
import SignUp from './components/SignUpPage/SignUp'
import Login from './components/LoginPage/Login'
import VerifyPage from './components/VerifyPage/VerifyPage'
import Home from "./components/Home/Home.jsx" 
import { Route, Routes } from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import Nav from './components/Nav/Nav.jsx'
import { getItem, setItem } from './helper/localStorage.js'
import EditPage from './components/NoteEdit/EditPage.jsx'
import { showAlert } from './Hooks/useShowAlert.js'
import Forget from './components/ForgetPage/Forget.jsx'
import Otp from './components/ForgetPage/OtpStep/Otp.jsx'
import VerifyForgetOtp from './components/ForgetPage/VerifyPage/VerifyForgetOtp.jsx'
import Pass from './components/ForgetPage/PassStep/Pass.jsx'



export default function App() {

  const [isLogged,setIsLogged] = useState(false)
  
  const userLogged=(bool)=>{
    setItem(bool)
    setIsLogged(bool)
  }

  useEffect(()=>{
    let value = Boolean(getItem("isLogged"))
    setIsLogged(value)
  },[])

  return (
    <center className='text-black'>
      <Toaster/>
      <Routes>
        <Route path='/' element={<SignUp/>} />
        <Route path='/verify/:id' element={<VerifyPage/>}/>
        <Route path='/login' element={<Login userLogged={userLogged}/>}/>
        <Route path='/forget/*' element={<Forget/>} >
          <Route path='otp' element={<Otp/>} />
          <Route path='verify' element={<VerifyForgetOtp/>} />
          <Route path='change-pass' element={<Pass/>} />
         </Route>
      </Routes>
      {isLogged &&
      <>
      <nav>
        <Nav userLogged={userLogged}/>
      </nav>
      <main>
      <Routes>
        <Route path='/home/:id' element={<Home/>}/>
        <Route path='/home/*' element={<h1>404 Page Not Found</h1>} />
        <Route path='/home/:id/Edit' element={<EditPage/>} />
        <Route path='/home/:id/Edit/:id' element={<EditPage/>} />
      </Routes>    
      </main>
      </>
     }
    </center>
  )
}
