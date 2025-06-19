import React from 'react';
import AuditComplianceSystem from '@/components/audit/AuditComplianceSystem';
import ProtectedRoute from '@/components/ProtectedRoute';

const AuditCompliancePage = () => {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
      <AuditComplianceSystem />
    </ProtectedRoute>
  );
};

export default AuditCompliancePage; 