import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { LoginPage } from "./components/auth/LoginPage";
import { MainLayout } from "./components/layout/MainLayout";
import Error from "./pages/Error";
import { DashboardPage } from "./pages/DashboardPage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogEditorPage } from "./pages/BlogEditorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "/blogs",
        element: <BlogListPage />,
      },
      {
        path: "/blogs/new",
        element: <BlogEditorPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <Error />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
