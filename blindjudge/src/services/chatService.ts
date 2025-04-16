// src/services/chatService.ts
import axios from "axios";
import { Message, RoomStatusResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

interface ChatInitResponse {
  success: boolean;
  sessionId: string;
  message: string;
}

interface ChatResponse {
  success: boolean;
  messages: Message[];
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const chatService = {
  async getRoomStatus(roomId: string): Promise<RoomStatusResponse["status"]> {
    const response = await api.get<RoomStatusResponse>(
      `/rooms/${roomId}/status`
    );
    return response.data.status;
  },

  async initializeChat(roomId: string): Promise<ChatInitResponse> {
    const response = await api.post<ChatInitResponse>(
      `/rooms/${roomId}/chat/init`
    );
    return response.data;
  },

  async getChatHistory(
    roomId: string,
    sessionId: string
  ): Promise<ChatResponse> {
    const response = await api.get<ChatResponse>(
      `/rooms/${roomId}/chat/history`,
      {
        headers: {
          "Session-Id": sessionId,
        },
      }
    );
    return response.data;
  },

  async sendMessage(
    roomId: string,
    message: string,
    sessionId: string
  ): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>(
      `/rooms/${roomId}/chat/message`,
      { message },
      {
        headers: {
          "Session-Id": sessionId,
        },
      }
    );
    return response.data;
  },

  async submitConclusion(roomId: string): Promise<{ success: boolean }> {
    const response = await api.post(`/rooms/${roomId}/chat/conclude`);
    return response.data;
  },

  async submitComparison(roomId: string): Promise<{ success: boolean }> {
    const response = await api.post(`/ai/${roomId}/compare`);
    return response.data;
  },
};
