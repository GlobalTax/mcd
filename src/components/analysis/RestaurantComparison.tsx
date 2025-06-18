
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RestaurantComparisonProps {
  selectedYear: number;
  restaurants: any[];
}

export const RestaurantComparison = ({ selectedYear, restaurants }: RestaurantComparisonProps) => {
  // Datos de ejemplo para comparación entre restaurantes
  const comparisonData = [
    { 
      restaurant: 'Madrid Centro', 
      revenue: 1200000, 
      profit: 240000, 
      margin: 20.0,
      customers: 42000,
      avgTicket: 28.6,
      efficiency: 85
    },
    { 
      restaurant: 'Barcelona Eixample', 
      revenue: 1350000, 
      profit: 283500, 
      margin: 21.0,
      customers: 45000,
      avgTicket: 30.0,
      efficiency: 88
    },
    { 
      restaurant: 'Valencia Centro', 
      revenue: 980000, 
      profit: 176400, 
      margin: 18.0,
      customers: 35000,
      avgTicket: 28.0,
      efficiency: 82
    }
  ];

  const radarData = [
    { subject: 'Ventas', A: 85, B: 92, C: 75 },
    { subject: 'Rentabilidad', A: 80, B: 88, C: 72 },
    { subject: 'Eficiencia', A: 85, B: 88, C: 82 },
    { subject: 'Satisfacción', A: 88, B: 85, C: 90 },
    { subject: 'Crecimiento', A: 75, B: 80, C: 65 },
  ];

  const formatCurrency = (value: number) => `€${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación por Restaurante - {selectedYear}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">Restaurante</th>
                  <th className="text-right p-3 font-semibold">Ingresos</th>
                  <th className="text-right p-3 font-semibold">Beneficio</th>
                  <th className="text-right p-3 font-semibold">Margen %</th>
                  <th className="text-right p-3 font-semibold">Clientes</th>
                  <th className="text-right p-3 font-semibold">Ticket Promedio</th>
                  <th className="text-center p-3 font-semibold">Rendimiento</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((restaurant, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{restaurant.restaurant}</td>
                    <td className="p-3 text-right">{formatCurrency(restaurant.revenue)}</td>
                    <td className="p-3 text-right text-green-600 font-semibold">
                      {formatCurrency(restaurant.profit)}
                    </td>
                    <td className="p-3 text-right">{formatPercentage(restaurant.margin)}</td>
                    <td className="p-3 text-right">{restaurant.customers.toLocaleString()}</td>
                    <td className="p-3 text-right">€{restaurant.avgTicket.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <Badge 
                        variant={restaurant.efficiency >= 85 ? 'default' : restaurant.efficiency >= 75 ? 'secondary' : 'destructive'}
                      >
                        {restaurant.efficiency}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Comparison Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Comparación de Ingresos y Beneficios</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="restaurant" />
                <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Ingresos" />
                <Bar dataKey="profit" fill="#3b82f6" name="Beneficio" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Rendimiento Multidimensional</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar 
                  name="Madrid Centro" 
                  dataKey="A" 
                  stroke="#dc2626" 
                  fill="#dc2626" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar 
                  name="Barcelona Eixample" 
                  dataKey="B" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Radar 
                  name="Valencia Centro" 
                  dataKey="C" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comparisonData.map((restaurant, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{restaurant.restaurant}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">ROI</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">24.5%</span>
                  {getTrendIcon(2.1)}
                  <span className={`text-xs ${getTrendColor(2.1)}`}>+2.1%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Crecimiento</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">12.3%</span>
                  {getTrendIcon(1.2)}
                  <span className={`text-xs ${getTrendColor(1.2)}`}>+1.2%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eficiencia Operativa</span>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{restaurant.efficiency}%</span>
                  {getTrendIcon(0.5)}
                  <span className={`text-xs ${getTrendColor(0.5)}`}>+0.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
