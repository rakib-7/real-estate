// 'use client';
// import React, { useState, useEffect } from 'react';
// //import Navbar from '@/components/Navbar'; // Correct path
// import Input from '@/components/ui/Input'; // Correct path
// import Button from '@/components/ui/Button'; // Correct path
// import PropertyCard from '@/components/PropertyCard'; // Correct path
// import fetcher from '@/lib/api';
// import { formatPrice } from '@/lib/utils';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// // fetcher is globally available

// export default function PropertiesPage() {
//   const router = useRouter();
//   const {isAuthenticated} = useAuth();
//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchParams, setSearchParams] = useState({
//     location: '',
//     minPrice: '',
//     maxPrice: '',
//     type: '',
//     category: '',
//     nearLocation: '',
//     suggestedByBookmarks: false,
//   });

//   const fetchProperties = async () => {
//     setLoading(true);
//     setError(null);
//     const queryParams = {...searchParams};
//      if (isAuthenticated && queryParams.suggestedByBookmarks) {
//       queryParams.suggestedByBookmarks = 'true'; // Send as string for backend query parsing
//     } else {
//       delete queryParams.suggestedByBookmarks; // Don't send if not authenticated or checkbox is false
//     }
//     const query = new URLSearchParams(searchParams).toString();
//     try {
//       const data = await fetcher(`/properties?${query}`);
//       setProperties(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProperties();
//   }, [searchParams, isAuthenticated]);
  

//   const handleSearchChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSearchParams(prev => ({ ...prev,
//        [name]: type === 'checkbox' ? checked : value 
//       }));
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchProperties();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      
//       <main className="container mx-auto p-8 flex-grow">
//         <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Discover Your Next Home</h1>

//         <form onSubmit={handleSearchSubmit} className="bg-white p-6 rounded-xl shadow-lg mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           <Input
//             label="Location"
//             type="text"
//             name="location"
//             value={searchParams.location}
//             onChange={handleSearchChange}
//             placeholder="e.g., Chittagong, Dhaka"
//           />
//           <Input
//             label="Min Price"
//             type="number"
//             name="minPrice"
//             value={searchParams.minPrice}
//             onChange={handleSearchChange}
//             placeholder="e.g., 100000"
//           />
//           <Input
//             label="Max Price"
//             type="number"
//             name="maxPrice"
//             value={searchParams.maxPrice}
//             onChange={handleSearchChange}
//             placeholder="e.g., 500000"
//           />
//           <Input // NEW: Near Location Input
//             label="Near Location (City/Area)"
//             type="text"
//             name="nearLocation"
//             value={searchParams.nearLocation}
//             onChange={handleSearchChange}
//             placeholder="e.g., Gulshan, Agrabad"
//           />
//           <div>
//             <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
//             <select
//               id="type"
//               name="type"
//               value={searchParams.type}
//               onChange={handleSearchChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             >
//               <option value="">All Types</option>
//               <option value="rent">Rent</option>
//               <option value="sale">Sale</option>
//             </select>
//           </div>
//           <div>
//             <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//             <select
//               id="category"
//               name="category"
//               value={searchParams.category}
//               onChange={handleSearchChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//             >
//               <option value="">All Categories</option>
//               <option value="house">House</option>
//               <option value="apartment">Apartment</option>
//               <option value="commercial">Commercial</option>
//               <option value="land">Land</option>
//             </select>
//           </div>
//           {isAuthenticated && ( // Only show if logged in
//             <div className="col-span-full flex items-center mt-4">
//               <input
//                 type="checkbox"
//                 id="suggestedByBookmarks"
//                 name="suggestedByBookmarks"
//                 checked={searchParams.suggestedByBookmarks}
//                 onChange={handleSearchChange}
//                 className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md transition-all duration-200 ease-in-out"
//               />
//               <label htmlFor="suggestedByBookmarks" className="text-base text-gray-700 font-medium">
//                 Show suggestions based on bookmarks
//               </label>
//             </div>
//           )}
//           <div className="md:col-span-2 lg:col-span-4 flex justify-end">
//             <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6">
//               Search Properties
//             </Button>
//           </div>
//         </form>

//         {loading && <p className="text-center text-gray-600 text-lg">Loading amazing properties...</p>}
//         {error && <p className="text-center text-red-500 text-lg">Error: {error}</p>}
//         {!loading && !error && properties.length === 0 && (
//           <p className="text-center text-gray-600 text-lg">No properties found matching your criteria. Try adjusting your search!</p>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
//           {properties.map(property => (
//             <PropertyCard key={property.id} property={property} />
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

//gemini

// frontend/src/app/properties/page.js
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PropertiesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // COMMENTED: This page is no longer needed. Redirect to the homepage where the new search is located.
    router.replace('/'); 
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <p className="text-xl text-gray-700">Redirecting to homepage...</p>
    </div>
  );
}