import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // Leaflet map components
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import axios from 'axios'; // Import Axios for API calls
import L from 'leaflet';

const MapComponent = () => {
  const [companyData, setCompanyData] = useState<any[]>([]); // State to store company data
  const [userReportData, setUserReportData] = useState<any[]>([]); // State to store user report data

  // Create a red marker using L.divIcon for a customizable and reliable solution
  const getRedMarkerIcon = (index: number) => {
    return new L.DivIcon({
      className: 'red-marker',
      html: `<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white; text-align: center; font-size: 10px;">
      ${index+1}
    </div>`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -41],
    });
  };

  useEffect(() => {
    // Fetch company data from the API when the component mounts
    axios
      .get('http://localhost:8000/api/v1/users/companies') // Replace with your actual API endpoint
      .then((response) => {
        setCompanyData(response.data); // Update state with company data
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching company data:', error); // Handle error
      });

    // Fetch user report data from the API when the component mounts
    axios
      .get('http://localhost:8000/api/v1/users/user-reports') // Replace with your actual API endpoint
      .then((response) => {
        setUserReportData(response.data); // Update state with user report data
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user report data:', error); // Handle error
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="h-screen border border-gray-700">
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ width: '100%', height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Loop through company data and add markers */}
        {companyData.map((company, index) => (
          <Marker key={index} position={[company.latitude, company.longitude]}>
            <Popup>
              <div>
                <h1 className="font-bold text-center text-lg">{company.name}</h1>
                <p><strong>Address:</strong> {company.address}</p>
                <p><strong>Email:</strong> {company.email}</p>
                <p><strong>Industry:</strong> {company.industry_type}</p>
                <p><strong>TDS Value:</strong> {company.tds_value} mg/L</p>
                <p><strong>Turbidity Value:</strong> {company.turbidity_value} NTU</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Loop through user report data and add red markers */}
        {userReportData.map((report, index) => (
        // Conditionally render the Marker if report.seen is false
        !report.seen && (
          <Marker key={index} position={[report.latitude, report.longitude]} icon={getRedMarkerIcon(index)}>
            <Popup>
              <div>
                <h1 className="font-bold text-center text-lg">{report.name}</h1>
                <p><strong>Email:</strong> {report.email}</p>
              </div>
            </Popup>
          </Marker>
        )
      ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
