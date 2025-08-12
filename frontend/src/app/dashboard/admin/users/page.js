// frontend/src/app/dashboard/admin/users/page.js
'use client';
import React, { useState, useEffect } from 'react';
// useRouter and useAuth are handled by AdminLayout
import fetcher from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function AdminUsersPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [errorCreate, setErrorCreate] = useState('');
  const [messageCreate, setMessageCreate] = useState('');

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', phoneNumber: '', location: '', role: '' });
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState('');

  useEffect(() => {
    fetchUsers(); // No auth check needed here, AdminLayout handles it
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setErrorUsers(null);
    try {
      const data = await fetcher('/admin/users');
      setUsers(data);
    } catch (err) {
      setErrorUsers(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    setErrorCreate('');
    setMessageCreate('');

    try {
      const data = await fetcher('/admin/users', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      setMessageCreate(data.message || `User ${email} created successfully!`);
      setEmail('');
      setPassword('');
      setRole('user');
      fetchUsers(); // Refresh user list
    } catch (err) {
      setErrorCreate(err.message || 'Failed to create user.');
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      phoneNumber: user.phoneNumber || '',
      location: user.location || '',
      role: user.role,
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setErrorUpdate('');
    try {
      await fetcher(`/admin/users/${editingUser.id}`, {
        method: 'PUT',
        body: JSON.stringify(editFormData),
      });
      alert('User updated successfully!');
      setIsEditModalOpen(false);
      fetchUsers(); // Refresh user list
    } catch (err) {
      setErrorUpdate(err.message || 'Failed to update user.');
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await fetcher(`/admin/users/${userId}`, { method: 'DELETE' });
      alert('User deleted successfully!');
      fetchUsers(); // Refresh user list
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  if (loadingUsers) {
    return <div className="text-center p-8 text-xl text-gray-700">Loading user management...</div>;
  }

  if (errorUsers) {
    return <div className="text-center p-8 text-red-500 text-xl">Error: {errorUsers}</div>;
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">User Management</h2>

      {/* Create New User Section */}
      <div className="bg-gray-50 p-8 rounded-2xl shadow-inner-lg border border-gray-100 mb-10">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Create New User Account</h3>
        <form onSubmit={handleCreateUser}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="new.user@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="mb-5">
            <label htmlFor="role" className="block text-base font-medium text-gray-700 mb-2">Role</label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {errorCreate && <p className="text-red-500 text-sm mb-4 font-medium">{errorCreate}</p>}
          {messageCreate && <p className="text-green-600 text-sm mb-4 font-medium">{messageCreate}</p>}
          <Button type="submit" disabled={loadingCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {loadingCreate ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </div>

      {/* All Users List Section */}
      <h3 className="text-2xl font-semibold mb-6 text-gray-800">All Registered Users</h3>
      {users.length === 0 ? (
        <p className="text-gray-600 text-lg">No users found.</p>
      ) : (
        <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id} className="px-6 py-5 sm:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors duration-150">
                <div className="flex-grow mb-3 sm:mb-0">
                  <p className="text-xl font-medium text-gray-900 leading-tight">{user.email} <span className={`ml-2 px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{user.role.toUpperCase()}</span></p>
                  <p className="text-base text-gray-600 mt-1">{user.name || 'N/A'} | {user.phoneNumber || 'N/A'} | {user.location || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleEditClick(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2.5 px-4 text-sm shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" /></svg>
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 text-sm shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit User Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit User Profile">
        {editingUser && (
          <form onSubmit={handleUpdateUser}>
            <Input label="Email" type="email" value={editingUser.email} disabled className="bg-gray-100 cursor-not-allowed" />
            <Input label="Name" type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} />
            <Input label="Phone Number" type="text" name="phoneNumber" value={editFormData.phoneNumber} onChange={handleEditFormChange} />
            <Input label="Location" type="text" name="location" value={editFormData.location} onChange={handleEditFormChange} />
            <div className="mb-5">
              <label htmlFor="edit-role" className="block text-base font-medium text-gray-700 mb-2">Role</label>
              <select
                id="edit-role"
                name="role"
                value={editFormData.role}
                onChange={handleEditFormChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition-all duration-200 ease-in-out"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {errorUpdate && <p className="text-red-500 text-sm mb-4 font-medium">{errorUpdate}</p>}
            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-300 text-gray-800 hover:bg-gray-400">Cancel</Button>
              <Button type="submit" disabled={loadingUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                {loadingUpdate ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}