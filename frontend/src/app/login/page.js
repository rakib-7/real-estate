// src/app/login/page.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//import { useSimulatedRouter, SimulatedLink } from '@/hooks/useSimulatedRouter'; // Correct path
import AuthForm from '@/components/auth/AuthForm'; // Correct path
import { useAuth } from '@/context/AuthContext';
import fetcher from '@/lib/api';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {login} = useAuth();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      // const data = await fetcher('/auth/login', { // fetcher is globally available
      //   method: 'POST',
      //   body: JSON.stringify({ email, password }),
      // });

      // localStorage.setItem('token', data.token);
      // localStorage.setItem('userRole', data.role);
      // localStorage.setItem('userId', data.userId);

      const data = await login(email, password);

      if (data.role === 'ADMIN') {
        router.push('/dashboard/admin/properties');
      } else {
        router.push('/properties');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="bg-white p-12 rounded-2xl shadow-4xl w-full max-w-md border border-gray-100">
        <h1 className="text-5xl font-bold mb-10 text-center text-gray-800 drop-shadow-sm">Welcome To Real Estate</h1>
        <AuthForm onSubmit={handleLogin} type="login" />
        {error && <p className="text-red-500 text-center mt-6 text-base font-medium">{error}</p>}
        
        {/* Admin Test Credentials */}
        {/* <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2 text-sm text-blue-800">Test Admin Credentials:</h3>
          <p className="text-xs text-blue-700"><strong>Email:</strong> admin@test.com</p>
          <p className="text-xs text-blue-700"><strong>Password:</strong> admin123</p>
        </div> */}
        
        <p className="text-center mt-8 text-base text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-600 hover:underline font-semibold"> {/* <--- CHANGE THIS */}
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}