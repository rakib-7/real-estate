'use client';
import React, { useState, useEffect } from 'react';
import fetcher from '@/lib/api';

export default function AdminAnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetcher('/admin/analytics');
            setAnalyticsData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-center p-8 text-xl text-gray-700">Loading analytics...</p>;
    }

    if (error) {
        return <p className="text-center p-8 text-red-500 text-xl">Error: {error}</p>;
    }

    return (
        <>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Site Analytics Overview</h2>
            {analyticsData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-blue-50 p-6 rounded-xl shadow-md border border-blue-100 text-center">
                        <p className="text-5xl font-extrabold text-blue-700">{analyticsData.totalUsers}</p>
                        <p className="text-lg text-gray-700 mt-2">Total Users</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-xl shadow-md border border-green-100 text-center">
                        <p className="text-5xl font-extrabold text-green-700">{analyticsData.totalProperties}</p>
                        <p className="text-lg text-gray-700 mt-2">Total Properties Listed</p>
                    </div>
                    
                    {/* COMMENTED OUT: The old "Total Inquiries" card. */}
                    {/*
                    <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-100 text-center">
                        <p className="text-5xl font-extrabold text-yellow-700">{analyticsData.totalInquiries}</p>
                        <p className="text-lg text-gray-700 mt-2">Total Inquiries</p>
                    </div>
                    */}

                    {/* CORRECTED: This card now displays the total number of chat threads. */}
                    <div className="bg-yellow-50 p-6 rounded-xl shadow-md border border-yellow-100 text-center">
                        <p className="text-5xl font-extrabold text-yellow-700">{analyticsData.totalChats}</p>
                        <p className="text-lg text-gray-700 mt-2">Total Chats</p>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-xl shadow-md border border-purple-100 text-center">
                        <p className="text-5xl font-extrabold text-purple-700">{analyticsData.featuredPropertiesCount}</p>
                        <p className="text-lg text-gray-700 mt-2">Featured Properties</p>
                    </div>

                    <div className="md:col-span-full bg-gray-50 p-8 rounded-xl shadow-inner-lg border border-gray-200">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Recent Activity</h3>
                        
                        {/* CORRECTED: The recent activity section is now split to show different types of recent data. */}
                        <div className="space-y-6">
                            {/* Recent Users */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-2">New Users</h4>
                                {analyticsData.recentActivity?.users?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analyticsData.recentActivity.users.map(user => (
                                            <li key={user.id} className="text-gray-600">New user registered: <strong>{user.name || user.email}</strong></li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500">No new users.</p>}
                            </div>

                            {/* Recent Properties */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-2">New Properties</h4>
                                {analyticsData.recentActivity?.properties?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analyticsData.recentActivity.properties.map(prop => (
                                            <li key={prop.id} className="text-gray-600">New property listed: <strong>{prop.title}</strong></li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500">No new properties.</p>}
                            </div>

                            {/* Recent Chats */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-2">Recent Chats</h4>
                                {analyticsData.recentActivity?.chats?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {analyticsData.recentActivity.chats.map(chat => (
                                            <li key={chat.id} className="text-gray-600">Chat updated with <strong>{chat.user.name || chat.user.email}</strong> ({chat._count.messages} messages)</li>
                                        ))}
                                    </ul>
                                ) : <p className="text-gray-500">No recent chat activity.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 text-lg">No analytics data available.</p>
            )}
        </>
    );
}