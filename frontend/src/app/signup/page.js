// src/app/signup/page.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
//import { useSimulatedRouter, SimulatedLink } from '@/hooks/useSimulatedRouter'; // Correct path
import AuthForm from '@/components/auth/AuthForm'; // Correct path
import fetcher from '@/lib/api';

export default function SignupPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (email, password,name, phoneNumber, location) => {
    setLoading(true);
    setError('');
    try {
      await fetcher('/auth/register', { // fetcher is globally available
        method: 'POST',
        body: JSON.stringify({ email, password,name,phoneNumber, location }),
      });

      alert('Registration successful! You can now log in.');
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="bg-white p-12 rounded-2xl shadow-4xl w-full max-w-md border border-gray-100">
        <h1 className="text-5xl font-bold mb-10 text-center text-gray-800 drop-shadow-sm">Join Our Community!</h1>
        <AuthForm onSubmit={handleSignup} type="signup" />
        {error && <p className="text-red-500 text-center mt-6 text-base font-medium">{error}</p>}
        <p className="text-center mt-8 text-base text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 hover:underline font-semibold"> {/* <--- CHANGE THIS */}
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}