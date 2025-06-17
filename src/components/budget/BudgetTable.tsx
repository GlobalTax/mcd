
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface BudgetData {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  total: number;
}

interface BudgetTableProps {
  data: BudgetData[];
  onCellChange: (id: string, field: string, value: number) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ data, onCellChange }) => {
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

  const handleInputChange = (id: string, field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    onCellChange(id, field, numValue);
  };

  const formatCurrency = (value: number) => {
    return `€${value.toLocaleString()}`;
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
                <TableCell key={month.key} className="text-center">
                  {row.isCategory ? (
                    <span className="text-gray-400">-</span>
                  ) : (
                    <Input
                      type="number"
                      value={row[month.key as keyof BudgetData] as number}
                      onChange={(e) => handleInputChange(row.id, month.key, e.target.value)}
                      className="w-full text-center border-0 focus:border focus:border-blue-300 bg-transparent"
                      step="100"
                    />
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
