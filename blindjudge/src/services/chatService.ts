// src/services/chatService.ts
import { apiService } from "./api";
import { Message, RoomStatusResponse } from "../types";

export interface ChatInitResponse {
  success: boolean;
  sessionId: string;
  message: string;
}

export interface ChatSessionResponse {
  success: boolean;
  sessionId: string;
  roomStatus: string;
  guidingQuestion: string;
}

export interface ChatResponse {
  success: boolean;
  messages: Message[];
}

export interface ConclusionResponse {
  success: boolean;
  message?: string;
}

export interface ComparisonResponse {
  success: boolean;
  comparison?: string;
  guidingQuestion?: string;
  conclusions?: Array<{
    userId: string;
    username: string;
    conclusion: string;
    timestamp: string;
  }>;
}

export const chatService = {
  /**
   * Get the status of a room
   */
  async getRoomStatus(roomId: string): Promise<RoomStatusResponse["status"]> {
    const response = await apiService.get<RoomStatusResponse>(
      `/rooms/${roomId}/status`
    );
    return response.status;
  },

  /**
   * Initialize a new chat session
   */
  async initializeChat(roomId: string): Promise<ChatInitResponse> {
    return apiService.post<ChatInitResponse>(`/rooms/${roomId}/chat/init`, {});
  },

  /**
   * Get the session ID for an existing chat
   */
  async getSessionId(roomId: string): Promise<ChatSessionResponse> {
    try {
      return apiService.get<ChatSessionResponse>(
        `/rooms/${roomId}/chat/session`
      );
    } catch (error) {
      console.error("Failed to get session ID:", error);
      throw error;
    }
  },

  /**
   * Get chat history for a specific session
   */
  async getChatHistory(
    roomId: string,
    sessionId: string
  ): Promise<ChatResponse> {
    return apiService.get<ChatResponse>(`/rooms/${roomId}/chat/history`, {
      headers: {
        "Session-Id": sessionId,
      },
    });
  },

  /**
   * Send a message in a chat session
   */
  async sendMessage(
    roomId: string,
    message: string,
    sessionId: string
  ): Promise<ChatResponse> {
    return apiService.post<ChatResponse>(
      `/rooms/${roomId}/chat/message`,
      { message },
      {
        headers: {
          "Session-Id": sessionId,
        },
      }
    );
  },

  /**
   * Submit the conclusion for a discussion
   */
  async submitConclusion(roomId: string): Promise<ConclusionResponse> {
    return apiService.post<ConclusionResponse>(
      `/rooms/${roomId}/chat/conclude`,
      {}
    );
  },

  /**
   * Submit comparison between two discussions
   */
  async submitComparison(roomId: string): Promise<ComparisonResponse> {
    return apiService.post<ComparisonResponse>(`/ai/${roomId}/compare`, {});
  },
};

export default chatService;
