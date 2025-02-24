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
    participantCount: number;
    conclusionCount: number;
    roomStatus: Room["status"];
    hasSubmitted: boolean;
    participants: {
      username: string;
      hasSubmitted: boolean;
    }[];
  };
}
