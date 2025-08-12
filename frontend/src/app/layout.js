// src/app/layout.js
// No 'use client' here! This file remains a Server Component.
import React from 'react';
import '../styles/global.css';  // Relative from layout.js
import ClientAuthWrapper from '@/components/providers/ClientAuthWrapper'; // NEW: Import the wrapper
//import { usePathname } from 'next/navigation';


export const metadata = {
  title: 'Real Estate Management System',
  description: 'A responsive web application for real estate property management.',
};

export default function RootLayout({ children }) {
    
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* <title> and <meta name="description"> are handled by Next.js metadata export */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter antialiased">
        <ClientAuthWrapper> {/* NEW: Use the client wrapper here */}
          {children}
        </ClientAuthWrapper>
      </body>
    </html>
  );
}

