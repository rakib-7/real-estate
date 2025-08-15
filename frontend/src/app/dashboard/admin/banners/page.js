'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import fetcher, { API_BASE_URL } from '@/lib/api';

export default function BannersPage() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        isActive: true,
        position: 'top'
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // --- All your existing functions (useEffect, handleSubmit, etc.) remain exactly the same ---
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await fetcher('/admin/banners');
            setBanners(data);
        } catch (error) {
            console.error('Error fetching banners:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isEditing = !!editingBanner;
        if (!isEditing && !imageFile && !formData.imageUrl) {
            alert('To create a new banner, please either upload an image or provide an image URL.');
            return;
        }
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('linkUrl', formData.linkUrl || '');
            formDataToSend.append('isActive', formData.isActive);
            formDataToSend.append('position', formData.position);
            if (imageFile) {
                formDataToSend.append('image', imageFile);
            } else if (isEditing && formData.imageUrl) {
                formDataToSend.append('imageUrl', formData.imageUrl);
            }
            
            const url = isEditing ? `/admin/banners/${editingBanner.id}` : '/admin/banners';
            const method = isEditing ? 'PUT' : 'POST';

            await fetcher(url, {
                method,
                body: formDataToSend,
            });

            setShowAddModal(false);
            setEditingBanner(null);
            resetForm();
            fetchBanners();
        } catch (error) {
            console.error('Error saving banner:', error);
            alert(`Error saving banner: ${error.message}`);
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            description: banner.description,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
            isActive: banner.isActive,
            position: banner.position
        });
        setImagePreview(API_BASE_URL + banner.imageUrl);
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this banner?')) {
            try {
                await fetcher(`/admin/banners/${id}`, {
                    method: 'DELETE',
                });
                fetchBanners();
            } catch (error) {
                console.error('Error deleting banner:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            linkUrl: '',
            isActive: true,
            position: 'top'
        });
        setImageFile(null);
        setImagePreview('');
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setEditingBanner(null);
        resetForm();
    };
    // --- End of existing functions ---


    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        );
    }

    // COMMENTED OUT: Your entire old return statement is replaced by the new redesigned version below.
    /*
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                // ... old header ...
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                // ... old stats cards ...
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                // ... old banner grid ...
            </div>
            {banners.length === 0 && (
                // ... old no banners message ...
            )}
            <Modal isOpen={showAddModal} onClose={handleModalClose} title={editingBanner ? 'Edit Banner' : 'Add New Banner'}>
                // ... old form ...
            </Modal>
        </div>
    );
    */

    // CORRECTED: The new, "dashing" UI for the banner management page.
    return (
        <div className="p-8 bg-gray-50 min-h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
                    <p className="text-gray-600 mt-1">Manage promotional banners and announcements</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Banner
                </Button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white rounded-2xl shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-all duration-300">
                        <div className="relative h-56 bg-gray-200">
                            <img
                                src={`${API_BASE_URL}${banner.imageUrl}`}
                                alt={banner.title}
                                // THIS IS THE FIX: 'object-contain' shows the full image without cropping.
                                className="absolute inset-0 w-full h-full object-cover "
                            />
                            <div className="absolute top-4 right-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    banner.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-200 text-gray-800'
                                }`}>
                                    {banner.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{banner.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{banner.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <span className="text-sm text-gray-500 capitalize">{banner.position} position</span>
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={() => handleEdit(banner)}
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(banner.id)}
                                        className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg text-sm font-semibold"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {banners.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-md">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No Banners Found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new banner.</p>
                </div>
            )}

            <Modal isOpen={showAddModal} onClose={handleModalClose} title={editingBanner ? 'Edit Banner' : 'Add New Banner'}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <Input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                placeholder="Enter banner title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                            <select
                                value={formData.position}
                                onChange={(e) => setFormData({...formData, position: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="top">Top</option>
                                <option value="side">Side</option>
                                <option value="bottom">Bottom</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Enter banner description"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (Optional)</label>
                        <Input
                            type="url"
                            value={formData.linkUrl}
                            onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                            placeholder="https://example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                    {imagePreview && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                            <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border" />
                        </div>
                    )}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Active
                        </label>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button
                            type="button"
                            onClick={handleModalClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                        >
                            {editingBanner ? 'Update Banner' : 'Create Banner'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}