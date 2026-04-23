import { useEffect, useState } from 'react';
import api from '../api';

const StudentDashboard = () => {
    const [placement, setPlacement] = useState(null);
    const [logs, setLogs] = useState([]);
    const [weekNumber, setWeekNumber] = useState('');
    const [content, setContent] = useState('');
    const [message, setMessage] = useState('');

    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const placementRes = await api.get('/api/placements/');
            if (placementRes.data.length > 0) {
                setPlacement(placementRes.data[0]);
                // Fetch existing logs for this placement
                const logsRes = await api.get(`/api/logs/?placement=${placementRes.data[0].id}`);
                setLogs(logsRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSubmitLog = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/logs/', {
                placement: placement.id,
                week_number: weekNumber,
                content: content
            });
            setMessage("Log submitted successfully!");
            setWeekNumber('');
            setContent('');
            fetchData(); // Refresh the list
        } catch (error) {
            setMessage("Error submitting log. Check if week number already exists.");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Student Dashboard</h1>
            <p>Welcome, <strong>{username}</strong></p>

            {placement && (
                <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3>Current Placement: {placement.organization_name}</h3>
                </div>
            )}

            <section style={{ marginBottom: '40px', border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                <h3>Submit Weekly Log</h3>
                <form onSubmit={handleSubmitLog}>
                    <input 
                        type="number" 
                        placeholder="Week Number" 
                        value={weekNumber} 
                        onChange={(e) => setWeekNumber(e.target.value)}
                        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
                        required 
                    />
                    <textarea 
                        placeholder="What did you do this week?" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px', height: '100px' }}
                        required 
                    />
                    <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                        Submit Log
                    </button>
                </form>
                {message && <p>{message}</p>}
            </section>

            <section>
                <h3>Your Previous Logs</h3>
                <ul>
                    {logs.map(log => (
                        <li key={log.id} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                            <strong>Week {log.week_number}:</strong> {log.content} 
                            <span style={{ marginLeft: '10px', color: log.is_verified ? 'green' : 'orange' }}>
                                ({log.status})
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default StudentDashboard;