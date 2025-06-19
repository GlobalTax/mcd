import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export const RestaurantComparison = ({ selectedYear, restaurants }) => {
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
    const formatCurrency = (value) => `€${value.toLocaleString()}`;
    const formatPercentage = (value) => `${value.toFixed(1)}%`;
    const getTrendIcon = (value) => {
        if (value > 0)
            return _jsx(TrendingUp, { className: "w-4 h-4 text-green-600" });
        if (value < 0)
            return _jsx(TrendingDown, { className: "w-4 h-4 text-red-600" });
        return _jsx(Minus, { className: "w-4 h-4 text-gray-600" });
    };
    const getTrendColor = (value) => {
        if (value > 0)
            return 'text-green-600';
        if (value < 0)
            return 'text-red-600';
        return 'text-gray-600';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Comparaci\u00F3n por Restaurante - ", selectedYear] }) }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-gray-50", children: [_jsx("th", { className: "text-left p-3 font-semibold", children: "Restaurante" }), _jsx("th", { className: "text-right p-3 font-semibold", children: "Ingresos" }), _jsx("th", { className: "text-right p-3 font-semibold", children: "Beneficio" }), _jsx("th", { className: "text-right p-3 font-semibold", children: "Margen %" }), _jsx("th", { className: "text-right p-3 font-semibold", children: "Clientes" }), _jsx("th", { className: "text-right p-3 font-semibold", children: "Ticket Promedio" }), _jsx("th", { className: "text-center p-3 font-semibold", children: "Rendimiento" })] }) }), _jsx("tbody", { children: comparisonData.map((restaurant, index) => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "p-3 font-medium", children: restaurant.restaurant }), _jsx("td", { className: "p-3 text-right", children: formatCurrency(restaurant.revenue) }), _jsx("td", { className: "p-3 text-right text-green-600 font-semibold", children: formatCurrency(restaurant.profit) }), _jsx("td", { className: "p-3 text-right", children: formatPercentage(restaurant.margin) }), _jsx("td", { className: "p-3 text-right", children: restaurant.customers.toLocaleString() }), _jsxs("td", { className: "p-3 text-right", children: ["\u20AC", restaurant.avgTicket.toFixed(2)] }), _jsx("td", { className: "p-3 text-center", children: _jsxs(Badge, { variant: restaurant.efficiency >= 85 ? 'default' : restaurant.efficiency >= 75 ? 'secondary' : 'destructive', children: [restaurant.efficiency, "%"] }) })] }, index))) })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Comparaci\u00F3n de Ingresos y Beneficios" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: comparisonData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "restaurant" }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}K` }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Legend, {}), _jsx(Bar, { dataKey: "revenue", fill: "#10b981", name: "Ingresos" }), _jsx(Bar, { dataKey: "profit", fill: "#3b82f6", name: "Beneficio" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "An\u00E1lisis de Rendimiento Multidimensional" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(RadarChart, { data: radarData, children: [_jsx(PolarGrid, {}), _jsx(PolarAngleAxis, { dataKey: "subject" }), _jsx(PolarRadiusAxis, { angle: 30, domain: [0, 100] }), _jsx(Radar, { name: "Madrid Centro", dataKey: "A", stroke: "#dc2626", fill: "#dc2626", fillOpacity: 0.1, strokeWidth: 2 }), _jsx(Radar, { name: "Barcelona Eixample", dataKey: "B", stroke: "#10b981", fill: "#10b981", fillOpacity: 0.1, strokeWidth: 2 }), _jsx(Radar, { name: "Valencia Centro", dataKey: "C", stroke: "#3b82f6", fill: "#3b82f6", fillOpacity: 0.1, strokeWidth: 2 }), _jsx(Legend, {})] }) }) })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: comparisonData.map((restaurant, index) => (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-3", children: _jsx(CardTitle, { className: "text-lg", children: restaurant.restaurant }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "ROI" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "font-semibold", children: "24.5%" }), getTrendIcon(2.1), _jsx("span", { className: `text-xs ${getTrendColor(2.1)}`, children: "+2.1%" })] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Crecimiento" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "font-semibold", children: "12.3%" }), getTrendIcon(1.2), _jsx("span", { className: `text-xs ${getTrendColor(1.2)}`, children: "+1.2%" })] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Eficiencia Operativa" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("span", { className: "font-semibold", children: [restaurant.efficiency, "%"] }), getTrendIcon(0.5), _jsx("span", { className: `text-xs ${getTrendColor(0.5)}`, children: "+0.5%" })] })] })] })] }, index))) })] }));
};
