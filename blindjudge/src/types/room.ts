// src/types/room.ts
export interface Room {
  id: string;
  password: string;
  guidingQuestion: string;
  created: Date;
  participants: {
    userId: string;
    username: string;
    chatSessionId?: string;
    hasSubmitted: boolean;
  }[];
  conclusions: {
    userId: string;
    conclusion: string;
    timestamp: Date;
  }[];
  comparisonChatId?: string;
  finalVerdict?: string;
  status: "active" | "comparing" | "completed";
}

export interface RoomStatusResponse {
  success: boolean;
  status: {
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
    // Note: We don't include password for security reasons
  };
}
