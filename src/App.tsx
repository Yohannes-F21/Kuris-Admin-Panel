import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "./components/auth/LoginPage";
import { MainLayout } from "./components/layout/MainLayout";
import Error from "./pages/Error";
import { DashboardPage } from "./pages/DashboardPage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogEditorPage } from "./pages/BlogEditorPage";
import { BlogCreatorPage } from "./pages/BlogCreatorPage";
// import { loader as blogLoader } from "./pages/BlogListPage";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import { CheckSession } from "./features/authActions.ts";
import { useAppDispatch, useAppSelector } from "./features/hooks";
import { RegisterPage } from "./components/auth/RegisterPage";
import VerifyEmail from "./pages/VerifyEmail";
import { Toaster } from "react-hot-toast";

// Route Guard Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, sessionChecked } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!sessionChecked) {
      dispatch(CheckSession());
    }
  }, [dispatch, sessionChecked]);

  if (!sessionChecked || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, sessionChecked } = useAppSelector(
    (state) => state.auth,
  );

  if (!sessionChecked && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
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
        element: <Navigate to="/dashboard" replace />,
      },
      {
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
        <Navigate to="/login" replace />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "/verify-email",
    element: (
      <PublicRoute>
        <VerifyEmail />
      </PublicRoute>
    ),
    errorElement: <Error />,
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
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm font-medium",
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
}
