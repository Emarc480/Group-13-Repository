import React from "react";
import '../components/Homepage.css'
import { useNavigate } from "react-router-dom";

export default function Homepage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="homepage">
            <div className="header">
                <h1>Welcome to the Homepage!</h1>
            </div>
            <div className="content">
                <p>This is the main landing page of our application.</p>
            </div>
            <div className="login-link">
                <button onClick={handleLoginClick}>Login</button>
            </div>
        </div>
    );
}