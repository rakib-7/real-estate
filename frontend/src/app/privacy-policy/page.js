'use client';
import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <div className="space-y-4 text-gray-700">
                    <p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p>
                    
                    <h2 className="text-2xl font-semibold pt-4">1. Information We Collect</h2>
                    <p>We collect personal information you provide during registration (name, email, phone number) and information you generate (property listings, chat messages). We also collect anonymous usage data to improve our service.</p>

                    <h2 className="text-2xl font-semibold pt-4">2. How We Use Your Information</h2>
                    <p>We use your information to operate the platform, such as displaying your listings, facilitating communication through our chat feature, and managing your account. We do not sell your personal data to third parties.</p>

                    <h2 className="text-2xl font-semibold pt-4">3. Data Security</h2>
                    <p>We take reasonable measures to protect your personal information from unauthorized access or disclosure. This includes practices like hashing passwords.</p>
                    
                    <p className="pt-6 text-sm text-gray-500">Last updated: August 12, 2025</p>
                </div>
            </div>
        </div>
    );
}