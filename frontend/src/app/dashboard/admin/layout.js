// frontend/src/app/dashboard/admin/layout.js
'use client';
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminDashboardRootLayout({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}