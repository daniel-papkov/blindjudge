// src/contexts/AuthContextTypes.ts
import { LoginCredentials, SignupCredentials } from "../services/authService";
import { AuthState } from "../types/auth.types";

// Create auth context with proper typing
export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignupCredentials) => Promise<void>;
  logout: () => void;
}

// Auth context actions
export type AuthAction =
  | { type: "AUTH_REQUEST" }
  | { type: "AUTH_SUCCESS"; payload: { email: string; username?: string } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" };
