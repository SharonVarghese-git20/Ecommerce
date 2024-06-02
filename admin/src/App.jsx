import React from 'react'
import Navbar from '../src/Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'
import LoginSignup from './Pages/LoginSignup/LoginSignup'
import { Routes,Route } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
const App = () => {
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginSignup/>}/>
      </Routes>
      <Admin/>
        
      
    </div>
  )
}

export default App