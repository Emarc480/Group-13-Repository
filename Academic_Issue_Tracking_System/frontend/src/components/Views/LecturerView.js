import React, { useEffect, useState } from "react";

const LecturerView = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch('/api/lecturer/issues/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                setIssues(data);
            } catch (error) {
                console.error('Error fetching issues:', error);
            }
        };


        fetchIssues();
    }, []);

    return (
        <div>
            <h1>Lecturer Dashboard</h1>
            <h2>Assigned Issues</h2>

            {issues.map(issue => (
                <div key={issue.id}>
                    <h3>{issue.student}</h3>
                    <p>{issue.course}</p>
                    <p>{issue.category}</p>
                    <p>{issue.status}</p>
                    <p><strong>Description:</strong> {issue.description}</p>
                </div>
            ))}
            <button onClick={() => updateStatus(issue.id)}>Update Status</button>
        </div>
    );
};

export default LecturerView;