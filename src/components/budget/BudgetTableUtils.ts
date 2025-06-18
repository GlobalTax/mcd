
import { BudgetData } from '@/types/budgetTypes';
import { HeaderLabels } from './BudgetTableTypes';

export const months = [
  { key: 'jan', label: 'Ene' },
  { key: 'feb', label: 'Feb' },
  { key: 'mar', label: 'Mar' },
  { key: 'apr', label: 'Abr' },
  { key: 'may', label: 'May' },
  { key: 'jun', label: 'Jun' },
  { key: 'jul', label: 'Jul' },
  { key: 'aug', label: 'Ago' },
  { key: 'sep', label: 'Sep' },
  { key: 'oct', label: 'Oct' },
  { key: 'nov', label: 'Nov' },
  { key: 'dec', label: 'Dic' }
];

export const formatCurrency = (value: number): string => {
  return `€${value.toLocaleString('es-ES')}`;
};

export const getCellValue = (row: BudgetData, field: string): number => {
  return row[field as keyof BudgetData] as number;
};

export const getActualValue = (row: BudgetData, field: string, actualData: any[]): number => {
  const actualRow = actualData.find(actual => 
    actual.category === row.category && actual.subcategory === row.subcategory
  );
  return actualRow ? (actualRow[field as keyof typeof actualRow] as number || 0) : 0;
};

export const calculateCategoryTotals = (data: BudgetData[], categoryName: string, field: string): number => {
  return data
    .filter(row => row.category === categoryName && !row.isCategory)
    .reduce((sum, row) => sum + (getCellValue(row, field) || 0), 0);
};

export const calculateCategoryActualTotals = (data: BudgetData[], actualData: any[], categoryName: string, field: string): number => {
  return data
    .filter(row => row.category === categoryName && !row.isCategory)
    .reduce((sum, row) => sum + (getActualValue(row, field, actualData) || 0), 0);
};

export const getVarianceColor = (budget: number, actual: number): string => {
  if (budget === 0 && actual === 0) return '';
  const variance = ((actual - budget) / Math.abs(budget)) * 100;
  if (Math.abs(variance) < 5) return 'text-gray-600';
  return variance > 0 ? 'text-green-600' : 'text-red-600';
};

export const getVariancePercentage = (budget: number, actual: number): string => {
  if (budget === 0) return actual === 0 ? '0%' : '∞%';
  const variance = ((actual - budget) / Math.abs(budget)) * 100;
  return `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
};

export const getHeaderLabels = (viewMode: 'budget' | 'comparison' | 'actuals'): HeaderLabels => {
  switch (viewMode) {
    case 'comparison':
      return {
        monthSubheaders: (
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-blue-700 font-semibold bg-blue-50 py-1 px-1 rounded">Presup.</div>
            <div className="text-green-700 font-semibold bg-green-50 py-1 px-1 rounded">Real</div>
            <div className="text-orange-700 font-semibold bg-orange-50 py-1 px-1 rounded">Var.</div>
          </div>
        ),
        totalSubheaders: (
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-blue-700 font-semibold">Presup.</div>
            <div className="text-green-700 font-semibold">Real</div>
            <div className="text-orange-700 font-semibold">Var.</div>
          </div>
        )
      };
    case 'actuals':
      return {
        monthSubheaders: (
          <div className="text-green-700 font-semibold bg-green-50 py-1 px-2 rounded text-sm">Reales</div>
        ),
        totalSubheaders: (
          <div className="text-green-700 font-semibold text-sm">Reales</div>
        )
      };
    default:
      return {
        monthSubheaders: (
          <div className="text-blue-700 font-semibold bg-blue-50 py-1 px-2 rounded text-sm">Presupuesto</div>
        ),
        totalSubheaders: (
          <div className="text-blue-700 font-semibold text-sm">Presupuesto</div>
        )
      };
  }
};
