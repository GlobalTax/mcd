
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { BudgetData } from '@/types/budgetTypes';

interface BudgetTableProps {
  data: BudgetData[];
  onCellChange: (id: string, field: string, value: number) => void;
}

interface EditingCell {
  rowId: string;
  field: string;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ data, onCellChange }) => {
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
    if (isCategory) return; // No permitir edición en filas de categoría
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

  const isEditing = (rowId: string, field: string): boolean => {
    return editingCell?.rowId === rowId && editingCell?.field === field;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 bg-white z-10 min-w-[200px]">Concepto</TableHead>
            {months.map(month => (
              <TableHead key={month.key} className="text-center min-w-[100px]">
                {month.label}
              </TableHead>
            ))}
            <TableHead className="text-center min-w-[120px] bg-blue-50 font-bold">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id} className={row.isCategory ? 'bg-gray-50 font-bold' : ''}>
              <TableCell className="sticky left-0 bg-white z-10 font-medium">
                <div className={row.isCategory ? 'font-bold text-gray-900' : 'pl-4 text-gray-700'}>
                  {row.subcategory || row.category}
                </div>
              </TableCell>
              {months.map(month => (
                <TableCell 
                  key={month.key} 
                  className={`text-center ${!row.isCategory ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                  onClick={() => handleCellClick(row.id, month.key, row.isCategory)}
                >
                  {row.isCategory ? (
                    <span className="text-gray-400">-</span>
                  ) : isEditing(row.id, month.key) ? (
                    <Input
                      type="number"
                      defaultValue={getCellValue(row, month.key)}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={handleInputBlur}
                      onKeyPress={handleKeyPress}
                      className="w-full text-center border-blue-300 focus:border-blue-500"
                      autoFocus
                      step="100"
                    />
                  ) : (
                    <span className="block w-full py-2 px-1 rounded hover:bg-blue-50">
                      {formatCurrency(getCellValue(row, month.key))}
                    </span>
                  )}
                </TableCell>
              ))}
              <TableCell className="text-center bg-blue-50 font-bold">
                {formatCurrency(row.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
