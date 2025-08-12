// frontend/src/context/AuthContext.js
'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/api'; // Assuming lib/api.js is correctly set up

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { userId, email, role }
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  console.log('AuthContext: Initializing AuthProvider');

  // Function to check authentication status (called on mount and after login/logout)
  const checkAuthStatus = async () => {
    setLoading(true); // Set loading true while checking
    try {
      console.log('AuthContext: Checking auth status...');
      console.log('AuthContext: About to call fetcher("/auth/status")');
      const data = await fetcher('/auth/status'); // Backend checks cookie and returns user data
      console.log('AuthContext: Auth status check successful:', data);
      setUser({ userId: data.userId, email: data.email, role: data.role });
    } catch (error) {
      console.log('AuthContext: Auth status check failed:', error.message);
      console.log('AuthContext: Error details:', error);
      // If /auth/status fails (e.g., 401, 403, network error), user is not authenticated
      setUser(null);
    } finally {
      setLoading(false); // Always set loading to false when check is complete
    }
  };

  // Initial authentication check on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []); // Empty dependency array means this runs once on mount

  const login = async (email, password) => {
    console.log('AuthContext: Attempting login for', email);
    setLoading(true);
    try {
      const data = await fetcher('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      console.log('AuthContext: Login SUCCESS. Response data:', data);
      // Backend now sets HttpOnly cookie. Frontend receives role and userId in JSON.
      setUser({ userId: data.userId, email: email, role: data.role });
      console.log('AuthContext: User state updated after login:', { userId: data.userId, email: email, role: data.role });
      
      // Immediately check auth status after login to ensure cookie is set
      await checkAuthStatus();
      
      return data; // Return data for redirection logic in LoginPage
    } catch (error) {
      console.log('AuthContext: Login failed:', error.message);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //logout function
  const logout = async () => {
    setLoading(true);
    try {
      await fetcher('/auth/logout', { method: 'POST' }); // Call backend logout endpoint
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if backend logout fails, clear frontend state
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // Provide user, login, logout, and loading status to children
  const authContextValue = {
    user,
    isAuthenticated: !!user,
    isAdmin: user && user.role === 'ADMIN',
    login,
    logout,
    loading,
    checkAuthStatus
  };
  
  console.log('AuthContext: Render. State: isAuthenticated=', authContextValue.isAuthenticated, 'isAdmin=', authContextValue.isAdmin, 'loading=', authContextValue.loading, 'user=', authContextValue.user);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


