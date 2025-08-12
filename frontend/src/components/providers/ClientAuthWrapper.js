// src/components/providers/ClientAuthWrapper.js
'use client'; // THIS MUST BE THE FIRST LINE

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar'; // Assuming Navbar is also a client component
import { usePathname } from 'next/navigation'; // Correct import for usePathname

export default function ClientAuthWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/dashboard/admin');
  return (
    <AuthProvider>
       {/* Only render the main site Navbar if it's NOT an admin page */}
      {!isAdminPage && <Navbar />}
      
      {/* The rest of your application's pages will be rendered here */}
      <main>{children}</main>
    </AuthProvider>
  );
}