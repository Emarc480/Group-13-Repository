import React, { useEffect, useState } from "react";

const LecturerView = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch('/api/lecturer/issues/', {
                    method: 'GET',
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
            <h2>Lecturer View</h2>
            <p>Welcome, lecturer! Here you can manage your courses and view student submissions.</p>
        </div>
    );
};

export default LecturerView;