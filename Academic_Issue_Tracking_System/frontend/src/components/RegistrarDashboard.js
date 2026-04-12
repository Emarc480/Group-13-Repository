import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RegistrarDashboard = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    // Step A: Fetch all issues when the page loads
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://127.0.0.1:8000/api/registrar/all-issues/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIssues(response.data);
            } catch (error) {
                console.error("Error fetching issues:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);

    // Step B: Function to update an issue status
    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/api/registrar/update-issue/${id}/`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Update local state instantly
            setIssues(issues.map(issue => 
                issue.id === id ? { ...issue, status: newStatus } : issue
            ));
            alert(`Issue #${id} updated to ${newStatus}`);
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update issue. Please check your permissions.");
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading Academic Issues...</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ color: '#2c3e50' }}>Academic Registrar - Management Portal</h2>
            <hr />
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#34495e', color: 'white', textAlign: 'left' }}>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Student</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Category</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Description</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: '12px', border: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {issues.length > 0 ? (
                        issues.map(issue => (
                            <tr key={issue.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{issue.id}</td>
                                <td style={{ padding: '10px' }}>{issue.student_name || `User ID: ${issue.student}`}</td>
                                <td style={{ padding: '10px' }}>{issue.category}</td>
                                <td style={{ padding: '10px' }}>{issue.description}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ 
                                        fontWeight: 'bold', 
                                        color: issue.status === 'Resolved' ? '#27ae60' : '#f39c12',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: issue.status === 'Resolved' ? '#eafaf1' : '#fef5e7'
                                    }}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    <button 
                                        onClick={() => handleStatusChange(issue.id, 'In Progress')}
                                        style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}
                                    >
                                        Work on It
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(issue.id, 'Resolved')} 
                                        style={{ marginLeft: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '3px' }}
                                    >
                                        Resolve
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No academic issues found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default RegistrarDashboard;