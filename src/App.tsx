import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { LoginPage } from "./components/auth/LoginPage";
import { MainLayout } from "./components/layout/MainLayout";
import Error from "./pages/Error";
import { DashboardPage } from "./pages/DashboardPage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogEditorPage } from "./pages/BlogEditorPage";
import { BlogCreatorPage } from "./pages/BlogCreatorPage";
import OTPScreen from "./pages/OTPScreen";
// import { loader as blogLoader } from "./pages/BlogListPage";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import { CheckSession } from "./features/authActions.ts";
import { useAppDispatch } from "./features/hooks";

// Route Guard Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  if (isAuthenticated) {
    // Redirect to dashboard if authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Define Routes
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    // element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/blogs",
        element: <BlogListPage />,
        // loader: blogLoader,
      },
      {
        path: "/new-blog",
        element: <BlogCreatorPage />,
      },
      {
        path: "/edit-blog/:id",
        element: <BlogEditorPage />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "verify-otp/*",
    element: (
      <PublicRoute>
        <OTPScreen />
      </PublicRoute>
    ),
  },
  {
    path: "reset-password*",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
]);

export function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(CheckSession());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
