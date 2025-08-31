'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_BASE_URL } from '@/lib/api';

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // This effect handles closing the dropdown if the user clicks outside of it.
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);
    const handleLinkClick = () => {
        setIsOpen(false);
    };


    return (
        <div className="relative" ref={dropdownRef}>
            {/* The clickable avatar */}
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                <img
                    src={user?.avatarUrl ? `${API_BASE_URL.replace('/api', '')}${user.avatarUrl}` : `https://placehold.co/40x40/6366f1/ffffff?text=${user?.email?.charAt(0).toUpperCase()}`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-indigo-500 transition-all"
                />
            </button>

            {/* The Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 py-2">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                        <p className="font-semibold text-gray-800 dark:text-white truncate">{user?.email}</p>
                    </div>
                    <Link href="/dashboard/user/profile" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        My Profile
                    </Link>
                    <Link href="/pricing" onClick={handleLinkClick} className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Upgrade Plan
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;