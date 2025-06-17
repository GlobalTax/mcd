
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { BudgetData } from '@/types/budgetTypes';

interface BudgetTableProps {
  data: BudgetData[];
  actualData?: any[];
  onCellChange: (id: string, field: string, value: number) => void;
}

interface EditingCell {
  rowId: string;
  field: string;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ data, actualData = [], onCellChange }) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  const months = [
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

  const handleCellClick = (rowId: string, field: string, isCategory: boolean) => {
    if (isCategory) return;
    setEditingCell({ rowId, field });
  };

  const handleInputChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (editingCell) {
      onCellChange(editingCell.rowId, editingCell.field, numValue);
    }
  };

  const handleInputBlur = () => {
    setEditingCell(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingCell(null);
    }
  };

  const formatCurrency = (value: number) => {
    return `€${value.toLocaleString()}`;
  };

  const getCellValue = (row: BudgetData, field: string): number => {
    return row[field as keyof BudgetData] as number;
  };

  const getActualValue = (row: BudgetData, field: string): number => {
    const actualRow = actualData.find(actual => 
      actual.category === row.category && actual.subcategory === row.subcategory
    );
    return actualRow ? (actualRow[field as keyof typeof actualRow] as number || 0) : 0;
  };

  const isEditing = (rowId: string, field: string): boolean => {
    return editingCell?.rowId === rowId && editingCell?.field === field;
  };

  const getVarianceColor = (budget: number, actual: number): string => {
    if (budget === 0 && actual === 0) return '';
    const variance = ((actual - budget) / Math.abs(budget)) * 100;
    if (Math.abs(variance) < 5) return 'text-gray-600';
    return variance > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-white z-10 min-w-[200px] border-r">Concepto</TableHead>
            {months.map(month => (
              <TableHead key={month.key} className="text-center border-r">
                <div className="space-y-1">
                  <div className="font-bold text-gray-900">{month.label}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className="text-blue-600 font-medium">Presup.</div>
                    <div className="text-green-600 font-medium">Real</div>
                  </div>
                </div>
              </TableHead>
            ))}
            <TableHead className="text-center min-w-[120px] bg-blue-50 font-bold border-l">
              <div className="space-y-1">
                <div>Total</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="text-blue-600">Presup.</div>
                  <div className="text-green-600">Real</div>
                </div>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const actualTotal = months.reduce((sum, month) => 
              sum + getActualValue(row, month.key), 0
            );

            return (
              <TableRow key={row.id} className={row.isCategory ? 'bg-gray-50 font-bold' : ''}>
                <TableCell className="sticky left-0 bg-white z-10 font-medium border-r">
                  <div className={row.isCategory ? 'font-bold text-gray-900' : 'pl-4 text-gray-700'}>
                    {row.subcategory || row.category}
                  </div>
                </TableCell>
                {months.map(month => {
                  const budgetValue = getCellValue(row, month.key);
                  const actualValue = getActualValue(row, month.key);
                  
                  return (
                    <TableCell key={month.key} className="text-center p-1 border-r">
                      {row.isCategory ? (
                        <div className="grid grid-cols-2 gap-1">
                          <span className="text-gray-400 text-sm">-</span>
                          <span className="text-gray-400 text-sm">-</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1">
                          {/* Columna Presupuesto */}
                          <div className={`cursor-pointer hover:bg-blue-50 p-1 rounded text-xs ${!row.isCategory ? 'border-r border-gray-200' : ''}`}
                               onClick={() => handleCellClick(row.id, month.key, row.isCategory)}>
                            {isEditing(row.id, month.key) ? (
                              <Input
                                type="number"
                                defaultValue={budgetValue}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onBlur={handleInputBlur}
                                onKeyPress={handleKeyPress}
                                className="w-full text-center text-xs h-6 border-blue-300 focus:border-blue-500"
                                autoFocus
                                step="100"
                              />
                            ) : (
                              <span className="text-blue-600 font-medium">
                                {formatCurrency(budgetValue)}
                              </span>
                            )}
                          </div>
                          
                          {/* Columna Real */}
                          <div className="p-1 text-xs">
                            <span className={`font-medium ${getVarianceColor(budgetValue, actualValue)}`}>
                              {formatCurrency(actualValue)}
                            </span>
                          </div>
                        </div>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="text-center bg-blue-50 font-bold border-l p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="text-blue-600 text-sm font-bold">
                      {formatCurrency(row.total)}
                    </div>
                    <div className={`text-sm font-bold ${getVarianceColor(row.total, actualTotal)}`}>
                      {formatCurrency(actualTotal)}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
