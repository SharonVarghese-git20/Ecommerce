import React from 'react'
import './LoginSignup.css'
const LoginSignup = () => {
  return (
    <div className='loginsignup'>
    <div className="loginsignup-container">
      <h1>SignUp</h1>
      <div className="loginsignupfields">
        <input type="text"  placeholder='Your Name'/>
        <input type="email"  placeholder='Email Address'/>
        <input type="password"  placeholder='Password'/>
      </div>
      <button>Continue</button>
      <p className='loginsinup-login'>
        Already have an account <span>Login Here</span>
<div className="loginsignup-agree">
  <input type="checkbox" name='' id='' />
        <p>By continuing I agree to the terms of use & privacy policy</p>
</div>
      </p>
    </div>
    </div>
  )
}

export default LoginSignup