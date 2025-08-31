'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import fetcher from '@/lib/api';
import Link from 'next/link';

const VerifyEmailContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('Verifying...');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (!token) {
            setStatus('Error');
            setError('Verification token is missing. The link may be invalid.');
            return;
        }

        const verifyToken = async () => {
            try {
                const data = await fetcher(`/auth/verify-email/${token}`);
                setStatus('Success!');
                setError('');
                
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (err) {
                setStatus('Error');
                setError(err.message || 'Failed to verify email. The token may be invalid or expired.');
            }
        };

        verifyToken();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                {status === 'Verifying...' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold">Verifying Your Email</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Please wait a moment...</p>
                    </>
                )}
                {status === 'Success!' && (
                    <>
                        <h2 className="text-2xl font-bold text-green-600">Email Verified!</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">Your account has been successfully verified. Redirecting you to the login page...</p>
                    </>
                )}
                {status === 'Error' && (
                    <>
                        <h2 className="text-2xl font-bold text-red-500">Verification Failed</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
                        <Link href="/login" className="text-indigo-600 hover:underline mt-4 inline-block">
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}