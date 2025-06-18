
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { BudgetData } from '@/types/budgetTypes';
import { BudgetTableCell } from './BudgetTableCell';
import { EditingCell } from './BudgetTableTypes';
import { 
  months, 
  formatCurrency, 
  getCellValue, 
  getActualValue, 
  calculateCategoryTotals, 
  calculateCategoryActualTotals,
  getVarianceColor,
  getVariancePercentage
} from './BudgetTableUtils';

interface BudgetTableRowProps {
  row: BudgetData;
  data: BudgetData[];
  actualData: any[];
  viewMode: 'budget' | 'comparison' | 'actuals';
  editingCell: EditingCell | null;
  onCellClick: (rowId: string, field: string, isCategory: boolean) => void;
  onInputChange: (value: string) => void;
  onInputBlur: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export const BudgetTableRowComponent: React.FC<BudgetTableRowProps> = ({
  row,
  data,
  actualData,
  viewMode,
  editingCell,
  onCellClick,
  onInputChange,
  onInputBlur,
  onKeyPress
}) => {
  // Para categorías, calculamos los totales sumando las subcategorías
  const categoryTotalByMonth = row.isCategory ? 
    months.reduce((acc, month) => {
      acc[month.key] = calculateCategoryTotals(data, row.category, month.key);
      return acc;
    }, {} as Record<string, number>) : {};

  const categoryActualTotalByMonth = row.isCategory ? 
    months.reduce((acc, month) => {
      acc[month.key] = calculateCategoryActualTotals(data, actualData, row.category, month.key);
      return acc;
    }, {} as Record<string, number>) : {};

  const actualTotal = row.isCategory ? 
    months.reduce((sum, month) => sum + (categoryActualTotalByMonth[month.key] || 0), 0) :
    months.reduce((sum, month) => sum + getActualValue(row, month.key, actualData), 0);

  const budgetTotal = row.isCategory ?
    months.reduce((sum, month) => sum + (categoryTotalByMonth[month.key] || 0), 0) :
    row.total;

  return (
    <TableRow className={`${row.isCategory ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'} border-b`}>
      <TableCell className="sticky left-0 bg-white z-10 font-medium border-r p-4">
        <div className={row.isCategory ? 'font-bold text-gray-900 text-base' : 'pl-6 text-gray-700 font-medium'}>
          {row.subcategory || row.category}
        </div>
      </TableCell>
      {months.map(month => {
        const budgetValue = row.isCategory ? 
          categoryTotalByMonth[month.key] : 
          getCellValue(row, month.key);
        const actualValue = row.isCategory ?
          categoryActualTotalByMonth[month.key] :
          getActualValue(row, month.key, actualData);
        
        return (
          <TableCell key={month.key} className="text-center p-2 border-r">
            <BudgetTableCell
              budgetValue={budgetValue}
              actualValue={actualValue}
              viewMode={viewMode}
              isCategory={row.isCategory}
              rowId={row.id}
              field={month.key}
              editingCell={editingCell}
              onCellClick={onCellClick}
              onInputChange={onInputChange}
              onInputBlur={onInputBlur}
              onKeyPress={onKeyPress}
            />
          </TableCell>
        );
      })}
      <TableCell className="text-center bg-blue-50 font-bold border-l p-2">
        <div className={viewMode === 'comparison' ? "grid grid-cols-3 gap-1" : "flex justify-center"}>
          {/* Total Presupuesto o única columna */}
          {viewMode !== 'actuals' && (
            <div className="text-blue-700 font-bold text-base py-2">
              {formatCurrency(budgetTotal)}
            </div>
          )}
          
          {/* Solo mostrar total real */}
          {viewMode === 'actuals' && (
            <div className="text-green-700 font-bold text-base py-2">
              {formatCurrency(actualTotal)}
            </div>
          )}
          
          {/* Comparativa: Total Real y Varianza */}
          {viewMode === 'comparison' && (
            <>
              <div className={`font-bold text-base py-2 ${getVarianceColor(budgetTotal, actualTotal)}`}>
                {formatCurrency(actualTotal)}
              </div>
              <div className={`font-bold text-sm py-2 ${getVarianceColor(budgetTotal, actualTotal)}`}>
                {getVariancePercentage(budgetTotal, actualTotal)}
              </div>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
