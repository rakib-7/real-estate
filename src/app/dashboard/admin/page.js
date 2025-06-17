'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPropertyForm from '../../../components/AdminPropertyForm';
import Navbar from '../../../components/Navbar';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [activeTab, setActiveTab] = useState('manage-properties');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    // Redirect if not admin or not logged in
    if (role !== 'admin') {
      router.push('/login');
    } else {
      fetchProperties();
    }
  }, [router]);

  const fetchProperties = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/admin/properties', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          // Token expired or unauthorized, clear storage and redirect
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          router.push('/login');
          throw new Error('Unauthorized or session expired. Please log in again.');
        }
        throw new Error('Failed to fetch properties');
      }
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
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
    const token = localStorage.getItem('token');
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
         if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            router.push('/login');
            throw new Error('Unauthorized or session expired. Please log in again.');
         }
        throw new Error('Failed to delete property');
      }
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleFormSubmitSuccess = () => {
    setShowPropertyForm(false);
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin={true} />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('manage-properties')}
              className={`${
                activeTab === 'manage-properties'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Properties 
            </button>
            <button
              onClick={() => setActiveTab('manage-inquiries')}
              className={`${
                activeTab === 'manage-inquiries'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Manage Inquiries 
            </button>
            <button
              onClick={() => setActiveTab('upload-banners')}
              className={`${
                activeTab === 'upload-banners'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Upload Promotional Banners 
            </button>
            <button
              onClick={() => setActiveTab('site-analytics')}
              className={`${
                activeTab === 'site-analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              View Site Analytics (Optional) 
            </button>
          </nav>
        </div>

        {activeTab === 'manage-properties' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Property Listings</h2>
              <button
                onClick={handleAddProperty}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add New Property
              </button>
            </div>

            {showPropertyForm && (
              <div className="mb-6 p-4 border rounded-md bg-white shadow-sm">
                <AdminPropertyForm
                  property={selectedProperty}
                  onSuccess={handleFormSubmitSuccess}
                  onCancel={() => setShowPropertyForm(false)}
                />
              </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {properties.length > 0 ? (
                  properties.map((property) => (
                    <li key={property.id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium text-gray-900">{property.title}</p>
                        <p className="text-sm text-gray-500">{property.location}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-4 sm:px-6 text-gray-500">No properties found.</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'manage-inquiries' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Manage Inquiries (Coming Soon) </h2>
            <p className="text-gray-700">This section will allow admins to view and respond to inquiries.</p>
          </div>
        )}

        {activeTab === 'upload-banners' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Upload Promotional Banners (Coming Soon) </h2>
            <p className="text-gray-700">This section will allow admins to upload promotional banners.</p>
          </div>
        )}

        {activeTab === 'site-analytics' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Site Analytics (Optional) </h2>
            <p className="text-gray-700">This section will display site analytics data.</p>
          </div>
        )}
      </div>
    </div>
  );
}