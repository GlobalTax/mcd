import React from 'react';
import BudgetReports from '@/components/budget/BudgetReports';
import ProtectedRoute from '@/components/ProtectedRoute';

const BudgetReportsPage = () => {
  return (
    <ProtectedRoute allowedRoles={['franchisee', 'asesor', 'admin', 'superadmin']}>
      <BudgetReports />
    </ProtectedRoute>
  );
};

export default BudgetReportsPage; 