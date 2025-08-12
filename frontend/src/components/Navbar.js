// src/components/Navbar.js
'use client';
import React from 'react';
//import React, { useState, useEffect } from 'react';
//import { useSimulatedRouter, SimulatedLink } from '@/hooks/useSimulatedRouter'; // Correct path for simulated router
import { useRouter, usePathname} from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button'; // Correct path for Button
import { useAuth } from 'src/context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {isAuthenticated, isAdmin, logout, loading} = useAuth();

  // const [token, setToken] = useState(null);
  // const [userRole, setUserRole] = useState(null);
  // const isLoggedIn = !!token;
  // const isAdmin = isLoggedIn && userRole === 'admin';

  // useEffect(() => {
  //   // Client-side effect to get localStorage items
  //   if (typeof window !== 'undefined') {
  //     setToken(localStorage.getItem('token'));
  //     setUserRole(localStorage.getItem('userRole'));
  //   }
  // }, [pathname]); // Re-check on path change

  const handleLogout = () => {
    // if (typeof window !== 'undefined') {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('userRole');
    //   localStorage.removeItem('userId');
    // }
    // router.push('/login');
    logout();
  };

  if(loading){
    // Optionally render a loading state for Navbar while auth status is checked
    return (
      <nav className="bg-gradient-to-r from-indigo-700 to-purple-800 shadow-2xl p-5 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-4xl font-extrabold tracking-wide drop-shadow-md">RealEstatePro</span>
          <span className="text-lg">Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-4xl font-extrabold tracking-wide drop-shadow-md"> {/* <--- CHANGE THIS */}
          RealEstate
        </Link>
        <div className="space-x-8 flex items-center">
          <Link href="/properties" className={`text-xl font-medium hover:text-purple-200 transition-colors duration-200 ${pathname === '/properties' ? 'text-purple-200 font-bold' : ''}`}> {/* <--- CHANGE THIS */}
            Browse Properties
          </Link>

           {isAdmin && (
            <Link href="/dashboard/admin/properties" className={`text-xl font-medium hover:text-purple-200 transition-colors duration-200 ${pathname.startsWith('/dashboard/admin') ? 'text-purple-200 font-bold' : ''}`}>
              Admin Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {!isAdmin && ( // Only show My Dashboard for regular users
                 <Link
                   href="/dashboard/user"
                   className={`text-xl font-medium hover:text-purple-200 transition-colors duration-200 ${pathname.startsWith('/dashboard/user') ? 'text-purple-200 font-bold' : ''}`}
                 >
                   My Dashboard
                 </Link>
              )}
              <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white ml-8 px-6 py-2.5 rounded-full shadow-lg text-lg">
                Logout
              </Button>
            </>
          ) : (
            <Link
              href="/login"
              className={`bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-full shadow-lg text-lg ${pathname === '/login' ? 'font-bold' : ''}`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;