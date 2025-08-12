// frontend/src/app/dashboard/admin/inquiries/page.js
'use client';
import React, { useState, useEffect } from 'react';
// useRouter and useAuth are handled by AdminLayout
import InquiryItem from '@/components/InquiryItem';
import fetcher from '@/lib/api';

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, [filterStatus]); // Re-fetch on filter change

  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher('/admin/inquiries');
      let filteredData = data;
      if (filterStatus === 'responded') {
        filteredData = data.filter(inq => inq.response !== null && inq.response !== '');
      } else if (filterStatus === 'pending') {
        filteredData = data.filter(inq => inq.response === null || inq.response === '');
      }
      setInquiries(filteredData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center p-8 text-xl text-gray-700">Loading inquiries...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-red-500 text-xl">Error: {error}</p>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Manage Customer Inquiries</h2>

      <div className="mb-8 flex justify-end">
        <label htmlFor="inquiry-filter" className="sr-only">Filter Inquiries</label>
        <select
          id="inquiry-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out"
        >
          <option value="all">All Inquiries</option>
          <option value="pending">Pending Inquiries</option>
          <option value="responded">Responded Inquiries</option>
        </select>
      </div>

      {inquiries.length === 0 ? (
        <p className="text-gray-600 text-lg">No inquiries found for the selected filter.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {inquiries.map(inquiry => (
            <InquiryItem key={inquiry.id} inquiry={inquiry} onRespond={fetchInquiries} />
          ))}
        </div>
      )}
    </>
  );
}