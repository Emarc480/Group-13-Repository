import ProtectedRoute from './components/ProtectedRoute'
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Loginpage from './pages/Loginpage'
import Dashboard from './pages/Dashboard'
import Homepage from './pages/Homepage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Loginpage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/dashboard/student' element={<Dashboard />} />
          <Route path='/dashboard/supervisor' element={<Dashboard />} />
          <Route path='/dashboard/academic' element={<Dashboard />} />
          <Route path='/dashboard/admin' element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App
