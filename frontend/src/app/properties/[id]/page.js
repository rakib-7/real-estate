'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatBdtPrice } from '@/lib/utils';
import fetcher from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';

export default function PropertyDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mainImageIndex, setMainImageIndex] = useState(0);

    
    useEffect(() => {
        if (id) {
            const fetchProperty = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await fetcher(`/properties/${id}`);
                    setProperty(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchProperty();
        }
    }, [id]);

    const handleContactAdmin = () => {
        if (!isAuthenticated) {
            alert('Please log in to chat with an admin.');
            router.push('/login');
            return;
        }
        router.push('/dashboard/user/inquiries');
    };

    const handleBookmark = async () => {
        if (!isAuthenticated) {
            alert('Please log in to bookmark properties.');
            router.push('/login');
            return;
        }
        try {
            await fetcher('/user/bookmarks', {
                method: 'POST',
                body: JSON.stringify({ propertyId: parseInt(id) }),
            });
            alert('Property bookmarked successfully!');
        } catch (err) {
            alert(err.message);
        }
    };
    

    if (loading || authLoading) return <div className="text-center p-8 text-xl text-gray-700 dark:text-gray-300">Loading property details...</div>;
    if (error) return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
    if (!property) return <div className="text-center p-8 text-xl text-gray-700 dark:text-gray-300">Property not found.</div>;

    
    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            <main className="container mx-auto p-4 md:p-8">
                {/* --- Image Gallery Section --- */}
                <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[500px] mb-8">
                    {/* Main Image */}
                    <div className="col-span-3 row-span-2 md:col-span-2 h-full">
                        <img
                            // src={property.images && property.images.length > 0 ? `${API_BASE_URL.replace('/api', '')}${property.images[mainImageIndex].url}` : 'https://placehold.co/800x600?text=No+Image'}
                             src={property.images && property.images.length > 0 ? property.images[mainImageIndex].url : 'https://placehold.co/800x600?text=No+Image'}
                            alt={property.title}
                            className="w-full h-full object-cover rounded-2xl shadow-lg"
                        />
                    </div>
                    {/* Thumbnail Images */}
                    <div className="hidden md:grid col-span-1 row-span-2 grid-rows-3 gap-2">
                        {property.images && property.images.slice(0, 3).map((image, index) => (
                            <img
                                key={image.id}
                                // src={`${API_BASE_URL.replace('/api', '')}${image.url}`}
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                onClick={() => setMainImageIndex(index)}
                                className={`w-full h-full object-cover rounded-xl cursor-pointer transition-opacity duration-300 ${mainImageIndex === index ? 'opacity-100 border-4 border-indigo-500' : 'opacity-70 hover:opacity-100'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* --- Main Content Section --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details & Description */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                            {/* Header */}
                            <div className="border-b dark:border-gray-700 pb-4 mb-6">
                                <p className="text-indigo-600 dark:text-indigo-400 font-semibold">{property.category} for {property.type}</p>
                                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mt-1">{property.title}</h1>
                                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {`${property.area}, ${property.city}, ${property.division}`}
                                </p>
                            </div>
                            {/* Description */}
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About this property</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{property.description}</p>
                        </div>
                    </div>

                    {/* Right Column: Price & Actions */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border dark:border-gray-700">
                            <p className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6 text-center">{formatBdtPrice(property.price)}</p>
                            <div className="space-y-4">
                                <Button onClick={handleContactAdmin} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg transition-transform hover:scale-105">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    Chat with Admin
                                </Button>
                                <Button onClick={handleBookmark} className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                    Bookmark Listing
                                </Button>
                            </div>
                            {property.contactInfo && (
                                <div className="mt-6 pt-6 border-t dark:border-gray-700 text-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Admin Contact:</p>
                                    <p className="font-semibold text-gray-700 dark:text-gray-200">{property.contactInfo}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
