import React from "react";
import { useNavigate } from "react-router-dom";

function Homepage() {
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <>
            <div>
                <h1>Welcome to the Homepage!</h1>
                <p>This is the main landing page of our application.</p>
                <p>Please click below to login or register.</p>
            </div>
            <div>
                <button onClick={handleLoginClick}>Log in</button>
            </div>
        </>
    );
}

export default Homepage;