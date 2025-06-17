"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = ({ isAdmin }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          Real Estate Portal
        </Link>
        <div className="space-x-4">
          {isAdmin ? (
            <>
              <Link href="/dashboard/admin" className="text-gray-600 hover:text-blue-600">
                Admin Dashboard
              </Link>
              <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/properties" className="text-gray-600 hover:text-blue-600">
                Browse Properties 
              </Link>
              {typeof window !== 'undefined' && localStorage.getItem('token') ? (
                  <button onClick={handleLogout} className="text-gray-600 hover:text-blue-600">
                    Logout
                  </button>
              ) : (
                  <Link href="/login" className="text-gray-600 hover:text-blue-600">
                    Login
                  </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;