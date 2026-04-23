const AdminDashboard = () => (
  <div style={{ padding: '20px' }}>
    <h1>Admin Dashboard</h1>
    <p>System Overview: Manage placements and review evaluations.</p>
    <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}>Logout</button>
  </div>
);
export default AdminDashboard;