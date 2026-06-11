import React, {useState, useEffect} from 'react';
import axios from 'axios';

const InternshipPlacementForm = () => {
    const [formData, setFormData] = useState ({
        student: '',
        student_no: '',
        company_name:  '',
        start_date: '',
        end_date: '',
        workplace_supervisor: '',
    });

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await axios.post('/api/placements/', formData);
            alert("Placement successful!");
        } catch (err) {
        
            setError(err.response?.data);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <h2>Create New Placement</h2>
            {error && <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>}
            
            <input type="text" placeholder="Student ID (User Primary Key)" 
                onChange={(e) => setFormData({...formData, student: e.target.value})} required />
            
            <input type="text" placeholder="Student Number" 
                onChange={(e) => setFormData({...formData, student_no: e.target.value})} required />
            
            <input type="text" placeholder="Company Name" 
                onChange={(e) => setFormData({...formData, company_name: e.target.value})} required />
            
            <label>Start Date</label>
            <input type="date" onChange={(e) => setFormData({...formData, start_date: e.target.value})} required />
            
            <label>End Date</label>
            <input type="date" onChange={(e) => setFormData({...formData, end_date: e.target.value})} required />
            
            <input type="text" placeholder="Supervisor ID" 
                onChange={(e) => setFormData({...formData, workplace_supervisor: e.target.value})} />

            <button type="submit">Assign Internship</button>
        </form>
    );
};

export default InternshipPlacementForm;