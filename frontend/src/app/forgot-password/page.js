'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const data = await fetcher('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
            setMessage(data.message);
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    Forgot Your Password?
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                    Enter your email address below and we'll send you a link to reset it.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </div>
                </form>

                {message && <p className="text-green-600 text-center mt-6">{message}</p>}
                {error && <p className="text-red-500 text-center mt-6">{error}</p>}
                
                {/* <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
                    Remembered your password?{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Back to Login
                    </Link>
                </p> */}
            </div>
        </div>
    );
}