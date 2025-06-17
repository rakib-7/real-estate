'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../../components/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (email, password) => {
    setError('');
    try {
      // Assuming your backend runs on http://localhost:5000
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      alert('Registration successful! You can now log in.');
      router.push('/login'); // Redirect to login page after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up for Real Estate Portal</h1>
        <AuthForm onSubmit={handleSignup} type="signup" />
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}