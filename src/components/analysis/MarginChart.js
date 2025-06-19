import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n del Margen (%)" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: monthlyData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `${value}%` }), _jsx(Tooltip, { formatter: (value) => `${value.toFixed(1)}%` }), _jsx(Line, { type: "monotone", dataKey: "margin", stroke: "#8b5cf6", strokeWidth: 3, name: "Margen Operativo" })] }) }) })] }));
};
