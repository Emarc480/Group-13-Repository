import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMe } from './authService';

function ProtectedRoute() {
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const userData = await getMe();
                setUserRole(userData.role);
            } catch (error) {
                console.error("Error fetching user role:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserRole();
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }
    if (!userRole) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;