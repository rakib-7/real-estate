// src/app/dashboard/layout.js
'use client'; // This component uses hooks, so it must be a client component.
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Correct import
import Link from 'next/link'; // Correct import
import Navbar from '@/components/Navbar'; // Correct path for Navbar
import { useAuth } from '@/context/AuthContext';

const DashboardLayout = ({ children }) => { // Removed activeTab, onTabChange, userRole props from destructuring
  const router = useRouter();
  const pathname = usePathname();
  const {isAuthenticated, isAdmin, loading: authLoading, user: authUser} = useAuth();

  console.log('DashboardLayout: Render. State:', {
    isAuthenticated,
    isAdmin,
    authLoading,
    pathname
  });

  // Redirect if not authenticated (but allow admins to pass through)
  useEffect(() => {
    console.log('DashboardLayout: useEffect triggered with:', {
      isAuthenticated,
      isAdmin,
      authLoading,
      pathname
    });

    // Only perform redirect logic AFTER authLoading is false
    if (!authLoading) {
      if (!isAuthenticated) { // Only redirect if not authenticated
        console.log('DashboardLayout: Not authenticated, redirecting to login');
        router.push('/login');
      } else if (isAdmin && !pathname.startsWith('/dashboard/admin')) {
        // If user is admin but not on admin routes, redirect to admin dashboard
        console.log('DashboardLayout: Admin user on non-admin route, redirecting to admin dashboard');
        router.push('/dashboard/admin');
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router, pathname]);

  // Define user navigation tabs - RE-ADDED THIS BLOCK
  const userTabs = [
    { id: 'bookmarks', name: 'Bookmarked Properties', path: '/dashboard/user' },
    { id: 'my-inquiries', name: 'My Inquiries', path: '/dashboard/user/inquiries' },
    { id: 'my-properties', name: 'My Properties', path: '/dashboard/user/my-properties' }, // Corrected path for my-properties
    { id: 'profile', name: 'My Profile', path: '/dashboard/user/profile' }, // Corrected path for profile
  ];

  // Assign userTabs to 'tabs' variable
  const tabs = userTabs; // This ensures 'tabs' is defined for the map function

  // Render a loading state while authentication status is being determined
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <p className="text-xl text-gray-700">Loading dashboard...</p>
      </div>
    );
  }

  // If authLoading is false and user is not authenticated, return null
  // The useEffect will handle the push to /login
  if (!isAuthenticated) {
    return null;
  }

  // If user is admin and on admin routes, just render children (AdminLayout will handle the rest)
  if (isAdmin && pathname.startsWith('/dashboard/admin')) {
    return <>{children}</>;
  }

  // If we reach here, user is authenticated and is a regular user
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      
      <div className="container mx-auto p-8 flex-grow">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center drop-shadow-sm">User Dashboard</h1>

        <div className="mb-10 border-b-2 border-gray-200 pb-3">
          <nav className="-mb-px flex space-x-10" aria-label="Tabs">
            {tabs.map((tab) => ( // 'tabs' is now defined
              <Link // Use native Link
                key={tab.id}
                href={tab.path}
                className={`py-4 px-5 border-b-4 font-semibold text-xl transition-colors duration-200 ease-in-out
                  ${
                    pathname === tab.path
                      ? 'border-indigo-600 text-indigo-700 font-bold'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'
                  }`}
                onClick={(e) => {
                  // Next.js Link handles navigation, no need for onTabChange here
                  // onTabChange(tab.id); // REMOVED as onTabChange is not a prop anymore
                }}
              >
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-3xl border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;