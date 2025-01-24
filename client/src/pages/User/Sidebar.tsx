// Sidebar.tsx
import React from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, toggleSidebar, handleLogout }) => {
  return (
    <div
      className={`bg-gray-800 text-white w-64 p-4 z-[100] transform transition-transform duration-300 lg:static lg:translate-x-0 lg:h-screen ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:block fixed inset-0 lg:h-auto`}
    >
      <h2 className="text-xl text-center lg:text-2xl mt-1.5 mb-5 font-semibold">
        Social Reports
      </h2>
      <div className="mt-5 mb-7 hidden lg:block">
        <hr />
      </div>
      <ul className="space-y-4 text-center">
        <li>
          <a
            href="/home"
            className="block py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-300"
          >
            Home
          </a>
        </li>
      </ul>
      <ul className="space-y-4 mt-4 text-center">
        <li>
          <a
            href="/post"
            className="block py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-300"
          >
            Create Post
          </a>
        </li>
      </ul>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md w-full"
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
