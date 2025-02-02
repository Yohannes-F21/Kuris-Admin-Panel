import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { authLogout } from "../../features/authActions";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector(
  //   (state: any) => state.auth.isAuthenticated
  // );
  return (
    <main>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div
        className={`
        fixed top-0 left-0 h-full bg-white shadow-lg
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static
        w-64 z-40
      `}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold">Kuri Admin</h1>
        </div>
        <nav className="px-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({
              isActive,
            }) => `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/dashboard/blogs"
            className={({
              isActive,
            }) => `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <FileText size={20} />
            <span>View Blogs</span>
          </NavLink>
          <NavLink
            to="/dashboard/blogs/new"
            className={({
              isActive,
            }) => `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors
              ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
          >
            <PlusCircle size={20} />
            <span>Create Blog</span>
          </NavLink>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 w-full px-3 py-2">
            <LogOut size={20} />
            <button onClick={() => dispatch(authLogout())}>Logout</button>
          </button>
        </div>
      </div>
    </main>
  );
}
