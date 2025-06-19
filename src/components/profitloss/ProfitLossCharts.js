import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useProfitLossCalculations } from '@/hooks/useProfitLossData';
export const ProfitLossCharts = ({ data }) => {
    const { formatCurrency } = useProfitLossCalculations();
    const monthNames = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    // Preparar datos para los gráficos
    const chartData = data
        .sort((a, b) => a.month - b.month)
        .map(item => ({
        month: monthNames[item.month - 1],
        ingresos: item.total_revenue,
        gastos: item.total_cost_of_sales + item.total_labor + item.total_operating_expenses + item.total_mcdonalds_fees,
        beneficio: item.operating_income,
        margen: item.total_revenue > 0 ? (item.operating_income / item.total_revenue) * 100 : 0,
    }));
    if (data.length === 0) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No hay datos disponibles para mostrar gr\u00E1ficos" }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n Mensual - Ingresos vs Beneficio" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}K` }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "ingresos", stroke: "#10b981", strokeWidth: 2, name: "Ingresos" }), _jsx(Line, { type: "monotone", dataKey: "beneficio", stroke: "#3b82f6", strokeWidth: 2, name: "Beneficio Operativo" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Comparativa Mensual - Ingresos vs Gastos" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}K` }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "ingresos", fill: "#10b981", name: "Ingresos" }), _jsx(Bar, { dataKey: "gastos", fill: "#ef4444", name: "Gastos Totales" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Margen Operativo Mensual (%)" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 200, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `${value.toFixed(1)}%` }), _jsx(Tooltip, { formatter: (value) => `${value.toFixed(1)}%` }), _jsx(Line, { type: "monotone", dataKey: "margen", stroke: "#8b5cf6", strokeWidth: 3, name: "Margen Operativo %" })] }) }) })] })] }));
};
