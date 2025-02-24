// src/services/api.ts
import axios from "axios";

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

export const chatService = {
  // Room management
  async getRoom(roomId: string) {
    const response = await api.get(`/rooms/${roomId}`);
    return response.data;
  },

  // Message handling
  async sendMessage(roomId: string, content: string) {
    const response = await api.post(`/rooms/${roomId}/messages`, { content });
    return response.data;
  },

  async getMessages(roomId: string) {
    const response = await api.get(`/rooms/${roomId}/messages`);
    return response.data;
  },

  // Room joining
  async joinRoom(roomId: string, password: string) {
    const response = await api.post(`/rooms/${roomId}/join`, { password });
    return response.data;
  },
};

export default chatService;
