// src/pages/JoinRoom/JoinRoom.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { joinRoom, getRoomStatus } from "../../services/roomService";
import "./JoinRoom.css";

const JoinRoom: React.FC = () => {
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
      // Step 1: Join the room
      console.log(
        `Attempting to join room ${roomId} with password ${password}`
      );
      const joinResponse = await joinRoom(roomId.trim(), password.trim());
      console.log("Join room response:", joinResponse);

      if (joinResponse.success) {
        try {
          // Step 2: Get room status to pass as state
          console.log(`Getting room status for ${roomId}`);
          const statusResponse = await getRoomStatus(roomId.trim());

          if (statusResponse.success && statusResponse.status) {
            // Step 3: Navigate with full room data
            console.log(
              `Successfully joined room ${roomId}, navigating with state`
            );

            navigate(`/room/${roomId}`, {
              state: {
                roomId: roomId,
                guidingQuestion: statusResponse.status.guidingQuestion,
                createdAt: statusResponse.status.created,
                justJoined: true,
              },
            });
          } else {
            // Fall back to basic navigation if status fetch fails
            console.log(
              `Room status fetch failed, navigating with minimal state`
            );
            navigate(`/room/${roomId}`, {
              state: {
                roomId: roomId,
                justJoined: true,
              },
            });
          }
        } catch (statusErr) {
          // If status fetch fails, still navigate but with minimal info
          console.error("Error fetching room status:", statusErr);
          navigate(`/room/${roomId}`, {
            state: {
              roomId: roomId,
              justJoined: true,
            },
          });
        }
      } else {
        setError(
          joinResponse.message || "Failed to join room. Please try again."
        );
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
        console.log(`User is already in room ${roomId}, navigating`);
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

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <div className="join-room-container">
      <div className="join-room-card">
        <h2>Join Room</h2>
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

          <div className="form-actions">
            <button
              type="button"
              onClick={handleGoBack}
              disabled={isLoading}
              className="secondary-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="primary-button"
            >
              {isLoading ? "Joining..." : "Join Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
