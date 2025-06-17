
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/useBudgetData';
import { BudgetTable } from './BudgetTable';
import { BudgetGridHeader } from './BudgetGridHeader';
import { BudgetGridStatus } from './BudgetGridStatus';
import { BudgetChangesBanner } from './BudgetChangesBanner';

interface AnnualBudgetGridProps {
  restaurantId: string;
  year: number;
  onSave?: (data: any[]) => Promise<void>;
}

export const AnnualBudgetGrid: React.FC<AnnualBudgetGridProps> = ({
  restaurantId,
  year
}) => {
  const {
    rowData,
    hasChanges,
    loading,
    error,
    handleCellChange,
    handleSave,
    reloadData
  } = useBudgetData(restaurantId, year);

  // Mostrar estados de carga o error
  if (loading || error) {
    return (
      <BudgetGridStatus 
        loading={loading}
        error={error}
        onReload={reloadData}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <BudgetGridHeader
          year={year}
          hasChanges={hasChanges}
          loading={loading}
          onSave={handleSave}
        />
        <BudgetChangesBanner hasChanges={hasChanges} />
      </CardHeader>
      <CardContent>
        <BudgetTable 
          data={rowData} 
          onCellChange={handleCellChange}
        />
      </CardContent>
    </Card>
  );
};
