'use client';
import React from 'react';
import Button from '@/components/ui/Button'; // Assuming you have this Button component

export default function PricingPage() {
    // COMMENTED OUT: Your entire old return statement is replaced by the new redesigned version below.
    /*
    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Our Plans</h1>
            <div className="grid md:grid-cols-3 gap-8">
                // Free Plan
                <div className="border p-6 rounded-lg">
                    <h2 className="text-2xl font-bold">Free</h2>
                    <p>3 Property Listings</p>
                    <Button disabled>Your Current Plan</Button>
                </div>
                // Pro Plan
                <div className="border p-6 rounded-lg">
                    <h2 className="text-2xl font-bold">Pro Plan</h2>
                    <p>50 Property Listings</p>
                    <p>৳2000 / month</p>
                    <Button className="bg-indigo-600">Upgrade Now (via bKash)</Button>
                </div>
            </div>
        </div>
    );
    */

    // CORRECTED: The new, "dashing" UI for the pricing page.
    return (
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
            <div className="container mx-auto px-8 text-center">
                <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">Our Pricing Plans</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Choose the perfect plan to get your properties in front of the right audience.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 max-w-5xl mx-auto">
                    {/* Free Plan Card */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400">Free Plan</h2>
                        <p className="text-5xl font-extrabold text-gray-800 dark:text-white my-4">৳0</p>
                        <ul className="space-y-3 text-left text-gray-600 dark:text-gray-300 mb-8">
                            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>3 Property Listings / month</li>
                            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Admin Approval Required</li>
                            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Basic Support via Chat</li>
                        </ul>
                        <Button disabled className="w-full bg-gray-200 text-gray-500 cursor-not-allowed">
                            Your Current Plan
                        </Button>
                    </div>

                    {/* Pro Plan Card (Most Popular) */}
                    <div className="bg-indigo-600 text-white p-8 rounded-2xl shadow-2xl transform scale-105">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Pro Plan</h2>
                            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">POPULAR</span>
                        </div>
                        <p className="text-5xl font-extrabold my-4">৳3000 <span className="text-lg font-medium text-indigo-200">/ month</span></p>
                        <ul className="space-y-3 text-left text-indigo-100 mb-8">
                            <li className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>50 Property Listings / month</li>
                            <li className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Priority Listing Approval</li>
                            <li className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Featured Listing Options</li>
                            <li className="flex items-center"><svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Dedicated Support</li>
                        </ul>
                        <Button onClick={() => alert('bKash/Nagad integration coming soon!')} className="w-full bg-ingigo text-white-600 hover:bg-blue font-bold">
                            Upgrade Now
                        </Button>
                    </div>
                    
                    {/* Enterprise Plan Card */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400">Enterprise</h2>
                        <p className="text-4xl font-extrabold text-gray-800 dark:text-white my-4">Contact Us</p>
                        <ul className="space-y-3 text-left text-gray-600 dark:text-gray-300 mb-8">
                            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Unlimited Listings</li>
                            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Developer Showcase Page</li>
                            <li className="flex items-center"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Analytics & Reporting</li>
                        </ul>
                        <Button onClick={() => alert('coming soon')} className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300">
                            Contact Sales
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}