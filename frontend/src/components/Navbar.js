'use client';
import React from 'react';
import { useRouter, usePathname} from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useAuth } from 'src/context/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher'; // Make sure this component exists

const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const {isAuthenticated, isAdmin, logout, loading, user} = useAuth();

    const handleLogout = () => {
        logout();
    };

    if(loading){
        // A more subtle loading state that doesn't cause layout shifts.
        return (
            <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="container mx-auto flex justify-between items-center p-4 h-[72px]">
                    <div className="h-8 bg-gray-200 rounded-full w-40 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                </div>
            </nav>
        );
    }

    // COMMENTED OUT: Your entire old <nav> element is replaced by the redesigned version below.
    /*
    return (
        <nav className="sticky top-0 z-[60] bg-white shadow-md p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-4xl font-extrabold tracking-wide drop-shadow-md">
                    RealEstate
                </Link>
                <div className="space-x-8 flex items-center p-2">
                    <Link href="/properties" className={`text-xl font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 ${pathname === '/properties' ? 'text-indigo-600 font-bold' : ''}`}>
                        Browse Properties
                    </Link>
                    {isAdmin && (
                        <Link href="/dashboard/admin/properties" className={`text-xl font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 ${pathname.startsWith('/dashboard/admin') ? 'text-indigo-600 font-bold' : ''}`}>
                            Admin Dashboard
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <>
                            {!isAdmin && (
                               <Link
                                  href="/dashboard/user"
                                  className={`text-xl font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200 ${pathname.startsWith('/dashboard/user') ? 'text-indigo-600 font-bold' : ''}`}
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
                            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full shadow-lg text-lg ${pathname === '/login' ? 'font-bold' : ''}`}
                        >
                            Login
                        </Link>
                    )}
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>
            </div>
        </nav>
    );
    */

    // CORRECTED: A new, redesigned "dashing" Navbar with all buttons and links.
    return (
        <nav className="sticky top-0 z-[60] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Left Side: Logo and Main Navigation */}
                <div className="flex items-center space-x-10">
                    <Link href="/" className="text-3xl font-bold text-gray-800 dark:text-white">
                        RealEstate<span className="text-indigo-600 dark:text-indigo-400"></span>
                    </Link>
                    <div className=" md:flex items-center space-x-8">
                        <Link href="/properties" className={`text-lg font-medium transition-colors duration-300 ${pathname === '/properties' ? 'text-indigo-600 dark:text-indigo-400  border-indigo-600' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white'}`}>
                            Browse Properties
                        </Link>
                        {isAdmin && (
                            <Link href="/dashboard/admin" className={`text-lg font-medium pb-2 transition-colors duration-300 ${pathname.startsWith('/dashboard/admin') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white'}`}>
                                Admin Dashboard
                            </Link>
                        )}
                        {isAuthenticated && !isAdmin && (
                            <Link href="/dashboard/user" className={`text-lg font-medium pb-2 transition-colors duration-300 ${pathname.startsWith('/dashboard/user') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white'}`}>
                                My Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Side: Actions and Language Switcher */}
                <div className="flex items-center space-x-4">
                    <LanguageSwitcher />
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Dark Mode</span>
                        <ThemeSwitcher />
                    </div>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                            <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">{user?.email}</span>
                            <Button 
                                onClick={handleLogout} 
                                title="Logout"
                                className="bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900/50 dark:hover:bg-red-900/80 dark:text-red-300 font-semibold w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition-transform hover:scale-105">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;