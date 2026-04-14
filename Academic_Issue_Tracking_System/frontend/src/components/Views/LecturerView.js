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

        const updateStatus = async (issue_id) => {
            try {
                const response = await fetch(`/api/lecturer/issues/${issue_id}/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: 'resolved' })
                });
                const data = await response.json();
                console.log('Status updated:', data);
                fetchIssues();

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
                <div key={issue.issue_id}>
                    <div>
                        <h3>{issue.student}</h3>
                        <p>{issue.course_code}</p>
                        <p>{issue.category}</p>
                        <p>{issue.status}</p>
                        <p><strong>Description:</strong> {issue.description}</p>
                    </div>
                    <button onClick={() => updateStatus(issue.issue_id)}>Update Status</button>
                </div>
            ))}
        </div>
    );
};

export default LecturerView;