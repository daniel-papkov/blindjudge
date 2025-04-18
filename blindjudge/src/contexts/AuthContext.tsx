// src/contexts/AuthContext.ts
import { createContext } from "react";
import { AuthContextType } from "./AuthContextTypes";
import { AuthState } from "../types/auth.types";

// Initial auth state
export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create the context instance
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
