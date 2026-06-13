import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://iles-backend-4lkx.onrender.com/api/";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
});

function StudentPlacementUI() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await axios.get(`${API_URL}placements/`, authHeaders());
        setPlacements(res.data);
      } catch (err) {
        setError("Failed to load your placement details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlacements();
  }, []);

  if (loading) return <p style={{ padding: "24px" }}>Loading placement details...</p>;
  if (error) return <p style={{ padding: "24px", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>My Internship Placement</h2>
      <p>All details of your internship placement.</p>

      {placements.length === 0 ? (
        <div style={{ background: "#f2dede", color: "#a94442", padding: "12px 16px", borderRadius: "6px" }}>
          No placement found. Contact your internship administrator.
        </div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "16px" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Student No</th>
              <th style={thStyle}>Start Date</th>
              <th style={thStyle}>End Date</th>
              <th style={thStyle}>Supervisor ID</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((p) => {
              const today = new Date();
              const start = new Date(p.start_date);
              const end = new Date(p.end_date);
              const isActive = today >= start && today <= end;
              const isCompleted = today > end;

              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{p.company_name}</td>
                  <td style={tdStyle}>{p.student_no}</td>
                  <td style={tdStyle}>{p.start_date}</td>
                  <td style={tdStyle}>{p.end_date}</td>
                  <td style={tdStyle}>{p.workplace_supervisor || "—"}</td>
                  <td style={tdStyle}>
                    <span style={{
                      background: isActive ? "#5cb85c" : isCompleted ? "#777" : "#f0ad4e",
                      color: "#fff", padding: "2px 10px", borderRadius: "12px",
                      fontSize: "0.8rem", fontWeight: "bold",
                    }}>
                      {isActive ? "Active" : isCompleted ? "Completed" : "Upcoming"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = { padding: "10px 12px", borderBottom: "2px solid #ddd", textAlign: "left", fontWeight: "600" };
const tdStyle = { padding: "10px 12px", verticalAlign: "middle" };

export default StudentPlacementUI;