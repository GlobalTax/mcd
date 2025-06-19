import React from 'react';
import AdvancedReportingSystem from '@/components/reports/AdvancedReportingSystem';
import ProtectedRoute from '@/components/ProtectedRoute';

const AdvancedReportingPage = () => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin', 'asesor']}>
      <AdvancedReportingSystem />
    </ProtectedRoute>
  );
};

export default AdvancedReportingPage; 