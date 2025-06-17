
import React, { useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Save, Download, BarChart3, ChevronDown } from 'lucide-react';
import { useBudgetExport } from '@/hooks/useBudgetExport';
import { BudgetData } from '@/types/budgetTypes';

interface BudgetGridHeaderProps {
  year: number;
  hasChanges: boolean;
  loading: boolean;
  budgetData: BudgetData[];
  restaurantName?: string;
  onSave: () => void;
  onShowComparison: () => void;
}

export const BudgetGridHeader: React.FC<BudgetGridHeaderProps> = ({
  year,
  hasChanges,
  loading,
  budgetData,
  restaurantName,
  onSave,
  onShowComparison
}) => {
  const { exportToCSV, exportToExcel } = useBudgetExport();

  const handleExportCSV = () => {
    exportToCSV(budgetData, year, restaurantName);
  };

  const handleExportExcel = () => {
    exportToExcel(budgetData, year, restaurantName);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>Presupuesto Anual {year}</CardTitle>
        <p className="text-sm text-gray-600">
          Haz clic en cualquier celda para editar los valores
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onShowComparison}
          className="flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Comparativo
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportExcel}>
              <Download className="w-4 h-4 mr-2" />
              Exportar Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          size="sm" 
          onClick={onSave}
          disabled={!hasChanges || loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </div>
  );
};
