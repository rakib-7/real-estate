// frontend/src/components/auth/AuthForm.js
'use client';

import React, { useState } from 'react'; // Ensure React and useState are imported
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const AuthForm = ({ onSubmit, type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(''); // State for name field
  const [phoneNumber, setPhoneNumber] = useState(''); // State for phone number
  const [location, setLocation] = useState('');     // State for location
  const [agreedToTerms, setAgreedToTerms] = useState(false); // State for terms agreement
  const isLogin = type === 'login'; // Determines if it's a login or signup form

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic client-side validation for signup
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (!isLogin && !name.trim()) { // Ensure name is not just whitespace for signup
        alert('Full Name is required for registration.');
        return;
    }
    if (!isLogin && !phoneNumber.trim()) {
                alert('Phone Number is required for registration.');
                return;
            }

    // Call the onSubmit prop function with the appropriate data
    // For signup, pass all fields; for login, only email and password
    if (isLogin) {
      onSubmit(email, password);
    } else {
      onSubmit(email, password, name, phoneNumber, location);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Conditional rendering for signup-specific fields */}
      {!isLogin && (
        // React Fragment <>...</> is used to group multiple elements without adding an extra DOM node.
        // This is correct usage for conditional rendering of multiple inputs.
        <>
          <Input
            label="Full Name"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mohammad Rakib" // Placeholder text for full name
            required // Name is now required for signup
            //className="mb-4"
          />
          <Input
            label="Phone Number"
            type="tel" // Use type="tel" for phone numbers
            id="phoneNumber"
            name="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+8801XXXXXXXXX"
            required
            //className="mb-4"
          />
          <Input
            label="Location"
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Dhaka, Bangladesh"
            className="mb-4"
          />
        </>
      )}

      {/* Email Input (common to both login and signup) */}
      <Input
        label="Email Address"
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@example.com"
        required
      />

      {/* Password Input (common to both login and signup) */}
      <Input
        label="Password"
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      {/* Confirm Password Input (only for signup) */}
      {!isLogin && (
        <Input
          label="Confirm Password"
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      )}

      {!isLogin && (
                <div className="flex items-center">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                        I agree to the{' '}
                        <Link href="/terms-and-conditions" className="font-medium text-indigo-600 hover:underline" target="_blank">
                            Terms & Conditions
                        </Link>
                        .
                    </label>
                </div>
            )}

      {/* Submit Button */}
      <Button 
                type="submit" 
                className="w-full mt-8 bg-indigo-700 hover:bg-indigo-800"
                // The button is disabled if it's a signup form and the user hasn't agreed to the terms.
                disabled={!isLogin && !agreedToTerms}
            >
                {isLogin ? 'Login' : 'Create Account'}
            </Button>
    </form>
  );
};

export default AuthForm;