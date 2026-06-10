import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

const authHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
});

function AcademicSup() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    const [reviewLog, setReviewLog] = useState(null);
    const [viewMode, setViewMode] = useState("detail");
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [historyLog, setHistoryLog] = useState(null);
    const [history, setHistory] = useState([]);

    const [evaluationLog, setEvaluationLog] = useState(null);
    const [evaluationData, setEvaluationData] = useState({
        punctuality: 1,
        technical_skills: 1,
        communication: 1,
        initiative: 1
    });
    const [savingEvaluation, setSavingEvaluation] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}logs/`, authHeaders());
            setLogs(response.data);
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
        setViewMode("detail");
        setComment("");
        setEvaluationData({
            punctuality: 1,
            technical_skills: 1,
            communication: 1,
            initiative: 1
        });
        setReviewLog(log);
    }

    const closeReview = () => {
        setReviewLog(null);
        setViewMode("detail");
        setComment("");
    }

    const handleReview = async () => {
        setSubmitting(true);
        try {
            await axios.post(
                `${API_URL}logs/${selectedLog.id}/review/`,
                { comment },
                authHeaders()
            );
            showSuccess(`Week ${selectedLog.week_number} log marked as reviewed.`);
            setSelectedLog(null);
            setComment("");
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
            const response = await axios.get(`${API_URL}logs/${log.id}/history/`, authHeaders());
            setHistory(response.data);
        } catch {
            setHistory([]);
        }
    };

    const openEvaluation = (log) => {
        setEvaluationLog(log);

        setEvaluationData({
            punctuality: 1,
            technical_skills: 1,
            communication: 1,
            initiative: 1
        });
    };

    const handleEvaluationSubmit = async (finalize = false) => {
        try {
            setSavingEvaluation(true);
            await axios.post(
                `${API_URL}criteria/`,
                {
                    log: reviewLog.id,
                    ...evaluationData,
                    is_finalized: finalize,
                },
                authHeaders()
            );
            showSuccess(
                finalize
                    ? "Evaluation finalized successfully."
                    : "Evaluation draft saved."
            );
            console.log("successfully submitted evaluation:", evaluationData);
            setEvaluationLog(null);
            fetchLogs();
        } catch (err) {
            setError("Failed to save evaluation.");
            setTimeout(() => setError(null), 4000);
        } finally {
            setSavingEvaluation(false);
        }
    };

    const statusBadge = (status) => {
        const colors = { draft: "#f0ad4e", submitted: "#5bc0de", reviewed: "#9b59b6", approved: "#5cb85c" };
        return (
            <span style={{ background: colors[status] || "#ccc", color: "#fff", padding: "2px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "bold", textTransform: "capitalize" }}>
                {status}
            </span>
        );
    };

    const submittedLogs = logs.filter(l => l.status === "submitted");
    const otherLogs = logs.filter(l => l.status !== "submitted");

    const totalScore =
        (evaluationData.punctuality * 0.2) +
        (evaluationData.technical_skills * 0.4) +
        (evaluationData.communication * 0.2) +
        (evaluationData.initiative * 0.2);

    return (
        <div style={{ padding: "24px", maxWidth: "960px", margin: "0 auto" }}>
            <h2>Academic Supervisor Dashboard</h2>
            <p>Review student weekly logs before they are approved by the workplace supervisor.</p>

            {successMsg && <div style={bannerStyle("success")}>✅ {successMsg}</div>}
            {error && <div style={bannerStyle("error")}>❌ {error}</div>}

            {loading ? <p>Loading logs...</p> : (
                <>
                    <h3 style={{ marginTop: "24px" }}>
                        Awaiting Your Review
                        <span style={{ marginLeft: "10px", background: "#5bc0de", color: "#fff", borderRadius: "12px", padding: "2px 10px", fontSize: "0.85rem" }}>
                            {submittedLogs.length}
                        </span>
                    </h3>

                    {submittedLogs.length === 0 ? (
                        <p style={{ color: "#888" }}>No logs awaiting review.</p>
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
                                {submittedLogs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={tdStyle}>{log.placement}</td>
                                        <td style={tdStyle}>Week {log.week_number}</td>
                                        <td style={tdStyle}>
                                            {statusBadge(log.status)}
                                            {log.evaluation_finalized && (
                                                <div style={{ marginTop: "6px", fontSize: "0.75rem", color: "#5cb85c", fontWeight: "bold" }}>
                                                    Evaluation Finalized
                                                </div>
                                            )}
                                        </td>
                                        <td style={tdStyle}>{log.submitted_at ? new Date(log.submitted_at).toLocaleString() : "—"}</td>
                                        <td style={{ ...tdStyle, display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                            <button onClick={() => openReview(log)} style={btnStyle("#5bc0de", "sm")}>
                                                Review
                                            </button>
                                            <button onClick={() => openHistory(log)} style={btnStyle("#777", "sm")}>
                                                History
                                            </button>
                                            {log.evaluation_finalized && (
                                                <span style={{ fontSize: "0.75rem", color: "#5cb85c", fontWeight: "bold", alignSelf: "center" }}>
                                                    score: {log.evaluation_score !== null ? Number(log.evaluation_score).toFixed(2) : "N/A"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

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
                                {otherLogs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                                        <td style={tdStyle}>{log.placement}</td>
                                        <td style={tdStyle}>Week {log.week_number}</td>
                                        <td style={tdStyle}>
                                            {statusBadge(log.status)}
                                            {log.evaluation_finalized && (
                                                <div style={{ marginTop: "6px", fontSize: "0.75rem", color: "#5cb85c", fontWeight: "bold" }}>
                                                    Evaluation Finalized
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ ...tdStyle, display: "flex", gap: "6px", flexWrap: "wrap" }}>
                                            <button onClick={() => openReview(log)} style={btnStyle("#5bc0de", "sm")}>Review</button>
                                            <button onClick={() => openHistory(log)} style={btnStyle("#777", "sm")}>History</button>
                                            {log.evaluation_finalized && (
                                                <span style={{ fontsize: "0.75rem", color: "#5cb85c", fontWeight: "bold", alignSelf: "center" }}>
                                                    score: {log.evaluation_score !== null ? Number(log.evaluation_score).toFixed(2) : "N/A"}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}

            {/* Unified Review Modal */}
            {reviewLog && (
                <div style={overlayStyle}>
                    <div style={{ ...modalStyle, width: "600px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ margin: 0 }}>
                                Week {reviewLog.week_number} Log - {reviewLog.placement}
                            </h3>
                            {statusBadge(reviewLog.status)}
                        </div>

                        {/* Header to be shown in every viewMode */}
                        {viewMode === "detail" && (
                            <>
                                <div style={logSection}>
                                    <p style={logLabel}>Submitted</p>
                                    <p style={logValue}>
                                        {reviewLog.submitted_at ? new Date(reviewLog.submitted_at).toLocaleString() : "—"}
                                    </p>
                                </div>

                                <div style={logSection}>
                                    <p style={logLabel}>Activities / Tasks Completed</p>
                                    <p style={{ ...logValue, whiteSpace: "pre-wrap" }}>
                                        {reviewLog.activities || "—"}
                                    </p>
                                </div>

                                {reviewLog.evaluation_finalized && (
                                    <div style={logSection}>
                                        <p style={logLabel}>Evaluation Score</p>
                                        <p style={{ ...logValue, color: "#5cb85c", fontWeight: "bold" }}>
                                            {reviewLog.evaluation_score !== null ? Number(reviewLog.evaluation_score).toFixed(2) : "N/A"} / 10
                                        </p>
                                    </div>
                                )}

                                <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "16px 0" }} />

                                <div>
                                    {reviewLog.status == "submitted" && (
                                        <button onClick={() => setViewMode("review")} style={btnStyle("#5cb85c")}>
                                            Mark as Reviewed
                                        </button>
                                    )}
                                    {/* Evaluated hidden once finalized */}
                                    {!reviewLog.evaluation_finalized && (
                                        <button onClick={() => setViewMode("evaluate")} style={btnStyle("#5bc0de")}>
                                            Evaluate
                                        </button>
                                    )}
                                    <button onClick={closeReview} style={btnStyle("#aaa")}>
                                        Close
                                    </button>
                                </div>
                            </>
                        )}

                        {/* viewMode: review, mark reviewed comment box */}
                        {viewMode === "review" && (
                            <div>
                                <p style={{ color: "#555", marginBottom: "12px" }}>Optionally add a comment.</p>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    placeholder="Enter comment..."
                                    style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box" }}
                                />
                                <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                                    <button onClick={handleReview} disabled={submitting} style={btnStyle("#9b59b6")}>
                                        {submitting ? "Processing..." : "Confirm Review"}
                                    </button>
                                    <button onClick={() => setViewMode("detail")} style={btnStyle("#aaa")}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Evaluate scoring sliders */}
                        {viewMode === "evaluate" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {[
                                    ["punctuality", "Punctuality", "20%"],
                                    ["technical_skills", "Technical Skills", "25%"],
                                    ["communication", "Communication", "25%"],
                                    ["initiative", "Initiative", "30%"]
                                ].map(([key, label, weight]) => (
                                    <div key={key}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                            <label style={{ fontWeight: "500" }}>{label}</label>
                                            <span style={{ fontSize: "0.85rem", color: "#337ab7" }}>
                                                {evaluationData[key]} / 10 &nbsp;
                                                <span style={{ color: "#999", fontSize: "0.75rem" }}>({weight})</span>
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={evaluationData[key]}
                                            onChange={(e) => setEvaluationData({ ...evaluationData, [key]: Number(e.target.value) })}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                ))}

                                <div style={{ fontWeight: "bold", marginTop: "8px", borderRadius: "4px", padding: "8px", background: "#f0f0f0" }}>
                                    Total Score: {totalScore.toFixed(2)}
                                </div>

                                <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                                    <button
                                        onClick={() => handleEvaluationSubmit(false)}
                                        disabled={savingEvaluation}
                                        style={btnStyle("#5bc0de")}
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        onClick={() => handleEvaluationSubmit(true)}
                                        disabled={savingEvaluation}
                                        style={btnStyle("#5cb85c")}
                                    >
                                        Finalize
                                    </button>
                                    <button onClick={() => setViewMode("detail")} style={btnStyle("#aaa")}>
                                        Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* History Modal */}
            {
                historyLog && (
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
                                        {history.map(h => (
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
                            <button onClick={() => setHistoryLog(null)} style={{ ...btnStyle("#aaa"), marginTop: "16px" }}>Close</button>
                        </div>
                    </div>
                )
            }

            {/* Evaluation Modal */}
            {
                evaluationLog && (
                    <div style={overlayStyle}>
                        <div style={modalStyle}>
                            <h3>Evaluate Week {evaluationLog.week_number}</h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
                                {[
                                    ["punctuality", "Punctuality", "20%"],
                                    ["technical_skills", "Technical Skills", "25%"],
                                    ["communication", "Communication", "25%"],
                                    ["initiative", "Initiative", "30%"]
                                ].map(([key, label, weight]) => (
                                    <div key={key}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                                            <label style={{ fontWeight: "500" }}>{label}</label>
                                            <span style={{ fontSize: "0.85rem", color: "#337ab7" }}>
                                                {evaluationData[key]} / 10 &nbsp;
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={evaluationData[key]}
                                            onChange={(e) => setEvaluationData({ ...evaluationData, [key]: Number(e.target.value) })}
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                ))}
                                <div style={{ fontWeight: "bold", marginTop: "8px", borderRadius: "4px", padding: "8px", background: "#f0f0f0" }}>Total Score: {totalScore.toFixed(2)}</div>

                                <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
                                    <button
                                        onClick={() => handleEvaluationSubmit(false)}
                                        disabled={savingEvaluation}
                                        style={btnStyle("#5bc0de")}
                                    >
                                        Save Draft
                                    </button>

                                    <button
                                        onClick={() => handleEvaluationSubmit(true)}
                                        disabled={savingEvaluation}
                                        style={btnStyle("#5cb85c")}
                                    >
                                        Finalize
                                    </button>

                                    <button
                                        onClick={() => setEvaluationLog(null)}
                                        style={btnStyle("#aaa")}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

const logSection = { marginBottom: "12px" };
const logLabel = {
    fontSize: "0.75rem", fontWeight: "600", color: "#888",
    textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px"
};
const logValue = { fontSize: "0.95rem", color: "#333", margin: 0 };

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
const overlayStyle = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const modalStyle = { background: "#fff", borderRadius: "8px", padding: "28px", width: "500px", maxWidth: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" };

export default AcademicSup;