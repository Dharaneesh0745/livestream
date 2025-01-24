import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Sidebar from '../Sidebar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default Leaflet icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AdminUserReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  // Fetch reports data from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/users/user-reports', {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setReports(data); // Assuming backend returns an array of reports
        } else {
          console.error('Failed to fetch reports:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 mt-3 bg-gray-100 h-screen overflow-y-auto">
      {/* Header */}
        <Header />

        <div className="container mx-auto p-8 h-screen mt-10">
          <h2 className="text-3xl font-semibold mb-6">User Reports</h2>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">Report ID</th>
                  <th className="border border-gray-300 px-4 py-2">User Email</th>
                  <th className="border border-gray-300 px-4 py-2">Timestamp</th>
                  <th className="border border-gray-300 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
              {reports.length > 0 ? (
  reports.map((report) => (
    <tr
      key={report._id}
      className={`${
        report.seen ? 'bg-white'  : 'bg-red-100' // Apply danger color if seen is true
      } text-center transition-all duration-200`}
    >
      <td className="border border-gray-300 px-4 py-2">{report._id}</td>
      <td className="border border-gray-300 px-4 py-2">{report.email}</td>
      <td className="border border-gray-300 px-4 py-2">{new Date(report.date_time).toLocaleString()}</td>
      <td className="border border-gray-300 px-4 py-2">
        <button
          onClick={() => setSelectedReport(report)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
        >
          View
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan={4} className="text-center py-2">
      No reports available.
    </td>
  </tr>
)}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedReport && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[75vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Report Details</h3>
      <div className="mb-4">
        <p><strong>Email:</strong> {selectedReport.email}</p>
        <p><strong>Timestamp:</strong> {new Date(selectedReport.date_time).toLocaleString()}</p>
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-medium mb-2">Location:</h4>
        <MapContainer
          center={[selectedReport.latitude, selectedReport.longitude]}
          zoom={13}
          style={{ height: '300px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[selectedReport.latitude, selectedReport.longitude]}>
            <Popup>
              User: {selectedReport.email}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="mb-4">
        <h4 className="text-lg font-medium mb-2">Uploaded Image:</h4>
        {selectedReport.apiKey ? (
          <img
            src={`http://localhost:8000${selectedReport.apiKey}`}
            alt="Uploaded"
            className="max-w-full h-auto"
          />
        ) : (
          <p>No image uploaded.</p>
        )}
      </div>
      <div className="mb-4 m-0.5 bg-gray-200 rounded-lg">
        <div className='p-2 text-center'>
        <p className="text-md font-semibold mb-2">AI Description:</p>
        {selectedReport.ai_description ? (
          <span className='p-2'>{selectedReport.ai_description}</span>
        ) : (
          <p>No AI Description generated!</p>
        )}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setSelectedReport(null)}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500"
        >
          Close
        </button>
        {!selectedReport.seen && (
          <button
            onClick={async () => {
              try {
                const response = await fetch(
                  `http://localhost:8000/api/v1/users/user-reports/${selectedReport._id}/seen`,
                  { method: 'PUT' }
                );
                if (response.ok) {
                  const updatedReports = reports.map((report) =>
                    report._id === selectedReport._id ? { ...report, seen: true } : report
                  );
                  setReports(updatedReports);
                  setSelectedReport({ ...selectedReport, seen: true });
                  alert('Report marked as seen.');
                } else {
                  console.error('Failed to update report:', response.statusText);
                }
              } catch (error) {
                console.error('Error updating report:', error);
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
          >
            Seen
          </button>
        )}
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default AdminUserReports;
