import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
export const PerformanceCharts = ({ selectedYear, selectedRestaurant, restaurants }) => {
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
    const formatCurrency = (value) => `€${value.toLocaleString()}`;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n de Ventas y Clientes" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(LineChart, { data: performanceData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { yAxisId: "left", tickFormatter: (value) => `€${(value / 1000).toFixed(0)}K` }), _jsx(YAxis, { yAxisId: "right", orientation: "right" }), _jsx(Tooltip, { formatter: (value, name) => {
                                            if (name === 'sales')
                                                return formatCurrency(value);
                                            return value.toLocaleString();
                                        } }), _jsx(Legend, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "sales", stroke: "#10b981", strokeWidth: 3, name: "Ventas (\u20AC)" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "customers", stroke: "#3b82f6", strokeWidth: 3, name: "Clientes" })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Ticket Promedio y Satisfacci\u00F3n" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: performanceData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { yAxisId: "left", tickFormatter: (value) => `€${value}` }), _jsx(YAxis, { yAxisId: "right", orientation: "right", domain: [3.5, 5] }), _jsx(Tooltip, { formatter: (value, name) => {
                                                    if (name === 'avgTicket')
                                                        return `€${value.toFixed(2)}`;
                                                    return value.toFixed(1);
                                                } }), _jsx(Legend, {}), _jsx(Line, { yAxisId: "left", type: "monotone", dataKey: "avgTicket", stroke: "#8b5cf6", strokeWidth: 3, name: "Ticket Promedio (\u20AC)" }), _jsx(Line, { yAxisId: "right", type: "monotone", dataKey: "satisfaction", stroke: "#f59e0b", strokeWidth: 3, name: "Satisfacci\u00F3n (1-5)" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Mix de Productos (%)" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: categoryData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, value }) => `${name}: ${value}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: categoryData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => `${value}%` })] }) }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Tendencia de Ventas Acumuladas" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(AreaChart, { data: performanceData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}K` }), _jsx(Tooltip, { formatter: (value) => formatCurrency(value) }), _jsx(Area, { type: "monotone", dataKey: "sales", stroke: "#10b981", fill: "url(#colorSales)", strokeWidth: 2 }), _jsx("defs", { children: _jsxs("linearGradient", { id: "colorSales", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#10b981", stopOpacity: 0.1 })] }) })] }) }) })] })] }));
};
