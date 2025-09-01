'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import { formatBdtPrice } from '@/lib/utils';
import { API_BASE_URL } from '@/lib/api';
import { useTranslation } from 'react-i18next';

const PropertyCard = ({ property, showActions = false, onRemoveBookmark }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { t } = useTranslation();

    
    const handleViewDetails = () => {
        if (isAuthenticated) {
            router.push(`/properties/${property.id}`);
        } else {
            alert('You need to log in to view property details.');
            router.push('/login');
        }
    };
    const [imageIndex, setImageIndex] = useState(0);

    const nextImage = (e) => {
        e.stopPropagation(); // Prevent the card's main click event
        setImageIndex((prev) => (prev + 1) % property.images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    };
    


    

    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 border dark:border-gray-700">
            {/* Image Section with Overlays and Carousel */}
            <div className="relative h-64">
                {property.images && property.images.length > 0 ? (
                    <img
                        src={`${API_BASE_URL.replace('/api', '')}${property.images[imageIndex].url}`}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                        No Image
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Badges for Type and Featured Status */}
                <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full capitalize">{property.type}</span>
                    {property.isFeatured && (
                        <span className="bg-yellow-400 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">Featured</span>
                    )}
                </div>

                {/* Carousel Controls */}
                {property.images && property.images.length > 1 && (
                    <>
                        <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100">
                            ‹
                        </button>
                        <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-opacity opacity-0 group-hover:opacity-100">
                            ›
                        </button>
                    </>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6 flex-grow flex flex-col">
                <p className="text-indigo-500 dark:text-indigo-400 font-semibold text-sm mb-1">{property.category}</p>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 truncate" title={property.title}>{property.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {`${property.area}, ${property.city}`}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{formatBdtPrice(property.price)}</p>
                    <Button 
                        onClick={handleViewDetails}
                        className="bg-indigo-700 hover:bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:hover:bg-indigo-900 dark:text-indigo-300 font-semibold py-2 px-5 rounded-lg"
                    >
                        {t('viewDetails')}
                    </Button>
                </div>
                {showActions && onRemoveBookmark && (
                    <div className="mt-4">
                        <Button
                            onClick={() => onRemoveBookmark(property.id)}
                            className="w-full bg-red-100 hover:bg-red-200 text-red-800 text-sm font-semibold"
                        >
                            Remove Bookmark
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertyCard;
