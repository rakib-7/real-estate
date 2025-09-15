'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import fetcher, { API_BASE_URL } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function UserProfilePage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, loading: authLoading, user: authUser, revalidateUser } = useAuth();
    const [profileData, setProfileData] = useState({ name: '', phoneNumber: '', location: '', avatarUrl: '' });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    
    // ADDED: State and ref for the file input to handle avatar uploads.
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (authLoading) return;
        if (!isAuthenticated || isAdmin) {
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
                avatarUrl: data.avatarUrl || '' // ADDED: Fetch the avatar URL.
            });
            if (data.avatarUrl) {
                //setAvatarPreview(`${API_BASE_URL.replace('/api', '')}${data.avatarUrl}`);
                setAvatarPreview(data.avatarUrl);
            }
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
    
    // ADDED: New handler for when a user selects a new profile picture.
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            // Show a preview of the new image immediately.
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Automatically upload the new image.
            await handleAvatarUpload(file);
        }
    };

    // ADDED: New function to upload the avatar file to the backend.
    const handleAvatarUpload = async (file) => {
        if (!file) return;
        setIsUpdating(true);
        setUpdateMessage('Uploading picture...');
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await fetcher('/user/profile/avatar', {
                method: 'POST',
                body: formData,
            });
            setUpdateMessage('Profile picture updated successfully!');
            revalidateUser(); // This function should re-fetch the user data in your AuthContext
        } catch (err) {
            setError(err.message);
            setUpdateMessage('Failed to upload picture.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setUpdateMessage('');
        setError(null);
        setIsUpdating(true);
        try {
            const updatedData = await fetcher('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData),
            });
            setProfileData({
                name: updatedData.name || '',
                phoneNumber: updatedData.phoneNumber || '',
                location: updatedData.location || '',
                avatarUrl: updatedData.avatarUrl || ''
            });
            setUpdateMessage('Profile details updated successfully!');
            setIsEditingProfile(false);
        } catch (err) {
            setError(err.message);
            setUpdateMessage('Failed to update profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (authLoading || loading) {
        return <div className="text-center p-8 text-xl text-gray-700">Loading profile...</div>;
    }

    if (error && !isEditingProfile) {
        return <div className="text-center p-8 text-red-500 text-xl">Error: {error}</div>;
    }

    

    
    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
                {!isEditingProfile && (
                    <Button type="button" onClick={() => setIsEditingProfile(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" /></svg>
                        Edit Profile
                    </Button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar and Email */}
                <div className="md:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
                        <div className="relative w-40 h-40 mx-auto group">
                            <img
                                src={avatarPreview || `https://placehold.co/400x400/e0e7ff/6366f1?text=${authUser?.email?.charAt(0).toUpperCase()}`}
                                alt="Profile Avatar"
                                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            {/* <div 
                                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div> */}

                            {isEditingProfile && (
                                <div  
                                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer" 
                                    onClick={() => fileInputRef.current.click()} 
                                > 
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mt-4">{profileData.name || 'User Name'}</h3>
                        <p className="text-gray-500">{authUser?.email}</p>
                    </div>
                </div>

                {/* Right Column: Profile Details Form */}
                <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <form onSubmit={handleProfileSubmit}>
                        <div className="space-y-6">
                            <Input label="Full Name" type="text" name="name" value={profileData.name} onChange={handleProfileChange} disabled={!isEditingProfile} />
                            <Input label="Phone Number" type="tel" name="phoneNumber" value={profileData.phoneNumber} onChange={handleProfileChange} disabled={!isEditingProfile} />
                            <Input label="Location" type="text" name="location" value={profileData.location} onChange={handleProfileChange} disabled={!isEditingProfile} />
                        </div>

                        {isEditingProfile && (
                            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                                <Button type="button" onClick={() => { setIsEditingProfile(false); setUpdateMessage(''); fetchUserProfile(); }} className="bg-gray-200 text-gray-800 hover:bg-gray-300">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        )}
                        
                        {updateMessage && <p className={`mt-4 text-sm font-medium ${error ? 'text-red-500' : 'text-green-600'}`}>{updateMessage}</p>}
                    </form>
                </div>
            </div>
        </>
    );
}
