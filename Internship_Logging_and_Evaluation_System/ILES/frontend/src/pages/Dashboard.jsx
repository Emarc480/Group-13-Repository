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

  console.log("User role:", role);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <div>
        <button>Profile</button>
        <button onClick={() => { handleLogout() }}>Logout</button>
      </div>
      <div>{RenderView()}</div>
    </div>
  );
}

export default Dashboard;