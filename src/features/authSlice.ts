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
  UserLogout,
  AuthErrorPayload,
  AuthResponse,
  AuthUser,
} from "./authActions";

// Define the shape of the state
interface AuthState {
  isAuthenticated: boolean;
  loggedInSession: boolean;
  loading: boolean;
  sessionChecked: boolean;
  error: string | null;
  user: AuthUser | null;
}

const getUserFromPayload = (
  payload: AuthResponse | AuthUser | null | undefined,
): AuthUser | null => {
  if (!payload) return null;
  return (payload.user ?? payload) as AuthUser;
};

const persistUser = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem("userInfo", JSON.stringify(user));
    return;
  }

  localStorage.removeItem("userInfo");
};

const clearAuthStorage = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("blogContent");
};

const setPendingState = (state: AuthState) => {
  state.loading = true;
  state.error = null;
};

const setRejectedState = (state: AuthState, action: { payload?: unknown }) => {
  state.loading = false;
  state.error =
    (action.payload as AuthErrorPayload | undefined)?.message ??
    "Request failed";
};

// Initial state with type annotations
const storedUser = localStorage.getItem("userInfo");
const initialState: AuthState = {
  isAuthenticated: !!storedUser,
  loggedInSession: !!storedUser,
  loading: false,
  sessionChecked: !!storedUser,
  error: null,
  user: storedUser ? JSON?.parse(storedUser) : null,
};

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // User Login
      .addCase(UserLogin.pending, setPendingState)
      .addCase(
        UserLogin.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.error = null;
          state.isAuthenticated = true;
          state.loggedInSession = true;
          state.sessionChecked = true;

          const user = getUserFromPayload(action.payload);
          state.user = user;
          persistUser(user);
        },
      )
      .addCase(UserLogin.rejected, (state, action) => {
        setRejectedState(state, action);
        state.sessionChecked = true;
      })

      // Logout
      .addCase(authLogout, (state) => {
        state.isAuthenticated = false;
        state.loggedInSession = false;
        state.loading = false;
        state.sessionChecked = true;
        state.error = null;
        state.user = null;
        clearAuthStorage();
      })
      .addCase(UserLogout.pending, setPendingState)
      .addCase(UserLogout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loggedInSession = false;
        state.loading = false;
        state.sessionChecked = true;
        state.error = null;
        state.user = null;
        clearAuthStorage();
      })
      .addCase(UserLogout.rejected, (state, action) => {
        setRejectedState(state, action);
        state.isAuthenticated = false;
        state.loggedInSession = false;
        state.sessionChecked = true;
        state.user = null;
        clearAuthStorage();
      })

      // Send OTP
      .addCase(UserSendOTP.pending, setPendingState)
      .addCase(
        UserSendOTP.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.error = null;
          state.isAuthenticated = true;
          state.user = getUserFromPayload(action.payload);
          state.loggedInSession = false;
          state.sessionChecked = true;
          persistUser(state.user);
        },
      )
      .addCase(UserSendOTP.rejected, setRejectedState)

      // Forget Password
      .addCase(UserForgetPassword.pending, setPendingState)
      .addCase(UserForgetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UserForgetPassword.rejected, setRejectedState)

      // Reset Password
      .addCase(UserResetPassword.pending, setPendingState)
      .addCase(UserResetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UserResetPassword.rejected, setRejectedState)

      // Verify Email
      .addCase(UserVerifyEmail.pending, setPendingState)
      .addCase(UserVerifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UserVerifyEmail.rejected, setRejectedState)

      // User Register
      .addCase(UserRegister.pending, setPendingState)
      .addCase(UserRegister.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UserRegister.rejected, setRejectedState)

      // Change Password
      .addCase(UserChangePassword.pending, setPendingState)
      .addCase(UserChangePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UserChangePassword.rejected, setRejectedState)
      .addCase(CheckSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        CheckSession.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          const user = getUserFromPayload(action.payload);

          state.loading = false;
          state.error = null;
          state.sessionChecked = true;
          state.isAuthenticated = true;
          state.loggedInSession = true;
          state.user = user;
          persistUser(user);
        },
      )
      .addCase(CheckSession.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as AuthErrorPayload | undefined)?.message ?? null;
        state.sessionChecked = true;
        state.isAuthenticated = false;
        state.loggedInSession = false;
        state.user = null;
        clearAuthStorage();
      });
  },
});

// Export actions and reducer
export const {} = authSlice.actions;
export default authSlice.reducer;
