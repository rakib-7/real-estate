import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function PropertiesPage() {
  const dummyProperties = [
    { id: 1, title: 'Beautiful Family Home', location: '123 Main St, Anytown', price: '500,000', imageUrl: ['https://via.placeholder.com/150/0000FF/808080?text=House1'] },
    { id: 2, title: 'Modern Downtown Apartment', location: '456 Oak Ave, Cityville', price: '2,500/month', imageUrl: ['https://via.placeholder.com/150/FF0000/FFFFFF?text=Apartment1'] },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar isAdmin={false} />
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyProperties.map(property => (
            <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {property.imageUrl && property.imageUrl.length > 0 && (
                <img src={property.imageUrl[0]} alt={property.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{property.title}</h2>
                <p className="text-gray-600 mb-1">{property.location}</p>
                <p className="text-blue-600 font-bold text-lg">{property.price}</p>
                <Link href={`/properties/${property.id}`} className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}