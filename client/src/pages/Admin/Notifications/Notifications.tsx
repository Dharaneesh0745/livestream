import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './../Sidebar'; // Adjust the import path if necessary
import Header from './../Header'; // Adjust the import path if necessary

// Define the notification data type
type Notification = {
  _id: string;
  name: string;
  email: string;
  message: string;
  time: string; // Assuming time is a string (ISO format or any other readable format)
};

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications when component mounts
    axios
      .get('http://localhost:8000/api/v1/notifications') // Replace with your actual API endpoint
      .then((response) => {
        setNotifications(response.data); // Update state with notification data
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error);
      });
  }, []);

  // Handle sending a warning action
  const handleSendWarning = (notificationId: string) => {
    console.log(`Sending warning for notification ID: ${notificationId}`);
    // Add logic to send warning here, such as making an API call
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 mt-16 bg-gray-100 h-screen overflow-y-auto">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="p-6  flex-1 overflow-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Notifications</h1>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-gray-800">
            <thead>
            <tr className="bg-gray-200 text-gray-700 text-center">
                <th className="border-b px-4 py-2">Name</th>
                <th className="border-b px-4 py-2">Email</th>
                <th className="border-b px-4 py-2">Message</th>
                <th className="border-b px-4 py-2">Time</th>
                <th className="border-b px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification._id}>
                  <td className="border-b px-4 py-2">{notification.name}</td>
                  <td className="border-b px-4 py-2">{notification.email}</td>
                  <td className="border-b px-4 py-2">{notification.message}</td>
                  <td className="border-b px-4 py-2">{new Date(notification.time).toLocaleString()}</td>
                  <td className="border-b px-4 py-2">
                    {/* Action Button */}
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded"
                      onClick={() => handleSendWarning(notification._id)}
                    >
                      Send Warning
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;
