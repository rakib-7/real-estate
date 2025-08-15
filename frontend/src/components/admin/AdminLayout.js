// frontend/src/components/admin/AdminLayout.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, loading: authLoading, logout, user } = useAuth();
  

  console.log('AdminLayout: Render. State: isAuthenticated=', isAuthenticated, 'isAdmin=', isAdmin, 'authLoading=', authLoading, 'user=', user);

  const handleLogout = () => {
    logout();
  };

  const adminTabs = [
    { id: 'properties', name: 'Properties', path: '/dashboard/admin/properties', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
    )},
    // { id: 'inquiries', name: 'Inquiries', path: '/dashboard/admin/inquiries', icon: (
    //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.508 12.27 2 11.104 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
    // )},
    { id: 'inquiries', name: 'Chat / Support', path: '/dashboard/admin/inquiries', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.508 12.27 2 11.104 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
    )},
    { id: 'banners', name: 'Banners', path: '/dashboard/admin/banners', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
    )},
    { id: 'users', name: 'Users', path: '/dashboard/admin/users', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
    )},
    { id: 'analytics', name: 'Analytics', path: '/dashboard/admin/analytics', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
    )},
  ];

  // Show loading state while auth is being checked
  if (authLoading) {
    console.log('AdminLayout: Displaying loading state.');
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

  // Show debug info if not authenticated or not admin, but still render the layout
  if (!isAuthenticated || !isAdmin) {
    console.log('AdminLayout: Not authenticated or not admin, showing debug info');
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Admin Header */}
        <header className="bg-gradient-to-r from-red-800 to-orange-900 shadow-xl p-5 text-white">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-md">⚠️ Admin Panel (Debug Mode)</h1>
            <div className="flex items-center space-x-6">
              <span className="text-lg font-medium">Authentication Issue Detected</span>
              <Button onClick={() => router.push('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full shadow-lg text-lg">
                Go to Login
              </Button>
            </div>
          </div>
        </header>

        {/* Debug Information */}
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="container mx-auto">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Debug Information:</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><strong>Loading:</strong> {authLoading ? 'Yes' : 'No'}</div>
              <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
              <div><strong>Admin:</strong> {isAdmin ? 'Yes' : 'No'}</div>
              <div><strong>User:</strong> {user ? JSON.stringify(user) : 'None'}</div>
            </div>
          </div>
        </div>

        {/* Main Admin Content Area */}
        <div className="flex flex-grow">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-gray-800 text-white p-6 shadow-xl flex-shrink-0">
            <nav className="space-y-4">
              {adminTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.path}
                  className={`flex items-center py-3 px-4 rounded-lg text-lg font-medium transition-colors duration-200
                    ${
                      pathname.startsWith(tab.path)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                >
                  {tab.icon}
                  {tab.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Page Content */}
          <main className="flex-grow p-8 bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-3xl border border-gray-100">
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Authentication Required</h2>
                <p className="text-gray-600 mb-6">You need to be logged in as an admin to access this dashboard.</p>
                <Button 
                  onClick={() => router.push('/login')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                  Login as Admin
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  console.log('AdminLayout: Rendering full admin layout.');

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-indigo-800 to-purple-900 shadow-xl p-5 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md">Admin Panel</h1>
              <p className="text-indigo-200 text-sm">Welcome back, {user?.email || 'Admin'}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
           <Link href="/properties" className="text-lg font-medium text-indigo-200 hover:text-white border-b-2 border-transparent hover:border-white transition-all duration-200">
                            Browse Properties
                        </Link>
                    </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-indigo-200">Logged in as</p>
              <p className="font-semibold">{user?.email || 'Admin'}</p>
            </div>
            <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Area */}
      <div className="flex flex-grow">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-xl flex-shrink-0">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Navigation</h2>
            <nav className="space-y-2">
              {adminTabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.path}
                  className={`flex items-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${
                      pathname.startsWith(tab.path)
                        ? 'bg-indigo-600 text-white shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                >
                  <span className={`mr-3 transition-colors duration-200 ${
                    pathname.startsWith(tab.path) ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'
                  }`}>
                    {tab.icon}
                  </span>
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-grow p-8 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;