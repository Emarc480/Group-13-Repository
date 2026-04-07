import React from "react";
import '../components/CSS/LoginPage.css'
import { useNavigate } from "react-router-dom";

import user_icon from '../assets/user.png'
import email_icon from '../assets/mail.png'
import password_icon from '../assets/lock.png'

const LoginPage = () => {

    const [action, setAction] = React.useState('Sign Up');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: email,
                    password: password,
                }),
            });

            const data = await response.json();
            console.log("Login Response", data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                alert('Login successful!');

                navigate('/dashboard');
            } else {
                alert(data.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }


    return (
        <div className='container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className="underline"></div>
            </div>
            <div className='inputs'>
                {action === "Login" ? <div></div> : <div className='input'>
                    <img src={user_icon} alt="" />
                    <input type="text" id='name' placeholder='Name' onChange={(e) => setName(e.target.value)} />
                </div>}

                <div className='input'>
                    <img src={email_icon} alt="" />
                    <input type="email" id='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='input'>
                    <img src={password_icon} alt="" />
                    <input type="password" id='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            {action === "Sign Up" ? <div></div> : <div className="forgot-password">Forgot password?
                <span><a href="#">Click here</a></span>
            </div>}

            <div className="submit-container">
                <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => setAction("Sign Up")}>
                    Sign Up
                </div>
                <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => {
                    if (action === "Login") {
                        handleLogin();
                    } else {
                        setAction("Login")
                    }
                }}>
                    Login
                </div>
            </div>
        </div>
    )
}

export default LoginPage