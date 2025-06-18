
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useProfitLossCalculations } from '@/hooks/useProfitLossData';

interface FinancialMetricsProps {
  selectedYear: number;
  selectedRestaurant: string;
  restaurants: any[];
}

export const FinancialMetrics = ({ selectedYear, selectedRestaurant, restaurants }: FinancialMetricsProps) => {
  const { formatCurrency, formatPercentage } = useProfitLossCalculations();

  // Datos de ejemplo para métricas financieras
  const monthlyData = [
    { month: 'Ene', revenue: 98000, costs: 76000, profit: 22000, margin: 22.4 },
    { month: 'Feb', revenue: 105000, costs: 82000, profit: 23000, margin: 21.9 },
    { month: 'Mar', revenue: 112000, costs: 87000, profit: 25000, margin: 22.3 },
    { month: 'Abr', revenue: 108000, costs: 84000, profit: 24000, margin: 22.2 },
    { month: 'May', revenue: 115000, costs: 89000, profit: 26000, margin: 22.6 },
    { month: 'Jun', revenue: 120000, costs: 92000, profit: 28000, margin: 23.3 },
    { month: 'Jul', revenue: 125000, costs: 95000, profit: 30000, margin: 24.0 },
    { month: 'Ago', revenue: 118000, costs: 91000, profit: 27000, margin: 22.9 },
    { month: 'Sep', revenue: 114000, costs: 88000, profit: 26000, margin: 22.8 },
    { month: 'Oct', revenue: 110000, costs: 85000, profit: 25000, margin: 22.7 },
    { month: 'Nov', revenue: 116000, costs: 89000, profit: 27000, margin: 23.3 },
    { month: 'Dic', revenue: 122000, costs: 93000, profit: 29000, margin: 23.8 }
  ];

  const kpiData = [
    { metric: 'EBITDA', value: 315000, percentage: 23.1, trend: '+5.2%', color: 'text-green-600' },
    { metric: 'ROI', value: 24.8, percentage: 0, trend: '-1.2%', color: 'text-red-600' },
    { metric: 'Margen Neto', value: 18.5, percentage: 0, trend: '+2.1%', color: 'text-green-600' },
    { metric: 'Cash Flow', value: 285000, percentage: 20.9, trend: '+8.7%', color: 'text-green-600' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{kpi.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpi.metric.includes('Margen') || kpi.metric === 'ROI' 
                  ? formatPercentage(kpi.value)
                  : formatCurrency(kpi.value)
                }
              </div>
              <p className={`text-xs ${kpi.color}`}>
                {kpi.trend} vs año anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue vs Profit Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución Ingresos vs Beneficio</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Ingresos" 
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Beneficio" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Margin Evolution */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución del Margen (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                <Line 
                  type="monotone" 
                  dataKey="margin" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Margen Operativo" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Estructura de Costos Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="costs" fill="#ef4444" name="Costos Totales" />
                <Bar dataKey="profit" fill="#10b981" name="Beneficio" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
