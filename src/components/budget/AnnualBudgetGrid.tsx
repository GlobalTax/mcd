
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useActualData } from '@/hooks/useActualData';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { BudgetTable } from './BudgetTable';
import { BudgetGridHeader } from './BudgetGridHeader';
import { BudgetGridStatus } from './BudgetGridStatus';
import { BudgetChangesBanner } from './BudgetChangesBanner';
import { BudgetComparison } from './BudgetComparison';
import { ArrowLeft } from 'lucide-react';

interface AnnualBudgetGridProps {
  restaurantId: string;
  year: number;
}

export const AnnualBudgetGrid: React.FC<AnnualBudgetGridProps> = ({
  restaurantId,
  year
}) => {
  const [showComparison, setShowComparison] = useState(false);
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

  const handleShowComparison = () => {
    setShowComparison(!showComparison);
  };

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

  if (showComparison) {
    return (
      <div className="space-y-4 w-full">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setShowComparison(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Presupuesto
          </Button>
          <h2 className="text-xl font-semibold">Comparativo Real vs Presupuesto</h2>
        </div>
        
        {actualLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando datos reales...</p>
            </CardContent>
          </Card>
        ) : actualError ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{actualError}</p>
              <Button onClick={() => fetchActualData(restaurantId, year)}>
                Reintentar
              </Button>
            </CardContent>
          </Card>
        ) : (
          <BudgetComparison 
            budgetData={rowData}
            actualData={actualData}
            year={year}
          />
        )}
      </div>
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
          onShowComparison={handleShowComparison}
          showComparison={showComparison}
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
