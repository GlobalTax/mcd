import React from 'react';
import AdvancedUserManagement from '@/components/admin/AdvancedUserManagement';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdvancedUserManagementPage = () => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <AdvancedUserManagement />
    </ProtectedRoute>
  );
};

export default AdvancedUserManagementPage; 