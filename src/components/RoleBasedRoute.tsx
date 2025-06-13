import React, {useEffect} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../data/enum/UserRole';
import { UserDto } from '../data/models/UserDto';

type User = UserDto;

interface RoleBasedRouteProps {
    children: React.ReactNode | ((props: { user: User }) => React.ReactNode);
    allowedRoles: UserRole[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        console.log('RoleBasedRoute mounted', user);
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If authenticated but role not allowed, redirect to appropriate page
    if (!user.roles || user.roles.length === 0) {
        return <Navigate to="/" replace />;
    }

    const userRoles = user.roles.map(role => role.replace('ROLE_', ''));
    const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasAllowedRole) {
        // Redirect clients to job details page if they try to access freelancer pages
        if (userRoles.includes(UserRole.CLIENT)) {
            return <Navigate to="/jobs" replace />;
        }
        // Add more role-specific redirects here as needed
        return <Navigate to="/" replace />;
    }

    // Handle children as a function
    if (typeof children === 'function') {
        return <>{children({ user })}</>;
    }

    return <>{children}</>;
};

export default RoleBasedRoute;