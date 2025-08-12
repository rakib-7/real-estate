// frontend/src/app/dashboard/admin/properties/page.js
'use client';
import React, { useState, useEffect } from 'react';
// useRouter and useAuth are handled by AdminLayout
import AdminPropertyForm from '@/components/AdminPropertyForm';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import fetcher from '@/lib/api';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties(); // No auth check needed here, AdminLayout handles it
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher('/admin/properties'); // Admin can get all properties
      setProperties(data);
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
      await fetcher(`/admin/properties/${propertyId}`, { method: 'DELETE' });
      alert('Property deleted successfully!');
      fetchProperties();
    } catch (err) {
      alert(err.message);
    }
  };

  // NEW: Handle property status update (Approve/Reject)
  const handleUpdateStatus = async (propertyId, status) => {
    if (!confirm(`Are you sure you want to ${status} this property?`)) return;
    try {
      await fetcher(`/admin/properties/${propertyId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      alert(`Property ${status}d successfully!`);
      fetchProperties(); // Refresh list
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowPropertyForm(false);
    fetchProperties();
  };

  if (loading) {
    return <p className="text-center p-8 text-xl text-gray-700">Loading properties...</p>;
  }

  if (error) {
    return <p className="text-center p-8 text-red-500 text-xl">Error: {error}</p>;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manage Property Listings</h2>
        <Button onClick={handleAddProperty} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Add New Property
        </Button>
      </div>

      {showPropertyForm && (
        <div className="mb-8">
          <AdminPropertyForm
            property={selectedProperty}
            onSuccess={handleFormSubmitSuccess}
            onCancel={() => setShowPropertyForm(false)}
          />
        </div>
      )}

      {properties.length === 0 ? (
        <p className="text-gray-600 text-lg">No properties found. Add one to get started!</p>
      ) : (
        <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {properties.map((property) => (
              <li key={property.id} className="px-6 py-5 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors duration-150">
                <div className="flex-grow mb-3 sm:mb-0">
                  <p className="text-xl font-medium text-gray-900 leading-tight">{property.title}</p>
                  <p className="text-base text-gray-600 mt-1">{property.location} - {formatPrice(property.price)}</p>
                </div>
                <div className="flex space-x-3">
                  {property.status === 'pending' && ( // Show Approve/Reject only for pending
                    <>
                      <Button
                        onClick={() => handleUpdateStatus(property.id, 'approved')}
                        className="bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 text-sm shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatus(property.id, 'rejected')}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 px-4 text-sm shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Reject
                      </Button>
                    </>
                  )}
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