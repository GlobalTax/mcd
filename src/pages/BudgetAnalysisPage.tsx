import React from 'react';
import BudgetAnalysis from '@/components/budget/BudgetAnalysis';
import ProtectedRoute from '@/components/ProtectedRoute';

const BudgetAnalysisPage = () => {
  return (
    <ProtectedRoute allowedRoles={['franchisee', 'asesor', 'admin', 'superadmin']}>
      <BudgetAnalysis />
    </ProtectedRoute>
  );
};

export default BudgetAnalysisPage; 