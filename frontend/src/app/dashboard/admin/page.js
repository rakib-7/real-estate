'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardLandingPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, loading: authLoading, user } = useAuth();

    // --- All your existing logic for authentication and redirection remains the same ---
    useEffect(() => {
        if (authLoading) {
            return;
        }
        if (!isAuthenticated || !isAdmin) {
            router.push('/login');
        } else {
            router.replace('/dashboard/admin/properties');
        }
    }, [isAuthenticated, isAdmin, authLoading, router]);
    // --- End of existing logic ---


    // COMMENTED OUT: Your entire old return statement is replaced by the new redesigned version below.
    /*
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
    */

    // CORRECTED: The new, "dashing" loading and redirecting UI.
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8">
                {/* A more modern, visually appealing loading indicator */}
                <div className="relative flex justify-center items-center mb-6">
                    <div className="absolute w-24 h-24 rounded-full animate-spin border-4 border-dashed border-indigo-500"></div>
                    <div className="absolute w-20 h-20 rounded-full animate-spin border-4 border-dashed border-purple-500" style={{ animationDirection: 'reverse' }}></div>
                    <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 animate-pulse">
                    {authLoading ? 'Verifying Credentials...' : 'Redirecting to Dashboard...'}
                </h1>
                <p className="text-gray-500 mt-2">
                    Please wait a moment.
                </p>
            </div>
        </div>
    );
}