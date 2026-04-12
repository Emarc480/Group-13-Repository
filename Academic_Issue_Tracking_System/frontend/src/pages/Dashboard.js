import React from "react";
import StudentView from "../components/Views/StudentView";
import LecturerView from "../components/Views/LecturerView";
import HodView from "../components/Views/HodView";
import RegistrarView from "../components/Views/RegistrarView";
import AdminView from "..components/Views/AdminView";

export default function Dashboard() {
    const role = localStorage.getItem('role');

    console.log('ROLE:', role);

    if (!role) {
        return <h2>No role found.</h2>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            {role === 'student' && (<StudentView />)}
            {role === 'lecturer' && (<LecturerView />)}
            {role === 'hod' && (<HodView />)}
            {role === 'registrar' && (<RegistrarView />)}
            {role === 'admin' && (<AdminView />)}

        </div>
    );
};