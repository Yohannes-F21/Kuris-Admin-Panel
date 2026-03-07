import api from "../axios";
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";

// Define types for the data being passed in each thunk
interface LoginData {
  email: string;
  password: string;
}

interface OTPData {
  email: string;
}

interface ForgetPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

interface VerifyEmailData {
  token: string;
  email?: string;
}

export interface AuthErrorPayload {
  message: string;
  raw?: unknown;
}

export interface AuthUser {
  _id?: string;
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  message?: string;
  user?: AuthUser;
  [key: string]: unknown;
}

const getErrorMessage = (error: any) => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return error?.message ?? "Request failed";
};

const toRejectedPayload = (error: any): AuthErrorPayload => ({
  message: getErrorMessage(error),
  raw: error?.response?.data,
});

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface ChangePasswordData {
  _id: string;
  oldPassword: string;
  newPassword: string;
}

// User Login Thunk
export const UserLogin = createAsyncThunk(
  "user/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/login`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// User Send OTP Thunk
export const UserSendOTP = createAsyncThunk(
  "user/sendOTP",
  async (data: OTPData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/login-otp`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// User Forget Password Thunk
export const UserForgetPassword = createAsyncThunk(
  "user/forget-password",
  async (data: ForgetPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/forgot-password`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// User Reset Password Thunk
export const UserResetPassword = createAsyncThunk(
  "user/reset-password",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/reset-password`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// User Verify Email Thunk
export const UserVerifyEmail = createAsyncThunk(
  "user/verify-email",
  async (data: VerifyEmailData, { rejectWithValue }) => {
    try {
      // Some backends expect POST body; others expect GET with token param.
      // Also token field name may vary; sending both is usually safe.
      const response = await api.post(`/user/auth/verify-email`, {
        token: data.token,
        verificationToken: data.token,
        email: data.email,
      });
      return response.data;
    } catch (error: any) {
      try {
        const response = await api.get(`/user/auth/verify-email`, {
          params: { token: data.token, email: data.email },
        });
        return response.data;
      } catch (error2: any) {
        return rejectWithValue({
          message: getErrorMessage(error2),
          raw: error2?.response?.data,
        });
      }
    }
  },
);

// Logout Action
export const authLogout = createAction("user/logout");

export const UserLogout = createAsyncThunk(
  "user/logout-request",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/logout`);
      return response.data;
    } catch (error: any) {
      try {
        const response = await api.get(`/user/auth/logout`);
        return response.data;
      } catch (fallbackError: any) {
        return rejectWithValue(toRejectedPayload(fallbackError));
      }
    }
  },
);

// User Register Thunk
export const UserRegister = createAsyncThunk(
  "user/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/register`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// User Change Password Thunk
export const UserChangePassword = createAsyncThunk(
  "user/change-password",
  async (data: ChangePasswordData, { rejectWithValue }) => {
    const { _id } = data;
    try {
      const response = await api.post(
        `/user/auth/change-password/${_id}`,
        data,
      );
      return response.data;
    } catch (error: any) {
      try {
        const response = await api.post(`/user/auth/change-password`, data);
        return response.data;
      } catch (fallbackError: any) {
        return rejectWithValue(toRejectedPayload(fallbackError));
      }
    }
  },
);

export const CheckSession = createAsyncThunk(
  "user/check-session",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/auth/get-session`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);
