import { useEffect, useState } from 'react';
import api from '../api';

const AdminDashboard = () => {
    const [students, setStudents] = useState([]);
    const [placements, setPlacements] = useState([]);
    const [formData, setFormData] = useState({
        student: '',
        organization_name: '',
        supervisor_name: '',
        start_date: '',
        end_date: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const studentRes = await api.get('/api/token/refresh/'); 
            const placementRes = await api.get('/api/placements/');
            setPlacements(placementRes.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/api/placements/', formData);
            setFormData({ student: '', organization_name: '', supervisor_name: '', start_date: '', end_date: '' });
            fetchData();
            alert("Placement assigned successfully!");
        } catch (err) {
            const errorMsg = err.response?.data?.non_field_errors || err.response?.data?.detail || "Validation failed";
            setError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>

            <section style={{ marginTop: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <h2>Assign New Internship</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px' }}>
                    <input type="number" placeholder="Student ID" value={formData.student} onChange={(e) => setFormData({...formData, student: e.target.value})} required />
                    <input type="text" placeholder="Organization Name" value={formData.organization_name} onChange={(e) => setFormData({...formData, organization_name: e.target.value})} required />
                    <input type="text" placeholder="Supervisor Name" value={formData.supervisor_name} onChange={(e) => setFormData({...formData, supervisor_name: e.target.value})} required />
                    <label>Start Date:</label>
                    <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} required />
                    <label>End Date:</label>
                    <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} required />
                    <button type="submit" style={{ background: 'blue', color: 'white', padding: '10px' }}>Assign Placement</button>
                </form>
            </section>

            <section style={{ marginTop: '40px' }}>
                <h2>Active Placements</h2>
                <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Organization</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        {placements.map(p => (
                            <tr key={p.id}>
                                <td>{p.student_username} (ID: {p.student})</td>
                                <td>{p.organization_name}</td>
                                <td>{p.start_date} to {p.end_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default AdminDashboard;