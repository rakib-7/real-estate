'use client';

import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useEffect, useState } from 'react';

export default function PropertyDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      // In a real app, you would fetch property details from your backend here
      const dummyProperty = {
        id: parseInt(id),
        title: `Property ${id} Details`,
        description: `This is a detailed description for property number ${id}. It's a fantastic place with all the amenities. `,
        price: id % 2 === 0 ? '750,000 USD' : '3,000 USD/month',
        location: '789 Elm St, Wonderland',
        type: id % 2 === 0 ? 'sale' : 'rent', // Browse listings by category (Rent/Sale) 
        category: id % 2 === 0 ? 'house' : 'apartment',
        imageUrl: [
          `https://via.placeholder.com/600x400/007bff/ffffff?text=Property${id}-1`,
          `https://via.placeholder.com/600x400/28a745/ffffff?text=Property${id}-2`,
        ],
        contactInfo: 'agent@example.com / +1234567890', // Contact info 
      };
      setProperty(dummyProperty);
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div className="text-center p-8">Loading property details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  if (!property) return <div className="text-center p-8">Property not found.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin={false} />
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden md:flex">
          <div className="md:w-1/2">
            {property.imageUrl && property.imageUrl.length > 0 && (
              <img
                src={property.imageUrl[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">{property.price}</p>
            <p className="text-gray-700 mb-2"><strong>Location:</strong> {property.location}</p>
            <p className="text-gray-700 mb-2"><strong>Type:</strong> {property.type}</p>
            <p className="text-gray-700 mb-4"><strong>Category:</strong> {property.category}</p>
            <p className="text-gray-800 leading-relaxed mb-6">{property.description}</p>
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Contact Information</h3>
              <p className="text-gray-700">{property.contactInfo}</p>
              <button className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
                Submit Inquiry (Future Feature) 
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}