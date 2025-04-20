// src/components/auth/AuthGuard.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component - Protects routes that require authentication
 * Redirects to login if not authenticated, preserving the intended destination
 */
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const {
    state: { isAuthenticated, isLoading },
  } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="auth-loading-container">
        <div className="auth-loading">
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save current location for redirect after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default AuthGuard;
