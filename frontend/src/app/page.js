// src/app/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button'; // Correct path
import Input from '@/components/ui/Input'; // Correct path
import PropertyCard from '@/components/PropertyCard'; // To display listed properties
import { useAuth } from '@/context/AuthContext'; // To get user authentication status
import fetcher, {API_BASE_URL} from '@/lib/api'; // For making API calls
import { formatPrice } from '@/lib/utils'; // For formatting prices in property cards
import Navbar from '@/components/Navbar'; // Global Navbar is now in layout.js


//const API_BASE_URL = 'http://localhost:5000';
export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth(); // Check if a user is logged in

  // ADDED: State to manage the banner data and its loading state
  const [banners, setBanners] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true);
  const [bannersError, setBannersError] = useState(null);

  // ADDED: State to manage the properties shown below the search bar
  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState(null);

  // ADDED: State to control the dynamic search bar's expansion
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  // ADDED: State for all the search parameters
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    category: '',
    nearLocation: '',
    suggestedByBookmarks: false,
  });

  // ADDED: useEffect hook to fetch banners when the component mounts
  useEffect(() => {
    const fetchBanners = async () => {
      setBannersLoading(true);
      setBannersError(null);
      try {
        // This is a new public endpoint to fetch banners from the backend
        const data = await fetcher('/properties/banners');
        setBanners(data);
      } catch (err) {
        setBannersError(err.message);
      } finally {
        setBannersLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // ADDED: useEffect hook to fetch properties based on search parameters
  useEffect(() => {
    const fetchProperties = async () => {
      setPropertiesLoading(true);
      setPropertiesError(null);
      const queryParams = { ...searchParams };
      // Conditionally add the 'suggestedByBookmarks' flag if the user is authenticated and the checkbox is checked
      if (isAuthenticated && queryParams.suggestedByBookmarks) {
        queryParams.suggestedByBookmarks = 'true';
      } else {
        delete queryParams.suggestedByBookmarks;
      }
      const query = new URLSearchParams(queryParams).toString();
      try {
        // Fetch public properties from the backend, filtered by search query
        const data = await fetcher(`/properties?${query}`);
        setProperties(data);
      } catch (err) {
        setPropertiesError(err.message);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();
    // Re-run this effect whenever the search parameters or authentication status changes
  }, [searchParams, isAuthenticated]);

  // ADDED: Handler for form input changes
  const handleSearchChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ADDED: Handler for form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // The useEffect hook will automatically trigger a new fetch because searchParams state has changed
    setIsSearchExpanded(false); // Collapse the search bar after submitting the form
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navbar is now in a separate layout file */}
      <main className="flex-grow"> {/* The main tag now correctly wraps all sections */}
        
        {/* ADDED: Banner Section - Shown at the top of the homepage */}
        <section className="relative w-full h-96 bg-gray-800 text-white flex items-center justify-center overflow-hidden shadow-xl">
          {bannersLoading ? (
            <div className="text-xl">Loading banners...</div>
          ) : bannersError ? (
            <div className="text-xl text-red-300">Error loading banners: {bannersError}</div>
          ) : banners.length > 0 ? (
            <div className="w-full h-full">
              {/* Display the banner image */}
              <img
                // src={banners[0].imageUrl}
                // src={`${API_BASE_URL}${banners[0].imageUrl}`}
                src={`${API_BASE_URL.replace('/api', '')}${banners[0].imageUrl}`}
                alt={banners[0].title}
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                onError={(e) => { e.target.src = 'https://placehold.co/1920x1080?text=RealEstatePro+Banner'; }}
              />
              {/* Overlay with banner text */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black bg-opacity-40 p-8">
                <h1 className="text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg text-center">
                  {banners[0].title || "Find Your Dream Property"}
                </h1>
                <p className="text-2xl text-gray-200 mb-8 max-w-3xl text-center">
                  {banners[0].description || "Explore a diverse range of properties for rent or sale."}
                </p>
                {/* Conditionally render a link if the banner has one */}
                {banners[0].linkUrl && (
                  <Link href={banners[0].linkUrl} className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                    Learn More
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <h1 className="text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg text-center">
              Your Dream Property Awaits.
            </h1>
          )}
        </section>

        {/* ADDED: Search Bar Section - Dynamically expands on click */}
        <section className="relative -mt-16 z-20 container mx-auto px-4">
          <div className="bg-white p-6 rounded-2xl shadow-3xl border border-gray-100">
            {/* Conditional Rendering: Show a simple search bar if not expanded */}
            {!isSearchExpanded ? (
              <div className="flex items-center justify-between p-2 cursor-pointer" onClick={() => setIsSearchExpanded(true)}>
                <Input
                  type="text"
                  placeholder="Search by location, price, or type..."
                  className="flex-grow mr-4 border-none shadow-none focus:ring-0"
                  readOnly // This makes the input un-editable, so click event triggers the expansion
                  onClick={() => setIsSearchExpanded(true)}
                />
                <Button type="button" onClick={() => setIsSearchExpanded(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg">
                  Search
                </Button>
              </div>
            ) : (
              // If the search bar is expanded, show the detailed form
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Input
                  label="Location"
                  type="text"
                  name="location"
                  value={searchParams.location}
                  onChange={handleSearchChange}
                  placeholder="e.g., Chittagong, Dhaka"
                />
                <Input
                  label="Min Price"
                  type="number"
                  name="minPrice"
                  value={searchParams.minPrice}
                  onChange={handleSearchChange}
                  placeholder="e.g., 100000"
                />
                <Input
                  label="Max Price"
                  type="number"
                  name="maxPrice"
                  value={searchParams.maxPrice}
                  onChange={handleSearchChange}
                  placeholder="e.g., 500000"
                />
                <Input
                  label="Near Location (City/Area)"
                  type="text"
                  name="nearLocation"
                  value={searchParams.nearLocation}
                  onChange={handleSearchChange}
                  placeholder="e.g., Gulshan, Agrabad"
                />
                <div>
                  <label htmlFor="type" className="block text-base font-medium text-gray-700 mb-2">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={searchParams.type}
                    onChange={handleSearchChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out"
                  >
                    <option value="">All Types</option>
                    <option value="rent">Rent</option>
                    <option value="sale">Sale</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-base font-medium text-gray-700 mb-2">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={searchParams.category}
                    onChange={handleSearchChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out"
                  >
                    <option value="">All Categories</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                {isAuthenticated && (
                  <div className="col-span-full flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="suggestedByBookmarks"
                      name="suggestedByBookmarks"
                      checked={searchParams.suggestedByBookmarks}
                      onChange={handleSearchChange}
                      className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md transition-all duration-200 ease-in-out"
                    />
                    <label htmlFor="suggestedByBookmarks" className="text-base text-gray-700 font-medium">
                      Show suggestions based on my bookmarks
                    </label>
                  </div>
                )}
                <div className="md:col-span-2 lg:col-span-4 flex justify-end mt-6">
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-10 shadow-lg">
                    Search Properties
                  </Button>
                  <Button type="button" onClick={() => setIsSearchExpanded(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-3.5 px-10 shadow-md ml-4">
                    Collapse
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ADDED: Property Listings Section */}
        <section className="container mx-auto p-8 mt-8 flex-grow">
          <h2 className="text-4xl font-bold mb-10 text-gray-800 text-center drop-shadow-sm">Featured Properties</h2>
          {propertiesLoading && <p className="text-center text-gray-600 text-xl font-medium">Loading amazing properties...</p>}
          {propertiesError && <p className="text-center text-red-500 text-xl font-medium">Error: {propertiesError}</p>}
          {!propertiesLoading && !propertiesError && properties.length === 0 && (
            <p className="text-center text-gray-600 text-xl font-medium">No properties found matching your criteria. Try adjusting your search!</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full bg-white shadow-inner p-8 text-center text-gray-600 text-base border-t border-gray-100 mt-auto">
        &copy; {new Date().getFullYear()} RealEstatePro. All rights reserved. Designed with passion.
      </footer>
    </div>
  );
}