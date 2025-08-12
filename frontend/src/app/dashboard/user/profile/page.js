// frontend/src/app/dashboard/user/profile/page.js
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import fetcher from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function UserProfilePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading, user: authUser } = useAuth();
  const [profileData, setProfileData] = useState({ name: '', phoneNumber: '', location: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loading, setLoading] = useState(true); // For initial fetch
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState(''); // For success/failure messages after update

  useEffect(() => {
    if (authLoading) return; // Wait for auth status to load
    if (!isAuthenticated || isAdmin) { // Ensure it's a regular user
      router.push('/login');
    } else {
      fetchUserProfile();
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher('/user/profile');
      setProfileData({
        name: data.name || '',
        phoneNumber: data.phoneNumber || '',
        location: data.location || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage('');
    setLoading(true); // Set loading for update action
    try {
      const updatedData = await fetcher('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      setProfileData({
        name: updatedData.name || '',
        phoneNumber: updatedData.phoneNumber || '',
        location: updatedData.location || '',
      });
      setUpdateMessage('Profile updated successfully!');
      setIsEditingProfile(false); // Exit edit mode
    } catch (err) {
      setError(err.message);
      setUpdateMessage('Failed to update profile.');
    } finally {
      setLoading(false); // End loading for update action
    }
  };

  if (authLoading || loading) {
    return <div className="text-center p-8 text-xl text-gray-700">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h2>
      <form onSubmit={handleProfileSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <Input label="Email" type="email" value={authUser?.email || ''} disabled className="bg-gray-100 cursor-not-allowed" />
        <Input label="Name" type="text" name="name" value={profileData.name} onChange={handleProfileChange} disabled={!isEditingProfile} />
        <Input label="Phone Number" type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} disabled={!isEditingProfile} />
        <Input label="Location" type="text" name="location" value={profileData.location} onChange={handleProfileChange} disabled={!isEditingProfile} />

        {updateMessage && <p className={`mt-4 text-base font-medium ${error ? 'text-red-500' : 'text-green-600'}`}>{updateMessage}</p>}

        <div className="flex justify-end space-x-4 mt-8">
          {isEditingProfile ? (
            <>
              <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" onClick={() => { setIsEditingProfile(false); setUpdateMessage(''); fetchUserProfile(); }} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditingProfile(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" /></svg>
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </>
  );
}