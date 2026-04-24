import React from "react";
import '../components/CSS/Homepage.css'
import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/home/login');
    };

    return (
        <div className="homepage">
            <div className="header">
                <h1>Academic Issue Tracking System</h1>
            </div>
            <div className="content">
                <p>This is the main landing page of our  application.</p>
            </div>
            <div className="login-link">
                <button onClick={handleLoginClick}>Login</button>
            </div>
        </div>
    );
}