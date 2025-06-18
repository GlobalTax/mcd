
import React from 'react';
import { Input } from '@/components/ui/input';
import { formatCurrency, getVarianceColor, getVariancePercentage } from './BudgetTableUtils';
import { EditingCell } from './BudgetTableTypes';

interface BudgetTableCellProps {
  budgetValue: number;
  actualValue: number;
  viewMode: 'budget' | 'comparison' | 'actuals';
  isCategory: boolean;
  rowId: string;
  field: string;
  editingCell: EditingCell | null;
  onCellClick: (rowId: string, field: string, isCategory: boolean) => void;
  onInputChange: (value: string) => void;
  onInputBlur: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const BudgetTableCell: React.FC<BudgetTableCellProps> = ({
  budgetValue,
  actualValue,
  viewMode,
  isCategory,
  rowId,
  field,
  editingCell,
  onCellClick,
  onInputChange,
  onInputBlur,
  onKeyPress
}) => {
  const isEditing = editingCell?.rowId === rowId && editingCell?.field === field;

  if (isCategory) {
    return (
      <div className={viewMode === 'comparison' ? "grid grid-cols-3 gap-1" : "flex justify-center"}>
        {/* Presupuesto para categorías */}
        {viewMode !== 'actuals' && (
          <span className="text-blue-700 font-bold text-sm py-2">
            {formatCurrency(budgetValue)}
          </span>
        )}
        
        {/* Solo mostrar reales */}
        {viewMode === 'actuals' && (
          <span className="text-green-700 font-bold text-sm py-2">
            {formatCurrency(actualValue)}
          </span>
        )}
        
        {/* Comparativa: Real y Varianza para categorías */}
        {viewMode === 'comparison' && (
          <>
            <span className={`font-bold text-sm py-2 ${getVarianceColor(budgetValue, actualValue)}`}>
              {formatCurrency(actualValue)}
            </span>
            <span className={`font-bold text-xs py-2 ${getVarianceColor(budgetValue, actualValue)}`}>
              {getVariancePercentage(budgetValue, actualValue)}
            </span>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={viewMode === 'comparison' ? "grid grid-cols-3 gap-1" : "flex justify-center"}>
      {/* Columna Presupuesto o única columna */}
      {viewMode !== 'actuals' && (
        <div className={`cursor-pointer hover:bg-blue-50 p-2 rounded ${viewMode === 'comparison' ? '' : 'border-r border-gray-200'}`}
             onClick={() => onCellClick(rowId, field, isCategory)}>
          {isEditing ? (
            <Input
              type="number"
              defaultValue={budgetValue}
              onChange={(e) => onInputChange(e.target.value)}
              onBlur={onInputBlur}
              onKeyPress={onKeyPress}
              className="w-full text-center text-sm h-8 border-blue-300 focus:border-blue-500"
              autoFocus
              step="100"
            />
          ) : (
            <span className="text-blue-700 font-semibold text-sm block py-1">
              {formatCurrency(budgetValue)}
            </span>
          )}
        </div>
      )}
      
      {/* Solo mostrar reales */}
      {viewMode === 'actuals' && (
        <div className="p-2">
          <span className="text-green-700 font-semibold text-sm block py-1">
            {formatCurrency(actualValue)}
          </span>
        </div>
      )}
      
      {/* Comparativa: Real y Varianza */}
      {viewMode === 'comparison' && (
        <>
          <div className="p-2">
            <span className={`font-semibold text-sm block py-1 ${getVarianceColor(budgetValue, actualValue)}`}>
              {formatCurrency(actualValue)}
            </span>
          </div>
          <div className="p-2">
            <span className={`font-semibold text-xs block py-1 ${getVarianceColor(budgetValue, actualValue)}`}>
              {getVariancePercentage(budgetValue, actualValue)}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
