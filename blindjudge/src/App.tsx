// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateSession from "./pages/CreateSession/CreateSession";
import ChatInterface from "./components/chat/ChatInterface/ChatInterface";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AuthGuard from "./components/auth/AuthGuard";
import JoinRoom from "./pages/JoinRoom/JoinRoom";
import PageNav from "./components/common/PageNav/PageNav";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with PageNav */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <div className="app-container">
                <PageNav />
                <div className="app-content">
                  <Home />
                </div>
              </div>
            </AuthGuard>
          }
        />

        <Route
          path="/create"
          element={
            <AuthGuard>
              <div className="app-container">
                <PageNav />
                <div className="app-content">
                  <CreateSession />
                </div>
              </div>
            </AuthGuard>
          }
        />

        <Route
          path="/join"
          element={
            <AuthGuard>
              <div className="app-container">
                <PageNav />
                <div className="app-content">
                  <JoinRoom />
                </div>
              </div>
            </AuthGuard>
          }
        />

        {/* Chat interface doesn't need PageNav as it has its own header */}
        <Route
          path="/room/:roomId"
          element={
            <AuthGuard>
              <ChatInterface />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
