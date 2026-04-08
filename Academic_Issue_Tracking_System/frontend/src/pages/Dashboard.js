import React from "react";

import StudentView from "../components/Views/StudentView";
import LecturerView from "../components/Views/LecturerView";
import HodView from "../components/Views/HodView";
import RegistrarView from "../components/Views/RegistrarView";
import '../components/CSS/Dashboard.css'

export default function Dashboard() {
    const role = localStorage.getItem('role');

    const renderView = () => {
        switch (role) {
            case 'student':
                return <StudentView />;
            case 'lecturer':
                return <LecturerView />;
            case 'hod':
                return <HodView />;
            case 'registrar':
                return <RegistrarView />;
            default:
                return <h2>Invalid role.</h2>;
        }
    };


    return (
        <div>
            <div className="wrapper">
                <nav>
                    <div className="navbar">
                        <a href="/dashboard">Dashboard</a>
                        <a href="/profile">Profile</a>
                        <a href="/settings">Settings</a>
                        <a href="/logout">Logout</a>
                    </div>        
                </nav>    
            </div>
            <div>
                {renderView()}
            </div>
        </div>
    );
};