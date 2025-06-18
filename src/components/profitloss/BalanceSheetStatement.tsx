
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface BalanceSheetStatementProps {
  restaurantId: string;
  year: number;
}

export const BalanceSheetStatement: React.FC<BalanceSheetStatementProps> = ({ restaurantId, year }) => {
  // Datos de ejemplo para el balance sheet
  const balanceSheetData = {
    assets: {
      current: [
        { item: 'Efectivo y equivalentes', amount: 45000 },
        { item: 'Cuentas por cobrar', amount: 15000 },
        { item: 'Inventario', amount: 25000 },
        { item: 'Gastos pagados por adelantado', amount: 8000 }
      ],
      nonCurrent: [
        { item: 'Equipo y maquinaria', amount: 180000 },
        { item: 'Mobiliario', amount: 35000 },
        { item: 'Mejoras en local arrendado', amount: 65000 },
        { item: 'Depreciación acumulada', amount: -45000 }
      ]
    },
    liabilities: {
      current: [
        { item: 'Cuentas por pagar', amount: 18000 },
        { item: 'Salarios por pagar', amount: 12000 },
        { item: 'Impuestos por pagar', amount: 8500 },
        { item: 'Préstamo corto plazo', amount: 15000 }
      ],
      nonCurrent: [
        { item: 'Préstamo a largo plazo', amount: 120000 },
        { item: 'Depósitos de clientes', amount: 5000 }
      ]
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, item) => sum + item.amount, 0);
  const totalNonCurrentAssets = balanceSheetData.assets.nonCurrent.reduce((sum, item) => sum + item.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = balanceSheetData.liabilities.current.reduce((sum, item) => sum + item.amount, 0);
  const totalNonCurrentLiabilities = balanceSheetData.liabilities.nonCurrent.reduce((sum, item) => sum + item.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
  
  const equity = totalAssets - totalLiabilities;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Balance Sheet</h2>
          <p className="text-gray-600">Estado de situación financiera - Año {year}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Datos
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-700">ACTIVOS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Assets */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Activos Corrientes</h4>
              <div className="space-y-2">
                {balanceSheetData.assets.current.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-700">{item.item}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-semibold">
                  <span>Total Activos Corrientes</span>
                  <span>{formatCurrency(totalCurrentAssets)}</span>
                </div>
              </div>
            </div>

            {/* Non-Current Assets */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Activos No Corrientes</h4>
              <div className="space-y-2">
                {balanceSheetData.assets.nonCurrent.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-700">{item.item}</span>
                    <span className={`font-medium ${item.amount < 0 ? 'text-red-600' : ''}`}>
                      {item.amount < 0 ? '-' : ''}{formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-semibold">
                  <span>Total Activos No Corrientes</span>
                  <span>{formatCurrency(totalNonCurrentAssets)}</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 pt-3 flex justify-between items-center font-bold text-lg text-green-700">
              <span>TOTAL ACTIVOS</span>
              <span>{formatCurrency(totalAssets)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities & Equity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-red-700">PASIVOS Y PATRIMONIO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Liabilities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Pasivos Corrientes</h4>
              <div className="space-y-2">
                {balanceSheetData.liabilities.current.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-700">{item.item}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-semibold">
                  <span>Total Pasivos Corrientes</span>
                  <span>{formatCurrency(totalCurrentLiabilities)}</span>
                </div>
              </div>
            </div>

            {/* Non-Current Liabilities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Pasivos No Corrientes</h4>
              <div className="space-y-2">
                {balanceSheetData.liabilities.nonCurrent.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-700">{item.item}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between items-center font-semibold">
                  <span>Total Pasivos No Corrientes</span>
                  <span>{formatCurrency(totalNonCurrentLiabilities)}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-2 flex justify-between items-center font-semibold">
              <span>TOTAL PASIVOS</span>
              <span>{formatCurrency(totalLiabilities)}</span>
            </div>

            {/* Equity */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Patrimonio</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700">Capital inicial</span>
                  <span className="font-medium">{formatCurrency(150000)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700">Utilidades retenidas</span>
                  <span className="font-medium">{formatCurrency(equity - 150000)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between items-center font-semibold">
                  <span>TOTAL PATRIMONIO</span>
                  <span>{formatCurrency(equity)}</span>
                </div>
              </div>
            </div>

            <div className="border-t-2 pt-3 flex justify-between items-center font-bold text-lg text-red-700">
              <span>TOTAL PASIVOS Y PATRIMONIO</span>
              <span>{formatCurrency(totalLiabilities + equity)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
