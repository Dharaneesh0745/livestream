// Header.tsx
import React from "react";
import { FiMenu, FiX } from "react-icons/fi";

interface HeaderProps {
  userName: string;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, isSidebarOpen, toggleSidebar }) => {
  return (
    <header className="bg-gray-800 text-white p-4 fixed w-full top-0 z-50 flex justify-between items-center">
      <h1 className="text-lg lg:text-xl">Welcome: {userName}</h1>
      <button
        onClick={toggleSidebar}
        className="text-white text-2xl lg:hidden focus:outline-none"
      >
        {isSidebarOpen ? <FiX /> : <FiMenu />}
      </button>
    </header>
  );
};

export default Header;
