import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route,Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import MyNetwork from './pages/MyNetwork';
import CreateSprint from './pages/CreateSprint';
import { UserProvider } from './context/UserContext';
function App() {
  

  return (
    <>
      <UserProvider>
      <Routes>
        <Route path='/' element={<Navigate to='/auth/register'/>} />
        <Route path='/auth/login' element={<Login/>} />
        <Route path='/auth/register' element={<Register/>} />
        <Route path='/completeprofile' element={<CompleteProfile/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/search' element={<Search/>} />
        <Route path='/network' element={<MyNetwork/>} />
        <Route path='/create-sprint' element={<CreateSprint/>} />
      </Routes>
      </UserProvider>
    </>
  )
}

export default App
