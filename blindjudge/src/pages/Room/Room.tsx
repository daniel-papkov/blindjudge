// src/pages/Room/Room.tsx
import React from "react";
import ChatInterface from "../../components/chat/ChatInterface/ChatInterface";
import "./Room.css"; // You'll need to create this CSS file

// This component simply wraps the ChatInterface
const Room: React.FC = () => {
  // We're not using these variables directly, but including them for clarity

  // The ChatInterface component handles all the room-specific logic
  return (
    <div className="room-container">
      <ChatInterface />
    </div>
  );
};

export default Room;
