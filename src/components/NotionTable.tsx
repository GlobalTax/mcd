
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronDown } from 'lucide-react';
import { calculateRestaurantValuation } from '@/utils/valuationCalculator';

interface ProjectionData {
  id: string;
  year: number;
  sales: number;
  pac: number;
  rent: number;
  serviceFees: number;
  soi: number;
  cashflow: number;
  freeCashFlow: number;
}

// Datos base para la proyección
const baseData = {
  valuationDate: new Date().toISOString().split('T')[0],
  initialSales: 2454919,
  salesGrowthRate: 3,
  inflationRate: 1.5,
  discountRate: 21,
  yearsRemaining: 20,
  pacPercentage: 32,
  rentPercentage: 11.47,
  serviceFeesPercentage: 5,
  depreciation: 72092,
  interest: 19997,
  loanPayment: 31478,
  rentIndex: 75925,
  miscellaneous: 85521
};

// Calcular proyecciones iniciales
const calculateInitialProjections = (): ProjectionData[] => {
  const result = calculateRestaurantValuation(baseData);
  return result.yearlyProjections.slice(0, 10).map((projection, index) => ({
    id: (index + 1).toString(),
    year: projection.year,
    sales: projection.sales,
    pac: projection.pac,
    rent: projection.rent,
    serviceFees: projection.serviceFees,
    soi: projection.soi,
    cashflow: projection.cashflow,
    freeCashFlow: projection.freeCashFlow
  }));
};

const definitions = [
  {
    term: 'Sales',
    definition: 'Ventas totales proyectadas con crecimiento anual del 3%'
  },
  {
    term: 'P.A.C.',
    definition: 'Costo de comida y papel como porcentaje de ventas (32%)'
  },
  {
    term: 'Rent',
    definition: 'Alquiler como porcentaje de ventas (11.47%)'
  },
  {
    term: 'Service Fees',
    definition: 'Tarifas de servicio como porcentaje de ventas (5%)'
  },
  {
    term: 'S.O.I.',
    definition: 'Store Operating Income - Ingresos operativos después de todos los gastos'
  },
  {
    term: 'Cashflow',
    definition: 'Flujo de caja operativo incluyendo pagos de préstamo'
  },
  {
    term: 'Free Cash Flow',
    definition: 'Flujo de caja libre después de reinversiones y depreciación'
  }
];

export function NotionTable() {
  const [data, setData] = useState<ProjectionData[]>(calculateInitialProjections());
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [newRow, setNewRow] = useState({
    year: '',
    sales: '',
    pac: '',
    rent: '',
    serviceFees: '',
    soi: '',
    cashflow: '',
    freeCashFlow: ''
  });
  const [isAddingRow, setIsAddingRow] = useState(false);

  const handleAddRow = () => {
    if (newRow.year && newRow.sales) {
      const newData: ProjectionData = {
        id: Date.now().toString(),
        year: parseInt(newRow.year),
        sales: parseFloat(newRow.sales),
        pac: parseFloat(newRow.pac) || 0,
        rent: parseFloat(newRow.rent) || 0,
        serviceFees: parseFloat(newRow.serviceFees) || 0,
        soi: parseFloat(newRow.soi) || 0,
        cashflow: parseFloat(newRow.cashflow) || 0,
        freeCashFlow: parseFloat(newRow.freeCashFlow) || 0
      };
      
      setData([...data, newData]);
      setNewRow({
        year: '',
        sales: '',
        pac: '',
        rent: '',
        serviceFees: '',
        soi: '',
        cashflow: '',
        freeCashFlow: ''
      });
      setIsAddingRow(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    }).format(value) + ' €';
  };

  const formatYear = (year: number) => {
    return year.toString();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-600 text-sm">📊</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Valoración Restaurante / Proyecciones Financieras</h1>
        </div>
      </div>

      <div className="space-y-8">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Proyecciones Financieras 2025-2034
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Año</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Ventas</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">P.A.C.</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Alquiler</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Service Fees</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">S.O.I.</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Cashflow</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Free Cash Flow</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow 
                      key={row.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4 px-6">
                        <span className="font-medium text-gray-900">
                          {formatYear(row.year)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {formatCurrency(row.sales)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {formatCurrency(row.pac)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {formatCurrency(row.rent)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {formatCurrency(row.serviceFees)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {formatCurrency(row.soi)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {formatCurrency(row.cashflow)}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700 font-semibold">
                        {formatCurrency(row.freeCashFlow)}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {isAddingRow && (
                    <TableRow className="border-b border-gray-100">
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.year}
                          onChange={(e) => setNewRow({...newRow, year: e.target.value})}
                          placeholder="2035"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.sales}
                          onChange={(e) => setNewRow({...newRow, sales: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.pac}
                          onChange={(e) => setNewRow({...newRow, pac: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.rent}
                          onChange={(e) => setNewRow({...newRow, rent: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.serviceFees}
                          onChange={(e) => setNewRow({...newRow, serviceFees: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.soi}
                          onChange={(e) => setNewRow({...newRow, soi: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.cashflow}
                          onChange={(e) => setNewRow({...newRow, cashflow: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.freeCashFlow}
                          onChange={(e) => setNewRow({...newRow, freeCashFlow: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="p-4 border-t border-gray-100">
                {!isAddingRow ? (
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAddingRow(true)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar año
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleAddRow} size="sm">
                      Guardar
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAddingRow(false)}
                      size="sm"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded"
            onClick={() => setShowDefinitions(!showDefinitions)}
          >
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDefinitions ? 'rotate-0' : '-rotate-90'}`} />
            <h3 className="text-lg font-semibold text-gray-900">Definiciones de métricas financieras</h3>
          </div>
          
          {showDefinitions && (
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-3 w-48">Término</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3">Definición</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {definitions.map((def, index) => (
                    <TableRow key={index} className="border-b border-gray-100">
                      <TableCell className="py-4 font-medium text-gray-900">
                        {def.term}
                      </TableCell>
                      <TableCell className="py-4 text-gray-700">
                        {def.definition}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
