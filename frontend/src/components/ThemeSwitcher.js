'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Using icons for a better look

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-12 h-6 rounded-full p-1 bg-gray-300 dark:bg-gray-700 relative transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
            <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
            ></div>
        </button>
    );
};

export default ThemeSwitcher;