// src/components/common/AppHeader.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "./styles/AppHeader.css";

interface AppHeaderProps {
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title = "Blind Judge" }) => {
  const location = useLocation();
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isLoginPage) {
    return null; // Don't show header on login/register pages
  }

  return (
    <header className="app-header">
      <div className="app-header-container">
        <div className="app-header-left">
          <Link to="/" className="app-logo">
            {title}
          </Link>
        </div>
        <div className="app-header-right">
          <nav className="app-nav">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </nav>
          <LogoutButton variant="secondary" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
