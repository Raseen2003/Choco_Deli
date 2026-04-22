import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-chocolate-50">
        <Loader2 className="w-12 h-12 text-chocolate-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Logged in but not an admin
    return <Navigate to="/shop" replace />;
  }

  // Authorized
  return <Outlet />;
};

export default ProtectedRoute;
