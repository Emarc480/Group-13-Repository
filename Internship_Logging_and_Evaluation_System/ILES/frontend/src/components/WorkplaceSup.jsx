import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
});

function WorkplaceSup() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Modal state — shared for approve and reject actions
  const [reviewLog, setReviewLog] = useState(null);
  const [modalAction, setModalAction] = useState(null); // 'approve' | 'reject'
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // History modal
  const [historyLog, setHistoryLog] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}logs/`, authHeaders());
      setLogs(res.data);
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

  const openReview = (log) => {
    setReviewLog(log);
    setModalAction("null");
    setComment("");
  }


  const closeReview = () => {
    setReviewLog(null);
    setModalAction(null);
    setComment("");
  };

  const handleAction = async () => {
    if (!reviewLog || !modalAction) return;
    if (modalAction === "reject" && !comment.trim()) {
      setError("A comment is required when rejecting a log.");
      setTimeout(() => setError(null), 4000);
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}logs/${reviewLog.id}/${modalAction}/`,
        { comment },
        authHeaders()
      );
      showSuccess(
        modalAction === "approve"
          ? `Week ${reviewLog.week_number} log approved.`
          : `Week ${reviewLog.week_number} log rejected and returned to student.`
      );
      closeReview();
      fetchLogs();
    } catch (err) {
      const msg = err.response?.data?.error || "Action failed.";
      setError(msg);
      setTimeout(() => setError(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const openHistory = async (log) => {
    setHistoryLog(log);
    try {
      const res = await axios.get(`${API_URL}logs/${log.id}/history/`, authHeaders());
      setHistory(res.data);
    } catch {
      setHistory([]);
    }
  };

  const statusBadge = (s) => {
    const colors = {
      draft: "#f0ad4e", submitted: "#5bc0de",
      reviewed: "#9b59b6", approved: "#5cb85c", rejected: "#d9534f",
    };
    return (
      <span style={{
        background: colors[s] || "#ccc", color: "#fff",
        padding: "2px 10px", borderRadius: "12px",
        fontSize: "0.8rem", fontWeight: "bold", textTransform: "capitalize",
      }}>
        {s}
      </span>
    );
  };

  // Logs this supervisor can act on: submitted or reviewed
  const actionableLogs = logs.filter((l) => ["submitted", "reviewed"].includes(l.status));
  const otherLogs = logs.filter((l) => !["submitted", "reviewed"].includes(l.status));

  return (
    <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
      <h2>Workplace Supervisor Dashboard</h2>
      <p>Review, approve, or reject your students' weekly logs.</p>

      {successMsg && <div style={bannerStyle("success")}>✅ {successMsg}</div>}
      {error && <div style={bannerStyle("error")}>❌ {error}</div>}

      {loading ? (
        <p>Loading logs...</p>
      ) : (
        <>
          {/* ── Actionable logs ── */}
          <h3 style={{ marginTop: "24px" }}>
            Awaiting Action
            <span style={{ marginLeft: "10px", background: "#5bc0de", color: "#fff", borderRadius: "12px", padding: "2px 10px", fontSize: "0.85rem" }}>
              {actionableLogs.length}
            </span>
          </h3>

          {actionableLogs.length === 0 ? (
            <p style={{ color: "#888" }}>No logs awaiting your action.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={thStyle}>Placement</th>
                  <th style={thStyle}>Week</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Submitted At</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {actionableLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>{log.placement}</td>
                    <td style={tdStyle}>Week {log.week_number}</td>
                    <td style={tdStyle}>{statusBadge(log.status)}</td>
                    <td style={tdStyle}>{log.submitted_at ? new Date(log.submitted_at).toLocaleString() : "—"}</td>
                    <td style={{ ...tdStyle, display: "flex", gap: "6px" }}>
                      <button onClick={() => openReview(log)} style={btnStyle("#5bc0de", "sm")}>
                        Review
                      </button>
                      <button onClick={() => openHistory(log)} style={btnStyle("#777", "sm")}>
                        History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* ── All other logs ── */}
          <h3 style={{ marginTop: "32px" }}>All Logs</h3>
          {otherLogs.length === 0 ? (
            <p style={{ color: "#888" }}>No other logs.</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th style={thStyle}>Placement</th>
                  <th style={thStyle}>Week</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {otherLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={tdStyle}>{log.placement}</td>
                    <td style={tdStyle}>Week {log.week_number}</td>
                    <td style={tdStyle}>{statusBadge(log.status)}</td>
                    <td style={tdStyle}>
                      <button onClick={() => openHistory(log)} style={btnStyle("#777", "sm")}>History</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* ── Review Modal ── */}
      {reviewLog && (
        <div style={overlayStyle}>
          <div style={{ ...modalStyle, width: "620px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h3 style={{ margin: 0 }}>
                Week {reviewLog.week_number} Log - {reviewLog.placement}
              </h3>
              {statusBadge(reviewLog.status)}
            </div>

            {/* Full Log Details */}
            <div style={logSection}>
              <p style={logLabel}>Submitted</p>
              <p style={logValue}>{reviewLog.submitted_at ? new Date(reviewLog.submitted_at).toLocaleString() : "—"}</p>
            </div>

            {/* Activities */}
            <div style={logSection}>
              <p style={logLabel}>Activities / Tasks completed</p>
              <p style={{ ...logValue, whiteSpace: "pre-wrap" }}>
                {reviewLog.activities || "No activities provided."}
              </p>
            </div>

            <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "16px 0" }} />

            {/* Action selection */}
            {!modalAction ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModalAction("approve")} style={btnStyle("#5cb85c")}>Approve</button>
                <button onClick={() => setModalAction("reject")} style={btnStyle("#d9534f")}>Reject</button>
                <button onClick={closeReview} style={btnStyle("#aaa")}>Cancel</button>
              </div>
            ) : (
              <div>
                <p style={{ color: "#555", marginBottom: "8px" }}>
                  {modalAction === "approve"
                    ? "Add a comment for approval (optional):"
                    : "Please provide a comment for rejection:"}
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={modalAction === "reject" ? "Explain why the log is being rejected..." : "Comment (optional for approval)..."}
                  style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "0.9rem", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                  <button
                    onClick={handleAction}
                    disabled={submitting} s
                    tyle={btnStyle(modalAction === "approve" ? "#5cb85c" : "#d9534f")}
                  >
                    {submitting
                      ? "Submitting..."
                      : modalAction === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                  </button>
                  <button onClick={() => setModalAction(null)} style={btnStyle("#aaa")}>
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── History Modal ── */}
      {historyLog && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h3>Review History — Week {historyLog.week_number}</h3>
            {history.length === 0 ? (
              <p style={{ color: "#888" }}>No review history yet.</p>
            ) : (
              <table style={{ ...tableStyle, marginTop: "12px" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th style={thStyle}>Action</th>
                    <th style={thStyle}>Reviewer</th>
                    <th style={thStyle}>Comment</th>
                    <th style={thStyle}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={tdStyle}>{statusBadge(h.action)}</td>
                      <td style={tdStyle}>{h.reviewer_name}</td>
                      <td style={tdStyle}>{h.comment || "—"}</td>
                      <td style={tdStyle}>{new Date(h.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button onClick={() => setHistoryLog(null)} style={{ ...btnStyle("#aaa"), marginTop: "16px" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const logSection = { marginBottom: "12px" };
const logLabel = {
  fontSize: "0.75rem", fontWeight: "600", color: "#888", margin: "0 0 4px",
  textTransform: "uppercase", letterSpacing: "0.02em",
};
const logValue = { fontSize: "0.9rem", color: "#333", margin: 0
};

const btnStyle = (bg, size = "md") => ({
  background: bg, color: "#fff", border: "none",
  padding: size === "sm" ? "4px 10px" : "8px 18px",
  borderRadius: "4px", cursor: "pointer",
  fontSize: size === "sm" ? "0.8rem" : "0.95rem",
});
const tableStyle = { width: "100%", borderCollapse: "collapse" };
const thStyle = { padding: "10px 12px", borderBottom: "2px solid #ddd", textAlign: "left", fontWeight: "600" };
const tdStyle = { padding: "10px 12px", verticalAlign: "middle" };
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
  width: "500px", maxWidth: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};

export default WorkplaceSup;
