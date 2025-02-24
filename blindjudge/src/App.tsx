// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import CreateSession from "./pages/CreateSession/CreateSession";
import ChatInterface from "../src/components/chat/ChatInterface/ChatInterface";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AuthGuard from "./components/auth/AuthGuard";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/create"
          element={
            <AuthGuard>
              <CreateSession />
            </AuthGuard>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <AuthGuard>
              <ChatInterface />
            </AuthGuard>
          }
        />
        <Route
          path="/join"
          element={
            <AuthGuard>
              <div>Join Page (TODO)</div>
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
