import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserLogin,
  UserRegister,
  UserSendOTP,
  UserChangePassword,
  UserForgetPassword,
  UserResetPassword,
  UserVerifyEmail,
  authLogout,
  CheckSession,
} from "./authActions";

// Define the shape of the state
interface AuthState {
  isAuthenticated: boolean;
  loggedInSession: boolean;
  loading: boolean;
  user: null | any; // Replace `any` with a more specific type if you have a User interface
}

// Initial state with type annotations
const storedUser = localStorage.getItem("userInfo");
const initialState: AuthState = {
  isAuthenticated: !!storedUser,
  loggedInSession: !!storedUser,
  loading: false,
  user: storedUser ? JSON.parse(storedUser) : null,
};

console.log(initialState, "initialState");

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // User Login
      .addCase(UserLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserLogin.fulfilled, (state, action: PayloadAction<any>) => {
        console.log(action, "slice");
        state.loading = false;
        state.loggedInSession = true;
      })
      .addCase(UserLogin.rejected, (state) => {
        state.loading = false;
      })

      // Logout
      .addCase(authLogout, (state) => {
        state.isAuthenticated = false;
        state.loggedInSession = false;
        state.user = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("blogContent");
      })

      // Send OTP
      .addCase(UserSendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserSendOTP.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loggedInSession = false;
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      })
      .addCase(UserSendOTP.rejected, (state) => {
        state.loading = false;
      })

      // Forget Password
      .addCase(UserForgetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserForgetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UserForgetPassword.rejected, (state) => {
        state.loading = false;
      })

      // Reset Password
      .addCase(UserResetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserResetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UserResetPassword.rejected, (state) => {
        state.loading = false;
      })

      // Verify Email
      .addCase(UserVerifyEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserVerifyEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UserVerifyEmail.rejected, (state) => {
        state.loading = false;
      })

      // User Register
      .addCase(UserRegister.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserRegister.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UserRegister.rejected, (state) => {
        state.loading = false;
      })

      // Change Password
      .addCase(UserChangePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(UserChangePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(UserChangePassword.rejected, (state) => {
        state.loading = false;
      })
      .addCase(CheckSession.fulfilled, (state, action: PayloadAction<any>) => {
        state.isAuthenticated = true;
        state.loggedInSession = true;
        state.user = action.payload.user;
        localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
      })
      .addCase(CheckSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.loggedInSession = false;
        state.user = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("blogContent");
      });
  },
});

// Export actions and reducer
export const {} = authSlice.actions;
export default authSlice.reducer;
