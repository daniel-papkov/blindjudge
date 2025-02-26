// src/services/api.ts
import axios from "axios";
import { authService } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth header to all requests if token exists
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

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      console.log("Auth token expired or invalid");

      // Log out the user
      authService.logout();

      // Store the current location for redirect after login
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        localStorage.setItem("redirectPath", currentPath);
      }

      // Redirect to login page
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const chatService = {
  // Room status and management
  async getRoom(roomId: string) {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  async getRoomStatus(roomId: string) {
    const response = await api.get(`/rooms/${roomId}/status`);
    return response.data.status;
  },

  // Chat initialization and history
  async initializeChat(roomId: string) {
    const response = await api.post(`/rooms/${roomId}/chat/init`);
    return response.data;
  },

  async getChatHistory(roomId: string, sessionId: string) {
    const response = await api.get(`/rooms/${roomId}/chat/history`, {
      headers: {
        "Session-Id": sessionId,
      },
    });
    return response.data;
  },

  // Message handling
  async sendMessage(roomId: string, message: string, sessionId: string) {
    const response = await api.post(
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

  // Room joining
  async checkRoom(roomCode: string) {
    const response = await api.get(`/rooms/check/${roomCode}`);
    return response.data;
  },

  async joinRoom(roomCode: string, password?: string) {
    const response = await api.post(`/rooms/join`, { roomCode, password });
    return response.data;
  },

  // Conclusion submission
  async submitConclusion(roomId: string) {
    const response = await api.post(`/rooms/${roomId}/chat/conclude`);
    return response.data;
  },
};

export default chatService;
