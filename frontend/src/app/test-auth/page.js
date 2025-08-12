// Test authentication page
'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import fetcher from '@/lib/api';

export default function TestAuthPage() {
  const { user, isAuthenticated, isAdmin, loading, login } = useAuth();
  const [testResult, setTestResult] = useState('');

  const testLogin = async () => {
    try {
      setTestResult('Testing login...');
      const result = await login('admin@test.com', 'admin123');
      setTestResult(`Login successful! Role: ${result.role}, UserID: ${result.userId}`);
    } catch (error) {
      setTestResult(`Login failed: ${error.message}`);
    }
  };

  const testAuthStatus = async () => {
    try {
      setTestResult('Testing auth status...');
      const result = await fetcher('/auth/status');
      setTestResult(`Auth status: ${JSON.stringify(result)}`);
    } catch (error) {
      setTestResult(`Auth status failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Current State:</h2>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user) : 'None'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <button 
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Login (admin@test.com / admin123)
          </button>
          
          <button 
            onClick={testAuthStatus}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
          >
            Test Auth Status
          </button>
        </div>

        {testResult && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <p className="text-sm">{testResult}</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-semibold mb-2">Test Credentials:</h3>
          <p><strong>Email:</strong> admin@test.com</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </div>
    </div>
  );
} 