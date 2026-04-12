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

        const updateStatus = async (issueId) => {
            try {
                const response = await fetch(`/api/lecturer/issues/${issueId}/update_status/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'In Progress' })
                });
                const data = await response.json();
                setIssues(data);
            } catch (error) {
                console.error('Error updating issue status:', error);
            }
        };


        fetchIssues();
    }, []);

    console.log('Issues:', issues);

    return (
        <div>
            <h1>Lecturer Dashboard</h1>
            <h2>Assigned Issues</h2>

            {issues.map(issue => (
                <div key={issue.id}>
                    <div>
                        <h3>{issue.student}</h3>
                        <p>{issue.course_code}</p>
                        <p>{issue.category}</p>
                        <p>{issue.status}</p>
                        <p><strong>Description:</strong> {issue.description}</p>
                    </div>
                    <button onClick={() => updateStatus(issue.id)}>Update Status</button>
                </div>
            ))}
        </div>
    );
};

export default LecturerView;