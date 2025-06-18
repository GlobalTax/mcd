
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

interface PerformanceChartsProps {
  selectedYear: number;
  selectedRestaurant: string;
  restaurants: any[];
}

export const PerformanceCharts = ({ selectedYear, selectedRestaurant, restaurants }: PerformanceChartsProps) => {
  // Datos de ejemplo para gráficos de rendimiento
  const performanceData = [
    { month: 'Ene', sales: 98000, customers: 3200, avgTicket: 30.6, satisfaction: 4.2 },
    { month: 'Feb', sales: 105000, customers: 3400, avgTicket: 30.9, satisfaction: 4.3 },
    { month: 'Mar', sales: 112000, customers: 3600, avgTicket: 31.1, satisfaction: 4.1 },
    { month: 'Abr', sales: 108000, customers: 3500, avgTicket: 30.9, satisfaction: 4.4 },
    { month: 'May', sales: 115000, customers: 3700, avgTicket: 31.1, satisfaction: 4.2 },
    { month: 'Jun', sales: 120000, customers: 3800, avgTicket: 31.6, satisfaction: 4.5 },
    { month: 'Jul', sales: 125000, customers: 3900, avgTicket: 32.1, satisfaction: 4.3 },
    { month: 'Ago', sales: 118000, customers: 3650, avgTicket: 32.3, satisfaction: 4.4 },
    { month: 'Sep', sales: 114000, customers: 3550, avgTicket: 32.1, satisfaction: 4.2 },
    { month: 'Oct', sales: 110000, customers: 3450, avgTicket: 31.9, satisfaction: 4.3 },
    { month: 'Nov', sales: 116000, customers: 3650, avgTicket: 31.8, satisfaction: 4.5 },
    { month: 'Dic', sales: 122000, customers: 3800, avgTicket: 32.1, satisfaction: 4.4 }
  ];

  const categoryData = [
    { name: 'Hamburguesas', value: 45, color: '#dc2626' },
    { name: 'Bebidas', value: 25, color: '#ea580c' },
    { name: 'Acompañamientos', value: 20, color: '#ca8a04' },
    { name: 'Postres', value: 7, color: '#65a30d' },
    { name: 'Desayunos', value: 3, color: '#0891b2' }
  ];

  const formatCurrency = (value: number) => `€${value.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Sales Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Ventas y Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'sales') return formatCurrency(value);
                  return value.toLocaleString();
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="sales" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Ventas (€)" 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="customers" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Clientes" 
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Ticket */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Promedio y Satisfacción</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" tickFormatter={(value) => `€${value}`} />
                <YAxis yAxisId="right" orientation="right" domain={[3.5, 5]} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'avgTicket') return `€${value.toFixed(2)}`;
                    return value.toFixed(1);
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="avgTicket" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Ticket Promedio (€)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  name="Satisfacción (1-5)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Mix de Productos (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sales Trend Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ventas Acumuladas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#10b981" 
                fill="url(#colorSales)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
