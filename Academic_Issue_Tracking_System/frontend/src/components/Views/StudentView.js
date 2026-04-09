import React,{ useEffect, useState} from 'react';

const StudentView = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('/api/student/dashboard/', {
            headers: {'Authorization':`Bearer ${token}` }
        })
        .then(res => res.json())
        .then(json => setData(json))
        .catch(()=> setError('Failed to load Dashboard'));
    },[]);

    if(error) return <p>{error}</p>;
    if(!data) return <p>Loading...</p>
    
    return (
        <div>
            <h2>Welcome, {data.username}</h2>

            <div classname = "stats">
                <div>Total: {data.stats.total}</div>
                <div>Open: {data.stats.open}</div>
                <div>In Progress: {data.stats.in_progress}</div>
                <div>Resolved: {data.stats.resolved}</div>
            </div>

            <h3>My Issues</h3>
            {data.issues.length === 0 ?(
                <p>No issues submitted yet.</p>
            ):(
                <table>
                    <thread>
                        <tr>
                            <th>Course</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thread>
                    <tbody>
                        {data.issues.map(issue =>(
                            <tr key={issue.id}>
                                <td>{issue.course_code}</td>
                                <td>{issue.category}</td>
                                <td>{issue.status}</td>
                                <td>{new Date(issue.created_at).toLocaleDateString()}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentView;