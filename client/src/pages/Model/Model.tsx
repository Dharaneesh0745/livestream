import React, { useState } from 'react';
import axios from 'axios'; // Axios for API calls

const Model = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // State for storing selected image
  const [responseData, setResponseData] = useState<any>(null); // State for storing API response
  const [loading, setLoading] = useState(false); // Loading state

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Handle image submission to backend
  const handleImageSubmit = async () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // Replace with your backend API URL
      const response = await axios.post('http://localhost:8000/ollama', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Store response data
      setResponseData(response.data.modelResponse);
      setLoading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setLoading(false);
    }
  };

  const formatResponse = (data: string) => {
    // Split the response string by newlines for better line-by-line rendering
    const lines = data.split('\n');
    return lines.map((line, index) => {
      // Check if the line is a title (i.e., wrapped in '**')
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="mt-4">
            <h3 className="text-lg font-medium text-blue-700">{line.replace(/\*\*/g, '')}</h3>
          </div>
        );
      }
      // Otherwise, treat it as normal text
      return (
        <div key={index} className="mt-2">
          <p className="text-gray-700">{line}</p>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Image</h1>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Select an Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-3"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center mb-6">
          <button
            onClick={handleImageSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-500 transition"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Upload Image'}
          </button>
        </div>

        {/* Response Section */}
        <div>
          {responseData && (
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-green-700">Model Response:</h2>
              <div className="overflow-auto max-h-60 mt-2">
                {formatResponse(responseData)}
              </div>

              {/* If the response contains an image URL, display the image */}
              {responseData.imageUrl && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-700">Uploaded Image:</h3>
                  <img
                    src={responseData.imageUrl}
                    alt="Uploaded"
                    className="mt-2 max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Model;
