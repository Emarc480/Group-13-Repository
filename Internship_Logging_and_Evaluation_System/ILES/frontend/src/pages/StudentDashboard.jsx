import { useEffect, useState } from 'react';
import api from '../api';

const StudentDashboard = () => {
    const [placement, setPlacement] = useState(null);
    const username = localStorage.getItem('username');

    useEffect(() => {
        // Fetch the placement linked to this student
        api.get('/api/placements/')
            .then(response => {
                if (response.data.length > 0) {
                    setPlacement(response.data[0]);
                }
            })
            .catch(error => console.error("Error fetching placement:", error));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
            <h1>Student Dashboard</h1>
            <p>Welcome back, <strong>{username}</strong>!</p>
            
            {placement ? (
                <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
                    <h3>Current Placement</h3>
                    <p><strong>Organization:</strong> {placement.organization_name}</p>
                    <p><strong>Supervisor:</strong> {placement.supervisor_name}</p>
                </div>
            ) : (
                <p>Loading placement details...</p>
            )}

            <button 
                onClick={handleLogout}
                style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
                Logout
            </button>
        </div>
    );
};

export default StudentDashboard;