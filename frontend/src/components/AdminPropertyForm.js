// src/components/AdminPropertyForm.js
'use client';
import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import fetcher from '@/lib/api';
import { API_BASE_URL } from '@/lib/api';



const initialState = {
    title: '',
    description: '',
    price: '',
    
    address: '',
    area: '',
    city: '',
    district: '',
    division: '',
    type: 'rent',
    category: '',
    contactInfo: '',
    isFeatured: false,
    status: 'approved',
    images: null,
    acceptTerms: false,
};

const AdminPropertyForm = ({ property, onSuccess, onCancel, isUserSubmission = false }) => {
    
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (property) {
            // If editing an existing property, populate the form with its data.
            setFormData({
                title: property.title || '',
                description: property.description || '',
                price: property.price || '',
                //location: property.location || '',
                address: property.address || '',
                area: property.area || '',
                city: property.city || '',
                district: property.district || '',
                division: property.division || '',
                type: property.type || 'rent',
                category: property.category || '',
                contactInfo: property.contactInfo || '',
                isFeatured: property.isFeatured || false,
                
                status: property.status || 'approved', 
                images: null, // Reset images; user will upload new ones if they want to change them.
                acceptTerms: false, // This is only for new user submissions.
            });
        } else {
            // If adding a new property, reset the form to its initial state.
           
            setFormData({
                ...initialState,
                status: isUserSubmission ? 'pending' : 'approved',
            });
        }
    }, [property, isUserSubmission]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        // This handler correctly sets the FileList object from the file input.
        setFormData({ ...formData, images: e.target.files });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        if (!formData.title || !formData.price || !formData.type || !formData.area || !formData.city || !formData.district || !formData.division) {
            setError('Title, price, type, and full location details (Division, District, City, Area) are required.');
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        
        
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('price', formData.price);
        //formDataToSend.append('location', formData.location);
        formDataToSend.append('address', formData.address);
        formDataToSend.append('area', formData.area);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('district', formData.district);
        formDataToSend.append('division', formData.division);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('contactInfo', formData.contactInfo);
        
        // Only admins can set the 'isFeatured' flag.
        if (!isUserSubmission) {
            formDataToSend.append('isFeatured', formData.isFeatured);
        }

       
        // Users always submit as 'pending'. Admins can set the status.
        formDataToSend.append('status', isUserSubmission ? 'pending' : formData.status);
        
        // Append new images if they have been selected.
        if (formData.images) {
            for (let i = 0; i < formData.images.length; i++) {
                formDataToSend.append('images', formData.images[i]);
            }
        }

        try {
            const isEditing = !!property;
            
            const baseUrl = isUserSubmission ? '/user/properties' : '/admin/properties';
            const url = isEditing ? `${baseUrl}/${property.id}` : baseUrl;
            const method = isEditing ? 'PUT' : 'POST';

            const responseData = await fetcher(url, { 
                method, body: formDataToSend 
            });
            // const responseData =

            

            alert(`Property ${isEditing ? 'updated' : 'submitted'} successfully!`);
            onSuccess(responseData);
        } catch (err) {
            setError(err.message);
            console.error('PropertyForm: Fetch failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">{property ? 'Edit Property' : 'Add New Property'}</h2>
            {error && <p className="text-red-500 mb-5 text-base font-medium">{error}</p>}
            
            
            {property && property.images && property.images.length > 0 && (
                <div className="mb-5">
                    <p className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Current Images</p>
                    <div className="flex flex-wrap gap-4">
                        {property.images.map(img => (
                            <img 
                                key={img.id} 
                                // src={`${API_BASE_URL.replace('/api', '')}${img.url}`} 
                                src={img.url}
                                alt="Existing property" 
                                className="w-24 h-24 object-cover rounded-lg border"
                            />
                        ))}
                    </div>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Uploading new images will replace all current images.</p>
                </div>
            )}

           
            <Input label="Title" type="text" name="title" value={formData.title} onChange={handleChange} required />
            <div className="mb-5">
                <label htmlFor="description" className="block text-base font-medium text-gray-700 mb-2">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                     className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
            </div>
            <Input label="Price" type="number" name="price" value={formData.price} onChange={handleChange} required />
            {/* <Input label="Location" type="text" name="location" value={formData.location} onChange={handleChange} required /> */}
             {/* --- ADDED: New structured location inputs --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Division" type="text" name="division" value={formData.division} onChange={handleChange} required placeholder="e.g., Chittagong" />
                <Input label="District" type="text" name="district" value={formData.district} onChange={handleChange} required placeholder="e.g., Chittagong" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="City / Thana" type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g., Panchlaish" />
                <Input label="Area" type="text" name="area" value={formData.area} onChange={handleChange} required placeholder="e.g., Nasirabad H/S" />
            </div>
            <Input label="Address (Optional)" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="e.g., House 123, Road 4" />
            {/* --- End of new location inputs --- */}
            <div className="mb-5">
                <label htmlFor="type" className="block text-base font-medium text-gray-700 mb-2">Type</label>
                <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    // required={!isUserSubmission || !formData.acceptTerms}
                    required // This field is always required
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                </select>
            </div>

            <Input label="Category (e.g., House, Apartment)" type="text" name="category" value={formData.category} onChange={handleChange} />
            
            <div className="mb-5">
                <label htmlFor="images" className="block text-base font-medium text-gray-700 mb-2">
                    
                    {property ? 'Upload New Images (Replaces Old)' : 'Upload Images'}
                </label>
                <input
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
            </div>

            <Input label="Contact Info (Phone or Email)" type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />

            {!isUserSubmission && (
                <div className="mb-8 flex items-center">
                    <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-md transition-all duration-200 ease-in-out"
                    />
                    <label htmlFor="isFeatured" className="text-base text-gray-700 font-medium">
                        Featured Property
                    </label>
                </div>
            )}
            
            

            <div className="flex justify-end space-x-4 mt-8">
                <Button type="button" onClick={onCancel} className="bg-gray-300 text-gray-800 hover:bg-gray-400 shadow-md">
                    Cancel
                </Button>
                {/* <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                    {loading ? 'Saving...' : (property ? 'Update Property' : 'Submit for Approval')}
                </Button> */}
                <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                    {
                        loading 
                            ? 'Saving...' 
                            : property 
                                ? 'Update Property' 
                                : isUserSubmission 
                                    ? 'Submit for Approval' 
                                    : 'Add Property'
                    }
                </Button>
            </div>
        </form>
    );
};

export default AdminPropertyForm;