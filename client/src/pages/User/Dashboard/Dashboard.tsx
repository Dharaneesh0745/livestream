import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Ensure to include the Leaflet styles

const Dashboard = () => {
  const { user, setUser, logout } = useAuth(); // Ensure `setUser` is available in useAuth
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const [loading, setLoading] = useState(true); // Loading state
  const [posts, setPosts] = useState([]); // State to store posts data

  useEffect(() => {
    const fetchUserData = async () => {
      if (user === null) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
        } else {
          navigate("/");
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate, setUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/users/user-reports");
        const data = await response.json();
        console.log(data)
        setPosts(data); // Assuming the API returns an array of posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/");
  };

  const openModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="flex-2 flex flex-col w-full bg-gray-100 overflow-auto pt-16 lg:pt-0">
        <header className="bg-gray-800 text-white p-4 fixed w-full top-0 z-50 flex justify-between items-center">
          <h1 className="text-lg lg:text-xl">Welcome: {user?.name}</h1>
          <button
            onClick={toggleSidebar}
            className="text-white text-2xl lg:hidden focus:outline-none"
          >
            {isSidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </header>
        <div className="flex-1 p-4 md:mt-16 -mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
  posts.map((post, index) => (
    index !== 0 && (  // Only render if index is not 0
      <div
        key={index}
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
        onClick={() => openModal(post)}
      >
        <div className="p-4">
          <h2 className="font-semibold text-lg">{post.email}</h2>
        </div>
        <img
          src={`http://localhost:8000${post.apiKey}`}
          alt={post.ai_description}
          className="w-full h-48 sm:h-64 object-cover"
        />
      </div>
    )
  ))
) : (
  <p>No posts available</p>
)}

          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPost && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-lg w-full sm:w-96 shadow-lg overflow-hidden max-h-[80vh]">
      <div className="p-4">
        <h2 className="font-semibold text-xl">{selectedPost.email}</h2>
        <p className="text-gray-500 text-sm">{selectedPost.date_time}</p>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(80vh-160px)]"> {/* Make content scrollable */}
        <img
          src={`http://localhost:8000${selectedPost.apiKey}`}
          alt={selectedPost.ai_description}
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <p className="text-gray-700">{selectedPost.ai_description}</p>
        </div>
        
        {/* Leaflet Map */}
        {selectedPost.latitude && selectedPost.longitude && (
          <div className="h-64 w-full">
            <MapContainer
              center={[selectedPost.latitude, selectedPost.longitude]} // Center the map on the lat/lon
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[selectedPost.latitude, selectedPost.longitude]}>
                <Popup>{selectedPost.email}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>

      <div className="p-4 flex justify-end">
        <button
          onClick={closeModal}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboard;
