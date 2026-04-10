import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username,
                password
            });

            localStorage.setItem('token', response.data.access);
            const role = response.data.role;

            if (role === 'registrar') {
                navigate('/registrar-dashboard');
            } else {
                alert("Login successful, but you are not a registrar.");
            }
        } catch (error) {
            alert("Login failed. Check backend connection.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>AITS Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} /><br/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;