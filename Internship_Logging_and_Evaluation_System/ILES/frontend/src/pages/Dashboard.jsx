import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { logout } from '../services/authService';
import { getMe } from '../services/authService';

import AcademicSup from "../components/AcademicSup";
import InternshipAdmin from "../components/InternshipAdmin";
import WorkplaceSup from "../components/WorkplaceSup";
import StudentDashboard from "../components/StudentDashboard";

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userData = await getMe();
        setRole(userData.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);


  const RenderView = () => {
    switch (role) {
      case 'academic_supervisor':
        return <AcademicSup />;
      case 'intern_admin':
        return <InternshipAdmin />;
      case 'workplace_supervisor':
        return <WorkplaceSup />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <p>Invalid role</p>;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }} >

      {/* Sidebar */}
      <div style={{
        width: '150px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderRight: '1px solid #ccc'
      }}>
        <button onClick={handleProfile}>Profile</button>
        <button onClick={() => { handleLogout() }}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {RenderView()}
      </div>
    </div>
  );
}

export default Dashboard;