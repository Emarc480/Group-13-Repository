import React, {} from "react";

const HodView = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const response = await fetch('/api/hod/issues/', {
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
            <h2>HOD View</h2>
            <p>Welcome, HOD! Here you can manage departmental information and view reports.</p>
        </div>
    );
};

export default HodView;