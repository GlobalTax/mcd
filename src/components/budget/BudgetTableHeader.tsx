
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { months, getHeaderLabels } from './BudgetTableUtils';

interface BudgetTableHeaderProps {
  viewMode: 'budget' | 'comparison' | 'actuals';
}

export const BudgetTableHeaderComponent: React.FC<BudgetTableHeaderProps> = ({ viewMode }) => {
  const headerLabels = getHeaderLabels(viewMode);

  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="sticky left-0 bg-gray-50 z-20 min-w-[300px] border-r font-bold text-gray-900 text-base">
          Concepto
        </TableHead>
        {months.map(month => (
          <TableHead key={month.key} className="text-center border-r min-w-[200px] p-3">
            <div className="space-y-2">
              <div className="font-bold text-gray-900 text-base">{month.label}</div>
              {headerLabels.monthSubheaders}
            </div>
          </TableHead>
        ))}
        <TableHead className="text-center min-w-[250px] bg-blue-100 font-bold border-l text-base p-3">
          <div className="space-y-2">
            <div className="text-gray-900">Total Anual</div>
            {headerLabels.totalSubheaders}
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
