import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from './../Sidebar';
import Header from './../Header';
import MapComponent from './MapComponent';

const AdminDashboard = () => {
  const { admin, setAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (admin === null) {
        const storedAdmin = localStorage.getItem('admin');
        if (storedAdmin) {
          const parsedAdmin = JSON.parse(storedAdmin);
          setAdmin(parsedAdmin);
          setLoading(false);
        } else {
          navigate('/');
        }
      } else {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [admin, navigate, setAdmin]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 ml-64 mt-20 bg-gray-100 h-screen overflow-y-auto">
        <Header />
        <div className="flex-1 p-2.5 bg-gray-100">
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;