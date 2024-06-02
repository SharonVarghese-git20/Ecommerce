import React from 'react'
import './Navbar.css'
import navlogo from "../../Assets/nav-logo.svg"
import navProfile from '../../Assets/nav-profile.svg'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navlogo} alt="" className='nav-logo' />
       <Link to='/login'><img src={navProfile} alt="" className='nav-profile' /></Link>
    </div>
  )
}

export default Navbar