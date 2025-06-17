
import React, { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useAnnualBudgets } from '@/hooks/useAnnualBudgets';

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
  const { budgets, loading, fetchBudgets, saveBudgets } = useAnnualBudgets();

  // Datos de ejemplo para la estructura del presupuesto
  const defaultBudgetStructure: BudgetData[] = [
    {
      id: 'ingresos',
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
      id: 'costos',
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
  ];

  useEffect(() => {
    loadBudgetData();
  }, [restaurantId, year]);

  const loadBudgetData = async () => {
    if (!restaurantId) return;
    
    await fetchBudgets(restaurantId, year);
    
    if (budgets.length > 0) {
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
    } else {
      // Usar datos por defecto si no hay datos en la BD
      setRowData(defaultBudgetStructure);
    }
  };

  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Concepto',
      field: 'subcategory',
      valueGetter: (params: any) => params.data.subcategory || params.data.category,
      width: 250,
      pinned: 'left',
      cellStyle: (params: any) => {
        if (params.data.isCategory) {
          return { 
            fontWeight: 'bold', 
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #dee2e6'
          };
        }
        return { paddingLeft: '20px' };
      }
    },
    {
      headerName: 'Ene',
      field: 'jan',
      width: 100,
      editable: (params: any) =>  !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Feb',
      field: 'feb',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Mar',
      field: 'mar',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Abr',
      field: 'apr',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'May',
      field: 'may',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Jun',
      field: 'jun',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Jul',
      field: 'jul',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Ago',
      field: 'aug',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Sep',
      field: 'sep',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Oct',
      field: 'oct',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Nov',
      field: 'nov',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Dec',
      field: 'dec',
      width: 100,
      editable: (params: any) => !params.data.isCategory,
      type: 'numericColumn',
      valueFormatter: (params: any) => params.data.isCategory ? '' : `€${params.value?.toLocaleString() || 0}`
    },
    {
      headerName: 'Total',
      field: 'total',
      width: 120,
      pinned: 'right',
      valueGetter: calculateRowTotal,
      valueFormatter: (params: any) => `€${params.value?.toLocaleString() || 0}`,
      cellStyle: { 
        fontWeight: 'bold',
        backgroundColor: '#e8f4f8'
      }
    }
  ], []);

  function calculateRowTotal(params: any) {
    if (params.data.isCategory) {
      // Para categorías, sumar todos los subcategorías
      const categoryItems = rowData.filter(item => 
        item.category === params.data.category && !item.isCategory
      );
      return categoryItems.reduce((sum, item) => sum + item.total, 0);
    }
    
    // Para elementos individuales, sumar todos los meses
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    return months.reduce((sum, month) => sum + (params.data[month] || 0), 0);
  }

  const handleCellValueChanged = (event: any) => {
    console.log('Celda modificada:', event);
    
    // Actualizar el total de la fila
    const updatedData = [...rowData];
    const rowIndex = updatedData.findIndex(item => item.id === event.data.id);
    
    if (rowIndex !== -1) {
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      updatedData[rowIndex].total = months.reduce((sum, month) => 
        sum + (updatedData[rowIndex][month as keyof BudgetData] as number || 0), 0
      );
      
      setRowData(updatedData);
      setHasChanges(true);
    }
    
    toast.success('Valor actualizado correctamente');
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    
    try {
      const success = await saveBudgets(restaurantId, year, rowData);
      if (success) {
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Error al guardar el presupuesto');
    }
  };

  const handleExport = () => {
    // Implementar exportación a Excel/CSV
    toast.info('Funcionalidad de exportación próximamente');
  };

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
        <div 
          className="ag-theme-alpine" 
          style={{ height: 600, width: '100%' }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={rowData}
            onCellValueChanged={handleCellValueChanged}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true
            }}
            suppressRowClickSelection={true}
            rowSelection="multiple"
            animateRows={true}
            enableCellTextSelection={true}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={20}
            stopEditingWhenCellsLoseFocus={true}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
};
