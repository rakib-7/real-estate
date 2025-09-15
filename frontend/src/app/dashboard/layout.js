'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isAdmin, loading: authLoading, user: authUser } = useAuth();

    // logic for authentication and redirection 
    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (isAdmin && !pathname.startsWith('/dashboard/admin')) {
                router.push('/dashboard/admin');
            }
        }
    }, [isAuthenticated, isAdmin, authLoading, router, pathname]);

    
    const userTabs = [
        { id: 'bookmarks', name: 'Bookmarks', path: '/dashboard/user', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg> },
        { id: 'my-inquiries', name: 'Chat with Admin', path: '/dashboard/user/inquiries', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
        { id: 'my-properties', name: 'My Properties', path: '/dashboard/user/my-properties', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h2M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
        { id: 'profile', name: 'My Profile', path: '/dashboard/user/profile', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    ];

    if (authLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-gray-700">Loading dashboard...</p>
            </div>
        );
    }

    if (isAdmin) {
        return <>{children}</>; // Admins use a separate layout
    }

    
    return (
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">My Dashboard</h2>
                    <nav className="space-y-2">
                        {userTabs.map((tab) => (
                            <Link
                                key={tab.id}
                                href={tab.path}
                                className={`flex items-center py-3 px-4 rounded-lg text-lg font-medium transition-all duration-200 group
                                    ${pathname === tab.path
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <span className="mr-4">{tab.icon}</span>
                                {tab.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow p-8">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;