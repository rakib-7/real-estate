// frontend/src/app/dashboard/user/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link'; // Ensure Link is imported for PropertyCard
import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/context/AuthContext';
import fetcher from '@/lib/api';
// Button is not directly used in this specific page's JSX, but often useful in related components.
// import Button from '@/components/ui/Button';

export default function UserDashboardPage() {
  const router = useRouter();
  const pathname = usePathname(); // Used for active tab logic in DashboardLayout
  const {isAuthenticated, isAdmin, loading: authLoading, user: authUser} = useAuth(); // Get authUser from context
  const [bookmarkedProperties, setBookmarkedProperties] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const [errorBookmarks, setErrorBookmarks] = useState(null);

  // This page will primarily display bookmarked properties.
  // Other tabs (inquiries, my-properties, profile) will be handled by their own page.js files
  // within the /dashboard/user/ subdirectories.
  // The activeTab logic here is mainly for the DashboardLayout component's styling.
  const activeTab = pathname.startsWith('/dashboard/user/inquiries') ? 'my-inquiries' :
                     pathname.startsWith('/dashboard/user/my-properties') ? 'my-properties' :
                     pathname.startsWith('/dashboard/user/profile') ? 'profile' :
                     'bookmarks'; // Default to 'bookmarks' for this page's content

  useEffect(() => {
    if(authLoading) return; // Wait for authentication status to be determined

    // If user is not authenticated or is an admin, redirect them away from user dashboard
    if(!isAuthenticated || isAdmin){
      router.push('/login');
    } else {
      // If authenticated as a regular user, fetch bookmarked properties
      fetchBookmarkedProperties();
    }
  }, [isAuthenticated, isAdmin, authLoading, router, authUser]); // Depend on auth state and router

  const fetchBookmarkedProperties = async () => {
    setLoadingBookmarks(true);
    setErrorBookmarks(null);
    try {
      const data = await fetcher('/user/bookmarks');
      setBookmarkedProperties(data);
    } catch (err) {
      setErrorBookmarks(err.message);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const handleRemoveBookmark = async (propertyId) => {
    if (!confirm('Are you sure you want to remove this bookmark?')) return;
    try {
      await fetcher(`/user/bookmarks/${propertyId}`, { method: 'DELETE' });
      alert('Bookmark removed successfully!');
      fetchBookmarkedProperties(); // Refresh the list after removal
    } catch (err) {
      alert(err.message);
    }
  };

  // Render a loading state for the entire page while authentication is being checked
  if (authLoading) {
    return <div className="text-center p-8 text-xl text-gray-700">Loading user dashboard...</div>;
  }

  // If not authenticated or is an admin, this component will return null,
  // as the useEffect hook above will handle the redirection.
  if (!isAuthenticated || isAdmin) {
    return null;
  }

  // If we reach here, the user is authenticated and is a regular user.
  // Render the user dashboard content.
  return (
    <>
      {/* Welcome Message Section */}
      <div className="mb-8 p-6 bg-blue-50 rounded-xl shadow-inner-lg border border-blue-100 text-gray-800">
        <h2 className="text-2xl font-bold mb-3">Welcome, {authUser?.email || 'User'}!</h2>
        <p className="text-lg">This is your personalized dashboard. Here you can manage your bookmarked properties, inquiries, and properties you've listed for sale.</p>
      </div>

      {/* Bookmarked Properties Content */}
      {/* This content is displayed by default when navigating to /dashboard/user */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Bookmarked Properties</h2>
        {loadingBookmarks && <p className="text-gray-600 text-lg">Loading bookmarked properties...</p>}
        {errorBookmarks && <p className="text-red-500 text-lg">Error: {errorBookmarks}</p>}
        {!loadingBookmarks && !errorBookmarks && bookmarkedProperties.length === 0 ? (
          <p className="text-gray-600 text-lg">You have no bookmarked properties yet. Browse properties to add some!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarkedProperties.map(property => (
              <PropertyCard key={property.id} property={property} showActions={true} onRemoveBookmark={handleRemoveBookmark} />
            ))}
          </div>
        )}
      </div>

      {/* Note: The content for 'My Inquiries', 'My Properties', and 'My Profile'
           is now handled by their respective page.js files in subdirectories.
           The DashboardLayout component handles the tab navigation. */}
    </>
  );
}