import { API_URL } from '@/app/config';
import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
const DownloadButton = ({ imageId }) => {
  const router = useRouter();
  const handleDownload = async () => {
    try {
      // console.log('Downloading image with ID:', imageId);
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
      router.push('/upload');
    } catch (err) {
      // console.error('Download error:', err);
      if (err.response) {

        // console.error('Error response:', err.response.data);
        alert(`Download failed: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        // console.error('Error request:', err.request);
        alert('Download failed: No response from server');
      } else {
    
        // console.error('Error message:', err.message);
        alert('Download failed: Please try again');
      }
    }
  };

  return (
    <button 
      onClick={handleDownload} 
      className="mt-30 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Download Image
    </button>
  );
};

export default DownloadButton;
