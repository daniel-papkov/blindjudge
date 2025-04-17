// src/components/auth/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/LogoutButton.css";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "minimal";
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  variant = "primary",
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth token
    localStorage.removeItem("token");

    // Any other cleanup needed
    // sessionStorage.clear();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`logout-button logout-button-${variant} ${className}`}
    >
      {variant === "minimal" ? "Logout" : "Sign Out"}
    </button>
  );
};

export default LogoutButton;
