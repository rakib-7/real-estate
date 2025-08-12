// frontend/src/app/dashboard/admin/page.js
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardLandingPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading, user } = useAuth();

  console.log('AdminDashboardLandingPage: Render. State:', {
    isAuthenticated,
    isAdmin,
    authLoading,
    user
  });

  useEffect(() => {
    console.log('AdminDashboardLandingPage: useEffect triggered with:', {
      isAuthenticated,
      isAdmin,
      authLoading
    });

    // Don't redirect while still loading
    if (authLoading) {
      console.log('AdminDashboardLandingPage: Still loading, waiting...');
      return;
    }

    // If not authenticated or not admin, redirect to login
    if (!isAuthenticated || !isAdmin) {
      console.log('AdminDashboardLandingPage: Not authenticated or not admin, redirecting to login');
      router.push('/login');
    } else {
      // User is authenticated and is admin, redirect to properties
      console.log('AdminDashboardLandingPage: User is authenticated and admin, redirecting to properties');
      router.replace('/dashboard/admin/properties');
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading admin dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show redirect message
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-xl text-gray-700">Redirecting to Admin Dashboard...</p>
        <p className="text-sm text-gray-500 mt-2">Authentication: {isAuthenticated ? '✅' : '❌'} | Admin: {isAdmin ? '✅' : '❌'}</p>
      </div>
    </div>
  );
}