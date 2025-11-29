import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

/**
 * ProtectedRoute component - Redirects unauthenticated users to login
 * If user is not authenticated or session expired, redirect to login page
 */
function ProtectedRoute({ children }) {
  const { userData, loading } = useUser();
  const token = localStorage.getItem('token');

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8D2B7E] mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If no token or no user data, redirect to login
  if (!token || !userData) {
    return <Navigate to="/auth/login" replace />;
  }

  // User is authenticated, render the protected component
  return children;
}

export default ProtectedRoute;

