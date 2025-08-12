// --- components/ui/Button.js ---
'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
const Button = ({ children, onClick, type = 'button', className = '', disabled = false, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
        disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;