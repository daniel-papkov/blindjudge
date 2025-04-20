// src/services/authService.ts
import api from "./api";
import { User } from "../types";

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  username?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  username?: string;
}

export interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

// Instead of relying on apiService helper, use the api instance directly
// to avoid type incompatibility issues
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // Store user email for display purposes
      console.log("*****");
      console.log(response.data);
      console.log(credentials);

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: credentials.email,
          username: response.data.username,
        })
      );
    }

    return response.data;
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/signup", credentials);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // Store user email for display purposes
      localStorage.setItem(
        "user",
        JSON.stringify({ email: credentials.email })
      );
    }

    return response.data;
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): { email: string } | null {
    const user = localStorage.getItem("user");
    console.log(user);
    return user ? JSON.parse(user) : null;
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getRedirectPath(): string {
    // Get stored redirect path or default to home
    const redirectPath = localStorage.getItem("redirectPath");
    // Clear the stored path after retrieving it
    if (redirectPath) {
      localStorage.removeItem("redirectPath");
    }
    return redirectPath || "/";
  },
};

// Set up interceptors for authentication
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authService;
