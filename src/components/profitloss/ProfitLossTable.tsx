
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfitLossData } from '@/types/profitLoss';
import { useProfitLossCalculations } from '@/hooks/useProfitLossData';

interface ProfitLossTableProps {
  data: ProfitLossData[];
}

export const ProfitLossTable = ({ data }: ProfitLossTableProps) => {
  const { formatCurrency, formatPercentage, calculateMetrics } = useProfitLossCalculations();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500">No hay datos disponibles para este año</p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar datos por mes
  const sortedData = [...data].sort((a, b) => a.month - b.month);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Mensuales P&L</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3 font-semibold">Mes</th>
                <th className="text-right p-3 font-semibold">Ventas Netas</th>
                <th className="text-right p-3 font-semibold">Ingresos Totales</th>
                <th className="text-right p-3 font-semibold">Costo Comida</th>
                <th className="text-right p-3 font-semibold">Mano de Obra</th>
                <th className="text-right p-3 font-semibold">Gastos Operativos</th>
                <th className="text-right p-3 font-semibold">Fees McDonald's</th>
                <th className="text-right p-3 font-semibold">Beneficio Operativo</th>
                <th className="text-right p-3 font-semibold">Margen %</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => {
                const metrics = calculateMetrics(row);
                return (
                  <tr key={`${row.year}-${row.month}`} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{monthNames[row.month - 1]}</td>
                    <td className="p-3 text-right">{formatCurrency(row.net_sales)}</td>
                    <td className="p-3 text-right font-semibold">{formatCurrency(row.total_revenue)}</td>
                    <td className="p-3 text-right text-red-600">
                      {formatCurrency(row.food_cost)}
                      <div className="text-xs text-gray-500">{formatPercentage(metrics.foodCostPercentage)}</div>
                    </td>
                    <td className="p-3 text-right text-orange-600">
                      {formatCurrency(row.total_labor)}
                      <div className="text-xs text-gray-500">{formatPercentage(metrics.laborPercentage)}</div>
                    </td>
                    <td className="p-3 text-right">{formatCurrency(row.total_operating_expenses)}</td>
                    <td className="p-3 text-right">{formatCurrency(row.total_mcdonalds_fees)}</td>
                    <td className="p-3 text-right font-semibold">
                      <span className={row.operating_income >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(row.operating_income)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <span className={metrics.operatingMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercentage(metrics.operatingMargin)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-gray-100 font-semibold">
                <td className="p-3">TOTAL</td>
                <td className="p-3 text-right">
                  {formatCurrency(sortedData.reduce((sum, row) => sum + row.net_sales, 0))}
                </td>
                <td className="p-3 text-right">
                  {formatCurrency(sortedData.reduce((sum, row) => sum + row.total_revenue, 0))}
                </td>
                <td className="p-3 text-right text-red-600">
                  {formatCurrency(sortedData.reduce((sum, row) => sum + row.food_cost, 0))}
                </td>
                <td className="p-3 text-right text-orange-600">
                  {formatCurrency(sortedData.reduce((sum, row) => sum + row.total_labor, 0))}
                </td>
                <td className="p-3 text-right">
                  {formatCurrency(sortedData.reduce((sum, row) => sum + row.total_operating_expenses, 0))}
                </td>
                <td className="p-3 text-right">
                  {formatCurrency(sortedData.reduce((sum, row) => sum + row.total_mcdonalds_fees, 0))}
                </td>
                <td className="p-3 text-right">
                  <span className={sortedData.reduce((sum, row) => sum + row.operating_income, 0) >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(sortedData.reduce((sum, row) => sum + row.operating_income, 0))}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {(() => {
                    const totalRevenue = sortedData.reduce((sum, row) => sum + row.total_revenue, 0);
                    const totalOperatingIncome = sortedData.reduce((sum, row) => sum + row.operating_income, 0);
                    const avgMargin = totalRevenue > 0 ? (totalOperatingIncome / totalRevenue) * 100 : 0;
                    return (
                      <span className={avgMargin >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercentage(avgMargin)}
                      </span>
                    );
                  })()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
