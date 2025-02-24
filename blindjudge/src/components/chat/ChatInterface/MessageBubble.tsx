import React from "react";
import { Message } from "../../../types";
import "./styles/MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // Apply CSS class based on sender type (either "user" or "ai")
  return (
    <div className={`message-container ${message.sender}`}>
      <div className="message-bubble">
        <div className="message-content">{message.content}</div>
        <div className="message-timestamp">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
