'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import fetcher from '@/lib/api';
import AuthLayout from '@/components/auth/AuthLayout'; // Import the new layout

export default function SignupPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');   
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
        setSuccessMessage('');
        try {
            const data = await fetcher('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, phoneNumber, location }),
            });
            setSuccessMessage(data.message);

            alert('Registration successful! You can now log in.');
           // router.push('/login');
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout type="signup">
            <div className="form-container sign-up">
                {successMessage ? (
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">Verification Email Sent</h1>
                        <p className="mt-4">{successMessage}</p>
                        <p className="mt-2">Please check your inbox (and spam folder) to complete your registration.</p>
                    </div>
                ) : (
                <form onSubmit={handleSignup}>
                    <h1>Create Account</h1>
                    <span>use your email for registration</span>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete='name'/>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete='email'/>
                    <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required autoComplete='phoneNumber'/>
                    <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} autoComplete='location'/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete='password'/>
                    {error && <p className="text-red-500 dark:text-red-400 text-center mt-4 text-sm">{error}</p>}
                    <button type="submit" disabled={loading}>{loading ? 'Creating Account...' : 'Sign Up'}</button>
                </form>
                )}
            </div>
        </AuthLayout>
    );
}