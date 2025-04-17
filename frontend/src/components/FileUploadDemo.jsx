"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";
import { API_URL } from "@/app/config";
import { useRouter } from "next/navigation";

// Configure axios defaults
axios.defaults.withCredentials = true;

export function FileUploadDemo() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);

  const handleFileUpload = (files) => {
    setFiles(files);
    setError(null);
    setSuccess(null);
    setProcessedImageUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Starting upload process');
    
    if (files.length === 0) {
      setError("Please select an image.");
      return;
    }

    const file = files[0];
    console.log('Selected file:', file);
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and JPG files are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    console.log('FormData created with file');

    setLoading(true);
    setError(null);
    setSuccess(null);
    setProcessedImageUrl(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please log in first");
        setLoading(false);
        return;
      }

      console.log('Sending request to:', `${API_URL}/main/upload`);
      const response = await axios.post(`${API_URL}/main/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": token
        }
      });
      console.log('Response received:', response.data);

      // Navigate to download page with the image data
      router.push(`/download?imageId=${response.data.image_id}`);
    } catch (err) {
      setLoading(false);
      console.error('Full error details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      if (err.response) {
        if (err.response.status === 404 && err.response.data.msg === "You are not logged in") {
          setError("Please log in first");
        } else {
          setError(err.response.data.message || "Upload failed. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
      <FileUpload onChange={handleFileUpload} />
      
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading || files.length === 0}
        >
          {loading ? "Processing..." : "Upload Image"}
        </button>
      </div>
      
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {success && <div className="text-green-500 mt-2">{success}</div>}
      
      {processedImageUrl && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Processed Image:</h3>
          <img 
            src={processedImageUrl} 
            alt="Processed" 
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
