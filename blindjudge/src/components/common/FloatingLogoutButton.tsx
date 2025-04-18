// src/components/auth/FloatingLogoutButton.tsx
import React from "react";
import LogoutButton from "./LogoutButton";
import "./FloatingLogoutButton.css";

interface FloatingLogoutButtonProps {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const FloatingLogoutButton: React.FC<FloatingLogoutButtonProps> = ({
  position = "top-right",
}) => {
  return (
    <div className={`floating-logout-container floating-logout-${position}`}>
      <LogoutButton variant="primary" />
    </div>
  );
};

export default FloatingLogoutButton;
