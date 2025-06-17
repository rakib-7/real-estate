'use client';

import { useState, useEffect } from 'react';
import InputField from './InputField';

const AdminPropertyForm = ({ property, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'rent',
    category: '',
    imageUrl: '',
    contactInfo: '',
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        location: property.location || '',
        type: property.type || 'rent',
        category: property.category || '',
        imageUrl: property.imageUrl ? property.imageUrl.join(', ') : '',
        contactInfo: property.contactInfo || '',
        isFeatured: property.isFeatured || false,
      });
    } else {
      setFormData({
        title: '', description: '', price: '', location: '', type: 'rent',
        category: '', imageUrl: '', contactInfo: '', isFeatured: false,
      });
    }
  }, [property]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    const dataToSend = {
      ...formData,
      imageUrl: formData.imageUrl.split(',').map(url => url.trim()).filter(url => url !== ''),
      price: parseFloat(formData.price),
    };

    try {
      const url = property
        ? `http://localhost:5000/api/admin/properties/${property.id}`
        : 'http://localhost:5000/api/admin/properties';
      const method = property ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to ${property ? 'update' : 'add'} property`);
      }

      alert(`Property ${property ? 'updated' : 'added'} successfully!`);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{property ? 'Edit Property' : 'Add New Property'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <InputField label="Title" type="text" name="title" value={formData.title} onChange={handleChange} required />
      <div className="mb-4">
        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        ></textarea>
      </div>
      <InputField label="Price" type="number" name="price" value={formData.price} onChange={handleChange} required />
      <InputField label="Location" type="text" name="location" value={formData.location} onChange={handleChange} required />

      <div className="mb-4">
        <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
        </select>
      </div>

      <InputField label="Category (e.g., House, Apartment)" type="text" name="category" value={formData.category} onChange={handleChange} />
      <InputField label="Image URLs (comma-separated)" type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="e.g., url1.jpg, url2.png" />
      <InputField label="Contact Info" type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} />

      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="isFeatured"
          name="isFeatured"
          checked={formData.isFeatured}
          onChange={handleChange}
          className="mr-2 leading-tight"
        />
        <label htmlFor="isFeatured" className="text-sm text-gray-700">
          Featured Property
        </label>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {loading ? 'Saving...' : (property ? 'Update Property' : 'Add Property')}
        </button>
      </div>
    </form>
  );
};

export default AdminPropertyForm;