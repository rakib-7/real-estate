'use client';
import React from 'react';

export default function TermsAndConditionsPage() {
    return (
        <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
                <div className="space-y-4 text-gray-700">
                    <p>Welcome to RealEstate. By accessing our website, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>
                    
                    <h2 className="text-2xl font-semibold pt-4">1. User Accounts</h2>
                    <p>You must be at least 18 years of age to create an account. You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account.</p>

                    <h2 className="text-2xl font-semibold pt-4">2. Property Listings</h2>
                    <p>As a user listing a property, you warrant that you are the legal owner or have the authority to list the property. You agree that all information provided, including photos, price, and location, is accurate and not misleading. You are responsible for updating the status of your listing once it is sold or rented.</p>

                    <h2 className="text-2xl font-semibold pt-4">3. Limitation of Liability</h2>
                    <p>RealEstate is a platform for connecting property listers with potential buyers/renters. We do not verify the accuracy of every listing. We are not liable for any fraudulent listings, disputes, or damages arising from the use of our platform.</p>

                    <h2 className="text-2xl font-semibold pt-4">4. Governing Law</h2>
                    <p>These terms shall be governed by and construed in accordance with the laws of Bangladesh. Any disputes will be resolved in the courts of Bangladesh.</p>
                    
                    <p className="pt-6 text-sm text-gray-500">Last updated: August 12, 2025</p>
                </div>
            </div>
        </div>
    );
}