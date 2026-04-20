import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, userRole }) => {
    const token = localStorage.getItem('token');

    // 1. Check if logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check if role is authorized (if roles are provided)
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. If all good, render the child component
    return <Outlet />;
};

export default ProtectedRoute;