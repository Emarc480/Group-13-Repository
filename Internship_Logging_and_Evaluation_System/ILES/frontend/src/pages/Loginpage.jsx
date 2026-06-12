import React, { useState } from "react";
import { User as U, KeyRound as KR, Mail, LockKeyhole as LK, Gavel } from 'lucide-react';
import { getMe, login, register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Loginpage.css';

function Loginpage() {
  const [showLogin, setShowLogin] = React.useState(true);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    role: 'student', first_name: '', last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loginResponse = await login(loginData.username, loginData.password);
      const user = await getMe();
      const role = user.role;
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
      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      const firstError = data
        ? Object.values(data).flat()[0]
        : 'Registration failed.';
      setError(firstError);
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      {showLogin ? (
        <div className="loginForm">
          <div className="Header">
            <h2>Login</h2>
          </div>
          <form onSubmit={handleLogin}>
            <div>
              <U />
              <input
                placeholder="Username..."
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              />
            </div>
            <div>
              <KR />
              <input
                type="password"
                placeholder="Password..."
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="Login">
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
          <div className="SignUpPrompt">
            <p>
              New here?
              <a href="#" onClick={() => setShowLogin(false)}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      ) : (
        <div className="SignUpForm">
          <div className="Header">
            <h2>Sign Up</h2>
          </div>
          <form onSubmit={handleRegister}>

          <div>
              <U />
              <input
                placeholder="First Name..."
                value={registerData.first_name}
                onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })}
              />
            </div>
            <div>
              <U />
              <input
                placeholder="Last Name..."
                value={registerData.last_name}
                onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })}
              />
            </div>
            <div>
              <U />
              <input
                placeholder="Username..."
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
            </div>
            <div>
              <Mail />
              <input
                type="email"
                placeholder="Email..."
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
            </div>
            <div>
              <KR />
              <input
                type="password"
                placeholder="Password..."
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>
            <div>
              <LK />
              <input
                type="password"
                placeholder="Confirm Password..."
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              />
            </div>
            <div>
              <Gavel />
              <select
                value={registerData.role}
                onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
              >
                <option value="student">Student Intern</option>
                <option value="workplace_supervisor">Workplace Supervisor</option>
                <option value="academic_supervisor">Academic Supervisor</option>
                <option value="intern_admin">Internship Administrator</option>
              </select>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="SignUp">
              <button type="submit" disabled={loading}>
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="LoginPrompt">
            <p>
              Already have an account?
              <a href="#" onClick={() => setShowLogin(true)}>
                Login
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Loginpage;