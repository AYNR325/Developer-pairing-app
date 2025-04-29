import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route,Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
function App() {
  

  return (
    <>
      
      <Routes>
        <Route path='/' element={<Navigate to='/auth/register'/>} />
        <Route path='/auth/login' element={<Login/>} />
        <Route path='/auth/register' element={<Register/>} />
        <Route path='/completeprofile' element={<CompleteProfile/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </>
  )
}

export default App
