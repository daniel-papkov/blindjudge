// src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create a single axios instance for the entire app
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Add auth token to all requests
 */
export const setupInterceptors = (
  getToken: () => string | null,
  logoutFn: () => void
): void => {
  // Request interceptor - add auth header
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized errors (token expired or invalid)
      if (error.response?.status === 401) {
        console.log("Auth token expired or invalid");

        // Log out the user
        logoutFn();

        // Store the current location for redirect after login
        const currentPath = window.location.pathname;
        if (currentPath !== "/login") {
          localStorage.setItem("redirectPath", currentPath);
        }

        // Redirect to login page
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }
  );
};

// Type-safe API helper methods
export const apiService = {
  /**
   * Make a GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.get<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET request failed: ${url}`, error);
      throw error;
    }
  },

  /**
   * Make a POST request
   */
  async post<T>(
    url: string,
    data?: Record<string, unknown> | LoginCredentials | SignupCredentials,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST request failed: ${url}`, error);
      throw error;
    }
  },

  /**
   * Make a PUT request
   */
  async put<T>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT request failed: ${url}`, error);
      throw error;
    }
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await api.delete<T>(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE request failed: ${url}`, error);
      throw error;
    }
  },
};

// Interface for auth credentials
interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  username: string;
  email: string;
  password: string;
}

// Export the axios instance for direct use if needed
export default api;
