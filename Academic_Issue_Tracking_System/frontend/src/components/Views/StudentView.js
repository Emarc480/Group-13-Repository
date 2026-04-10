import React, { useEffect, useState } from 'react';
import '../CSS/StudentView.css';

const StudentView = () => {
    const token = localStorage.getItem('token');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({
        course_code: '',
        category: 'missing_marks',
        description: '',
        department: 1,
    });
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        window.location.href = '/home/login/';
    };

    const fetchDashboard = () => {
        fetch('http://127.0.0.1:8000/api/student/dashboard/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(json => setData(json))
            .catch(() => setError('Failed to load dashboard'));
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleSubmit = () => {
        setSubmitSuccess(false);
        setSubmitError(null);
        fetch('http://127.0.0.1:8000/api/student/submit_issue/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
            .then(res => res.json())
            .then(json => {
                if (json.id) {
                    setSubmitSuccess(true);
                    setForm({ course_code: '', category: 'missing_marks', description: '', department: 1 });
                    fetchDashboard();
                } else {
                    setSubmitError('Failed to submit issue. Check your inputs.');
                }
            })
            .catch(() => setSubmitError('Network error. Try again.'));
    };

    if (error) return <p className="error-msg">{error}</p>;
    if (!data) return <p className="loading-msg">Loading...</p>;

    return (
        <div className="student-shell">

            <aside className="sidebar">
                <div className="logo">
                    <div className="logo-title">AITS</div>
                    <div className="logo-sub">Makerere University</div>
                </div>
                <nav>
                    <div className="nav-item active">Dashboard</div>
                    <div className="nav-item">My Issues</div>
                    <div className="nav-item">Submit Issue</div>
                    <div className="nav-item">Notifications</div>
                </nav>
                <div style={{ flex: 1 }}></div>
                <div className="nav-item logout" onClick={handleLogout}>Logout</div>
            </aside>

            <main className="main-content">

                <div className="topbar">
                    <h2 className="page-title">Student Dashboard</h2>
                    <div className="user-pill">
                        <div className="avatar">{data.username.slice(0, 2).toUpperCase()}</div>
                        <span className="user-name">{data.username}</span>
                    </div>
                </div>

                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-label">Total issues</div>
                        <div className="stat-value blue">{data.stats.total}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Open</div>
                        <div className="stat-value blue">{data.stats.open}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">In progress</div>
                        <div className="stat-value amber">{data.stats.in_progress}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Resolved</div>
                        <div className="stat-value green">{data.stats.resolved}</div>
                    </div>
                </div>

                <div className="panel">
                    <h3 className="section-title">My issues</h3>
                    {data.issues.length === 0 ? (
                        <p className="empty-msg">No issues submitted yet.</p>
                    ) : (
                        <table className="issue-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Course</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.issues.map(issue => (
                                    <tr key={issue.id}>
                                        <td>{issue.id}</td>
                                        <td>{issue.course_code}</td>
                                        <td>
                                            <span className={`badge badge-${issue.category}`}>
                                                {issue.category.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${issue.status}`}>
                                                {issue.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="panel">
                    <h3 className="section-title">Submit a new issue</h3>
                    {submitSuccess && <div className="toast-success">Issue submitted successfully!</div>}
                    {submitError && <div className="toast-error">{submitError}</div>}
                    <div className="form-row">
                        <div className="form-field">
                            <label className="field-label">Course code</label>
                            <input
                                className="field-input"
                                type="text"
                                placeholder="e.g. CSC 1202"
                                value={form.course_code}
                                onChange={e => setForm({ ...form, course_code: e.target.value })}
                            />
                        </div>
                        <div className="form-field">
                            <label className="field-label">Issue type</label>
                            <select
                                className="field-input"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="missing_marks">Missing marks</option>
                                <option value="appeal">Appeal</option>
                                <option value="correction">Correction</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-field">
                        <label className="field-label">Description</label>
                        <textarea
                            className="field-textarea"
                            placeholder="Describe your issue here..."
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                    </div>
                    <button className="submit-btn" onClick={handleSubmit}>
                        Submit issue
                    </button>
                </div>

            </main>
        </div>
    );
};

export default StudentView;