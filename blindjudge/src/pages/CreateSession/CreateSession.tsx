// src/pages/CreateSession/CreateSession.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateSession.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface RoomResponse {
  success: boolean;
  roomId: string;
  message: string;
}

const CreateSession: React.FC = () => {
  const [guidingQuestion, setGuidingQuestion] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidingQuestion.trim() || !password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post<RoomResponse>(
        `${API_BASE_URL}/rooms`,
        {
          guidingQuestion,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Room creation response:", response.data); // Debug log

      if (response.data.success && response.data.roomId) {
        console.log("Navigating to room:", response.data.roomId); // Debug log

        navigate(`/room/${response.data.roomId}`, {
          state: {
            roomId: response.data.roomId,
            question: guidingQuestion,
            createdAt: new Date().toISOString(),
            isCreator: true,
            role: "creator", // Keep this for backward compatibility
          },
        });
      } else {
        setError(response.data.message || "Failed to create room");
        setLoading(false);
      }
    } catch (err) {
      console.error("Room creation error:", err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
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
          disabled={loading || !guidingQuestion.trim() || !password.trim()}
        >
          {loading ? "Creating..." : "Create Session"}
        </button>
      </form>
    </div>
  );
};

export default CreateSession;
