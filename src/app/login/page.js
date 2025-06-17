'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (email, password) => {
    setError('');
    try {
      // Assuming your backend runs on http://localhost:5000
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      // Store token and user role in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role);

      // Redirect based on role 
      if (data.role === 'admin') {
        router.push('/dashboard/admin'); // Admin dashboard
      } else {
        router.push('/properties'); // User property Browse page
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Real Estate Portal</h1>
        <AuthForm onSubmit={handleLogin} type="login" />
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}