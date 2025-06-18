
import React from 'react';
import { KPICards } from './KPICards';
import { RevenueChart } from './RevenueChart';
import { MarginChart } from './MarginChart';
import { CostChart } from './CostChart';

interface FinancialMetricsProps {
  selectedYear: number;
  selectedRestaurant: string;
  restaurants: any[];
}

export const FinancialMetrics = ({ selectedYear, selectedRestaurant, restaurants }: FinancialMetricsProps) => {
  return (
    <div className="space-y-6">
      <KPICards />
      <RevenueChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarginChart />
        <CostChart />
      </div>
    </div>
  );
};
