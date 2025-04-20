// src/components/common/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./styles/LogoutButton.css";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "secondary" | "minimal";
  withIcon?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  variant = "primary",
  withIcon = false,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // Use logout from useAuth hook
    logout();

    // Redirect to login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`logout-button logout-button-${variant} ${
        withIcon ? "logout-with-icon" : ""
      } ${className}`}
    >
      {variant === "minimal" ? "Logout" : "Sign Out"}
    </button>
  );
};

export default LogoutButton;
