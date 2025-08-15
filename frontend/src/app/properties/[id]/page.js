// src/app/properties/[id]/page.js
'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Button from '@/components/ui/Button';
import { useRouter, useParams } from 'next/navigation'; // Correct import for router and params
import Link from 'next/link';
//import { formatPrice } from '@/lib/utils';
import { formatBdtPrice } from '@/lib/utils';
import fetcher, {API_BASE_URL} from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

//const API_BASE_URL = 'http://localhost:5000';

export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params; // Extract ID from path

  const { isAuthenticated, loading: authLoading } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        setLoading(true);
        setError(null);
        try {
          // Fetch property with its nested images
          const data = await fetcher(`/properties/${id}`);
          setProperty(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id]);

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please log in to submit an inquiry.');
      router.push('/login');
      return;
    }
    setInquiryStatus('loading');
    if (!inquiryMessage.trim()) {
      setInquiryStatus('error');
      alert('Please enter a message for your inquiry.');
      return;
    }

    try {
      await fetcher('/user/inquiries', {
        method: 'POST',
        body: JSON.stringify({ propertyId: parseInt(id), message: inquiryMessage }),
      });

      setInquiryStatus('success');
      setInquiryMessage('');
      alert('Your inquiry has been submitted successfully!');
    } catch (err) {
      setInquiryStatus('error');
      alert(err.message);
    }
  };

  const handleContactAdmin = () => {
        if (!isAuthenticated) {
            alert('Please log in to chat with an admin.');
            router.push('/login');
            return;
        }
        // Redirects the user to their dedicated chat page.
        router.push('/dashboard/user/inquiries');
    };

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please log in to bookmark properties.');
      router.push('/login');
      return;
    }

    try {
      await fetcher('/user/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ propertyId: parseInt(id) }),
      });

      alert('Property bookmarked successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading || authLoading) return <div className="text-center p-8 text-xl text-gray-700">Loading property details...</div>;
  if (error) return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
  if (!property) return <div className="text-center p-8 text-xl text-gray-700">Property not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* <Navbar /> */}
      <main className="container mx-auto p-8 flex-grow">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden md:flex">
          <div className="md:w-1/2">
            {/* Corrected to handle 'images' array from the backend */}
            {property.images && property.images.length > 0 ? (
              <img
                // src={`http://localhost:5000${property.images[0].url}`} // Access 'url' property of the image object
                src={`${API_BASE_URL}${property.images[0].url}`}
                alt={property.title}
                className="w-full h-full object-cover min-h-[350px]"
              />
            ) : (
              <div className="w-full h-full min-h-[350px] bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
                No Image Available
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{property.title}</h1>
            <p className="text-3xl text-indigo-600 font-extrabold mb-8">{formatBdtPrice(property.price)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 mb-10 text-gray-700 text-lg">
              <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><strong>Location:</strong> {property.location}</p>
              <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg><strong>Type:</strong> {property.type}</p>
              <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m4 0h6m-6 0h-2m8 0h2M7 16V9a2 2 0 012-2h6a2 2 0 012 2v7m-4 4v-4m0 0h-4" /></svg><strong>Category:</strong> {property.category}</p>
              {/* <p className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><strong>Contact:</strong> {property.contactInfo || 'Not provided'}</p> */}
              {property.contactInfo && (
                <p className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <strong>Contact:</strong> {property.contactInfo}
                </p>
              )}
            </div>
            <p className="text-gray-800 leading-relaxed mb-10 text-lg">{property.description}</p>

            <div className="border-t pt-8">
              <div className="flex space-x-5 mb-10">
                <Button onClick={handleBookmark} className="bg-yellow-500 hover:bg-yellow-600 text-white py-3.5 px-8 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>
                  Bookmark Listing
                </Button>

                <Button onClick={handleContactAdmin} className="bg-green-600 hover:bg-green-700 text-white py-3.5 px-8 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    Chat with Admin
                </Button>
              </div>

              {/* <form onSubmit={handleSubmitInquiry} className="p-10 border border-gray-200 rounded-2xl bg-gray-50 shadow-inner">
                <h4 className="text-3xl font-semibold mb-6 text-gray-800">Submit Inquiry</h4>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 text-base transition-all duration-200 ease-in-out"
                  rows="7"
                  placeholder="Enter your message for the seller..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  required
                ></textarea>
                <Button type="submit" disabled={inquiryStatus === 'loading'} className="mt-6 bg-green-600 hover:bg-green-700 text-white">
                  {inquiryStatus === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                </Button>
                {inquiryStatus === 'success' && <p className="text-green-600 mt-3 text-base font-medium">Inquiry sent successfully!</p>}
                {inquiryStatus === 'error' && <p className="text-red-600 mt-3 text-base font-medium">Error sending inquiry. Please try again.</p>}
              </form> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}