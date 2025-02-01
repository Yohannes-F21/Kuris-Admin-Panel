export interface User {
  id: string;
  name: string;
  email: string;
  token?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  loggedInSession: boolean;
  loading: boolean;
  user: User | null;
}

export interface ApiResponse {
  user: User;
  message?: string;
}

export interface AuthData {
  email: string;
  password: string;
}
