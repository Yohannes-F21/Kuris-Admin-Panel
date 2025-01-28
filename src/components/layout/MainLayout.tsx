import { Sidebar } from "./Sidebar";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

// interface MainLayoutProps {
//   children: React.ReactNode;
// }
export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <main className="flex-1 p-8 lg:max-w-[70%] lg:mx-auto">
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
}
