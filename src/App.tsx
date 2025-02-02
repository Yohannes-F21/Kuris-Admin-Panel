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
import OTPScreen from "./pages/OTPScreen";
import { loader as blogLoader } from "./pages/BlogListPage";
import ResetPassword from "./pages/ResetPassword";

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
    path: "/dashboard",
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
        element: <DashboardPage />,
      },
      {
        path: "/dashboard/blogs",
        element: <BlogListPage />,
        loader: blogLoader,
      },
      {
        path: "/dashboard/blogs/new",
        element: <BlogEditorPage />,
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
  return <RouterProvider router={router} />;
}
