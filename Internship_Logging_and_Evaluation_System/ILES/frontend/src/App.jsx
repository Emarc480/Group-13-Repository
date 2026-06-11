import ProtectedRoute from './services/ProtectedRoute'
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Loginpage from './pages/Loginpage'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/Homepage'
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Loginpage />} />
        <Route path='/dashboard' element={<ProtectedRoute />} >
          <Route index element={<Dashboard />} />
        </Route>
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App
