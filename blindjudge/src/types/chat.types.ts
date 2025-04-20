// src/types/chat.types.ts
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  questionContext: string;
  status: "active" | "complete";
  createdAt: Date;
  updatedAt: Date;
}

export interface ComparisonResult {
  sessionId1: string;
  sessionId2: string;
  result: string;
  comparedAt: Date;
}

export interface MessageRequest {
  message: string;
}
