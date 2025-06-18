
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { BudgetData } from '@/types/budgetTypes';

interface BudgetTableProps {
  data: BudgetData[];
  actualData?: any[];
  onCellChange: (id: string, field: string, value: number) => void;
  showActuals?: boolean;
}

interface EditingCell {
  rowId: string;
  field: string;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ 
  data, 
  actualData = [], 
  onCellChange, 
  showActuals = false 
}) => {
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
    return `€${value.toLocaleString('es-ES')}`;
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

  const getVariancePercentage = (budget: number, actual: number): string => {
    if (budget === 0) return actual === 0 ? '0%' : '∞%';
    const variance = ((actual - budget) / Math.abs(budget)) * 100;
    return `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="sticky left-0 bg-gray-50 z-20 min-w-[300px] border-r font-bold text-gray-900 text-base">
                Concepto
              </TableHead>
              {months.map(month => (
                <TableHead key={month.key} className="text-center border-r min-w-[200px] p-3">
                  <div className="space-y-2">
                    <div className="font-bold text-gray-900 text-base">{month.label}</div>
                    {showActuals ? (
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        <div className="text-blue-700 font-semibold bg-blue-50 py-1 px-1 rounded">Presup.</div>
                        <div className="text-green-700 font-semibold bg-green-50 py-1 px-1 rounded">Real</div>
                        <div className="text-orange-700 font-semibold bg-orange-50 py-1 px-1 rounded">Var.</div>
                      </div>
                    ) : (
                      <div className="text-blue-700 font-semibold bg-blue-50 py-1 px-2 rounded text-sm">Presupuesto</div>
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="text-center min-w-[250px] bg-blue-100 font-bold border-l text-base p-3">
                <div className="space-y-2">
                  <div className="text-gray-900">Total Anual</div>
                  {showActuals ? (
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      <div className="text-blue-700 font-semibold">Presup.</div>
                      <div className="text-green-700 font-semibold">Real</div>
                      <div className="text-orange-700 font-semibold">Var.</div>
                    </div>
                  ) : (
                    <div className="text-blue-700 font-semibold text-sm">Presupuesto</div>
                  )}
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
                <TableRow key={row.id} className={`${row.isCategory ? 'bg-gray-100 font-bold' : 'hover:bg-gray-50'} border-b`}>
                  <TableCell className="sticky left-0 bg-white z-10 font-medium border-r p-4">
                    <div className={row.isCategory ? 'font-bold text-gray-900 text-base' : 'pl-6 text-gray-700 font-medium'}>
                      {row.subcategory || row.category}
                    </div>
                  </TableCell>
                  {months.map(month => {
                    const budgetValue = getCellValue(row, month.key);
                    const actualValue = getActualValue(row, month.key);
                    
                    return (
                      <TableCell key={month.key} className="text-center p-2 border-r">
                        {row.isCategory ? (
                          <div className={showActuals ? "grid grid-cols-3 gap-1" : "flex justify-center"}>
                            <span className="text-gray-400 text-base py-2">-</span>
                            {showActuals && (
                              <>
                                <span className="text-gray-400 text-base py-2">-</span>
                                <span className="text-gray-400 text-base py-2">-</span>
                              </>
                            )}
                          </div>
                        ) : (
                          <div className={showActuals ? "grid grid-cols-3 gap-1" : "flex justify-center"}>
                            {/* Columna Presupuesto */}
                            <div className={`cursor-pointer hover:bg-blue-50 p-2 rounded ${showActuals ? '' : 'border-r border-gray-200'}`}
                                 onClick={() => handleCellClick(row.id, month.key, row.isCategory)}>
                              {isEditing(row.id, month.key) ? (
                                <Input
                                  type="number"
                                  defaultValue={budgetValue}
                                  onChange={(e) => handleInputChange(e.target.value)}
                                  onBlur={handleInputBlur}
                                  onKeyPress={handleKeyPress}
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
                            
                            {showActuals && (
                              <>
                                {/* Columna Real */}
                                <div className="p-2">
                                  <span className={`font-semibold text-sm block py-1 ${getVarianceColor(budgetValue, actualValue)}`}>
                                    {formatCurrency(actualValue)}
                                  </span>
                                </div>
                                
                                {/* Columna Varianza */}
                                <div className="p-2">
                                  <span className={`font-semibold text-xs block py-1 ${getVarianceColor(budgetValue, actualValue)}`}>
                                    {getVariancePercentage(budgetValue, actualValue)}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="text-center bg-blue-50 font-bold border-l p-2">
                    <div className={showActuals ? "grid grid-cols-3 gap-1" : "flex justify-center"}>
                      <div className="text-blue-700 font-bold text-base py-2">
                        {formatCurrency(row.total)}
                      </div>
                      {showActuals && (
                        <>
                          <div className={`font-bold text-base py-2 ${getVarianceColor(row.total, actualTotal)}`}>
                            {formatCurrency(actualTotal)}
                          </div>
                          <div className={`font-bold text-sm py-2 ${getVarianceColor(row.total, actualTotal)}`}>
                            {getVariancePercentage(row.total, actualTotal)}
                          </div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
