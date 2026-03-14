import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom"

import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";

export default function Homepage() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<p>This is the Homepage</p>} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </Router>
    );
}