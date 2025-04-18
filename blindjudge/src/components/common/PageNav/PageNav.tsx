// src/components/common/PageNav/PageNav.tsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../LogoutButton";
import { useAuth } from "../../../hooks/useAuth";
import "./PageNav.css";

interface PageNavProps {
  title?: string;
}

const PageNav: React.FC<PageNavProps> = () => {
  // Get user information from auth context
  const {
    state: { user, isAuthenticated },
  } = useAuth();

  const [isDarkMode, setIsDarkMode] = React.useState(() =>
    document.documentElement.classList.contains("dark-mode")
  );

  // Set up theme based on localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" && !isDarkMode) {
      document.documentElement.classList.add("dark-mode");
      setIsDarkMode(true);
    } else if (savedTheme === "light" && isDarkMode) {
      document.documentElement.classList.remove("dark-mode");
      setIsDarkMode(false);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const dark = document.documentElement.classList.toggle("dark-mode");
    setIsDarkMode(dark);
    // Save preference to localStorage
    localStorage.setItem("theme", dark ? "dark" : "light");
  };

  return (
    <header className="page-nav">
      <div className="page-nav-container">
        <div className="page-nav-center">
          <nav className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            <Link to="/create" className="nav-link">
              Create Room
            </Link>
            <Link to="/join" className="nav-link">
              Join Room
            </Link>
          </nav>
        </div>
        <div className="page-nav-right">
          {isAuthenticated && user && (
            <div className="user-info">
              <span className="welcome-text">
                Hello, {user.username || user.email}
              </span>
            </div>
          )}
          <button
            onClick={toggleDarkMode}
            className="theme-toggle-button"
            aria-label="Toggle Theme"
          >
            <span className={`icon sun ${isDarkMode ? "hide" : ""}`}>☀️</span>
            <span className={`icon moon ${!isDarkMode ? "hide" : ""}`}>🌙</span>
          </button>
          <LogoutButton variant="secondary" />
        </div>
      </div>
    </header>
  );
};

export default PageNav;
