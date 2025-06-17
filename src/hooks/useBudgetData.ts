import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAnnualBudgets } from '@/hooks/useAnnualBudgets';
import { toast } from 'sonner';

export interface BudgetData {
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

export const useBudgetData = (restaurantId: string, year: number) => {
  const [rowData, setRowData] = useState<BudgetData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { budgets, loading, error, fetchBudgets, saveBudgets } = useAnnualBudgets();

  // Estructura de datos por defecto siguiendo el modelo P&L
  const defaultBudgetStructure: BudgetData[] = useMemo(() => [
    // VALOR DE LA PRODUCCIÓN
    {
      id: 'valor-produccion-category',
      category: 'VALOR DE LA PRODUCCIÓN',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'ventas-netas',
      category: 'VALOR DE LA PRODUCCIÓN',
      subcategory: 'Ventas Netas',
      isCategory: false,
      jan: 290770, feb: 290770, mar: 290770, apr: 290770, may: 290770, jun: 290770,
      jul: 290770, aug: 290770, sep: 290770, oct: 290770, nov: 290770, dec: 290770,
      total: 3489240
    },
    
    // TOTAL COSTE COMIDA Y PAPEL
    {
      id: 'coste-comida-papel-category',
      category: 'TOTAL COSTE COMIDA Y PAPEL',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'comida',
      category: 'TOTAL COSTE COMIDA Y PAPEL',
      subcategory: 'Comida',
      isCategory: false,
      jan: -75034, feb: -75034, mar: -75034, apr: -75034, may: -75034, jun: -75034,
      jul: -75034, aug: -75034, sep: -75034, oct: -75034, nov: -75034, dec: -75034,
      total: -900408
    },
    {
      id: 'comida-empleados',
      category: 'TOTAL COSTE COMIDA Y PAPEL',
      subcategory: 'Comida Empleados',
      isCategory: false,
      jan: -1705, feb: -1705, mar: -1705, apr: -1705, may: -1705, jun: -1705,
      jul: -1705, aug: -1705, sep: -1705, oct: -1705, nov: -1705, dec: -1705,
      total: -20460
    },
    {
      id: 'desperdicios',
      category: 'TOTAL COSTE COMIDA Y PAPEL',
      subcategory: 'Desperdicios',
      isCategory: false,
      jan: -2733, feb: -2733, mar: -2733, apr: -2733, may: -2733, jun: -2733,
      jul: -2733, aug: -2733, sep: -2733, oct: -2733, nov: -2733, dec: -2733,
      total: -32796
    },
    {
      id: 'papel',
      category: 'TOTAL COSTE COMIDA Y PAPEL',
      subcategory: 'Papel',
      isCategory: false,
      jan: -6760, feb: -6760, mar: -6760, apr: -6760, may: -6760, jun: -6760,
      jul: -6760, aug: -6760, sep: -6760, oct: -6760, nov: -6760, dec: -6760,
      total: -81120
    },

    // TOTAL GASTOS CONTROLABLES
    {
      id: 'gastos-controlables-category',
      category: 'TOTAL GASTOS CONTROLABLES',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'mano-obra',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Mano de Obra',
      isCategory: false,
      jan: -37210, feb: -37210, mar: -37210, apr: -37210, may: -37210, jun: -37210,
      jul: -37210, aug: -37210, sep: -37210, oct: -37210, nov: -37210, dec: -37210,
      total: -446520
    },
    {
      id: 'mano-obra-gerencia',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Mano de Obra Gerencia',
      isCategory: false,
      jan: -13567, feb: -13567, mar: -13567, apr: -13567, may: -13567, jun: -13567,
      jul: -13567, aug: -13567, sep: -13567, oct: -13567, nov: -13567, dec: -13567,
      total: -162804
    },
    {
      id: 'seguridad-social',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Seguridad Social',
      isCategory: false,
      jan: -16534, feb: -16534, mar: -16534, apr: -16534, may: -16534, jun: -16534,
      jul: -16534, aug: -16534, sep: -16534, oct: -16534, nov: -16534, dec: -16534,
      total: -198408
    },
    {
      id: 'publicidad',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Publicidad',
      isCategory: false,
      jan: -12134, feb: -12134, mar: -12134, apr: -12134, may: -12134, jun: -12134,
      jul: -12134, aug: -12134, sep: -12134, oct: -12134, nov: -12134, dec: -12134,
      total: -145608
    },
    {
      id: 'promocion',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Promoción',
      isCategory: false,
      jan: -833, feb: -833, mar: -833, apr: -833, may: -833, jun: -833,
      jul: -833, aug: -833, sep: -833, oct: -833, nov: -833, dec: -833,
      total: -9996
    },
    {
      id: 'servicios-exteriores',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Servicios Exteriores',
      isCategory: false,
      jan: -21115, feb: -21115, mar: -21115, apr: -21115, may: -21115, jun: -21115,
      jul: -21115, aug: -21115, sep: -21115, oct: -21115, nov: -21115, dec: -21115,
      total: -253380
    },
    {
      id: 'uniformes',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Uniformes',
      isCategory: false,
      jan: -31, feb: -31, mar: -31, apr: -31, may: -31, jun: -31,
      jul: -31, aug: -31, sep: -31, oct: -31, nov: -31, dec: -31,
      total: -372
    },
    {
      id: 'suministros-operacion',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Suministros Operación',
      isCategory: false,
      jan: -2399, feb: -2399, mar: -2399, apr: -2399, may: -2399, jun: -2399,
      jul: -2399, aug: -2399, sep: -2399, oct: -2399, nov: -2399, dec: -2399,
      total: -28788
    },
    {
      id: 'reparacion-mantenimiento',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Reparación y Mantenimiento',
      isCategory: false,
      jan: -5863, feb: -5863, mar: -5863, apr: -5863, may: -5863, jun: -5863,
      jul: -5863, aug: -5863, sep: -5863, oct: -5863, nov: -5863, dec: -5863,
      total: -70356
    },
    {
      id: 'luz-agua-telefono',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Luz, Agua, Teléfono',
      isCategory: false,
      jan: -6485, feb: -6485, mar: -6485, apr: -6485, may: -6485, jun: -6485,
      jul: -6485, aug: -6485, sep: -6485, oct: -6485, nov: -6485, dec: -6485,
      total: -77820
    },
    {
      id: 'gastos-oficina',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Gastos Oficina',
      isCategory: false,
      jan: -238, feb: -238, mar: -238, apr: -238, may: -238, jun: -238,
      jul: -238, aug: -238, sep: -238, oct: -238, nov: -238, dec: -238,
      total: -2856
    },
    {
      id: 'diferencias-caja',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Diferencias Caja',
      isCategory: false,
      jan: -39, feb: -39, mar: -39, apr: -39, may: -39, jun: -39,
      jul: -39, aug: -39, sep: -39, oct: -39, nov: -39, dec: -39,
      total: -468
    },
    {
      id: 'varios-controlables',
      category: 'TOTAL GASTOS CONTROLABLES',
      subcategory: 'Varios Controlables',
      isCategory: false,
      jan: -406, feb: -406, mar: -406, apr: -406, may: -406, jun: -406,
      jul: -406, aug: -406, sep: -406, oct: -406, nov: -406, dec: -406,
      total: -4872
    },

    // TOTAL GASTOS NO CONTROLABLES
    {
      id: 'gastos-no-controlables-category',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'renta',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Renta',
      isCategory: false,
      jan: -38914, feb: -38914, mar: -38914, apr: -38914, may: -38914, jun: -38914,
      jul: -38914, aug: -38914, sep: -38914, oct: -38914, nov: -38914, dec: -38914,
      total: -466968
    },
    {
      id: 'renta-adicional',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Renta Adicional',
      isCategory: false,
      jan: -1192, feb: -1192, mar: -1192, apr: -1192, may: -1192, jun: -1192,
      jul: -1192, aug: -1192, sep: -1192, oct: -1192, nov: -1192, dec: -1192,
      total: -14304
    },
    {
      id: 'royalti',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Royalti',
      isCategory: false,
      jan: -14539, feb: -14539, mar: -14539, apr: -14539, may: -14539, jun: -14539,
      jul: -14539, aug: -14539, sep: -14539, oct: -14539, nov: -14539, dec: -14539,
      total: -174468
    },
    {
      id: 'oficina-legal',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Oficina / Legal',
      isCategory: false,
      jan: -5702, feb: -5702, mar: -5702, apr: -5702, may: -5702, jun: -5702,
      jul: -5702, aug: -5702, sep: -5702, oct: -5702, nov: -5702, dec: -5702,
      total: -68424
    },
    {
      id: 'seguros',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Seguros',
      isCategory: false,
      jan: -366, feb: -366, mar: -366, apr: -366, may: -366, jun: -366,
      jul: -366, aug: -366, sep: -366, oct: -366, nov: -366, dec: -366,
      total: -4392
    },
    {
      id: 'tasas-licencias',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Tasas y Licencias',
      isCategory: false,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'depreciaciones-amortizaciones',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Depreciaciones/Amortizaciones',
      isCategory: false,
      jan: -15330, feb: -15330, mar: -15330, apr: -15330, may: -15330, jun: -15330,
      jul: -15330, aug: -15330, sep: -15330, oct: -15330, nov: -15330, dec: -15330,
      total: -183960
    },
    {
      id: 'intereses',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Intereses',
      isCategory: false,
      jan: -300, feb: -300, mar: -300, apr: -300, may: -300, jun: -300,
      jul: -300, aug: -300, sep: -300, oct: -300, nov: -300, dec: -300,
      total: -3600
    },
    {
      id: 'varios-no-controlables',
      category: 'TOTAL GASTOS NO CONTROLABLES',
      subcategory: 'Varios',
      isCategory: false,
      jan: -2155, feb: -2155, mar: -2155, apr: -2155, may: -2155, jun: -2155,
      jul: -2155, aug: -2155, sep: -2155, oct: -2155, nov: -2155, dec: -2155,
      total: -25860
    },

    // NETO NO PRODUCTO
    {
      id: 'neto-no-producto-category',
      category: 'NETO NO PRODUCTO',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'ventas-no-producto',
      category: 'NETO NO PRODUCTO',
      subcategory: 'Ventas no Producto',
      isCategory: false,
      jan: 3632, feb: 3632, mar: 3632, apr: 3632, may: 3632, jun: 3632,
      jul: 3632, aug: 3632, sep: 3632, oct: 3632, nov: 3632, dec: 3632,
      total: 43584
    },
    {
      id: 'costo-no-producto',
      category: 'NETO NO PRODUCTO',
      subcategory: 'Costo no Producto',
      isCategory: false,
      jan: -3187, feb: -3187, mar: -3187, apr: -3187, may: -3187, jun: -3187,
      jul: -3187, aug: -3187, sep: -3187, oct: -3187, nov: -3187, dec: -3187,
      total: -38244
    },

    // OTROS GASTOS
    {
      id: 'otros-gastos-category',
      category: 'OTROS GASTOS',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'draw-salary',
      category: 'OTROS GASTOS',
      subcategory: 'Draw Salary',
      isCategory: false,
      jan: -5391, feb: -5391, mar: -5391, apr: -5391, may: -5391, jun: -5391,
      jul: -5391, aug: -5391, sep: -5391, oct: -5391, nov: -5391, dec: -5391,
      total: -64692
    },
    {
      id: 'gastos-generales',
      category: 'OTROS GASTOS',
      subcategory: 'Gastos Generales',
      isCategory: false,
      jan: -4614, feb: -4614, mar: -4614, apr: -4614, may: -4614, jun: -4614,
      jul: -4614, aug: -4614, sep: -4614, oct: -4614, nov: -4614, dec: -4614,
      total: -55368
    },

    // CASH FLOW
    {
      id: 'cash-flow-category',
      category: 'CASH FLOW',
      isCategory: true,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    },
    {
      id: 'cuota-prestamo',
      category: 'CASH FLOW',
      subcategory: 'Cuota del préstamo (Int+Prin)',
      isCategory: false,
      jan: -15291, feb: -15291, mar: -15291, apr: -15291, may: -15291, jun: -15291,
      jul: -15291, aug: -15291, sep: -15291, oct: -15291, nov: -15291, dec: -15291,
      total: -183492
    },
    {
      id: 'inversiones-fondos-propios',
      category: 'CASH FLOW',
      subcategory: 'Inversiones con Fondos Propios',
      isCategory: false,
      jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
      jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
      total: 0
    }
  ], []);

  // Cargar datos solo una vez cuando cambien las props
  useEffect(() => {
    if (restaurantId && year && !isInitialized) {
      console.log('useBudgetData - Loading data for:', { restaurantId, year });
      fetchBudgets(restaurantId, year);
      setIsInitialized(true);
    }
  }, [restaurantId, year, fetchBudgets, isInitialized]);

  // Procesar datos cuando cambien los budgets del hook
  useEffect(() => {
    if (budgets.length > 0) {
      console.log('useBudgetData - Processing budgets from DB:', budgets.length);
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
      console.log('useBudgetData - No budgets found, using default structure');
      setRowData(defaultBudgetStructure);
    }
  }, [budgets, defaultBudgetStructure, isInitialized, loading]);

  // Función optimizada para manejar cambios en las celdas
  const handleCellChange = useCallback((id: string, field: string, value: number) => {
    console.log('useBudgetData - Cell changed:', { id, field, value });
    
    // Lista de campos numéricos editables
    const numericFields = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    if (!numericFields.includes(field)) {
      console.warn('useBudgetData - Field not editable:', field);
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

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;
    
    try {
      console.log('useBudgetData - Saving data:', rowData.length, 'rows');
      const success = await saveBudgets(restaurantId, year, rowData);
      if (success) {
        setHasChanges(false);
        console.log('useBudgetData - Save successful');
      }
    } catch (error) {
      console.error('useBudgetData - Error saving budget:', error);
      toast.error('Error al guardar el presupuesto');
    }
  }, [hasChanges, rowData, restaurantId, year, saveBudgets]);

  const reloadData = useCallback(() => {
    setIsInitialized(false);
    setRowData([]);
    setHasChanges(false);
  }, []);

  return {
    rowData,
    hasChanges,
    loading,
    error,
    handleCellChange,
    handleSave,
    reloadData
  };
};
