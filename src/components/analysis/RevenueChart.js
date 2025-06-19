import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useProfitLossCalculations } from '@/hooks/useProfitLossData';
export const RevenueChart = () => {
    const { formatCurrency } = useProfitLossCalculations();
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
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n Ingresos vs Beneficio" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(LineChart, { data: monthlyData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}K` }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#10b981", strokeWidth: 3, name: "Ingresos" }), _jsx(Line, { type: "monotone", dataKey: "profit", stroke: "#3b82f6", strokeWidth: 3, name: "Beneficio" })] }) }) })] }));
};
