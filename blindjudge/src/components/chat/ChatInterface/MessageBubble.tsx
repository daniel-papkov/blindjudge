// src/components/chat/ChatInterface/MessageBubble.tsx
import React from "react";
import { Message } from "../../../types";
import "./styles/MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div
      className={`message ${
        message.sender === "user" ? "user-message" : "ai-message"
      }`}
    >
      <div className="message-content">{message.content}</div>
      <div className="message-timestamp">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MessageBubble;
