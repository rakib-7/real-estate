// src/components/InquiryItem.js
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
//import { SimulatedLink } from '@/hooks/useSimulatedRouter'; // Correct path
import Button from '@/components/ui/Button'; // Correct path
import fetcher from '@/lib/api';
// fetcher is globally available in this context

const InquiryItem = ({ inquiry, onRespond }) => {
  const [response, setResponse] = useState(inquiry.response || '');
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState('');

  const handleResponseSubmit = async () => {
    setIsResponding(true);
    setError('');
    try {
      await fetcher(`/admin/inquiries/${inquiry.id}/respond`, {
        method: 'PUT',
        body: JSON.stringify({ response }),
      });
      alert('Response sent successfully!');
      onRespond(); // Refresh inquiries list
    } catch (err) {
      setError(err.message);
    } finally {
      setIsResponding(false);
    }
  };

  return (
     <div className="bg-white p-6 rounded-2xl shadow-md mb-6 border border-gray-200">
      <p className="text-xl font-bold text-gray-800 mb-2">Inquiry from: <span className="text-indigo-600">{inquiry.user?.email || 'N/A'}</span></p>
      <p className="text-gray-700 mt-1 mb-3">Regarding: <Link href={`/properties/${inquiry.property?.id}`} className="text-blue-600 hover:underline font-semibold">{inquiry.property?.title} ({inquiry.property?.location})</Link></p>
      <p className="text-gray-700 mt-2">Message: "{inquiry.message}"</p>
      <p className="text-gray-500 text-sm">Sent on: {new Date(inquiry.createdAt).toLocaleString()}</p>

      {inquiry.response ? (
        <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">
          <p className="font-semibold">Admin Response:</p>
          <p>{inquiry.response}</p>
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows="3"
            placeholder="Type your response here..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
          ></textarea>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <Button onClick={handleResponseSubmit} disabled={isResponding} className="mt-2 bg-green-600 hover:bg-green-700 text-white">
            {isResponding ? 'Sending...' : 'Send Response'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InquiryItem;