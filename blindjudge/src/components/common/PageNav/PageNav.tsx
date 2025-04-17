// src/components/common/PageNav/PageNav.tsx
import React from "react";
import { Link } from "react-router-dom";
import LogoutButton from "../../common/LogoutButton";
import "./PageNav.css";

interface PageNavProps {
  title?: string;
}

const PageNav: React.FC<PageNavProps> = ({ title = "Blind Judge" }) => {
  return (
    <header className="page-nav">
      <div className="page-nav-container">
        <div className="page-nav-left">
          <Link to="/" className="app-logo">
            {title}
          </Link>
        </div>
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
          <LogoutButton variant="secondary" />
        </div>
      </div>
    </header>
  );
};

export default PageNav;
