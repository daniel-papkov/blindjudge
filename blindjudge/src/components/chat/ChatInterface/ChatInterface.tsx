// src/components/chat/ChatInterface/ChatInterface.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Message } from "../../../types";
import { chatService } from "../../../services/chatService";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import PageNav from "../../common/PageNav/PageNav";
import "./styles/ChatInterface.css";

// Define a type for backend messages with 'role' instead of 'sender'
interface BackendMessage {
  id?: string;
  _id?: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ComparisonResult {
  success: boolean;
  comparison: string;
  guidingQuestion: string;
  conclusions: UserConclusion[];
}

interface UserConclusion {
  userId: string;
  username: string;
  conclusion: string;
  timestamp: string;
  parentDiscussion: Discussion;
}

interface Discussion {
  id: string;
  guidingQuestion: string;
  created: string;
  participants: Participant[];
  conclusions: ParticipantConclusion[];
  status: "completed" | "in-progress" | string;
  finalVerdict: string;
}

interface Participant {
  userId: string;
  username: string;
  hasSubmitted: boolean;
}

interface ParticipantConclusion {
  userId: string;
  conclusion: string;
  timestamp: string;
}

interface RoomStatusResponse {
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
  const [isSubmittingComparison, setIsSubmittingComparison] = useState(false);
  const [conclusionSuccess, setConclusionSuccess] = useState(false);
  const [comparisonSuccess, setComparisonSuccess] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);
  const [roomState, setRoomState] = useState<
    "active" | "comparing" | "completed"
  >("active");
  const [roomStatus, SetRoomStatus] = useState<RoomStatusResponse>();
  const [guidingQuestion, setGuidingQuestion] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<string>("");
  //const [shareSuccess, setShareSuccess] = useState<string>("");

