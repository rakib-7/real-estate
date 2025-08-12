// --- frontend/lib/api.js ---
// Centralized API fetcher with authentication and error handling
import React, { useState, useEffect, createContext, useContext } from 'react';
const API_BASE_URL = 'http://localhost:5000';
const API_ROUTE_BASE = `${API_BASE_URL}/api`;

async function fetcher(url, options = {}) {
   console.log('Fetcher: Called with URL:', url, 'Options:', options); // <--- ADD THIS LOG
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    //'content-Type': 'application/json',
    ...options.headers,
  };

  // Don't set Content-Type for FormData (let the browser set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }

  const fullUrl = `${API_BASE_URL}${url}`;
  console.log('Fetcher: Making request to:', fullUrl);

  try {
    const res = await fetch(`${API_ROUTE_BASE}${url}`, {
      ...options,
      headers,
      credentials: 'include',
    });
     console.log('Fetcher: Response received for URL:', url, 'Status:', res.status); // <--- ADD THIS LOG
    if (res.status === 401 || res.status === 403) {
      // if (typeof window !== 'undefined') {
      //   localStorage.removeItem('token');
      //   localStorage.removeItem('userRole');
      //   localStorage.removeItem('userId');
      //   window.location.href = '/login';
      // }
      throw new Error('Authentication failed or session expired. Please log in again.');
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Something went wrong!' }));
      console.log('Fetcher: Error response data:', errorData);
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${res.status}`);
    }

    if (res.status === 204) {
      return null;
    }

    const responseData = await res.json();
    console.log('Fetcher: Success response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Fetcher: Network or other error:', error.message);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}
export default fetcher;
export { API_BASE_URL};