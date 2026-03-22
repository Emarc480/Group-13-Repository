import React from "react";
import '../components/Homepage.css'

export default function Homepage() {
    return (
        <div className="homepage">
            <div className="header">
                <h1>Welcome to the Homepage!</h1>
            </div>
            <div className="content">
                <p>This is the main landing page of our application.</p>
            </div>
            <div className="login-link">
                <a href="/login">Login</a>
            </div>
        </div>
    );
}