// frontend/src/components/PropertyCard.js
'use client';
import React, { useState } from 'react'; // ADDED: useState for the image carousel
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
//import { formatPrice } from '@/lib/utils';
import { formatBdtPrice } from '@/lib/utils'; // Use the updated format function
import { API_BASE_URL } from '@/lib/api';
import { useTranslation } from 'react-i18next';
const PropertyCard = ({ property, showActions = false, onRemoveBookmark }) => {
  const { isAuthenticated } = useAuth(); // Get authentication status
  const router = useRouter();          // Get router instance
  const { t } = useTranslation();      // Get translation function

  const handleViewDetails = () => {
        if (isAuthenticated) {
            // If the user is logged in, go to the property details page
            router.push(`/properties/${property.id}`);
        } else {
            // If the user is NOT logged in, redirect them to the login page
            alert('You need to log in to view property details.');
            router.push('/login');
        }
    };
  // ADDED: State for the image carousel
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () => {
    // CORRECTED: Check for 'images' array instead of 'imageUrl'
    setImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    // CORRECTED: Check for 'images' array instead of 'imageUrl'
    setImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    // <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full transform hover:-translate-y-1">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl ...">
      {/* CORRECTED: Check for 'images' array instead of 'imageUrl' */}
      {property.images && property.images.length > 0 ? (
        <div className="relative">
          {/* CORRECTED: Access 'url' from the 'images' array */}
          <img src={`${API_BASE_URL}${property.images[imageIndex].url}`} className="w-full h-48 object-cover" />
          {property.images.length > 1 && (
            <>
              {/* Corrected button tags for the carousel */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow"
              >‹</button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow"
              >›</button>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{property.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {/* {property.location} */}
          {/* CORRECTED: Display new, more specific location. */}
          {`${property.area}, ${property.city}`}
        </p>
        {/* <p className="text-blue-600 font-bold text-lg mb-2">{formatPrice(property.price)}</p> */}
         <p className="text-indigo-600 dark: text-gray-400 font-bold text-lg mb-2">{formatBdtPrice(property.price)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-auto">{property.type} - {property.category}</p>
      </div>
      <div className="p-6 border-t border-gray-100 flex justify-between items-center">
        {/* <Link href={`/properties/${property.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg text-base font-medium transition-colors duration-200 shadow-md">
          View Details
        </Link> */}
         <Button 
                    onClick={handleViewDetails}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg ..."
                >
                    {t('viewDetails')}
                </Button>
        {showActions && onRemoveBookmark && (
          <Button
            onClick={() => onRemoveBookmark(property.id)}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md text-sm"
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;