import React from 'react';
import NotificationCenter from '@/components/NotificationCenter';
import ProtectedRoute from '@/components/ProtectedRoute';

const NotificationsPage = () => {
  return (
    <ProtectedRoute allowedRoles={['franchisee', 'asesor', 'admin', 'superadmin']}>
      <NotificationCenter />
    </ProtectedRoute>
  );
};

export default NotificationsPage; 