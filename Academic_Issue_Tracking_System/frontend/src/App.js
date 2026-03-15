import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Homepage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<Dashboard />} />
            </Routes>
        </Router>
    );
}
