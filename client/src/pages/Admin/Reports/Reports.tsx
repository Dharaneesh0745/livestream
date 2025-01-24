import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './../Sidebar'; // Adjust the import path if necessary
import Header from './../Header'; // Adjust the import path if necessary

// Define the company data type
type Company = {
  _id: string;
  name: string;
  address: string;
  email: string;
  industry_type: string;
  tds_value: number;
  turbidity_value: number;
  user_type: string;
};

const AdminReports = () => {
  const [companies, setCompanies] = useState<Company[]>([]); // State to store companies data

  useEffect(() => {
    // Fetch company data when component mounts
    axios
      .get('http://localhost:8000/api/v1/users/companies') // Replace with your actual API endpoint
      .then((response) => {
        setCompanies(response.data); // Update state with company data
      })
      .catch((error) => {
        console.error('Error fetching company data:', error);
      });
  }, []);

  // Handle action (like view, edit, delete)
  const handleAction = (action: string, companyId: string) => {
    console.log(`Action: ${action} for company with ID: ${companyId}`);
    // Add logic to handle view, edit, or delete actions here
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Company Reports</h1>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full table-auto border-collapse border border-gray-200 text-gray-800">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-center">
                  <th className="border-b px-6 py-3">Name</th>
                  <th className="border-b px-6 py-3">Address</th>
                  <th className="border-b px-6 py-3">Email</th>
                  <th className="border-b px-6 py-3">Industry</th>
                  <th className="border-b px-6 py-3">TDS Value</th>
                  <th className="border-b px-6 py-3">Turbidity Value</th>
                  <th className="border-b px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {companies.map((company, index) => (
                  <tr
                  key={company._id}
                  className={`${
                    company.tds_value > 50
                      ? 'bg-red-100' // Danger color when TDS is greater than 150
                      : index % 2 === 0
                      ? 'bg-gray-50' // Alternate row color
                      : 'bg-white'
                  }  transition-all duration-200`}
                >
                    <td className="border-b px-6 py-4">{company.name}</td>
                    <td className="border-b px-6 py-4">{company.address}</td>
                    <td className="border-b px-6 py-4">{company.email}</td>
                    <td className="border-b px-6 py-4">{company.industry_type}</td>
                    <td className="border-b px-6 py-4">{company.tds_value} mg/L</td>
                    <td className="border-b px-6 py-4">{company.turbidity_value} NTU</td>
                    <td className="border-b px-6 py-4">
                      {/* Action Buttons */}
                      <button
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700 transition duration-200"
                        onClick={() => handleAction('View', company._id)}
                      >
                        View
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

export default AdminReports;
