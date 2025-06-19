import React from 'react';
import ValuationComparison from '@/components/valuation/ValuationComparison';
import ProtectedRoute from '@/components/ProtectedRoute';

const ValuationComparisonPage = () => {
  return (
    <ProtectedRoute allowedRoles={['franchisee', 'asesor', 'admin', 'superadmin']}>
      <ValuationComparison />
    </ProtectedRoute>
  );
};

export default ValuationComparisonPage; 