  // Copy room ID to clipboard
  const copyRoomIdToClipboard = () => {
    if (roomId) {
      navigator.clipboard
        .writeText(roomId)
        .then(() => {
          setCopySuccess("Room ID copied!");
          // Clear the success message after 2 seconds
          setTimeout(() => {
            setCopySuccess("");
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy room ID: ", err);
          setCopySuccess("Failed to copy");
        });
    }
  };

  // Scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize the chat
  useEffect(() => {
    const initChat = async () => {
      if (!roomId) {
        setError("Room ID is required");
        setLoading(false);
        return;
      }

      try {
        // Get room status
        try {
          const statusData = await chatService.getRoomStatus(roomId);
          if (statusData) {
            if (statusData.roomStatus) {
              setRoomState(statusData.roomStatus);
              SetRoomStatus(statusData);
            }

            if (statusData.guidingQuestion) {
              setGuidingQuestion(statusData.guidingQuestion);
            }
          }
        } catch (error) {
          console.error("Failed to get room status:", error);
        }

        // Initialize chat based on user role
        let response;
        if (roomData?.isCreator) {
          console.log("User is creator, initializing chat");
          response = await chatService.initializeChat(roomId);
        } else {
          console.log("User is not creator, getting existing session ID");
          response = await chatService.getSessionId(roomId);
        }

        if (response.success) {
          console.log("Session ID received:", response.sessionId);
          setSessionId(response.sessionId);
        } else {
          throw new Error("Failed to get session ID");
        }

        setLoading(false);
      } catch (error) {
        console.error("Chat initialization error:", error);
        setError("Failed to initialize chat");
        setLoading(false);
      }
    };

    initChat();
  }, [roomId, roomData?.isCreator]);

  // Load chat history once sessionId is set
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!roomId || !sessionId) return;

      try {
        console.log("Loading chat history with session ID:", sessionId);
        const history = await chatService.getChatHistory(roomId, sessionId);

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
    };

    loadChatHistory();
  }, [roomId, sessionId]);

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

        // Only set status to comparing if the response indicates it's complete
        if (response.success) {
          setRoomState("comparing");
        }
        // Otherwise keep the current status
      } else {
        setError("Failed to submit conclusion. Please try again.");
      }
    } catch (error) {
      console.error("Submit conclusion error:", error);
      setError("Failed to submit conclusion. Please try again.");
    } finally {
      setIsSubmittingConclusion(false);
      // Get room status
      try {
        const statusData = await chatService.getRoomStatus(roomId);
        if (statusData) {
          if (statusData.roomStatus) {
            setRoomState(statusData.roomStatus);
            SetRoomStatus(statusData);
          }

          if (statusData.guidingQuestion) {
            setGuidingQuestion(statusData.guidingQuestion);
          }
        }
      } catch (error) {
        console.error("Failed to get room status:", error);
      }
    }
  };

  const handleSubmitComparison = async () => {
    if (!roomId || isSubmittingComparison) return;

    try {
      setIsSubmittingComparison(true);
      setError(null);
      const response = await chatService.submitComparison(roomId);

      if (response.success) {
        setComparisonSuccess(true);
        setRoomState("completed");
        setComparisonResult(response as ComparisonResult);
      } else {
        setError("Failed to submit comparison. Please try again.");
      }
    } catch (error) {
      console.error("Submit comparison error:", error);
      setError("Failed to submit comparison. Please try again.");
    } finally {
      setIsSubmittingComparison(false);
    }
  };

  return (
    <div className="app-container">
      <PageNav />
      <div className="app-content">
        {loading ? (
          <div className="chat-loading">Loading chat...</div>
        ) : error ? (
          <div className="chat-error">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => navigate("/")} className="error-back-button">
              Back to Home
            </button>
          </div>
        ) : (
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
              <div className="chat-header-controls">
                <div className="room-info">
                  <div className="room-id-container">
                    <span className="room-id-label">Room ID: </span>
                    <span className="room-id-value">{roomId}</span>
                    <button
                      onClick={copyRoomIdToClipboard}
                      className="copy-room-id-button"
                      title="Copy Room ID to clipboard"
                    >
                      📋
                    </button>
                    {copySuccess && (
                      <span className="copy-success">{copySuccess}</span>
                    )}
                  </div>
                  <div className="room-status">
                    Status:{" "}
                    <span className={`status-badge ${roomState}`}>
                      {roomState}
                    </span>
                  </div>
                </div>
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
            {((comparisonSuccess && comparisonResult) ||
              roomStatus?.finalVerdict) && (
              <div className="comparison-result">
                <h3>Final Verdict</h3>
                <div className="comparison-details">
                  <strong>Comparison:</strong>
                  <p>
                    {comparisonResult?.comparison || roomStatus?.finalVerdict}
                  </p>
                </div>
              </div>
            )}
            {roomState === "active" &&
              messages.length >= 2 &&
              roomStatus &&
              !roomStatus.hasSubmitted && (
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
                        Submitting your conclusion will end this chat session
                        and move to the comparison phase when all participants
                        have submitted.
                      </p>
                    </>
                  )}
                </div>
              )}

            {/* Show waiting state when user has submitted but waiting for others */}
            {roomState === "active" &&
              roomStatus &&
              roomStatus.hasSubmitted && (
                <div className="conclusion-container">
                  <div className="conclusion-success-message">
                    Your conclusion has been submitted. Waiting for other
                    participants to submit their conclusions.
                  </div>
                  <p className="participants-status">
                    <span className="participant-count">
                      {roomStatus.conclusionCount}
                    </span>{" "}
                    of{" "}
                    <span className="participant-count">
                      {roomStatus.participantCount}
                    </span>{" "}
                    participants have submitted conclusions.
                  </p>
                </div>
              )}

            {/* Comparison button - only show when in comparing state, 2+ participants, and all have submitted */}
            {roomState === "comparing" &&
              roomStatus &&
              roomStatus.participantCount >= 2 &&
              roomStatus.conclusionCount === roomStatus.participantCount && (
                <button
                  className="conclude-button"
                  onClick={handleSubmitComparison}
                  disabled={isSubmittingComparison || comparisonSuccess}
                >
                  {isSubmittingComparison && !comparisonSuccess
                    ? "Submitting comparison..."
                    : comparisonSuccess
                    ? "Comparison complete!"
                    : "Submit comparison"}
                </button>
              )}

            {/* Show waiting state when in comparing but not all have submitted */}
            {roomState === "comparing" &&
              roomStatus &&
              (roomStatus.participantCount < 2 ||
                roomStatus.conclusionCount < roomStatus.participantCount) && (
                <div className="conclusion-waiting">
                  <p>
                    Waiting for more participants or conclusions before
                    comparison can begin.
                  </p>
                  <p className="participants-status">
                    <span className="participant-count">
                      {roomStatus.conclusionCount}
                    </span>{" "}
                    of{" "}
                    <span className="participant-count">
                      {roomStatus.participantCount}
                    </span>{" "}
                    participants have submitted conclusions.
                  </p>
                </div>
              )}

            <div className="chat-input-container">
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isSending || !sessionId || roomState !== "active"}
              />
              {roomState !== "active" && (
                <div className="room-closed-message">
                  This room is {roomState}. No new messages can be sent.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
