import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../common/LogoutButton";
import "./PageNav.css";

interface PageNavProps {
  title?: string;
}

const PageNav: React.FC<PageNavProps> = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(() =>
    document.documentElement.classList.contains("dark-mode")
  );

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
