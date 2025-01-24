// Post.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext'; // Assuming you have a context for authentication
import Header from '../Header';
import Sidebar from '../Sidebar';

const Post = () => {
  const { user } = useAuth(); // Get the user from AuthContext
  const [formData, setFormData] = useState({
    latitude: null,
    longitude: null,
    apiKey: null, // This will store the image file name or URL
    email: '', // Initially empty email
  });

  const [imageData, setImageData] = useState(null); // For holding the image data (not uploaded, just captured)

  // UseEffect to set the email in formData once the user is available from context
  useEffect(() => {
    if (user && user.email) {
      setFormData((prevData) => ({
        ...prevData,
        email: user.email, // Set user email from context
      }));
    }
  }, [user]); // This effect will run when the user data changes

  // Function to handle image capture (from the user's camera)
  const handleImageCapture = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImageData(file); // Store file directly (not base64)
              };
              reader.readAsDataURL(file);
            }
          };
          input.click();

          // Update latitude and longitude in formData
          setFormData({
            ...formData,
            latitude,
            longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  // Function to handle form submission (when the user clicks the upload button)
  // const handleUpload = async () => {
  //   // Check if image is available
  //   if (!imageData) {
  //     alert('Please capture an image before uploading.');
  //     return;
  //   }



  //   // Form data to be sent to the server
  //   const dataToSubmit = {
  //     ...formData,
  //     // Add other form data if needed
  //   };

  //   // Upload image to FastAPI backend
  //   try {
  //     const formDataForUpload = new FormData();
  //     formDataForUpload.append('image', imageData); // Attach image file directly

  //     // Replace with your FastAPI endpoint
  //     const response = await fetch('http://localhost:8000/upload-image', {
  //       method: 'POST',
  //       body: formDataForUpload, // Sending FormData directly to backend
  //     });

  //     const responseData = await response.json();

  //     if (responseData.success) {
  //       // Store the returned file name (or URL) in formData
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         apiKey: responseData.fileName, // Store the file name returned from FastAPI
  //       }));
      
  //       alert('Upload successful!');

  //       console.log(formData)
      
  //       // Call backend API to save formData to the database
  //       try {
  //         const response = await fetch('http://localhost:8000/api/v1/users/save-report',{
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(formData),
  //         });
      
  //         const result = await response.json();
      
  //         if (result.success) {
  //           alert('Report saved successfully!');
  //         } else {
  //           alert('Failed to save report!');
  //         }
  //       } catch (error) {
  //         console.error('Error saving report:', error);
  //         alert('There was an error saving the report.');
  //       }
  //     } else {
  //       alert('Upload failed!');
  //     }
      
  //   } catch (error) {
  //     console.error('Error uploading image:', error);
  //     alert('There was an error uploading the image.');
  //   }
  // };

  const handleUpload = async () => {
    // Check if image is available
    if (!imageData) {
      alert('Please capture an image before uploading.');
      return;
    }
  
    // Prepare the FormData to send the image
    const formDataForUpload = new FormData();
    formDataForUpload.append('image', imageData); // Attach the image file directly
  
    try {
      // Step 1: Upload the image to FastAPI backend for processing
      const uploadResponse = await fetch('http://localhost:8000/upload-image', {
        method: 'POST',
        body: formDataForUpload, // Sending the image file directly
      });
  
      const uploadData = await uploadResponse.json();
  
      if (uploadData.success) {
        // Step 2: After image upload, interact with the LLaVA model
        const ollamaResponse = await fetch('http://localhost:8000/ollama', {
          method: 'POST',
          body: formDataForUpload, // Sending the same image to the LLaVA model
        });
  
        const ollamaData = await ollamaResponse.json();
  
        if (ollamaData.success) {
          console.log('Response from LLaVA Model:', ollamaData.modelResponse);
  
          // Step 3: Store the returned file name (or URL) and other form data
          const dataToSubmit = {
            ...formData,
            apiKey: uploadData.fileName,
            ai_description: ollamaData.modelResponse,
          };
  
          // Step 4: Call backend API to save the report in the database
          try {
            const saveResponse = await fetch('http://localhost:8000/api/v1/users/save-report', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataToSubmit),
            });
  
            const result = await saveResponse.json();
  
            if (result.success) {
              alert('Report saved successfully!');
            } else {
              alert('Failed to save report!');
            }
          } catch (error) {
            console.error('Error saving report:', error);
            alert('There was an error saving the report.');
          }
        } else {
          alert('Failed to upload image or process through LLaVA model!');
        }
      } else {
        alert('Upload failed!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('There was an error uploading the image.');
    }
  };
  
  

  // Render the image based on the file name or URL in formData.apiKey
  const imageUrl = formData.apiKey ? `http://localhost:8000${formData.apiKey}` : null;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 z-10">
        <Sidebar />
      </div>

      <div className="flex-1 bg-gray-100 ml-64 overflow-y-auto">
        {/* Header */}
        <Header />

        <div className="container mx-auto p-8 mt-10">
          <h2 className="text-3xl font-semibold mb-6">Post Image</h2>

          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            <button
              onClick={handleImageCapture}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-500 mb-4"
            >
              Capture Image and Location
            </button>

            {/* Display captured image (if any) */}
            {imageData && <img src={URL.createObjectURL(imageData)} alt="Captured" className="max-w-full h-auto mb-4" />}

            {/* User Email (Automatically fetched from AuthContext) */}
            <input
              type="email"
              value={formData.email}
              readOnly
              disabled
              placeholder="Email from context"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md"
            />

            {/* Button to trigger the upload */}
            <button
              onClick={handleUpload}
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-500"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
