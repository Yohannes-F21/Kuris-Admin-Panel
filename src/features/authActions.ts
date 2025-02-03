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
}

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
      console.log("what about here");
      const response = await api.post(`/user/auth/login`, data);
      console.log(response, "response from redux");
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

// User Send OTP Thunk
export const UserSendOTP = createAsyncThunk(
  "user/sendOTP",
  async (data: OTPData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/login-otp`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// User Forget Password Thunk
export const UserForgetPassword = createAsyncThunk(
  "user/forget-password",
  async (data: ForgetPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/forgot-password`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// User Reset Password Thunk
export const UserResetPassword = createAsyncThunk(
  "user/reset-password",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/reset-password`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// User Verify Email Thunk
export const UserVerifyEmail = createAsyncThunk(
  "user/verify-email",
  async (data: VerifyEmailData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/verify-email`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Logout Action
export const authLogout = createAction("user/logout");

// User Register Thunk
export const UserRegister = createAsyncThunk(
  "user/register",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/user/auth/register`, data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// User Change Password Thunk
export const UserChangePassword = createAsyncThunk(
  "user/change-password",
  async (data: ChangePasswordData, { rejectWithValue }) => {
    const { _id } = data;
    try {
      const response = await api.post(
        `/user/auth/change-password/${_id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);
