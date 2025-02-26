import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Message } from "../../../types";
import { chatService } from "../../../services/chatService";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import "./styles/ChatInterface.css";

// Define a type for backend messages with 'role' instead of 'sender'
interface BackendMessage {
  id?: string;
  _id?: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Helper function to map role to sender
const mapRoleToSender = (role: "user" | "assistant"): "user" | "ai" => {
  if (role === "user") return "user";
  return "ai"; // If role is "assistant", return "ai"
};

// Helper function to convert backend message to frontend message format
const convertToMessage = (backendMsg: BackendMessage | Message): Message => {
  // If it already has a sender property, it's likely already a Message
  if ("sender" in backendMsg) {
    return backendMsg as Message;
  }

  // Otherwise it's a BackendMessage, so convert it
  return {
    id: backendMsg.id || backendMsg._id || Date.now().toString(),
    content: backendMsg.content,
    sender: mapRoleToSender(backendMsg.role),
    timestamp: backendMsg.timestamp,
  };
};

const ChatInterface: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const roomData = location.state;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSubmittingConclusion, setIsSubmittingConclusion] = useState(false);
  const [conclusionSuccess, setConclusionSuccess] = useState(false);
  const [roomStatus, setRoomStatus] = useState<
    "active" | "comparing" | "completed"
  >("active");
  const [guidingQuestion, setGuidingQuestion] = useState<string>("");

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const initChat = async () => {
      if (!roomId) return;

      try {
        // Get room status
        try {
          const statusData = await chatService.getRoomStatus(roomId);
          if (statusData) {
            if (statusData.roomStatus) {
              setRoomStatus(statusData.roomStatus);
            }

            if (statusData.guidingQuestion) {
              setGuidingQuestion(statusData.guidingQuestion);
            }
          }
        } catch (error) {
          console.error("Failed to get room status:", error);
        }

        // Initialize chat
        const response = await chatService.initializeChat(roomId);
        if (response.success) {
          setSessionId(response.sessionId);

          // Get chat history
          try {
            const history = await chatService.getChatHistory(
              roomId,
              response.sessionId
            );
            if (history.success && history.messages) {
              // Map API messages to our frontend Message type
              const mappedMessages = history.messages.map((msg) =>
                convertToMessage(msg as BackendMessage | Message)
              );

              setMessages(mappedMessages);
            }
          } catch (error) {
            console.error("Failed to load chat history:", error);
          }

          setLoading(false);
        } else {
          throw new Error("Chat initialization failed");
        }
      } catch (error) {
        console.error("Chat initialization error:", error);
        setError("Failed to initialize chat");
        setLoading(false);
      }
    };

    initChat();
  }, [roomId]);

  const handleSendMessage = async (content: string) => {
    if (!roomId || !sessionId || isSending) return;

    // Add user message to UI immediately for better UX
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      setIsSending(true);
      const response = await chatService.sendMessage(
        roomId,
        content,
        sessionId
      );

      if (response.success && response.messages) {
        // Map API messages to our frontend Message type
        const mappedMessages = response.messages.map((msg) =>
          convertToMessage(msg as BackendMessage | Message)
        );

        setMessages(mappedMessages);
      }
    } catch (error) {
      console.error("Send message error:", error);
      setError("Failed to send message. Please try again.");

      // Remove the temporary message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmitConclusion = async () => {
    if (!roomId || isSubmittingConclusion) return;

    try {
      setIsSubmittingConclusion(true);
      setError(null);
      const response = await chatService.submitConclusion(roomId);

      if (response.success) {
        setConclusionSuccess(true);
        setRoomStatus("comparing");
      } else {
        setError("Failed to submit conclusion. Please try again.");
      }
    } catch (error) {
      console.error("Submit conclusion error:", error);
      setError("Failed to submit conclusion. Please try again.");
    } finally {
      setIsSubmittingConclusion(false);
    }
  };

  if (loading) {
    return <div className="chat-loading">Loading chat...</div>;
  }

  if (error) {
    return (
      <div className="chat-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="error-back-button">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="question-display">
          <h3>Question</h3>
          <p>
            {guidingQuestion ||
              roomData?.guidingQuestion ||
              "No question provided"}
          </p>
          {roomData?.isCreator && (
            <span className="creator-badge">Creator</span>
          )}
        </div>
        <div className="room-status">
          Status:{" "}
          <span className={`status-badge ${roomStatus}`}>{roomStatus}</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <MessageBubble
            key={`${message.id}-${message.timestamp.toString()}`}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Conclusion button area */}
      {roomStatus === "active" && (
        <div className="conclusion-container">
          {conclusionSuccess ? (
            <div className="conclusion-success-message">
              Your conclusion has been submitted successfully!
            </div>
          ) : (
            <>
              {error && <div className="conclusion-error">{error}</div>}
              <button
                className="conclude-button"
                onClick={handleSubmitConclusion}
                disabled={isSubmittingConclusion}
              >
                {isSubmittingConclusion
                  ? "Submitting conclusion..."
                  : "Submit Conclusion"}
              </button>
              <p className="conclusion-hint">
                Submitting your conclusion will end this chat session and move
                to the comparison phase.
              </p>
            </>
          )}
        </div>
      )}

      <div className="chat-input-container">
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isSending || !sessionId || roomStatus !== "active"}
        />
        {roomStatus !== "active" && (
          <div className="room-closed-message">
            This room is {roomStatus}. No new messages can be sent.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
