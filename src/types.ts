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

export interface Author {
  _id: string;
  name: string;
  email: string;
}

export interface Blog {
  author: Author;
  content: string;
  created: string;
  isPublished: boolean;
  thumbnail: string;
  title: string;
  updated: string;
  __v: number;
  _id: string;
}
