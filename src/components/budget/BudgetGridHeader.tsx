
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, TrendingUp, BarChart3, Eye, EyeOff } from 'lucide-react';
import { BudgetData } from '@/types/budgetTypes';

interface BudgetGridHeaderProps {
  year: number;
  hasChanges: boolean;
  loading: boolean;
  budgetData: BudgetData[];
  restaurantName?: string;
  onSave: () => void;
  onShowComparison: () => void;
  showComparison?: boolean;
  showActuals?: boolean;
  onToggleActuals?: () => void;
}

export const BudgetGridHeader: React.FC<BudgetGridHeaderProps> = ({
  year,
  hasChanges,
  loading,
  budgetData,
  restaurantName,
  onSave,
  onShowComparison,
  showComparison = false,
  showActuals = false,
  onToggleActuals
}) => {
  const calculateTotal = () => {
    return budgetData.reduce((sum, row) => sum + (row.total || 0), 0);
  };

  const formatCurrency = (value: number) => {
    return `€${value.toLocaleString('es-ES')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Presupuesto Anual {year}
          </h2>
          {restaurantName && (
            <p className="text-sm text-gray-600 mt-1">{restaurantName}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Presupuestado</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(calculateTotal())}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Button
            onClick={onShowComparison}
            variant="outline"
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            {showComparison ? 'Ocultar Comparativa' : 'Mostrar Comparativa'}
          </Button>
          
          {onToggleActuals && (
            <Button
              onClick={onToggleActuals}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showActuals ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showActuals ? 'Ocultar Reales' : 'Mostrar Reales'}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 font-medium">
              Cambios sin guardar
            </span>
          )}
          <Button 
            onClick={onSave}
            disabled={!hasChanges || loading}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
};
