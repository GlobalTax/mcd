
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface FinancialParams {
  initialSales: number;
  salesGrowthRate: number;
  ebitdaMargin: number;
  taxRate: number;
  capexPercentage: number;
  discountRate: number;
  yearsToProject: number;
}

interface ProjectionRow {
  year: number;
  sales: number;
  ebitda: number;
  fcf: number;
  discountedFcf: number;
}

export function FinancialDashboard() {
  const [params, setParams] = useState<FinancialParams>({
    initialSales: 500000,
    salesGrowthRate: 5,
    ebitdaMargin: 20,
    taxRate: 25,
    capexPercentage: 3,
    discountRate: 10,
    yearsToProject: 10
  });

  const [projections, setProjections] = useState<ProjectionRow[]>([]);
  const [valuation, setValuation] = useState<number>(0);

  const calculateProjections = () => {
    const newProjections: ProjectionRow[] = [];
    let totalDiscountedFcf = 0;

    for (let year = 1; year <= params.yearsToProject; year++) {
      const sales = params.initialSales * Math.pow(1 + params.salesGrowthRate / 100, year);
      const ebitda = sales * (params.ebitdaMargin / 100);
      const tax = ebitda * (params.taxRate / 100);
      const capex = sales * (params.capexPercentage / 100);
      const fcf = ebitda - tax - capex;
      const discountedFcf = fcf / Math.pow(1 + params.discountRate / 100, year);

      totalDiscountedFcf += discountedFcf;

      newProjections.push({
        year,
        sales,
        ebitda,
        fcf,
        discountedFcf
      });
    }

    setProjections(newProjections);
    setValuation(totalDiscountedFcf);
  };

  useEffect(() => {
    calculateProjections();
  }, [params]);

  const handleParamChange = (key: keyof FinancialParams, value: string) => {
    const numValue = parseFloat(value) || 0;
    setParams(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda - Controles */}
          <div>
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Parámetros de Entrada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ventas Iniciales (€)
                    </label>
                    <Input
                      type="number"
                      value={params.initialSales}
                      onChange={(e) => handleParamChange('initialSales', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tasa Crecimiento Ventas (%)
                    </label>
                    <Input
                      type="number"
                      value={params.salesGrowthRate}
                      onChange={(e) => handleParamChange('salesGrowthRate', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Margen EBITDA (%)
                    </label>
                    <Input
                      type="number"
                      value={params.ebitdaMargin}
                      onChange={(e) => handleParamChange('ebitdaMargin', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tasa de Impuestos (%)
                    </label>
                    <Input
                      type="number"
                      value={params.taxRate}
                      onChange={(e) => handleParamChange('taxRate', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Inversión (Capex) s/ Ventas (%)
                    </label>
                    <Input
                      type="number"
                      value={params.capexPercentage}
                      onChange={(e) => handleParamChange('capexPercentage', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tasa de Descuento (WACC) (%)
                    </label>
                    <Input
                      type="number"
                      value={params.discountRate}
                      onChange={(e) => handleParamChange('discountRate', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Años a Proyectar
                    </label>
                    <Input
                      type="number"
                      value={params.yearsToProject}
                      onChange={(e) => handleParamChange('yearsToProject', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna Derecha - Resultados */}
          <div className="space-y-8">
            {/* Tarjeta de Valoración */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Valoración Estimada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    {formatCurrency(valuation)}
                  </div>
                  <p className="text-sm text-gray-500">
                    Valor Presente Neto de los Flujos de Caja Libres
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de Proyecciones */}
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Proyecciones Financieras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-700">Año</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-700">Ventas</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-700">EBITDA</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-700">FCF</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-700">FCF Desc.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.slice(0, 10).map((row) => (
                        <tr key={row.year} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-2 font-medium text-gray-900">
                            {row.year}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-700">
                            {formatCurrency(row.sales)}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-700">
                            {formatCurrency(row.ebitda)}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-700">
                            {formatCurrency(row.fcf)}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-700 font-medium">
                            {formatCurrency(row.discountedFcf)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
