import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://127.0.0.1:8000/api/auth/";
const POST_URL = "http://127.0.0.1:8000/api/";
const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
});

const InternshipPlacementForm = ({ editingPlacement, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        student: '',
        student_no: '',
        company_name: '',
        start_date: '',
        end_date: '',
        workplace_supervisor: '',
    });

    const [students, setStudents] = useState([]);
    const [supervisors, setSupervisors] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // fetch both users on mount.
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const [studentsRes, supervisorsRes] = await Promise.all([
                    axios.get(`${API_URL}users/?role=student`, authHeaders()),
                    axios.get(`${API_URL}users/?role=workplace_supervisor`, authHeaders()),
                ]);
                setStudents(studentsRes.data);
                setSupervisors(supervisorsRes.data);
            } catch (err) {
                setError("Failed to load students/supervisors list.");
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (editingPlacement) {
            setFormData({
                student: editingPlacement.student || "",
                student_no: editingPlacement.student_no || "",
                company_name: editingPlacement.company_name || "",
                start_date: editingPlacement.start_date || "",
                end_date: editingPlacement.end_date || "",
                workplace_supervisor: editingPlacement.workplace_supervisor || "",
            });
        }
    }, [editingPlacement]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            if (editingPlacement) {
                await axios.put(`${POST_URL}placements/${editingPlacement.id}/`, formData, authHeaders());
                onSuccess("Placement updated.");
            } else {
                await axios.post(`${POST_URL}placements/`, formData, authHeaders());
                onSuccess("Placement created.");
            }
        } catch (err) {
            const data = err.response?.data;
            if (typeof data === "object") {
                setError(Object.values(data).flat().join(" "));
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const userLabel = (user) => {
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
        return fullName ? `${user.username} (${fullName})` : user.username;
    };

    return (
        <div>
            <h3>{editingPlacement ? "Edit Placement" : "Create New Placement"}</h3>

            {error && (
                <div style={{ background: "#f2dede", color: "#a94442", padding: "8px 12px", borderRadius: "4px", marginBottom: "10px" }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={twoCol}>
                    <div style={fieldStyle}>
                        <label>Student</label>
                        <select
                            name="student"
                            value={formData.student}
                            onChange={handleChange}
                            required
                            disabled={loadingUsers}
                            style={inputStyle}
                        >
                            <option value="">-- Select a student --</option>
                            {students.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {userLabel(s)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={fieldStyle}>
                        <label>Student Number</label>
                        <input
                            type="text"
                            name="student_no"
                            value={formData.student_no}
                            onChange={handleChange}
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={fieldStyle}>
                    <label>Company Name</label>
                    <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={twoCol}>
                    <div style={fieldStyle}>
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                    <div style={fieldStyle}>
                        <label>End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                <div style={fieldStyle}>
                    <label>Workplace Supervisor</label>
                    <select
                        name="workplace_supervisor"
                        value={formData.workplace_supervisor}
                        onChange={handleChange}
                        disabled={loadingUsers}
                        style={inputStyle}
                    >
                        <option value="">-- None --</option>
                        {supervisors.map((s) => (
                            <option key={s.id} value={s.id}>
                                {userLabel(s)}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                    <button type="submit" disabled={submitting} style={btnStyle("#5cb85c")}>
                        {submitting ? "Saving.." : editingPlacement ? "Update" : "Create"}
                    </button>
                    <button type="button" onClick={onCancel} style={btnStyle("#aaa")}>
                        cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

const fieldStyle = { marginBottom: "12px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 };
const inputStyle = { padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1rem" };
const twoCol = { display: "flex", gap: "12px" };
const btnStyle = (bg) => ({
    background: bg, color: "#fff", border: "none",
    padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "0.95rem",
});

export default InternshipPlacementForm;