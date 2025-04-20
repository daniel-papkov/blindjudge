// src/contexts/AuthProvider.tsx
import React, { useReducer, ReactNode, useEffect } from "react";
import authService, {
  LoginCredentials,
  SignupCredentials,
} from "../services/authService";
import { AuthContext, initialState } from "./AuthContext";
import { AuthAction } from "./AuthContextTypes";
import { AuthState } from "../types/auth.types";

// Auth reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "AUTH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case "AUTH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
}

// Auth Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      dispatch({ type: "AUTH_REQUEST" });

      try {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();

        if (user && isAuthenticated) {
          dispatch({ type: "AUTH_SUCCESS", payload: user });
        } else {
          dispatch({ type: "AUTH_LOGOUT" });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Authentication check failed";
        dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "AUTH_REQUEST" });

    try {
      const response = await authService.login(credentials);

      if (response.success && response.token) {
        const user = authService.getCurrentUser();
        if (user) {
          dispatch({ type: "AUTH_SUCCESS", payload: user });
        }
      } else {
        dispatch({
          type: "AUTH_FAILURE",
          payload: response.message || "Login failed",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  // Signup function
  const signup = async (credentials: SignupCredentials) => {
    dispatch({ type: "AUTH_REQUEST" });

    try {
      const response = await authService.signup(credentials);

      if (response.success && response.token) {
        const user = authService.getCurrentUser();
        if (user) {
          dispatch({ type: "AUTH_SUCCESS", payload: user });
        }
      } else {
        dispatch({
          type: "AUTH_FAILURE",
          payload: response.message || "Signup failed",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    dispatch({ type: "AUTH_LOGOUT" });
  };

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
