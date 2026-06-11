import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe();
                setUser(data);
            } catch (err) {
                setError("Failed to load profile. Please try logging in again.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const roleLabel = (role) => {
        const labels = {
            student: "Student Intern",
            workplace_supervisor: "Workplace Supervisor",
            academic_supervisor: "Academic Supervisor",
            intern_admin: "Internship Administrator",
        };
        return labels[role] || role;
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={bannerStyle}>{error}</div>
                <button onClick={() => navigate("/dashboard")} style={btnStyle("#aaa")}>
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2 style={{ marginBottom: "4px" }}>My Profile</h2>
            <p style={{ color: "#888", marginBottom: "24px" }}>
                Your account details as registered in the system.
            </p>

            <div style={cardStyle}>
                <Row label="Username" value={user.username} />
                <Row label="First Name" value={user.first_name || "—"} />
                <Row label="Last Name" value={user.last_name || "—"} />
                <Row label="Email" value={user.email || "—"} />
                <Row label="Role" value={roleLabel(user.role)} last />
            </div>

            <button onClick={() => navigate("/dashboard")} style={{ ...btnStyle("#337ab7"), marginTop: "20px" }}>
                Back to Dashboard
            </button>
        </div>
    );
}


function Row({ label, value, last }) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: last ? "none" : "1px solid #eee",
        }}>
            <span style={{ color: "#888", fontSize: "0.9rem" }}>{label}</span>
            <span style={{ fontWeight: "500" }}>{value}</span>
        </div>
    );
}

const containerStyle = { padding: "24px", maxWidth: "500px", margin: "0 auto" };
const cardStyle = {
    background: "#fff", border: "1px solid #ddd", borderRadius: "8px",
    padding: "8px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
};
const bannerStyle = {
    background: "#f2dede", color: "#a94442", padding: "10px 16px",
    borderRadius: "6px", marginBottom: "16px",
};
const btnStyle = (bg) => ({
    background: bg, color: "#fff", border: "none",
    padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "0.95rem",
});

export default Profile;