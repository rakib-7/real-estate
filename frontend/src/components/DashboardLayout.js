// src/components/DashboardLayout.js
'use client';
import React, { useState, useEffect } from 'react';
import {useROuter, usePathname} from 'next/navigation';
import Link from 'next/link';
//import { useSimulatedRouter, SimulatedLink } from '@/hooks/useSimulatedRouter'; // Correct path
import Navbar from './Navbar'; // Correct path

const DashboardLayout = ({ children, activeTab, onTabChange, userRole }) => {
  const router = useROuter();
  const pathname = usePathname();


  const isAdmin = userRole === 'admin';

  const adminTabs = [
    { id: 'properties', name: 'Manage Properties', path: '/dashboard/admin/properties' },
    { id: 'inquiries', name: 'Manage Inquiries', path: '/dashboard/admin/inquiries' },
    { id: 'banners', name: 'Manage Banners', path: '/dashboard/admin/banners' },
    { id: 'analytics', name: 'Site Analytics (Optional)', path: '/dashboard/admin/analytics' },
  ];

  const userTabs = [
    { id: 'bookmarks', name: 'Bookmarked Properties', path: '/dashboard/user' },
    { id: 'my-inquiries', name: 'My Inquiries', path: '/dashboard/user/inquiries' },
    { id: 'my-properties', name: 'My Properties', path: '/dashboard/user/my-properties'},
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <Navbar />
      <div className="container mx-auto p-8 flex-grow">
        <h1 className="text-4xl font-extrabold mb-10 text-gray-800 text-center drop-shadow-sm">{isAdmin ? 'Admin Dashboard' : 'User Dashboard'}</h1>

        <div className="mb-10 border-b-2 border-gray-200 pb-3">
          <nav className="-mb-px flex space-x-10" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link key={tab.id} href={tab.path} className={`py-4 px-5 border-b-4 font-semibold text-xl transition-colors duration-200 ease-in-out ${pathname === tab.path ? 'border-indigo-600 text-indigo-700 font-bold' : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800'}`} onClick={(e) => { onTabChange(tab.id); }}> {/* <--- CHANGE THIS */}
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