'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

// This component now contains the full expandable search logic.
const PropertySearchForm = ({ onSearch, initialParams = {} }) => {
    const { isAuthenticated } = useAuth();
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    
    // COMMENTED OUT: The old searchParams state with unnecessary fields.
    /*
    const [searchParams, setSearchParams] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        category: '',
        nearLocation: '',
        suggestedByBookmarks: false,
    });
    */

    // CORRECTED: Simplified the state to only include relevant fields.
    const [searchParams, setSearchParams] = useState({
        location: '',
        minPrice: '',
        maxPrice: '',
        type: '',
        category: '',
        suggestedByBookmarks: false,
    });

    // ADDED: A new useEffect to pre-fill the form if search params are in the URL.
    useEffect(() => {
        setSearchParams(prev => ({ ...prev, ...initialParams }));
        // If there are any initial search params, expand the form by default.
        if (Object.values(initialParams).some(val => val !== '')) {
            setIsSearchExpanded(true);
        }
    }, [initialParams]);


    const handleSearchChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // This function now correctly passes the search parameters to the parent page.
        onSearch(searchParams);
        // This line is the fix: it sets the expanded state to false, collapsing the form.
        setIsSearchExpanded(false);
    };

    return (
        <section className="relative -mt-16 z-20 container mx-auto px-4">
            <div className="bg-white p-6 rounded-2xl shadow-3xl border border-gray-100">
                {!isSearchExpanded ? (
                    // Collapsed View
                    <div className="flex items-center justify-between p-2 cursor-pointer" onClick={() => setIsSearchExpanded(true)}>
                        <p className="text-gray-500 text-lg">Search by location, price, or type...</p>
                        <Button type="button" onClick={() => setIsSearchExpanded(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg">
                            Search
                        </Button>
                    </div>
                ) : (
                    // Expanded View
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
                        {/* This input is redundant if you have a main location search, so it can be removed or kept based on preference. */}
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
                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm"
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
                                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm"
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
                                    className="mr-3 h-5 w-5 text-indigo-600 rounded-md"
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
    );
};

export default PropertySearchForm;