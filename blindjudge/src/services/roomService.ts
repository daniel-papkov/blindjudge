// src/services/roomService.ts
import axios from "axios";
import { ApiError } from "../types/errors";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface JoinRoomResponse {
  success: boolean;
  message: string;
}

/**
 * Join a room using the roomId and password
 * @param roomId - The ID of the room to join
 * @param password - The password for the room
 * @returns Promise with the join room response
 */
export const joinRoom = async (
  roomId: string,
  password: string
): Promise<JoinRoomResponse> => {
  try {
    console.log(`Attempting to join room with ID: ${roomId}`);
    console.log(`API URL being used: ${API_URL}/rooms/${roomId}/join`);

    const token = localStorage.getItem("token");
    console.log(`Auth token available: ${!!token}`);

    const response = await axios.post<JoinRoomResponse>(
      `${API_URL}/rooms/${roomId}/join`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Join room response:", response.data);
    return response.data;
  } catch (error) {
    const apiError = error as ApiError;
    console.error("Join room error:", apiError);
    console.error("Error response:", apiError.response?.data);
    console.error("Error status:", apiError.response?.status);

    throw {
      message: apiError.response?.data?.message || "Failed to join room",
      status: apiError.response?.status,
    };
  }
};

/**
 * Check if a room exists by trying to fetch its status
 * @param roomId - The ID of the room to check
 * @returns Promise with boolean indicating if room exists
 */
export const checkRoomExists = async (roomId: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/rooms/${roomId}/status`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data.success === true;
  } catch (error) {
    const apiError = error as ApiError;
    // If it's a 403 error, the user is not in the room (which means it does exist)
    return apiError.response?.status === 403;
  }
};

/**
 * Get room status
 * @param roomId - The ID of the room
 * @returns Promise with the room status response
 */
export const getRoomStatus = async (
  roomId: string
): Promise<{
  success: boolean;
  status?: {
    id: string;
    guidingQuestion: string;
    created: Date;
    participantCount: number;
    conclusionCount: number;
    roomStatus: "active" | "comparing" | "completed";
    hasSubmitted: boolean;
    participants: {
      username: string;
      hasSubmitted: boolean;
    }[];
    comparisonChatId?: string;
    finalVerdict?: string;
  };
  message?: string;
}> => {
  try {
    const response = await axios.get(`${API_URL}/rooms/${roomId}/status`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return response.data;
  } catch (error) {
    const apiError = error as ApiError;

    throw {
      message: apiError.response?.data?.message || "Failed to get room status",
      status: apiError.response?.status,
    };
  }
};

/**
 * Alternative implementation using fetch API for testing
 */
export const joinRoomWithFetch = async (
  roomId: string,
  password: string
): Promise<JoinRoomResponse> => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/rooms/${roomId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    console.log("Join room response (fetch):", data);

    if (!response.ok) {
      throw {
        message: data.message || "Failed to join room",
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error("Join room error (fetch):", error);
    // Rethrow as a properly typed error
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
