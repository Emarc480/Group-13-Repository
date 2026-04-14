import React, { Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrarDashboard from "./components/RegistrarDashboard";
import Login from "./Login";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path="/" element={<h1>Testing if react works!</h1>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registrar-dashboard" element={<RegistrarDashboard />} />
                </Routes>
            </Router>
        );
    }
}