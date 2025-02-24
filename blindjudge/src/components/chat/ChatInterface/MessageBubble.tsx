import React from "react";
import { Message } from "../../../types";
import "./styles/MessageBubble.css";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`message-container ${isUser ? "user" : "ai"}`}>
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
