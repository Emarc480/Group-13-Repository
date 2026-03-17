import React from "react";
import '../components/LoginPage.css'

import user_icon from '../assets/user.png'
import email_icon from '../assets/mail.png'
import password_icon from '../assets/lock.png'

const LoginPage = () => {
    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>Sign Up</div>
                <div className="underline"></div>              
            </div>
            <div className='inputs'>
                <div className='input'>
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder='Name' />
                </div>
                <div className='input'>
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder='Email' />
                </div>
                <div className='input'>
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder='Password' />
                </div>
            </div>
            <div className="forgot-password">Forgot password?
                <span><a href="#">Click here</a></span>
            </div>
            <div className="submit-container">
                <div className="submit">Sign Up</div>
                <div className="submit">Log in</div>
            </div>
        </div>
    )
}

export default LoginPage