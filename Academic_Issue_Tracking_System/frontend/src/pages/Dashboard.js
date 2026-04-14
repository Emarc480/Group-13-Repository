import React, { useEffect } from "react";
import StudentView from "../components/Views/StudentView";
import LecturerView from "../components/Views/LecturerView";
import HodView from "../components/Views/HodView";
import RegistrarView from "../components/Views/RegistrarView";

export default function Dashboard() {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            window.location.href = '/home/login';
        }
    }, []);

    if (!token) return null;

    if (!role) {
        return <h2>No role found.</h2>;
    }

    return (
        <div>
            {role === 'student' && (<StudentView />)}
            {role === 'lecturer' && (<LecturerView />)}
            {role === 'hod' && (<HodView />)}
            {role === 'registrar' && (<RegistrarView />)}

        </div>
    );
};