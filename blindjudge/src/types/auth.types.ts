// src/types/auth.types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | { email: string; username?: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
