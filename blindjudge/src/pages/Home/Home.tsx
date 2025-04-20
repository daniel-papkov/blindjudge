// src/pages/Home/Home.tsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    state: { isAuthenticated, user, isLoading },
  } = useAuth();

  // Ensure the user is authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-container">
      <h1>Welcome to BlindJudge{user && `, ${user.username || user.email}`}</h1>
      <div className="options-container">
        <div className="option-card">
          <h2>Create New Comparison</h2>
          <p>Start a new session to compare responses or progress</p>
          <Link to="/create" className="action-button">
            Create New
          </Link>
        </div>
        <div className="option-card">
          <h2>Join Session</h2>
          <p>Join an existing comparison session</p>
          <Link to="/join" className="action-button">
            Join
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
