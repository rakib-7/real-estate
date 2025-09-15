'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import AdminPropertyForm from '@/components/AdminPropertyForm';
import { useAuth } from '@/context/AuthContext';
import fetcher from '@/lib/api';
import Button from '@/components/ui/Button';
import { formatBdtPrice } from '@/lib/utils';
import Link from 'next/link';

export default function MyPropertiesPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, loading: authLoading, user: authUser } = useAuth();
    const [myProperties, setMyProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [showPropertyForm, setShowPropertyForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // ADDED: State to hold the user's profile data, including their subscription info.
    const [userProfile, setUserProfile] = useState(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isAuthenticated || isAdmin) {
            router.push('/login');
        } else {
            fetchData(); // CORRECTED: Call a new function to fetch both properties and profile.
        }
    }, [isAuthenticated, isAdmin, authLoading, router]);

    // COMMENTED OUT: The old function that only fetched properties.
    /*
    const fetchMyProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetcher('/user/properties');
            setMyProperties(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    */

    // ADDED: A new function to fetch both the user's properties and their profile data in parallel.
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [propertiesData, profileData] = await Promise.all([
                fetcher('/user/properties'),
                fetcher('/user/profile') // This endpoint gets the user's data, including subscription info.
            ]);
            setMyProperties(propertiesData);
            setUserProfile(profileData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProperty = () => {
        
            // If the limit is NOT reached, open the form as normal.
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
            await fetcher(`/user/properties/${propertyId}`, { method: 'DELETE' });
            alert('Property deleted successfully!');
            fetchData(); // Refresh all data after deleting.
        } catch (err) {
            alert(err.message);
        }
    };

    const handleFormSubmitSuccess = () => {
        setShowPropertyForm(false);
        fetchData(); // Refresh all data after submitting.
    };

    const handleAddPropertyClick = () => {
        const limits = { FREE: 3, PRO: 50 };
        const userLimit = userProfile ? limits[userProfile.subscription] : 0;
        // Use the accurate count from the backend, not the length of the current property list
        const propertiesPosted = userProfile ? userProfile.propertiesPostedThisMonth : 0;

        if (propertiesPosted >= userLimit) {
            alert('You have reached your monthly listing limit. Please upgrade your plan to add more properties.');
            router.push('/pricing');
        } else {
            setSelectedProperty(null);
            setShowPropertyForm(true);
        }
    };


    if (authLoading || loading) {
        return <div className="text-center p-8 text-xl text-gray-700">Loading your listings...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
    }

    // ADDED: A variable to check if the user has reached their limit.
    // This now checks against the subscription type instead of a fixed number.
    const limits = { FREE: 3, PRO: 50 };
    const userLimit = userProfile ? limits[userProfile.subscription] : 0;
    const propertiesPosted = userProfile ? userProfile.propertiesPostedThisMonth : 0;
    const hasReachedLimit = myProperties.length >= userLimit;

    return (
        <>
            {/* status bar to show the user their current listing limit. */}
            {userProfile && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg mb-8 text-center">
                    <p className="text-lg text-indigo-800">
                        You have used <strong>{propertiesPosted}</strong> of your <strong>{userLimit}</strong> available free listings this month.
                    </p>
                    {userProfile.listingResetDate && (
                        <p className="text-sm text-indigo-600 mt-1">
                            Your limit will reset on: {new Date(userProfile.listingResetDate).toLocaleDateString()}
                        </p>
                    )}
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800">My Listed Properties</h2>
                <Button 
                    onClick={handleAddPropertyClick} 
                    className={`${hasReachedLimit ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-md`}
                >
                    {hasReachedLimit ? 'Upgrade to Add More' : 'Add New Listing'}
                </Button>
            
            </div>

            {showPropertyForm && (
                <div className="mb-8">
                    <AdminPropertyForm
                        property={selectedProperty}
                        onSuccess={handleFormSubmitSuccess}
                        onCancel={() => setShowPropertyForm(false)}
                        isUserSubmission={true}
                    />
                </div>
            )}

            {myProperties.length === 0 ? (
                <p className="text-gray-600 text-lg">You haven't listed any properties yet. Click "Add New Listing" to get started!</p>
            ) : (
               <div className="bg-white dark:bg-gray-900 shadow-xl overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <ul className="divide-y divide-gray-200">
                        {myProperties.map(property => (
                            <li key={property.id} className="px-6 py-5 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex-grow mb-3 sm:mb-0">
                                    <p className="text-xl font-medium text-gray-900 dark:text-gray-100 leading-tight">
                                        {property.title} 
                                        <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-semibold ${property.status === 'approved' ? ' bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                            {property.status.toUpperCase()}
                                        </span>
                                    </p>
                                    <p className="text-base text-gray-600 dark:text-gray-400 mt-1">{`${property.area}, ${property.city}`} - {formatBdtPrice(property.price)}</p>
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