// src/pages/CreateSession/CreateSession.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../services/roomService";
import { useAuth } from "../../hooks/useAuth";
import "./CreateSession.css";

const CreateSession: React.FC = () => {
  const [guidingQuestion, setGuidingQuestion] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Get authentication state
  const {
    state: { isAuthenticated, user },
  } = useAuth();

  // Ensure user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidingQuestion.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Use the createRoom function from our refactored roomService
      const response = await createRoom(guidingQuestion, password);

      console.log("Room creation response:", response); // Debug log

      if (response.success && response.roomId) {
        console.log("Navigating to room:", response.roomId); // Debug log

        navigate(`/room/${response.roomId}`, {
          state: {
            roomId: response.roomId,
            guidingQuestion: guidingQuestion,
            createdAt: new Date().toISOString(),
            isCreator: true,
            role: "creator", // Keep this for backward compatibility
            username: user?.username || user?.email,
          },
        });
      } else {
        setError(response.message || "Failed to create room");
        setLoading(false);
      }
    } catch (err) {
      console.error("Room creation error:", err);

      if (err instanceof Error) {
        setError(err.message || "Failed to create room");
      } else {
        setError("Failed to create room");
      }

      setLoading(false);
    }
  };

  return (
    <div className="create-session-container">
      <h2>Create New Comparison Session</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="question">Guiding Question:</label>
          <textarea
            id="question"
            value={guidingQuestion}
            onChange={(e) => setGuidingQuestion(e.target.value)}
            placeholder="Enter the question or criteria for comparison..."
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Room Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter room password"
            required
            disabled={loading}
          />
          <small className="password-hint">
            This password will be needed by others to join the room
          </small>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={
            loading ||
            !guidingQuestion.trim() ||
            !password.trim() ||
            !isAuthenticated
          }
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
        {!isAuthenticated && (
          <p className="login-required-message">
            You need to log in to create a session
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateSession;
