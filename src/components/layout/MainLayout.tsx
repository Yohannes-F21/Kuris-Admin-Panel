import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar Component - contains mobile toggle logic internally */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative overflow-y-auto h-screen">
        <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
