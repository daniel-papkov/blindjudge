// src/pages/Auth/Signup.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.css";

const Signup: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { signup, state: authState } = useAuth();
  const { isAuthenticated, isLoading, error: authError } = authState;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return;
    }

    if (!username.trim()) {
      setFormError("Username is required");
      return;
    }

    try {
      // Use the signup function from the auth context
      await signup({ username, email, password });
      // The useEffect will handle redirect after successful signup
    } catch (err) {
      console.error("Signup failed:", err);
      // Most errors will be handled by the auth context,
      // but we can add custom handling here if needed
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create an Account</h2>

        {/* Show either form error or auth error */}
        {(formError || authError) && (
          <div className="auth-error">{formError || authError}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Choose a username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Create a password"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
