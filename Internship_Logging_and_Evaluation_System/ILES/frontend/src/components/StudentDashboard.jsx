import React, { useState, useEffect } from "react";
import { getLogs, createLog, updateLog, submitLog, recallLog } from "../services/logService";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
});

function StudentDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [formData, setFormData] = useState({ week_number: '', activities: '', placement: '' });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const[placement, setPlacement] = useState(null);
  const[placementLoading, setPlacementLoading] = useState(true);

  // Fetch logs on 
  useEffect(() => {
    fetchPlacement();
    fetchLogs();
  }, []);

  const fetchPlacement = async () => {
  try {
    setPlacementLoading(true);
    const res = await axios.get(`${API_URL}placements/`, authHeaders());
    if (res.data.length > 0) {
      setPlacement(res.data[0]);
    }
  } catch (err) {
    setError("Could not load your placement. Contact your administrator.");
  } finally {
    setPlacementLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs();
      setLogs(data);
    } catch (err) {
      setError("Failed to load logs.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Open form for new log
  const handleNewLog = () => {
    if (!placement){
      setError("You don't have any active placement, and therefore you cannot create a new log");
      return;
  }
    setEditingLog(null);
    setFormData({ week_number: '', activities: '', placement: '' });
    setFormError(null);
    setShowForm(true);
  };

  // Open form to edit existing log
  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({ week_number: log.week_number, activities: log.activities, placement: log.placement });
    setFormError(null);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingLog) {
        await updateLog(editingLog.id, { activities: formData.activities });
        showSuccess(`Week ${editingLog.week_number} log updated.`);
      } else {
        await createLog({...formData, placement:placement.id});
        showSuccess(`Week ${formData.week_number} log created.`);
      }
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      const data = err.response?.data;
      // Extract readable error message
      if (typeof data === 'object') {
        const msgs = Object.values(data).flat().join(' ');
        setFormError(msgs);
      } else {
        setFormError("Something went wrong.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitLog = async (log) => {
    try {
      await submitLog(log.id);
      showSuccess(`Week ${log.week_number} log submitted.`);
      fetchLogs();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to submit log.";
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleRecall = async (log) => {
    try {
      await recallLog(log.id);
      showSuccess(`Week ${log.week_number} log recalled to draft.`);
      fetchLogs();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to recall log.";
      setError(msg);
      setTimeout(() => setError(null), 4000);
    }
  };

  const statusBadge = (status) => {
    const colors = {
      draft: '#f0ad4e',
      submitted: '#5bc0de',
      reviewed: '#9b59b6',
      approved: '#5cb85c',
    };
    return (
      <span style={{
        background: colors[status] || '#ccc',
        color: '#fff',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        textTransform: 'capitalize'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h2>Student Dashboard</h2>
      <p>Manage your weekly internship logs below.</p>

      {!placementLoading && (
  placement ? (
    <div style={{ background: "#e8f4fd", border: "1px solid #b8d9f0", borderRadius: "6px", padding: "10px 16px", marginBottom: "16px", fontSize: "0.9rem" }}>
      <strong>Active placement:</strong> {placement.company_name} &nbsp;|&nbsp;
      {placement.start_date} → {placement.end_date}
    </div>
  ) : (
    <div style={{ background: "#f2dede", color: "#a94442", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px" }}>
      ⚠ No active placement found. Contact your internship administrator.
    </div>
  )
)}

      {/* Success / Error banners */}
      {successMsg && (
        <div style={{ background: '#dff0d8', color: '#3c763d', padding: '10px 16px', borderRadius: '6px', marginBottom: '12px' }}>
          ✅ {successMsg}
        </div>
      )}
      {error && (
        <div style={{ background: '#f2dede', color: '#a94442', padding: '10px 16px', borderRadius: '6px', marginBottom: '12px' }}>
          ❌ {error}
        </div>
      )}

      <button onClick={handleNewLog} style={btnStyle('#337ab7')}>
        + New Weekly Log
      </button>

      {/* Log Form (create / edit) */}
      {showForm && (
        <div style={{ background: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', margin: '20px 0' }}>
          <h3>{editingLog ? `Edit Week ${editingLog.week_number} Log` : 'Create New Log'}</h3>
          {formError && (
            <div style={{ background: '#f2dede', color: '#a94442', padding: '8px 12px', borderRadius: '4px', marginBottom: '10px' }}>
              {formError}
            </div>
          )}
          <form onSubmit={handleFormSubmit}>
            {/* Only show these fields when creating */}
            {!editingLog && (
              <>
                {placement && (
                <div style={{ ...fieldStyle, marginBottom: "14px" }}>
                    <label style={{ fontWeight: "500", fontSize: "0.9rem", color: "#555" }}>Placement</label>
                      <div style={{ padding: "8px", background: "#eee", borderRadius: "4px", fontSize: "0.95rem" }}>
                      {placement.company_name} (ID: {placement.id})
                      </div>
                </div>
)}
                <div style={fieldStyle}>
                  <label>Week Number</label>
                  <input
                    type="number"
                    name="week_number"
                    value={formData.week_number}
                    onChange={handleFormChange}
                    required
                    min="1"
                    max="52"
                    style={inputStyle}
                  />
                </div>
              </>
            )}
            <div style={fieldStyle}>
              <label>Activities</label>
              <textarea
                name="activities"
                value={formData.activities}
                onChange={handleFormChange}
                required
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Describe your activities for this week..."
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button type="submit" disabled={submitting} style={btnStyle('#5cb85c')}>
                {submitting ? 'Saving...' : editingLog ? 'Update Log' : 'Create Log'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={btnStyle('#aaa')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p style={{ color: '#888', marginTop: '20px' }}>No logs yet. Create your first weekly log!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f5f5f5', textAlign: 'left' }}>
              <th style={thStyle}>Week</th>
              <th style={thStyle}>Activities</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Submitted At</th>
              <th style={thStyle}>Evaluation </th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={tdStyle}>Week {log.week_number}</td>
                <td style={{ ...tdStyle, maxWidth: '300px' }}>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.activities}
                  </span>
                </td>
                <td style={tdStyle}>{statusBadge(log.status)}</td>
                <td style={tdStyle}>
                  {log.submitted_at ? new Date(log.submitted_at).toLocaleString() : '—'}
                </td>
                <td style={tdStyle}>
                  {log.evaluation_finalized ? (
                    <div>
                      <div style={{ color: '#5cb85c', fontWeight: 'bold', fontSize: '0.9rem' }}>Finalized</div>
                      <div style={{ marginTop: '4px', fontSize: '0.85rem', color: '#333' }}>
                        Score: {Number(log.evaluation_score).toFixed(2)}
                      </div>
                    </div>
                  ):(
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>Pending</span>
                  )}
                </td>
                <td style={{ ...tdStyle, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {/* Edit: only draft logs */}
                  {log.status === 'draft' && (
                    <button onClick={() => handleEdit(log)} style={btnStyle('#f0ad4e', 'sm')}>
                      Edit
                    </button>
                  )}
                  {/* Submit: only draft logs */}
                  {log.status === 'draft' && (
                    <button onClick={() => handleSubmitLog(log)} style={btnStyle('#5bc0de', 'sm')}>
                      Submit
                    </button>
                  )}
                  {/* Recall: only submitted logs */}
                  {log.status === 'submitted' && (
                    <button onClick={() => handleRecall(log)} style={btnStyle('#d9534f', 'sm')}>
                      Recall
                    </button>
                  )}
                  {/* Approved: no actions */}
                  {log.status === 'approved' && (
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Style helpers
const btnStyle = (bg, size = 'md') => ({
  background: bg,
  color: '#fff',
  border: 'none',
  padding: size === 'sm' ? '4px 10px' : '8px 18px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: size === 'sm' ? '0.8rem' : '0.95rem',
});

const fieldStyle = { marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '4px' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '1rem' };
const thStyle = { padding: '10px 12px', borderBottom: '2px solid #ddd', fontWeight: '600' };
const tdStyle = { padding: '10px 12px', verticalAlign: 'middle' };

export default StudentDashboard;