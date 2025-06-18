
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CashFlowStatementProps {
  restaurantId: string;
  year: number;
}

export const CashFlowStatement: React.FC<CashFlowStatementProps> = ({ restaurantId, year }) => {
  // Datos de ejemplo para el cash flow statement
  const cashFlowData = {
    operating: [
      { item: 'Beneficio neto', amount: 85000 },
      { item: 'Depreciación', amount: 15000 },
      { item: 'Cambios en cuentas por cobrar', amount: -5000 },
      { item: 'Cambios en inventario', amount: -3000 },
      { item: 'Cambios en cuentas por pagar', amount: 8000 }
    ],
    investing: [
      { item: 'Compra de equipos', amount: -25000 },
      { item: 'Mejoras en local', amount: -15000 },
      { item: 'Venta de activos', amount: 5000 }
    ],
    financing: [
      { item: 'Préstamo bancario', amount: 30000 },
      { item: 'Pago de préstamo', amount: -20000 },
      { item: 'Retiros de capital', amount: -25000 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const operatingCashFlow = cashFlowData.operating.reduce((sum, item) => sum + item.amount, 0);
  const investingCashFlow = cashFlowData.investing.reduce((sum, item) => sum + item.amount, 0);
  const financingCashFlow = cashFlowData.financing.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;

  const getIcon = (flow: number) => {
    if (flow > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (flow < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getFlowColor = (flow: number) => {
    if (flow > 0) return 'text-green-600';
    if (flow < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cash Flow Statement</h2>
          <p className="text-gray-600">Estado de flujos de efectivo - Año {year}</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Datos
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo Operacional</CardTitle>
            {getIcon(operatingCashFlow)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getFlowColor(operatingCashFlow)}`}>
              {operatingCashFlow < 0 ? '-' : ''}{formatCurrency(operatingCashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">Actividades operativas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo de Inversión</CardTitle>
            {getIcon(investingCashFlow)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getFlowColor(investingCashFlow)}`}>
              {investingCashFlow < 0 ? '-' : ''}{formatCurrency(investingCashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">Actividades de inversión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo de Financiación</CardTitle>
            {getIcon(financingCashFlow)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getFlowColor(financingCashFlow)}`}>
              {financingCashFlow < 0 ? '-' : ''}{formatCurrency(financingCashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">Actividades financieras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flujo Neto</CardTitle>
            {getIcon(netCashFlow)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getFlowColor(netCashFlow)}`}>
              {netCashFlow < 0 ? '-' : ''}{formatCurrency(netCashFlow)}
            </div>
            <p className="text-xs text-muted-foreground">Cambio neto en efectivo</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Cash Flow Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Flujos de Efectivo Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Operating Activities */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-4">Actividades Operacionales</h3>
              <div className="space-y-2">
                {cashFlowData.operating.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{item.item}</span>
                    <span className={`font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.amount < 0 ? '-' : ''}{formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 font-semibold text-blue-700 border-t-2">
                  <span>Flujo neto de actividades operacionales</span>
                  <span className={operatingCashFlow < 0 ? 'text-red-600' : 'text-green-600'}>
                    {operatingCashFlow < 0 ? '-' : ''}{formatCurrency(operatingCashFlow)}
                  </span>
                </div>
              </div>
            </div>

            {/* Investing Activities */}
            <div>
              <h3 className="text-lg font-semibold text-purple-700 mb-4">Actividades de Inversión</h3>
              <div className="space-y-2">
                {cashFlowData.investing.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{item.item}</span>
                    <span className={`font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.amount < 0 ? '-' : ''}{formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 font-semibold text-purple-700 border-t-2">
                  <span>Flujo neto de actividades de inversión</span>
                  <span className={investingCashFlow < 0 ? 'text-red-600' : 'text-green-600'}>
                    {investingCashFlow < 0 ? '-' : ''}{formatCurrency(investingCashFlow)}
                  </span>
                </div>
              </div>
            </div>

            {/* Financing Activities */}
            <div>
              <h3 className="text-lg font-semibold text-orange-700 mb-4">Actividades de Financiación</h3>
              <div className="space-y-2">
                {cashFlowData.financing.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{item.item}</span>
                    <span className={`font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {item.amount < 0 ? '-' : ''}{formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 font-semibold text-orange-700 border-t-2">
                  <span>Flujo neto de actividades de financiación</span>
                  <span className={financingCashFlow < 0 ? 'text-red-600' : 'text-green-600'}>
                    {financingCashFlow < 0 ? '-' : ''}{formatCurrency(financingCashFlow)}
                  </span>
                </div>
              </div>
            </div>

            {/* Net Cash Flow */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Cambio neto en efectivo y equivalentes</span>
                <span className={netCashFlow < 0 ? 'text-red-600' : 'text-green-600'}>
                  {netCashFlow < 0 ? '-' : ''}{formatCurrency(netCashFlow)}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Efectivo al inicio del período</span>
                  <span>{formatCurrency(25000)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Efectivo al final del período</span>
                  <span>{formatCurrency(25000 + netCashFlow)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
