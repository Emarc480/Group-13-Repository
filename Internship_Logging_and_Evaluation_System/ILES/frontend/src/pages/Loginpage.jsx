import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, KeyRound, Mail, LockKeyhole } from 'lucide-react';

const LoginPage = () => {
    const [showLogin, setShowLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({
        username: '', email: '', password: '', confirmPassword: '',
        role: 'STUDENT', first_name: '', last_name: ''
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', loginData);
            localStorage.setItem('token', response.data.access);
            
            // Extract role from JWT for RBAC logic
            const payload = JSON.parse(atob(response.data.access.split('.')[1]));
            localStorage.setItem('user_role', payload.role || 'STUDENT');
            localStorage.setItem('username', payload.username || loginData.username);
            
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const { confirmPassword, ...userData } = registerData;
            await axios.post('http://127.0.0.1:8000/api/users/', userData); // Adjust endpoint if needed
            setShowLogin(true);
            alert("Registration successful! Please login.");
        } catch (err) {
            setError(err.response?.data?.username?.[0] || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            {showLogin ? (
                <div className="loginForm">
                    <h2>ILES Login</h2>
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '10px' }}>
                            <User size={18} />
                            <input 
                                placeholder="Username" 
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                required 
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <KeyRound size={18} />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required 
                            />
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                    </form>
                    <p>New here? <a href="#" onClick={() => setShowLogin(false)}>Sign up</a></p>
                </div>
            ) : (
                <div className="SignUpForm">
                    <h2>Sign Up</h2>
                    <form onSubmit={handleRegister}>
                        <input placeholder="Username" onChange={(e) => setRegisterData({...registerData, username: e.target.value})} required />
                        <input type="email" placeholder="Email" onChange={(e) => setRegisterData({...registerData, email: e.target.value})} required />
                        <input type="password" placeholder="Password" onChange={(e) => setRegisterData({...registerData, password: e.target.value})} required />
                        <input type="password" placeholder="Confirm Password" onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})} required />
                        <select value={registerData.role} onChange={(e) => setRegisterData({...registerData, role: e.target.value})}>
                            <option value="STUDENT">Student Intern</option>
                            <option value="ADMIN">Internship Administrator</option>
                        </select>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" disabled={loading}>Sign Up</button>
                    </form>
                    <p>Already have an account? <a href="#" onClick={() => setShowLogin(true)}>Login</a></p>
                </div>
            )}
        </div>
    );
};

export default LoginPage;