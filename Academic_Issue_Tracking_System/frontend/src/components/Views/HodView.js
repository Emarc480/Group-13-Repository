import React, {} from "react";

const HodView = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch('/api/hod/issues/', {
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
            <h2>Departmental Issues</h2>
            
            {issues.map(issue => (
                <div key={issue.id}>
                    <p>{issue.course}</p>
                    <p>{issue.status}</p>
                </div>
            ))}
        </div>
    );
};

export default HodView;