import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InternshipPlacementForm = () => {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.company_name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            await axios.post(`${API_URL}placements/`, formData, authHeaders());
            alert("Placement successful!");

            setFormData({
                student: '',
                student_no: '',
                company_name: '',
                start_date: '',
                end_date: '',
                workplace_supervisor: '',
            })
        } catch (err) {
            setError(err.response?.data);
        } finally {
            setSubmitting(false);
        }
    };

    const userLabel = (user) => {
        const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
        return fullName ? `${user.username} (${fullName})` : user.username;
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <h2>Create New Placement</h2>
            {error && <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>}

            <label>Student</label>
            <select
                name="student"
                value={formData.student}
                onChange={handleChange}
                required
                disabled={loadingUsers}
            >
                <option value="">Select a student</option>
                {students.map((student) => (
                    <option key={student.id} value={student.id}>
                        {userLabel(student)}
                    </option>
                ))}
            </select>

            <label>Student Number</label>
            <input
                type="text"
                placeholder="Student Number"
                value={formData.student_no}
                onChange={handleChange}
                required
            />

            <label>Company Name</label>
            <input type="text" placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                required
            />

            <label>Start Date</label>
            <input
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
            />

            <label>End Date</label>
            <input
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
            />

            <label>Workplace Supervisor</label>
            <select
                name="workplace_supervisor"
                value={formData.workplace_supervisor}
                onChange={handleChange}
                disabled={loadingUsers}
            >
                <option value="">-- None --</option>
                {supervisors.map((s) => (
                    <option key={s.id} value={s.id}>
                        {userLabel(s)}
                    </option>
                ))}
            </select>

            <button type="submit" disabled={submitting}>
                {submitting ? "Assigning..." : "Assign Internship"}
            </button>
        </form>
    );
};

export default InternshipPlacementForm;