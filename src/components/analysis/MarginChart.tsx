
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const MarginChart = () => {
  const monthlyData = [
    { month: 'Ene', margin: 22.4 },
    { month: 'Feb', margin: 21.9 },
    { month: 'Mar', margin: 22.3 },
    { month: 'Abr', margin: 22.2 },
    { month: 'May', margin: 22.6 },
    { month: 'Jun', margin: 23.3 },
    { month: 'Jul', margin: 24.0 },
    { month: 'Ago', margin: 22.9 },
    { month: 'Sep', margin: 22.8 },
    { month: 'Oct', margin: 22.7 },
    { month: 'Nov', margin: 23.3 },
    { month: 'Dic', margin: 23.8 }
  ];

  return (
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
  );
};
