// src/pages/JoinRoom/JoinRoom.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatService } from "../../services/api";
import { ApiError } from "../../types/errors";
// Import CSS if available
// import './JoinRoom.css';

const JoinRoom: React.FC = () => {
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const checkRoom = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      // First, check if the room exists and if it requires a password
      const response = await chatService.checkRoom(roomCode);

      if (!response.exists) {
        setError("Room not found. Please check the code and try again.");
        setIsJoining(false);
        return;
      }

      if (response.requiresPassword) {
        setNeedsPassword(true);
        setIsJoining(false);
      } else {
        // If no password needed, join directly
        await joinRoom();
      }
    } catch (err) {
      console.error("Error checking room:", err);
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
          apiError.message ||
          "An error occurred while checking the room. Please try again."
      );
      setIsJoining(false);
    }
  };

  const joinRoom = async () => {
    if (!roomCode.trim()) {
      setError("Please enter a room code");
      return;
    }

    if (needsPassword && !password.trim()) {
      setError("Please enter the room password");
      return;
    }

    setIsJoining(true);
    setError(null);

    try {
      const response = await chatService.joinRoom(
        roomCode,
        needsPassword ? password : undefined
      );

      if (response.success) {
        // Navigate to the room
        navigate(`/room/${response.roomId}`);
      } else {
        setError(response.message || "Failed to join room. Please try again.");
      }
    } catch (err) {
      console.error("Error joining room:", err);
      const apiError = err as ApiError;

      if (apiError.response?.status === 403) {
        setError("Incorrect password. Please try again.");
      } else if (apiError.response?.status === 404) {
        setError("Room not found. Please check the code and try again.");
      } else {
        setError(
          apiError.response?.data?.message ||
            apiError.message ||
            "An error occurred while joining the room. Please try again."
        );
      }
    } finally {
      setIsJoining(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (needsPassword) {
      await joinRoom();
    } else {
      await checkRoom();
    }
  };

  return (
    <div className="join-room-container">
      <div className="join-room-card">
        <h1>Join a Room</h1>
        <p className="join-room-description">
          Enter a room code to join an existing discussion.
        </p>

        <form onSubmit={handleSubmit} className="join-room-form">
          <div className="form-group">
            <label htmlFor="roomCode">Room Code</label>
            <input
              type="text"
              id="roomCode"
              value={roomCode}
              onChange={handleRoomCodeChange}
              placeholder="Enter room code"
              disabled={isJoining || needsPassword}
              autoFocus
            />
          </div>

          {needsPassword && (
            <div className="form-group">
              <label htmlFor="password">Room Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter room password"
                disabled={isJoining}
                autoFocus
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="join-button" disabled={isJoining}>
            {isJoining
              ? "Joining..."
              : needsPassword
              ? "Join Room"
              : "Continue"}
          </button>
        </form>

        <div className="back-link">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
