'use client';

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '../Footer';
import { usePathname } from 'next/navigation';
import '../../i18n';
import { SocketProvider } from '@/context/SocketContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function ClientAuthWrapper({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith('/dashboard/admin');
    const isHomePage = pathname === '/';
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    // COMMENTED OUT: The old div without dark mode styles.
    /*
    return (
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    <div className="min-h-screen flex flex-col bg-gray-50">
                        // ... content ...
                    </div>
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    );
    */

    // CORRECTED: Added dark mode classes (e.g., dark:bg-gray-900) to the main container.
    // This will change the background of your entire app when dark mode is on.
    return (
        <ThemeProvider>
            <AuthProvider>
                <SocketProvider>
                    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                        {!isAdminPage && !isAuthPage && <Navbar />}
                        <main className="flex-grow">{children}</main>
                        {isHomePage && <Footer />}
                    </div>
                </SocketProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}