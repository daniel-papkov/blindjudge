// src/services/roomService.ts
import api from "./api";
import { RoomStatusResponse } from "../types";

interface JoinRoomResponse {
  success: boolean;
  message: string;
}

interface CreateRoomResponse {
  success: boolean;
  roomId: string;
  message: string;
}

interface RoomExistsResponse {
  success: boolean;
  exists: boolean;
}

interface ErrorWithStatus extends Error {
  status?: number;
  response?: {
    status: number;
    data: {
      message?: string;
    };
  };
}

// Keep individual exports for backward compatibility
export const joinRoom = async (
  roomId: string,
  password: string
): Promise<JoinRoomResponse> => {
  try {
    console.log(`Attempting to join room with ID: ${roomId}`);

    const response = await api.post<JoinRoomResponse>(`/rooms/${roomId}/join`, {
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Join room error:", error);

    // Rethrow with additional information
    const typedError = error as ErrorWithStatus;
    throw {
      message: typedError.response?.data?.message || "Failed to join room",
      status: typedError.response?.status,
    };
  }
};

export const checkRoomExists = async (roomId: string): Promise<boolean> => {
  try {
    const response = await api.get<RoomExistsResponse>(
      `/rooms/${roomId}/exists`
    );
    return response.data.exists;
  } catch (error) {
    const typedError = error as ErrorWithStatus;
    // If it's a 403 error, the user is not in the room (which means it does exist)
    if (typedError.response?.status === 403) {
      return true;
    }
    return false;
  }
};

export const getRoomStatus = async (
  roomId: string
): Promise<RoomStatusResponse> => {
  try {
    const response = await api.get<RoomStatusResponse>(
      `/rooms/${roomId}/status`
    );
    return response.data;
  } catch (error) {
    console.error("Get room status error:", error);

    // Rethrow with additional information
    const typedError = error as ErrorWithStatus;
    throw {
      message:
        typedError.response?.data?.message || "Failed to get room status",
      status: typedError.response?.status,
    };
  }
};

export const leaveRoom = async (roomId: string): Promise<JoinRoomResponse> => {
  const response = await api.post<JoinRoomResponse>(
    `/rooms/${roomId}/leave`,
    {}
  );
  return response.data;
};

export const createRoom = async (
  guidingQuestion: string,
  password: string
): Promise<CreateRoomResponse> => {
  const response = await api.post<CreateRoomResponse>("/rooms", {
    guidingQuestion,
    password,
  });
  return response.data;
};

// Also export as a service object for new code
export const roomService = {
  joinRoom,
  checkRoomExists,
  getRoomStatus,
  leaveRoom,
  createRoom,
};

export default roomService;
