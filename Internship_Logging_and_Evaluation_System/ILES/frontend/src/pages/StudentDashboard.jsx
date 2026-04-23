const StudentDashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1>Student Dashboard</h1>
    <p>Welcome, {localStorage.getItem('username')}! Here you can log your weekly activities.</p>
    <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}>Logout</button>
  </div>
);
export default StudentDashboard;