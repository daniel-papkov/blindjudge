// src/components/chat/ChatInput.tsx
import React, { useState, useEffect, useRef } from "react";
import "./styles/ChatInput.css";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus the input when component mounts
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || disabled) return;

    onSendMessage(inputValue);
    setInputValue("");

    // Refocus the input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`chat-input-form ${isFocused ? "focused" : ""}`}
    >
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Type your message..."
        className="chat-input"
        disabled={disabled}
      />
      <button
        type="submit"
        className="send-button"
        disabled={disabled || !inputValue.trim()}
      >
        <span className="button-text">Send</span>
        <span className="button-icon">→</span>
      </button>
    </form>
  );
};

export default ChatInput;
