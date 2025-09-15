'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import AuthLayout from '@/components/auth/AuthLayout'; 

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            if (data.role === 'ADMIN') {
                router.push('/dashboard/admin');
            } else {
                router.push('/');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout type="login">
            <div className="form-container sign-in">
                <form onSubmit={handleLogin}>
                    <h1>Sign In</h1>
                    <span>use your email and password</span>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email'/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='current-password'/>
                    {error && <p className="text-red-500 dark:text-red-400 text-center mt-4 text-sm">{error}</p>}
                    <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-indigo-600 my-4">
                            Forgot Your Password?
                    </Link>
                    <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Sign In'}</button>
                </form>
            </div>
        </AuthLayout>
    );
}