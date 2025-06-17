
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAnnualBudgets } from '@/hooks/useAnnualBudgets';
import { BudgetTable } from './BudgetTable';

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

interface AnnualBudgetGridProps {
  restaurantId: string;
  year: number;
  onSave?: (data: BudgetData[]) => Promise<void>;
}

export const AnnualBudgetGrid: React.FC<AnnualBudgetGridProps> = ({
  restaurantId,
  year,
  onSave
}) => {
  const [rowData, setRowData] = useState<BudgetData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { budgets, loading, error, fetchBudgets, saveBudgets } = useAnnualBudgets();

  // Datos de ejemplo para cuando no hay datos en la BD
  const defaultBudgetStructure: BudgetData[] = useMemo(() => [
    {
      id: 'ingresos-category',
      category: 'INGRESOS',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'ventas-restaurante',
      category: 'INGRESOS',
      subcategory: 'Ventas Restaurante',
      isCategory: false,
      jan: 45000, feb: 47000, mar: 49000, apr: 51000, may: 53000, jun: 55000,
      jul: 57000, aug: 59000, sep: 56000, oct: 54000, nov: 52000, dec: 58000,
      total: 636000
    },
    {
      id: 'otros-ingresos',
      category: 'INGRESOS', 
      subcategory: 'Otros Ingresos',
      isCategory: false,
      jan: 2000, feb: 2000, mar: 2000, apr: 2000, may: 2000, jun: 2000,
      jul: 2000, aug: 2000, sep: 2000, oct: 2000, nov: 2000, dec: 2000,
      total: 24000
    },
    {
      id: 'costos-category',
      category: 'COSTOS OPERATIVOS',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'costo-alimentos',
      category: 'COSTOS OPERATIVOS',
      subcategory: 'Costo de Alimentos',
      isCategory: false,
      jan: -13500, feb: -14100, mar: -14700, apr: -15300, may: -15900, jun: -16500,
      jul: -17100, aug: -17700, sep: -16800, oct: -16200, nov: -15600, dec: -17400,
      total: -190800
    },
    {
      id: 'mano-obra',
      category: 'COSTOS OPERATIVOS',
      subcategory: 'Mano de Obra',
      isCategory: false,
      jan: -12000, feb: -12000, mar: -12500, apr: -13000, may: -13500, jun: -14000,
      jul: -14500, aug: -15000, sep: -14000, oct: -13500, nov: -13000, dec: -14000,
      total: -161000
    },
    {
      id: 'alquiler',
      category: 'COSTOS OPERATIVOS',
      subcategory: 'Alquiler',
      isCategory: false,
      jan: -8000, feb: -8000, mar: -8000, apr: -8000, may: -8000, jun: -8000,
      jul: -8000, aug: -8000, sep: -8000, oct: -8000, nov: -8000, dec: -8000,
      total: -96000
    }
  ], []);

  // Cargar datos solo una vez cuando cambien las props
  useEffect(() => {
    if (restaurantId && year && !isInitialized) {
      console.log('AnnualBudgetGrid - Loading data for:', { restaurantId, year });
      fetchBudgets(restaurantId, year);
      setIsInitialized(true);
    }
  }, [restaurantId, year, fetchBudgets, isInitialized]);

  // Procesar datos cuando cambien los budgets del hook
  useEffect(() => {
    if (budgets.length > 0) {
      console.log('AnnualBudgetGrid - Processing budgets from DB:', budgets.length);
      // Convertir datos de la BD al formato del grid
      const gridData = budgets.map(budget => ({
        id: budget.id,
        category: budget.category,
        subcategory: budget.subcategory || '',
        isCategory: false,
        jan: budget.jan,
        feb: budget.feb,
        mar: budget.mar,
        apr: budget.apr,
        may: budget.may,
        jun: budget.jun,
        jul: budget.jul,
        aug: budget.aug,
        sep: budget.sep,
        oct: budget.oct,
        nov: budget.nov,
        dec: budget.dec,
        total: budget.jan + budget.feb + budget.mar + budget.apr + budget.may + budget.jun +
               budget.jul + budget.aug + budget.sep + budget.oct + budget.nov + budget.dec
      }));
      setRowData(gridData);
    } else if (isInitialized && !loading) {
      console.log('AnnualBudgetGrid - No budgets found, using default structure');
      setRowData(defaultBudgetStructure);
    }
  }, [budgets, defaultBudgetStructure, isInitialized, loading]);

  // Función optimizada para manejar cambios en las celdas
  const handleCellChange = useCallback((id: string, field: string, value: number) => {
    console.log('AnnualBudgetGrid - Cell changed:', { id, field, value });
    
    // Lista de campos numéricos editables
    const numericFields = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    if (!numericFields.includes(field)) {
      console.warn('AnnualBudgetGrid - Field not editable:', field);
      return;
    }
    
    setRowData(prevData => {
      const updatedData = prevData.map(row => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          // Recalcular el total
          updatedRow.total = numericFields.reduce((sum, month) => 
            sum + (updatedRow[month as keyof BudgetData] as number || 0), 0
          );
          return updatedRow;
        }
        return row;
      });
      
      setHasChanges(true);
      return updatedData;
    });
    
    toast.success('Valor actualizado correctamente');
  }, []);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    try {
      console.log('AnnualBudgetGrid - Saving data:', rowData.length, 'rows');
      const success = await saveBudgets(restaurantId, year, rowData);
      if (success) {
        setHasChanges(false);
        console.log('AnnualBudgetGrid - Save successful');
      }
    } catch (error) {
      console.error('AnnualBudgetGrid - Error saving budget:', error);
      toast.error('Error al guardar el presupuesto');
    }
  };

  const handleExport = () => {
    toast.info('Funcionalidad de exportación próximamente');
  };

  const reloadData = () => {
    setIsInitialized(false);
    setRowData([]);
    setHasChanges(false);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando presupuesto...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <p className="font-semibold">Error al cargar los datos</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button 
            onClick={reloadData}
            variant="outline"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
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
              onClick={handleSave}
              disabled={!hasChanges || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
        {hasChanges && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ Tienes cambios sin guardar. No olvides hacer clic en "Guardar" para preservar tus modificaciones.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <BudgetTable 
          data={rowData} 
          onCellChange={handleCellChange}
        />
      </CardContent>
    </Card>
  );
};
