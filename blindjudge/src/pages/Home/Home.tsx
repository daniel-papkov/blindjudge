import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <h1>Welcome to BlindJudge</h1>
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
