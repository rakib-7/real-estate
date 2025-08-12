// frontend/src/app/dashboard/admin/banners/page.js
'use client';
import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import fetcher, {API_BASE_URL} from '@/lib/api';

//const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';


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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append('title', formData.title);
  //     formDataToSend.append('description', formData.description);
  //     formDataToSend.append('linkUrl', formData.linkUrl);
  //     formDataToSend.append('isActive', formData.isActive);
  //     formDataToSend.append('position', formData.position);
      
  //     if (imageFile) {
  //       formDataToSend.append('image', imageFile);
  //     } else if (formData.imageUrl) {
  //       formDataToSend.append('imageUrl', formData.imageUrl);
  //     }

  //     console.log('Submitting banner with data:', {
  //       title: formData.title,
  //       description: formData.description,
  //       linkUrl: formData.linkUrl,
  //       isActive: formData.isActive,
  //       position: formData.position,
  //       hasImageFile: !!imageFile,
  //       imageUrl: formData.imageUrl
  //     });

  //     if (editingBanner) {
  //       await fetcher(`/admin/banners/${editingBanner.id}`, {
  //         method: 'PUT',
  //         body: formDataToSend,
  //       });
  //     } else {
  //       await fetcher('/admin/banners', {
  //         method: 'POST',
  //         body: formDataToSend,
  //       });
  //     }

  //     setShowAddModal(false);
  //     setEditingBanner(null);
  //     resetForm();
  //     fetchBanners();
  //   } catch (error) {
  //     console.error('Error saving banner:', error);
  //     alert(`Error saving banner: ${error.message}`);
  //   }
  // };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // This is the critical fix. It checks if the user has provided an image
//     // from EITHER the file input OR the URL text field.
//     if (!editingBanner && !imageFile && !formData.imageUrl) {
//             alert('Please either upload an image file or provide an image URL.');
//             return; // Stop the submission if no image source is provided.
//         }

//     try {
//       

//       let body = {}; // Use an object for JSON body
//       let headers = { 'Content-Type': 'application/json' };

// // CRITICAL: We need to use FormData for file uploads.
//       const formDataToSend = new FormData();
//       formDataToSend.append('title', formData.title);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('linkUrl', formData.linkUrl);
//       formDataToSend.append('isActive', formData.isActive);
//       formDataToSend.append('position', formData.position);

//       if (imageFile) {
//         formDataToSend.append('image', imageFile); // 'image' is the field name backend expects
//       } else if (formData.imageUrl) {
//         formDataToSend.append('imageUrl', formData.imageUrl);
//       }

//       const isEditing = !!editingBanner;
//       const url = isEditing ? `/admin/banners/${editingBanner.id}` : '/admin/banners';
//       const method = isEditing ? 'PUT' : 'POST';

//       await fetcher(url, {
//         method,
//         body: formDataToSend, // Pass FormData directly
//       });

//       setShowAddModal(false);
//       setEditingBanner(null);
//       resetForm();
//       fetchBanners();
//     } catch (error) {
//       console.error('Error saving banner:', error);
//       alert(`Error saving banner: ${error.message}`);
//     }
//   };
 // Replace your entire handleSubmit function with this final version.
const handleSubmit = async (e) => {
    e.preventDefault();

    const isEditing = !!editingBanner;

    // CORRECTED VALIDATION:
    // When creating a NEW banner, we must have an image source.
    if (!isEditing && !imageFile && !formData.imageUrl) {
        alert('To create a new banner, please either upload an image or provide an image URL.');
        return; // Stop the submission.
    }
    // Note: No validation is needed when editing, as the backend will keep the old image if a new one isn't provided.

    try {
        const formDataToSend = new FormData();

        // Append all the text fields
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('linkUrl', formData.linkUrl || '');
        formDataToSend.append('isActive', formData.isActive);
        formDataToSend.append('position', formData.position);

        // Only append a new image file if one has been selected by the user.
        if (imageFile) {
            formDataToSend.append('image', imageFile);
        }
        
        const url = isEditing ? `/admin/banners/${editingBanner.id}` : '/admin/banners';
        const method = isEditing ? 'PUT' : 'POST';

        await fetcher(url, {
            method,
            body: formDataToSend,
        });

        // Reset the form and fetch the updated list
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
      //imageUrl: banner.imageUrl ,
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

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-600 mt-2">Manage promotional banners and announcements</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add New Banner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Banners</p>
              <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Banners</p>
              <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Position</p>
              <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.position === 'top').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Side Position</p>
              <p className="text-2xl font-bold text-gray-900">{banners.filter(b => b.position === 'side').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
             <img
                // This creates the full URL: http://localhost:5000/uploads/banners/your-image.jpg
                src={`${API_BASE_URL}${banner.imageUrl}`}
                alt={banner.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://placehold.com/400x200?text=No+Image';
                }}
              />
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  banner.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{banner.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{banner.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">{banner.position} position</span>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleEdit(banner)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(banner.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm"
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
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No banners</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new banner.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Or Enter Image URL</label>
                <Input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
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

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={handleModalClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
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