
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { toast } from 'sonner';

interface BudgetGridHeaderProps {
  year: number;
  hasChanges: boolean;
  loading: boolean;
  onSave: () => void;
}

export const BudgetGridHeader: React.FC<BudgetGridHeaderProps> = ({
  year,
  hasChanges,
  loading,
  onSave
}) => {
  const handleExport = () => {
    toast.info('Funcionalidad de exportación próximamente');
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
          onClick={handleExport}
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
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
