import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
});

function InternshipAdmin() {
  const [placements, setPlacements] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // New placement form
  const [showForm, setShowForm] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);
  const [formData, setFormData] = useState({
    student: "", company_name: "", student_no: "",
    start_date: "", end_date: "", workplace_supervisor: "",
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [placRes, logRes] = await Promise.all([
        axios.get(`${API_URL}placements/`, authHeaders()),
        axios.get(`${API_URL}logs/`, authHeaders()),
      ]);
      setPlacements(placRes.data);
      setLogs(logRes.data);
    } catch (err) {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openNew = () => {
    setEditingPlacement(null);
    setFormData({ student: "", company_name: "", student_no: "", start_date: "", end_date: "", workplace_supervisor: "" });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingPlacement(p);
    setFormData({
      student: p.student, company_name: p.company_name, student_no: p.student_no,
      start_date: p.start_date, end_date: p.end_date,
      workplace_supervisor: p.workplace_supervisor || "",
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (editingPlacement) {
        await axios.put(`${API_URL}placements/${editingPlacement.id}/`, formData, authHeaders());
        showSuccess("Placement updated.");
      } else {
        await axios.post(`${API_URL}placements/`, formData, authHeaders());
        showSuccess("Placement created.");
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      const data = err.response?.data;
      if (typeof data === "object") {
        setFormError(Object.values(data).flat().join(" "));
      } else {
        setFormError("Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this placement? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}placements/${id}/`, authHeaders());
      showSuccess("Placement deleted.");
      fetchAll();
    } catch {
      setError("Failed to delete placement.");
      setTimeout(() => setError(null), 4000);
    }
  };

  // ── Stats for the summary cards ──
  const totalPlacements = placements.length;
  const totalLogs = logs.length;
  const pendingLogs = logs.filter((l) => ["submitted", "reviewed"].includes(l.status)).length;
  const approvedLogs = logs.filter((l) => l.status === "approved").length;

  const statCard = (label, value, color) => (
    <div style={{
      flex: "1", minWidth: "140px", background: color + "22",
      border: `1px solid ${color}55`, borderRadius: "8px",
      padding: "16px 20px", textAlign: "center",
    }}>
      <div style={{ fontSize: "2rem", fontWeight: "700", color }}>{value}</div>
      <div style={{ fontSize: "0.85rem", color: "#555", marginTop: "4px" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Internship Administrator Dashboard</h2>
      <p>Manage placements and monitor system-wide internship activity.</p>

      {successMsg && <div style={bannerStyle("success")}>✅ {successMsg}</div>}
      {error && <div style={bannerStyle("error")}>❌ {error}</div>}

      {/* ── Stats ── */}
      {!loading && (
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", margin: "20px 0" }}>
          {statCard("Total placements", totalPlacements, "#337ab7")}
          {statCard("Total logs", totalLogs, "#9b59b6")}
          {statCard("Pending review", pendingLogs, "#f0ad4e")}
          {statCard("Approved logs", approvedLogs, "#5cb85c")}
        </div>
      )}

      {/* ── Placements table ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px" }}>
        <h3 style={{ margin: 0 }}>Internship Placements</h3>
        <button onClick={openNew} style={btnStyle("#337ab7")}>+ New Placement</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : placements.length === 0 ? (
        <p style={{ color: "#888", marginTop: "12px" }}>No placements yet.</p>
      ) : (
        <table style={{ ...tableStyle, marginTop: "12px" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={thStyle}>Student ID</th>
              <th style={thStyle}>Student No</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>Start</th>
              <th style={thStyle}>End</th>
              <th style={thStyle}>Supervisor ID</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={tdStyle}>{p.student}</td>
                <td style={tdStyle}>{p.student_no}</td>
                <td style={tdStyle}>{p.company_name}</td>
                <td style={tdStyle}>{p.start_date}</td>
                <td style={tdStyle}>{p.end_date}</td>
                <td style={tdStyle}>{p.workplace_supervisor || "—"}</td>
                <td style={{ ...tdStyle, display: "flex", gap: "6px" }}>
                  <button onClick={() => openEdit(p)} style={btnStyle("#f0ad4e", "sm")}>Edit</button>
                  <button onClick={() => handleDelete(p.id)} style={btnStyle("#d9534f", "sm")}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── Create / Edit Placement Form ── */}
      {showForm && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: "560px" }}>
            <h3>{editingPlacement ? "Edit Placement" : "Create New Placement"}</h3>
            {formError && (
              <div style={{ background: "#f2dede", color: "#a94442", padding: "8px 12px", borderRadius: "4px", marginBottom: "10px" }}>
                {formError}
              </div>
            )}
            <form onSubmit={handleFormSubmit}>
              <div style={twoCol}>
                <div style={fieldStyle}>
                  <label>Student (user ID)</label>
                  <input type="number" name="student" value={formData.student} onChange={handleFormChange} required style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label>Student Number</label>
                  <input type="text" name="student_no" value={formData.student_no} onChange={handleFormChange} style={inputStyle} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label>Company Name</label>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleFormChange} required style={inputStyle} />
              </div>
              <div style={twoCol}>
                <div style={fieldStyle}>
                  <label>Start Date</label>
                  <input type="date" name="start_date" value={formData.start_date} onChange={handleFormChange} required style={inputStyle} />
                </div>
                <div style={fieldStyle}>
                  <label>End Date</label>
                  <input type="date" name="end_date" value={formData.end_date} onChange={handleFormChange} required style={inputStyle} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label>Workplace Supervisor (user ID, optional)</label>
                <input type="number" name="workplace_supervisor" value={formData.workplace_supervisor} onChange={handleFormChange} style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                <button type="submit" disabled={submitting} style={btnStyle("#5cb85c")}>
                  {submitting ? "Saving..." : editingPlacement ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={btnStyle("#aaa")}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = (bg, size = "md") => ({
  background: bg, color: "#fff", border: "none",
  padding: size === "sm" ? "4px 10px" : "8px 18px",
  borderRadius: "4px", cursor: "pointer",
  fontSize: size === "sm" ? "0.8rem" : "0.95rem",
});
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "10px 12px", borderBottom: "2px solid #ddd", textAlign: "left", fontWeight: "600" };
const tdStyle = { padding: "10px 12px", verticalAlign: "middle" };
const fieldStyle = { marginBottom: "12px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 };
const inputStyle = { padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1rem" };
const twoCol = { display: "flex", gap: "12px" };
const bannerStyle = (type) => ({
  background: type === "success" ? "#dff0d8" : "#f2dede",
  color: type === "success" ? "#3c763d" : "#a94442",
  padding: "10px 16px", borderRadius: "6px", marginBottom: "12px",
});
const overlayStyle = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  background: "rgba(0,0,0,0.5)", display: "flex",
  alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const modalStyle = {
  background: "#fff", borderRadius: "8px", padding: "28px",
  maxWidth: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};

export default InternshipAdmin;
