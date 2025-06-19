import React from 'react';
import UserInvitationManager from '@/components/admin/UserInvitationManager';
import ProtectedRoute from '@/components/ProtectedRoute';

const UserInvitationPage = () => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <UserInvitationManager />
    </ProtectedRoute>
  );
};

export default UserInvitationPage; 