import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Loginpage from './pages/Loginpage';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './services/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<Loginpage />} />

        {/* Generic Dashboard (Your teammate's main entry point) */}
        <Route path='/dashboard' element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Role-Specific Dashboards (Your specialized views) */}
        <Route 
          path="/student-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRoles={['intern_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Fallback to login if route doesn't exist */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;