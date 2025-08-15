'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PropertyCard from '@/components/PropertyCard';
import { useAuth } from '@/context/AuthContext';
import fetcher, { API_BASE_URL } from '@/lib/api';
// ADDED: Tone.js is a library for creating sound effects in the browser.
import * as Tone from 'tone';

export default function HomePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [banners, setBanners] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchParams, setSearchParams] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        category: '',
        nearLocation: '',
        suggestedByBookmarks: false,
    });
    const [isSticky, setIsSticky] = useState(false);

    // --- All your existing functions (useEffect, handleSearchChange, etc.) remain exactly the same ---
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const [bannerData, propertyData] = await Promise.all([
                    fetcher('/properties/banners'),
                    fetcher('/properties?isFeatured=true')
                ]);
                setBanners(bannerData);
                setProperties(propertyData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const cleanParams = Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== '' && v !== false));
        const query = new URLSearchParams(cleanParams).toString();
        router.push(`/properties?${query}`);
    };
    // --- End of existing functions ---

    // --- ADDED: Sound Effects for UI ---
    const playClickSound = () => {
        // Creates a simple, short synth sound for clicks.
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease("C5", "8n");
    };

    const playToggleSound = () => {
        // Creates a subtle pluck sound for toggles.
        const synth = new Tone.PluckSynth().toDestination();
        synth.triggerAttack("C4", Tone.now());
    };


    // COMMENTED OUT: Your entire old return statement is replaced by the redesigned version below.
    /*
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
            <header className={`sticky top-0 z-50 ...`}>
                // ... old sticky banner ...
            </header>
            <main className="flex-grow">
                <section className="relative w-full h-96 ...">
                    // ... old main banner ...
                </section>
                <section className="relative -mt-16 z-20 ...">
                    // ... old search form ...
                </section>
                <section className="container mx-auto p-8 mt-8 flex-grow">
                    // ... old property list ...
                </section>
            </main>
            <footer className="w-full bg-white ...">
                // ... old footer ...
            </footer>
        </div>
    );
    */

    // CORRECTED: The new, "dashing" UI for your homepage.
    return (
        <div className="min-h-screen flex flex-col ">
            {/* --- ADDED: Tone.js Script for Sound Effects --- */}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js"></script>

            <header className={`sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md shadow-lg transition-transform duration-300 ease-in-out ${isSticky ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto flex items-center justify-between p-3">
                    <div className="flex items-center">
                        {banners.length > 0 && (
                            <img
                                src={`${API_BASE_URL.replace('/api', '')}${banners[0].imageUrl}`}
                                alt={banners[0].title}
                                className="w-12 h-12 object-cover rounded-lg mr-4 shadow-md"
                            />
                        )}
                        <div>
                            <h2 className="text-md font-bold text-gray-800">{banners.length > 0 ? banners[0].title : "Featured Offer"}</h2>
                            <p className="text-sm text-gray-500">{banners.length > 0 ? banners[0].description : "Don't miss out!"}</p>
                        </div>
                    </div>
                    {banners.length > 0 && banners[0].linkUrl && (
                        <Link href={banners[0].linkUrl} onClick={playClickSound} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                            Learn More
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-grow">
                <section className="relative w-full h-[600px] bg-indigo-900 text-white flex flex-col items-center justify-center overflow-hidden">
                    {banners.length > 0 && (
                        <div className="absolute inset-0 w-full h-full">
                            <img
                                src={`${API_BASE_URL.replace('/api', '')}${banners[0].imageUrl}`}
                                alt={banners[0].title}
                                className="w-full h-full object-cover animate-zoom"
                            />
                            <style jsx>{`
                                @keyframes zoom {
                                    0% { transform: scale(1); }
                                    100% { transform: scale(1.1); }
                                }
                                .animate-zoom {
                                    animation: zoom 20s infinite alternate ease-in-out;
                                }
                            `}</style>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center animate-fade-in">
                        <style jsx>{`
                            @keyframes fade-in {
                                from { opacity: 0; transform: translateY(20px); }
                                to { opacity: 1; transform: translateY(0); }
                            }
                            .animate-fade-in { animation: fade-in 1s ease-out forwards; }
                        `}</style>
                        <h1 className="text-5xl md:text-7xl font-bold mb-4 text-white drop-shadow-xl">
                            {banners.length > 0 ? banners[0].title : "Your Perfect Home Awaits"}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl">
                            {banners.length > 0 ? banners[0].description : "Discover the finest properties in Bangladesh."}
                        </p>
                        <div className="w-full max-w-4xl">
                            {/* <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-2xl"> */}
                            <div className="bg-white/10 backdrop-blur-md ...">
                                <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl">
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 text-gray-500 mx-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        <input
                                            type="text"
                                            name="location"
                                            value={searchParams.location}
                                            onChange={handleSearchChange}
                                            placeholder="Search by Location (e.g., Gulshan, Dhaka)"
                                            className="w-full border-none focus:ring-0 text-lg text-gray-800 placeholder-gray-500 bg-transparent"
                                        />
                                        <Button type="button" onClick={() => { setIsSearchExpanded(!isSearchExpanded); playToggleSound(); }} title="Advanced Filters" className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg h-12 w-12 flex items-center justify-center flex-shrink-0 ml-2 transition-transform hover:scale-110">
                                            <svg className={`w-5 h-5 transition-transform duration-300 ${isSearchExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                                        </Button>
                                        <Button type="submit" onClick={playClickSound} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-12 px-8 ml-2 flex-shrink-0 shadow-lg transition-transform hover:scale-105">
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
                    </div>
                </section>
                <section className="container mx-auto p-8 py-20">
                    <h2 className="text-4xl font-bold mb-12 text-gray-800 text-center">Featured Properties</h2>
                    {loading && <p className="text-center text-gray-600 text-xl">Loading properties...</p>}
                    {error && <p className="text-center text-red-500 text-xl">Error: {error}</p>}
                    {!loading && !error && properties.length === 0 && (
                        <p className="text-center text-gray-600 text-xl">No featured properties found.</p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {properties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                </section>
            </main>
            {/* <footer className="w-full bg-white shadow-inner p-8 text-center text-gray-600 border-t">
                &copy; {new Date().getFullYear()} RealEstatePro. All rights reserved.
            </footer> */}
        </div>
    );
}