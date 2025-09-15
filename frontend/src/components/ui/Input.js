'use client';
import React from 'react';

const Input = ({ label, id, name, type, value, onChange, placeholder, required, disabled, className }) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id || name} className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <input
                id={id || name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                
                className={`block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm 
                           bg-gray-50 dark:bg-gray-700 
                           dark:border-gray-600 
                           text-gray-900 dark:text-white
                           dark:placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                           disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed
                           text-base transition-all duration-200 ease-in-out ${className}`}
            />
        </div>
    );
};

export default Input;
