// src/pages/Auth/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.css";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Use the auth context instead of direct service calls
  const { login, state: authState } = useAuth();
  const { isAuthenticated, isLoading, error: authError } = authState;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const redirectPath = state?.from?.pathname || "/";
      navigate(redirectPath);
    }
  }, [isAuthenticated, isLoading, navigate, state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Basic validation
    if (!email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!password.trim()) {
      setFormError("Password is required");
      return;
    }

    try {
      // Use the login function from the auth context
      await login({ email, password });
      // The useEffect will handle redirect after successful login
    } catch (err) {
      // Error is handled by the auth context, but we can add custom handling here
      console.error("Login failed:", err);
    }
  };

  // Show loading state
  if (isLoading) {
    return <div className="auth-loading">Loading...</div>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        {/* Show either form error or auth error */}
        {(formError || authError) && (
          <div className="auth-error">{formError || authError}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
