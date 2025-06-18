
import React, { useState } from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { BudgetTableProps, EditingCell } from './BudgetTableTypes';
import { BudgetTableHeaderComponent } from './BudgetTableHeader';
import { BudgetTableRowComponent } from './BudgetTableRow';

export const BudgetTable: React.FC<BudgetTableProps> = ({ 
  data, 
  actualData = [], 
  onCellChange, 
  viewMode = 'budget',
  showOnlySummary = false
}) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  // Filtrar datos según el modo de resumen
  const filteredData = showOnlySummary 
    ? data.filter(row => row.isCategory)
    : data;

  const handleCellClick = (rowId: string, field: string, isCategory: boolean) => {
    if (isCategory || viewMode === 'actuals') return;
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

  return (
    <div className="w-full">
      <div className="overflow-x-auto border rounded-lg">
        <Table className="min-w-full">
          <BudgetTableHeaderComponent viewMode={viewMode} />
          <TableBody>
            {filteredData.map((row) => (
              <BudgetTableRowComponent
                key={row.id}
                row={row}
                data={data}
                actualData={actualData}
                viewMode={viewMode}
                editingCell={editingCell}
                onCellClick={handleCellClick}
                onInputChange={handleInputChange}
                onInputBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
