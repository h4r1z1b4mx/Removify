// components/DownloadButton.tsx

import { API_URL } from '@/app/config';
import React from 'react';
import axios from 'axios';

const DownloadButton = ({ imageId }) => {
  const handleDownload = async () => {
    try {
      console.log('Downloading image with ID:', imageId);
      const response = await axios.get(`${API_URL}/main/download/${imageId}`, {
        headers: {
          'Authorization': `${localStorage.getItem('token') || ''}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${imageId}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', err.response.data);
        alert(`Download failed: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Error request:', err.request);
        alert('Download failed: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        alert('Download failed: Please try again');
      }
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Download Image
    </button>
  );
};

export default DownloadButton;
