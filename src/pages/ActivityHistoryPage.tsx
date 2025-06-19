import React from 'react';
import FranchiseeActivityHistory from '@/components/franchisee/FranchiseeActivityHistory';
import ProtectedRoute from '@/components/ProtectedRoute';

const ActivityHistoryPage = () => {
  return (
    <ProtectedRoute allowedRoles={['franchisee', 'asesor', 'admin', 'superadmin']}>
      <FranchiseeActivityHistory />
    </ProtectedRoute>
  );
};

export default ActivityHistoryPage; 