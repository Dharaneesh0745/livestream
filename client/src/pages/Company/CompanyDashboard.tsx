import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom'; // To navigate on logout

const CompanyDashboard = () => {
  const { company, logout } = useAuth(); // Access company data and logout function from AuthContext
  const navigate = useNavigate();

  // Optionally handle loading state if company data takes time to load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company) {
      setLoading(false); // Set loading to false once company data is available
    }
    console.log(company)
  }, [company]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    ); // Show loading state if data is still being fetched
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">No company data available</div>
      </div>
    ); // Handle the case when no company data is available
  }

  const handleLogout = () => {
    logout(); // Perform logout action from AuthContext
    navigate('/'); // Redirect user to login page after logout
  };

  const isTdsHigh = company.tds_value > 50; // Check if TDS value is high

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8 relative">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition"
        >
          Logout
        </button>

        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Company Dashboard
        </h1>

        {/* Warning if TDS Value is High */}
        {isTdsHigh && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
            <h2 className="text-xl font-semibold text-yellow-700">Warning: High TDS Value!</h2>
            <p className="text-lg text-gray-700">
              The TDS (Total Dissolved Solids) value for your company is above the safe limit (150 mg/L). Please review the quality of your water.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Company Info Card */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Company Information</h2>
            <p className="text-lg text-gray-700">
              <strong className="text-blue-500">Company Name:</strong> {company.name}
            </p>
            <p className="text-lg text-gray-700">
              <strong className="text-blue-500">Email:</strong> {company.email}
            </p>
            <p className="text-lg text-gray-700">
              <strong className="text-blue-500">Industry:</strong> {company.industry_type}
            </p>
          </div>

          {/* Company Location Card */}
          <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Location Details</h2>
            <p className="text-lg text-gray-700">
              <strong className="text-green-500">Address:</strong> {company.address}
            </p>
            <p className="text-lg text-gray-700">
              <strong className="text-green-500">TDS Value:</strong> {company.tds_value} mg/L
            </p>
            <p className="text-lg text-gray-700">
              <strong className="text-green-500">Turbidity Value:</strong> {company.turbidity_value} NTU
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">TDS Value</h3>
            <p className="text-lg text-gray-700">{company.tds_value} mg/L</p>
          </div>
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Turbidity Value</h3>
            <p className="text-lg text-gray-700">{company.turbidity_value} NTU</p>
          </div>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-purple-600 mb-2">Industry Type</h3>
            <p className="text-lg text-gray-700">{company.industry_type}</p>
          </div>
        </div>

        {/* Additional Details */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Information</h2>
          <p className="text-lg text-gray-700">
            Here you can add more information about the company, such as a description,
            achievements, certifications, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
