import { createSlice } from "@reduxjs/toolkit";

// import {
//   CreateBlog,
//   GetBlog,
//   DeleteBlog,
//   SearchFilterBlogs,
//   UpdateBlog,
// } from "./blogActions";

// // Define the shape of the state
// interface AuthState {
//   blogsList: null;
//   currentBlog: null;
//   loading: boolean;
// }

// Initial state with type annotations
// const storedUser = localStorage.getItem("userInfo");
// const initialState: AuthState = {
//   isAuthenticated: !!storedUser,
//   loggedInSession: !!storedUser,
//   loading: false,
//   user: storedUser ? JSON.parse(storedUser) : null,
// };

// console.log(initialState, "initialState");

// // Create the slice
// const authSlice = createSlice({
//   name: "blogs",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // User Login
//       .addCase(UserLogin.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(UserLogin.fulfilled, (state, action: PayloadAction<any>) => {
//         console.log(action, "slice");
//         state.loading = false;
//         state.loggedInSession = true;
//       })
//       .addCase(UserLogin.rejected, (state) => {
//         state.loading = false;
//       })

//       // Logout
//       .addCase(authLogout, (state) => {
//         state.isAuthenticated = false;
//         state.user = null;
//         localStorage.removeItem("userInfo");
//       })

//       // Send OTP
//       .addCase(UserSendOTP.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(UserSendOTP.fulfilled, (state, action: PayloadAction<any>) => {
//         state.loading = false;
//         state.isAuthenticated = true;
//         state.user = action.payload.user;
//         state.loggedInSession = false;
//         localStorage.setItem("userInfo", JSON.stringify(action.payload.user));
//       })
//       .addCase(UserSendOTP.rejected, (state) => {
//         state.loading = false;
//       })

//       // Forget Password
//       .addCase(UserForgetPassword.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(UserForgetPassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(UserForgetPassword.rejected, (state) => {
//         state.loading = false;
//       })

//       // Reset Password
//       .addCase(UserResetPassword.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(UserResetPassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(UserResetPassword.rejected, (state) => {
//         state.loading = false;
//       })

//       // Verify Email
//       .addCase(UserVerifyEmail.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(UserVerifyEmail.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(UserVerifyEmail.rejected, (state) => {
//         state.loading = false;
//       })

//       // User Register
//       .addCase(UserRegister.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(UserRegister.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(UserRegister.rejected, (state) => {
//         state.loading = false;
//       })

//       // Change Password
//       .addCase(UserChangePassword.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(UserChangePassword.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(UserChangePassword.rejected, (state) => {
//         state.loading = false;
//       });
//   },
// });

// // Export actions and reducer
// export const {} = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchFilterBlogs } from "./blogActions";

// Define types for the state and parameters
export interface Author {
  _id: string;
  name: string;
  email: string;
}
export interface lang {
  english: { title: string; content: string };
  amharic: { title: string; content: string };
}
interface Blog {
  _id: string;
  lang: lang;
  category: string;
  content: string;
  created: string;
  createdAt: string;
  isPublished: boolean;
  author: Author;
}

interface BlogState {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  totalBlogs: number; // Total number of blogs (for pagination)
  currentPage: number; // Current page number
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null,
  totalBlogs: 0,
  currentPage: 1,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch all blogs initially
    builder.addCase(SearchFilterBlogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(SearchFilterBlogs.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload.blogs; // Update blogs with filtered results
      state.totalBlogs = action.payload.totalBlogs; // Update total count
      state.currentPage = action.payload.currentPage; // Update current page
    });
    builder.addCase(SearchFilterBlogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default blogSlice.reducer;
