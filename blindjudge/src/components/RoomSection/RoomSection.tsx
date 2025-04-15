// src/pages/Home/components/RoomSection.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom } from "../../services/roomService";
import "./RoomSection.css";

const RoomSection: React.FC = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId.trim()) {
      setError("Room ID is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await joinRoom(roomId.trim(), password.trim());

      if (response.success) {
        // Use /room/ (singular) to match CreateSession component
        navigate(`/room/${roomId}`, {
          state: {
            roomId: roomId,
            justJoined: true,
          },
        });
      } else {
        setError(response.message || "Failed to join room. Please try again.");
      }
    } catch (err) {
      console.error("Join room error:", err);

      // Type-safe error handling
      let errorMessage = "An error occurred while joining the room.";
      let statusCode: number | undefined;

      if (typeof err === "object" && err !== null) {
        if ("message" in err) {
          errorMessage = String((err as { message: unknown }).message);
        }
        if ("status" in err) {
          statusCode = Number((err as { status: unknown }).status);
        }
      }

      if (statusCode === 404) {
        setError("Room not found. Please check the room ID and try again.");
      } else if (statusCode === 401) {
        setError("Incorrect password. Please try again.");
      } else if (statusCode === 403 && errorMessage.includes("full")) {
        setError(
          "This room is full. Please try another room or create your own."
        );
      } else if (
        statusCode === 400 &&
        errorMessage.includes("already in this room")
      ) {
        // If the user is already in the room, redirect them
        navigate(`/room/${roomId}`, {
          state: {
            roomId: roomId,
            justJoined: true,
          },
        });
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoom = () => {
    navigate("/create-room");
  };

  return (
    <div className="room-section">
      <div className="room-cards">
        <div className="room-card join-room">
          <h2>Join a Discussion</h2>
          <p>Enter an existing room ID and password to join a discussion.</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleJoinRoom}>
            <div className="form-group">
              <label htmlFor="roomId">Room ID</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={handleRoomIdChange}
                placeholder="Enter room ID"
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
                onChange={handlePasswordChange}
                placeholder="Enter room password"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="primary-button"
            >
              {isLoading ? "Joining..." : "Join Room"}
            </button>
          </form>
        </div>

        <div className="room-card create-room">
          <h2>Create a Discussion</h2>
          <p>Start a new discussion room and invite others to join.</p>
          <p>
            Create your own guiding question and engage in meaningful dialogue.
          </p>

          <button onClick={handleCreateRoom} className="secondary-button">
            Create New Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomSection;
