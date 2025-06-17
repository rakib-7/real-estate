import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar isAdmin={false} />
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Welcome to Real Estate Portal
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl">
          Explore a wide range of properties for rent or sale. Find your perfect home or showcase your listings with ease. 
        </p>
        <div className="flex space-x-4">
          <Link href="/properties" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
            Browse Properties
          </Link>
          <Link href="/login" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg text-lg transition duration-300">
            Admin/Login
          </Link>
        </div>
      </main>
      <footer className="w-full bg-white shadow-inner p-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Real Estate Management System.
      </footer>
    </div>
  );
}