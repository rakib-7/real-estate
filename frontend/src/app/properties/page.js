'use client';
import { useEffect, useCallback, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
// import PropertySearchForm from '@/components/PropertySearchForm'; // This is not used as the form is integrated
import { useAuth } from '@/context/AuthContext';
import fetcher, { API_BASE_URL } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';

// This is the main component that contains the page logic.
const PropertiesPageContent = () => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const urlSearchParams = useSearchParams();

    // State for the banner
    const [banners, setBanners] = useState([]);

    // State for the expandable search bar
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchParams, setSearchParams] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        category: '',
    });

    const fetchPropertiesAndBanner = useCallback(async (params) => {
        setLoading(true);
        setError(null);
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null && v !== '')
        );
        const query = new URLSearchParams(cleanParams).toString();
        try {
            // Fetch both properties and banners at the same time
            const [propertyData, bannerData] = await Promise.all([
                fetcher(`/properties?${query}`),
                fetcher('/properties/banners') // Also fetch banners
            ]);
            setProperties(propertyData);
            setBanners(bannerData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // This useEffect runs once when the page loads to perform the initial search.
    useEffect(() => {
        const initialParams = Object.fromEntries(urlSearchParams.entries());
        setSearchParams(prev => ({ ...prev, ...initialParams }));
        fetchPropertiesAndBanner(initialParams);
    }, [fetchPropertiesAndBanner, urlSearchParams]);

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchPropertiesAndBanner(searchParams);
        const query = new URLSearchParams(searchParams).toString();
        router.push(`/properties?${query}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="container mx-auto p-8 flex-grow">
                
                {/* COMMENTED OUT: The old, simpler banner section. */}
                {/*
                {banners.length > 0 && (
                    <section className="relative w-full h-64 bg-indigo-700 text-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg mb-12">
                        <img
                            src={`${API_BASE_URL.replace('/api', '')}${banners[0].imageUrl}`}
                            alt={banners[0].title}
                            className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                        <div className="relative z-10 text-center p-8">
                            <h1 className="text-4xl font-bold mb-2 drop-shadow-md">
                                {banners[0].title}
                            </h1>
                            <p className="text-lg text-indigo-200">
                                {banners[0].description}
                            </p>
                        </div>
                    </section>
                )}
                */}

                {/* --- ADDED: New, "Beautiful" Banner Section --- */}
                {banners.length > 0 && (
                    <section className="relative w-full h-80 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl mb-16 group">
                        {/* Background Image with Ken Burns Effect */}
                        <img
                            src={`${API_BASE_URL.replace('/api', '')}${banners[0].imageUrl}`}
                            alt={banners[0].title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5000ms] ease-in-out group-hover:scale-110"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 via-purple-900/50 to-black/30"></div>
                        
                        {/* Content with Animation */}
                        <div className="relative z-10 text-center p-8 animate-fade-in-up">
                             <style jsx>{`
                                @keyframes fade-in-up {
                                    from { opacity: 0; transform: translateY(30px); }
                                    to { opacity: 1; transform: translateY(0); }
                                }
                                .animate-fade-in-up {
                                    animation: fade-in-up 0.8s ease-out forwards;
                                }
                            `}</style>
                            <h1 className="text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
                                {banners[0].title}
                            </h1>
                            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
                                {banners[0].description}
                            </p>
                        </div>
                    </section>
                )}


                <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">Browse Properties</h1>
                <p className="text-lg text-gray-600 mb-8 text-center">Find the perfect property that meets your needs.</p>
                
                {/* --- Redesigned Search Form (Matches Homepage) --- */}
                <div className="w-full max-w-4xl mx-auto mb-12">
                    <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-gray-200 shadow-xl">
                        <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-gray-400 mx-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                <input
                                    type="text"
                                    name="location"
                                    value={searchParams.location}
                                    onChange={handleSearchChange}
                                    placeholder="Search by Location (e.g., Gulshan, Dhaka)"
                                    className="w-full border-none focus:ring-0 text-lg text-gray-800 placeholder-gray-500 bg-transparent"
                                />
                                <Button type="button" onClick={() => setIsSearchExpanded(!isSearchExpanded)} title="Advanced Filters" className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 ml-2">
                                    <svg className={`w-5 h-5 transition-transform duration-300 ${isSearchExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                                </Button>
                                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-12 px-8 ml-2 flex-shrink-0">
                                    Search
                                </Button>
                            </div>
                            {isSearchExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-200">
                                    <Input type="number" name="minPrice" value={searchParams.minPrice} onChange={handleSearchChange} placeholder="Min Price (BDT)" />
                                    <Input type="number" name="maxPrice" value={searchParams.maxPrice} onChange={handleSearchChange} placeholder="Max Price (BDT)" />
                                    <select name="type" value={searchParams.type} onChange={handleSearchChange} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">All Types</option>
                                        <option value="rent">For Rent</option>
                                        <option value="sale">For Sale</option>
                                    </select>
                                    <select name="category" value={searchParams.category} onChange={handleSearchChange} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">All Categories</option>
                                        <option value="house">House</option>
                                        <option value="apartment">Apartment</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="land">Land</option>
                                    </select>
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                {loading && <p className="text-center text-gray-600 text-lg">Loading properties...</p>}
                {error && <p className="text-center p-8 text-red-500 text-xl">Error: {error}</p>}
                {!loading && !error && properties.length === 0 && (
                    <p className="text-center text-gray-600 text-lg">No properties found. Please try a different search.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </main>
        </div>
    );
}

// This is the main export for the page. It wraps the content in a Suspense boundary,
// which is required for using the useSearchParams hook.
export default function PropertiesPage() {
    return (
        <Suspense fallback={<div className="text-center p-8 text-xl text-gray-700">Loading Search...</div>}>
            <PropertiesPageContent />
        </Suspense>
    );
}
