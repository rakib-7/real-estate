'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import fetcher from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (resetToken) {
            setToken(resetToken);
        } else {
            setError('No reset token found. The link may be invalid.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');
        try {
            const data = await fetcher(`/auth/reset-password/${token}`, {
                method: 'POST',
                body: JSON.stringify({ password }),
            });
            setMessage(data.message);
            // Redirect to login after a short delay
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError(err.message || 'Failed to reset password. The token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    Reset Your Password
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
                    Enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Input
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <div>
                        <Button type="submit" className="w-full" disabled={loading || !token}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </div>
                </form>

                {message && <p className="text-green-600 text-center mt-6">{message}</p>}
                {error && <p className="text-red-500 text-center mt-6">{error}</p>}
            </div>
        </div>
    );
};

// This is the main export. It wraps the page in a Suspense boundary,
// which is required for using the useSearchParams hook.
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}