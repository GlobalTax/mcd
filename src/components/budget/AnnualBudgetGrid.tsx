
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useActualData } from '@/hooks/useActualData';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { BudgetTable } from './BudgetTable';
import { BudgetGridHeader } from './BudgetGridHeader';
import { BudgetGridStatus } from './BudgetGridStatus';
import { BudgetChangesBanner } from './BudgetChangesBanner';

interface AnnualBudgetGridProps {
  restaurantId: string;
  year: number;
}

export const AnnualBudgetGrid: React.FC<AnnualBudgetGridProps> = ({
  restaurantId,
  year
}) => {
  const [showActuals, setShowActuals] = useState(false);
  const { restaurants } = useFranchiseeRestaurants();
  
  const {
    rowData,
    hasChanges,
    loading,
    error,
    handleCellChange,
    handleSave,
    reloadData
  } = useBudgetData(restaurantId, year);

  const {
    actualData,
    loading: actualLoading,
    error: actualError,
    fetchActualData
  } = useActualData();

  const selectedRestaurant = restaurants.find(r => r.id === restaurantId);
  const restaurantName = selectedRestaurant?.base_restaurant?.restaurant_name;

  // Cargar datos reales automáticamente
  useEffect(() => {
    if (restaurantId && year) {
      fetchActualData(restaurantId, year);
    }
  }, [restaurantId, year, fetchActualData]);

  const handleToggleActuals = () => {
    setShowActuals(!showActuals);
  };

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
      <CardHeader className="pb-4">
        <BudgetGridHeader
          year={year}
          hasChanges={hasChanges}
          loading={loading}
          budgetData={rowData}
          restaurantName={restaurantName}
          onSave={handleSave}
          showActuals={showActuals}
          onToggleActuals={handleToggleActuals}
        />
        <BudgetChangesBanner hasChanges={hasChanges} />
      </CardHeader>
      <CardContent className="p-0">
        <BudgetTable 
          data={rowData} 
          actualData={showActuals ? actualData : []}
          onCellChange={handleCellChange}
          showActuals={showActuals}
        />
      </CardContent>
    </Card>
  );
};
