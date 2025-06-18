
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface ProfitabilityAnalysisProps {
  selectedYear: number;
  selectedRestaurant: string;
  restaurants: any[];
}

export const ProfitabilityAnalysis = ({ selectedYear, selectedRestaurant, restaurants }: ProfitabilityAnalysisProps) => {
  // Datos de ejemplo para análisis de rentabilidad
  const profitabilityData = [
    { month: 'Ene', grossMargin: 65.2, operatingMargin: 22.4, netMargin: 18.1, roi: 23.5 },
    { month: 'Feb', grossMargin: 64.8, operatingMargin: 21.9, netMargin: 17.8, roi: 24.1 },
    { month: 'Mar', grossMargin: 65.5, operatingMargin: 22.3, netMargin: 18.2, roi: 24.8 },
    { month: 'Abr', grossMargin: 65.1, operatingMargin: 22.2, netMargin: 18.0, roi: 24.2 },
    { month: 'May', grossMargin: 65.8, operatingMargin: 22.6, netMargin: 18.4, roi: 25.1 },
    { month: 'Jun', grossMargin: 66.2, operatingMargin: 23.3, netMargin: 19.1, roi: 25.8 },
    { month: 'Jul', grossMargin: 66.5, operatingMargin: 24.0, netMargin: 19.5, roi: 26.2 },
    { month: 'Ago', grossMargin: 66.1, operatingMargin: 22.9, netMargin: 18.8, roi: 25.5 },
    { month: 'Sep', grossMargin: 65.9, operatingMargin: 22.8, netMargin: 18.6, roi: 25.2 },
    { month: 'Oct', grossMargin: 65.7, operatingMargin: 22.7, netMargin: 18.5, roi: 24.9 },
    { month: 'Nov', grossMargin: 66.0, operatingMargin: 23.3, netMargin: 19.0, roi: 25.6 },
    { month: 'Dic', grossMargin: 66.3, operatingMargin: 23.8, netMargin: 19.3, roi: 26.0 }
  ];

  const costBreakdown = [
    { category: 'Costo Comida', percentage: 34.5, target: 32.0, status: 'warning' },
    { category: 'Mano de Obra', percentage: 28.2, target: 30.0, status: 'good' },
    { category: 'Alquiler', percentage: 8.5, target: 10.0, status: 'good' },
    { category: 'Servicios', percentage: 6.8, target: 8.0, status: 'good' },
    { category: 'Marketing', percentage: 3.5, target: 4.0, status: 'good' },
    { category: 'Otros', percentage: 4.2, target: 5.0, status: 'good' }
  ];

  const benchmarkData = [
    { metric: 'Margen Bruto', actual: 65.8, industry: 62.5, target: 68.0 },
    { metric: 'Margen Operativo', actual: 23.1, industry: 19.8, target: 25.0 },
    { metric: 'ROI', actual: 25.2, industry: 22.1, target: 28.0 },
    { metric: 'Rotación Inventario', actual: 12.5, industry: 10.8, target: 15.0 }
  ];

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Profitability Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Márgenes de Rentabilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: number) => formatPercentage(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="grossMargin" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Margen Bruto" 
              />
              <Line 
                type="monotone" 
                dataKey="operatingMargin" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Margen Operativo" 
              />
              <Line 
                type="monotone" 
                dataKey="netMargin" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Margen Neto" 
              />
              <Line 
                type="monotone" 
                dataKey="roi" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="ROI" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Structure Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Estructura de Costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {costBreakdown.map((cost, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getStatusColor(cost.status)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(cost.status)}
                      <span className="font-medium">{cost.category}</span>
                    </div>
                    <Badge variant={cost.status === 'good' ? 'default' : 'secondary'}>
                      {formatPercentage(cost.percentage)}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Objetivo: {formatPercentage(cost.target)}</span>
                    <span className={cost.percentage <= cost.target ? 'text-green-600' : 'text-red-600'}>
                      {cost.percentage <= cost.target ? '✓ En objetivo' : '⚠ Sobre objetivo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benchmark Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Comparación con Benchmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={benchmarkData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="metric" type="category" width={120} />
                <Tooltip formatter={(value: number) => formatPercentage(value)} />
                <Legend />
                <Bar dataKey="actual" fill="#3b82f6" name="Actual" />
                <Bar dataKey="industry" fill="#6b7280" name="Promedio Industria" />
                <Bar dataKey="target" fill="#10b981" name="Objetivo" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ROI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Retorno sobre Inversión (ROI)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">25.2%</div>
              <div className="text-sm text-gray-600">ROI Actual</div>
              <div className="text-xs text-green-600 mt-1">+2.1% vs año anterior</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">28.0%</div>
              <div className="text-sm text-gray-600">ROI Objetivo</div>
              <div className="text-xs text-gray-600 mt-1">Meta anual</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">22.1%</div>
              <div className="text-sm text-gray-600">Promedio Industria</div>
              <div className="text-xs text-gray-600 mt-1">Benchmark sector</div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={profitabilityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value: number) => formatPercentage(value)} />
              <Legend />
              <Bar dataKey="roi" fill="#f59e0b" name="ROI Mensual" opacity={0.3} />
              <Line 
                type="monotone" 
                dataKey="roi" 
                stroke="#f59e0b" 
                strokeWidth={3}
                name="Tendencia ROI" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
