// frontend/src/app/dashboard/user/my-properties/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import AdminPropertyForm from '@/components/AdminPropertyForm'; // Reuse the form
import { useAuth } from '@/context/AuthContext';
import fetcher from '@/lib/api';
import Button from '@/components/ui/Button'; // Assuming Button is available
//import { formatPrice } from '@/lib/utils';
import { formatBdtPrice } from '@/lib/utils'; // Use the updated format function
import Link from 'next/link';

export default function MyPropertiesPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading, user: authUser } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null); // For editing
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || isAdmin) {
      router.push('/login');
    } else {
      fetchMyProperties();
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  const fetchMyProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming backend has a way to filter properties by current user's ID/email
      // If backend has creatorId in Property model, use /user/my-properties endpoint
      // For now, we'll fetch all and filter by contactInfo (user's email)
      
      // const allProperties = await fetcher('/properties');
      // const userProperties = allProperties.filter(p => p.contactInfo === authUser.email);
      // setMyProperties(userProperties);
       // Fetch properties created by the current user
      const data = await fetcher('/user/properties'); // This endpoint now returns user's own properties
      console.log('fetchMyProperties: Data received from backend:', data); // LOG THIS
      setMyProperties(data);
      console.log('fetchMyProperties: myProperties state updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = () => {
    setSelectedProperty(null);
    setShowPropertyForm(true);
  };

  const handleEditProperty = (property) => {
    setSelectedProperty(property);
    setShowPropertyForm(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    try {
      await fetcher(`/user/properties/${propertyId}`, { method: 'DELETE' }); // Assuming user has delete permission for own properties
      alert('Property deleted successfully!');
      fetchMyProperties();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowPropertyForm(false);
    fetchMyProperties();
  };

  if (authLoading || loading) {
    return <div className="text-center p-8 text-xl text-gray-700">Loading your listings...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">My Listed Properties</h2>
        <Button onClick={handleAddProperty} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Add New Listing
        </Button>
      </div>

      {showPropertyForm && (
        <div className="mb-8">
          <AdminPropertyForm
            property={selectedProperty}
            onSuccess={handleFormSubmitSuccess}
            onCancel={() => setShowPropertyForm(false)}
            isUserSubmission ={true}  // IMPORTANT: This tells the form it's for a user submission
          />
        </div>
      )}

      {myProperties.length === 0 ? (
        <p className="text-gray-600 text-lg">You haven't listed any properties yet. Click "Add New Listing" to get started!</p>
      ) : (
        <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {myProperties.map(property => (
              
              <li key={property.id} className="px-6 py-5 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors duration-150">
                <div className="flex-grow mb-3 sm:mb-0">
                  <p className="text-xl font-medium text-gray-900 leading-tight">{property.title} <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-semibold ${property.status === 'approved' ? 'bg-green-100 text-green-800' : property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{property.status.toUpperCase()}</span></p>
                  <p className="text-base text-gray-600 mt-1">{property.location} - {formatBdtPrice(property.price)}</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleEditProperty(property)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 text-sm shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" /></svg>
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 text-sm shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}