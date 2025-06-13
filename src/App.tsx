import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobListingPage from './pages/JobListingPage';
import JobDetailPage from './pages/JobDetailPage';
import FreelancerDashboard from './pages/FreelancerDashboard';
import RoleBasedRoute from './components/RoleBasedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { UserRole } from './data/enum/UserRole';

// Define allowed roles for each protected route
const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
  jobs: [UserRole.FREELANCER, UserRole.CLIENT, UserRole.ADMIN],
  jobDetails: [UserRole.FREELANCER, UserRole.CLIENT, UserRole.ADMIN],
  dashboard: [UserRole.FREELANCER, UserRole.ADMIN]
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.dashboard}>
                <FreelancerDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.jobs}>
                <JobListingPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <RoleBasedRoute allowedRoles={ROLE_PERMISSIONS.jobDetails}>
                <JobDetailPage />
              </RoleBasedRoute>
            }
          />

          {/* Root route with role-based redirection */}
          <Route
            path="/"
            element={
              <RoleBasedRoute allowedRoles={[UserRole.FREELANCER, UserRole.CLIENT, UserRole.ADMIN]}>
                {({ user }) => (
                  user.roles?.some(role => role.replace('ROLE_', '') === UserRole.FREELANCER) ? (
                    <Navigate to="/dashboard" replace />
                  ) : (
                    <Navigate to="/jobs" replace />
                  )
                )}
              </RoleBasedRoute>
            }
          />

          {/* Catch all redirect */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;