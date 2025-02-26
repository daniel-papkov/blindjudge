// src/pages/Auth/Login.tsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth";
import { ApiError } from "../../types/errors";
// Import CSS if available
// import "./Auth.css";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic validation
      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      const response = await authService.login({ email, password });

      if (response.success) {
        // Use the redirect path from the location state (if available) or from localStorage
        // This handles both:
        // 1. Direct navigation to a protected route (location state from AuthGuard)
        // 2. Token expiration redirects (stored in localStorage)
        const redirectPath =
          state?.from?.pathname || authService.getRedirectPath();
        navigate(redirectPath);
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          apiError.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>

        {error && <div className="auth-error">{error}</div>}

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
            <a
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
