
import React from 'react';
import { useParams } from 'react-router-dom';
import ProfitLossDashboard from '@/components/profitloss/ProfitLossDashboard';

const ProfitLossPage = () => {
  const { siteNumber } = useParams();
  
  if (!siteNumber) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">No se especificó el número de restaurante</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfitLossDashboard restaurantId={siteNumber} />
    </div>
  );
};

export default ProfitLossPage;
