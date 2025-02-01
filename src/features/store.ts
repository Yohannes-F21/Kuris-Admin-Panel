import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";

// import dataReducer from "./features/dataSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
    // Add other reducers if needed, e.g., posts: postsReducer
  },
});

// Export the store and its types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
