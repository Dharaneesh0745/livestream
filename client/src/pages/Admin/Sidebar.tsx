import React, { useState } from 'react';
import { FaTachometerAlt, FaFileAlt, FaBell, FaUsers, FaUserPlus, FaBuilding } from 'react-icons/fa'; // Import icons

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab); // Update active tab
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-800 p-2 text-white shadow-lg z-10 overflow-y-auto">
      <h2 className="text-2xl mt-1.5 font-semibold">Admin Dashboard</h2>
      <div className="mt-5 mb-7">
        <hr />
      </div>
      <ul className="space-y-4">
        <li>
          <a
            href="/admin/dashboard"
            onClick={() => handleTabClick("dashboard")}
            className={`flex items-center py-2 px-4 rounded-md ${activeTab === "dashboard" ? "bg-blue-500 text-white" : "text-gray-400"} hover:bg-blue-300`}
          >
            <FaTachometerAlt className="mr-3" /> {/* Dashboard Icon */}
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="/admin/reports"
            onClick={() => handleTabClick("reports")}
            className={`flex items-center py-2 px-4 rounded-md ${activeTab === "reports" ? "bg-blue-500 text-white" : "text-gray-400"} hover:bg-blue-300`}
          >
            <FaFileAlt className="mr-3" /> {/* Reports Icon */}
            Reports
          </a>
        </li>
        <li>
          <a
            href="/admin/notifications"
            onClick={() => handleTabClick("notifications")}
            className={`flex items-center py-2 px-4 rounded-md ${activeTab === "notifications" ? "bg-blue-500 text-white" : "text-gray-400"} hover:bg-blue-300`}
          >
            <FaBell className="mr-3" /> {/* Notifications Icon */}
            Notifications
          </a>
        </li>
        <li>
          <a
            href="/admin/users-reports"
            onClick={() => handleTabClick("user-reports")}
            className={`flex items-center py-2 px-4 rounded-md ${activeTab === "user-reports" ? "bg-blue-500 text-white" : "text-gray-400"} hover:bg-blue-300`}
          >
            <FaUsers className="mr-3" /> {/* User Reports Icon */}
            User Reports
          </a>
        </li>
        <li>
          <a
            href="/admin/add-admin"
            onClick={() => handleTabClick("add-admin")}
            className={`flex items-center py-2 px-4 rounded-md ${activeTab === "add-admin" ? "bg-blue-500 text-white" : "text-gray-400"} hover:bg-blue-300`}
          >
            <FaUserPlus className="mr-3" /> {/* Add Admin Icon */}
            Add Admin
          </a>
        </li>
        <li>
          <a
            href="/admin/add-company"
            onClick={() => handleTabClick("add-company")}
            className={`flex items-center py-2 px-4 rounded-md ${activeTab === "add-company" ? "bg-blue-500 text-white" : "text-gray-400"} hover:bg-blue-300`}
          >
            <FaBuilding className="mr-3" /> {/* Add Company Icon */}
            Add Company
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
