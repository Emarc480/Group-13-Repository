import React from "react";

import AcademicSup from "../components/AcademicSup";
import InternshipAdmin from "../components/InternshipAdmin";
import WorkplaceSup from "../components/WorkplaceSup";
import StudentDashboard from "../components/StudentDashboard";

function Dashboard() {
  const role = localStorage.getItem("role");

  const RenderView = () => {
    switch (role) {
      case "academic_supervisor":
        return <AcademicSup />;
      case "internship_admin":
        return <InternshipAdmin />;
      case "workplace_supervisor":
        return <WorkplaceSup />;
      case "student":
        return <StudentDashboard />;
      default:
        return <p>Invalid role</p>;
    }
  };

  return (
    <>
      <div>
        <p>Nav</p>
      </div>
      <div>{RenderView()}</div>
    </>
  );
}

export default Dashboard;