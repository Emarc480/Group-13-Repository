import { useEffect, useState } from 'react';
import api from '../api';

const StudentDashboard = () => {
    const [placement, setPlacement] = useState(null);
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({ week_number: '', content: '' });
    const [message, setMessage] = useState('');
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const pRes = await api.get('/api/placements/');
            if (pRes.data.length > 0) {
                setPlacement(pRes.data[0]);
                const lRes = await api.get(`/api/logs/?placement=${pRes.data[0].id}`);
                setLogs(lRes.data);
            }
        } catch (err) { console.error(err); }
    };

    const handleAction = async (status) => {
        setMessage('');
        try {
            await api.post('/api/logs/', {
                placement: placement.id,
                week_number: formData.week_number,
                content: formData.content,
                status: status
            });
            setMessage(`Log ${status.toLowerCase()} successfully!`);
            setFormData({ week_number: '', content: '' });
            fetchData();
        } catch (err) {
            setMessage(err.response?.data?.non_field_errors?.[0] || "Validation error.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Student Dashboard</h1>
            <p>Welcome, {username}</p>

            <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                <h3>Weekly Logbook</h3>
                <input type="number" placeholder="Week #" value={formData.week_number} onChange={(e) => setFormData({...formData, week_number: e.target.value})} />
                <textarea placeholder="Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} style={{ display: 'block', width: '100%', margin: '10px 0' }} />
                
                <button onClick={() => handleAction('DRAFT')} style={{ marginRight: '10px' }}>Save Draft</button>
                <button onClick={() => handleAction('SUBMITTED')} style={{ backgroundColor: 'green', color: 'white' }}>Submit Log</button>
                {message && <p>{message}</p>}
            </section>

            <h3>History</h3>
            <ul>
                {logs.map(log => (
                    <li key={log.id}>Week {log.week_number}: {log.status}</li>
                ))}
            </ul>
            <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}>Logout</button>
        </div>
    );
};

export default StudentDashboard;