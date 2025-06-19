import React from 'react';
import ImprovementsManagement from '@/components/improvements/ImprovementsManagement';
import ProtectedRoute from '@/components/ProtectedRoute';

const ImprovementsPage = () => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'asesor', 'franquiciado']}>
      <ImprovementsManagement />
    </ProtectedRoute>
  );
};

export default ImprovementsPage; 