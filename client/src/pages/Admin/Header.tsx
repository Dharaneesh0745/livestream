import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { admin, logout } = useAuth(); // Get admin data from context
  const navigate = useNavigate(); // useNavigate hook

  const handleLogout = () => {
    // You should call the logout function from your context here
    logout();
    navigate('/'); // Navigate to login page after logout
  };

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow justify-between z-10 flex items-center px-4">
      <h2 className="text-xl">{admin?.name}</h2> {/* Display admin's name */}
      <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded text-white">
        Logout
      </button>
    </div>
  );
};

export default Header;
