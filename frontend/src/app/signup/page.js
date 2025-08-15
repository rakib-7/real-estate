'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/api';
import AuthLayout from '@/components/auth/AuthLayout'; // Import the new layout

export default function SignupPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [location, setLocation] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await fetcher('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, phoneNumber, location }),
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
        <AuthLayout type="signup">
            <div className="form-container sign-up">
                <form onSubmit={handleSignup}>
                    <h1>Create Account</h1>
                    <span>or use your email for registration</span>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
                    <button type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</button>
                </form>
            </div>
        </AuthLayout>
    );
}