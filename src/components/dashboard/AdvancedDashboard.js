import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, Target, AlertTriangle, CheckCircle, BarChart3, PieChart, Activity, RefreshCw, Download, Share2, Info } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/utils/analytics';
import { useCache } from '@/utils/cache';
import { useNotifications, createNotification } from '@/components/NotificationSystem';
const AdvancedDashboard = () => {
    const [config, setConfig] = useState({
        layout: 'grid',
        theme: 'auto',
        refreshInterval: 30000, // 30 segundos
        widgets: [],
    });
    const [metrics, setMetrics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
    const analytics = useAnalytics();
    const cache = useCache();
    const { addNotification } = useNotifications();
    // Datos de ejemplo para gráficos
    const chartData = useMemo(() => [
        { name: 'Ene', ventas: 4000, gastos: 2400, ganancias: 1600 },
        { name: 'Feb', ventas: 3000, gastos: 1398, ganancias: 1602 },
        { name: 'Mar', ventas: 2000, gastos: 9800, ganancias: 1200 },
        { name: 'Abr', ventas: 2780, gastos: 3908, ganancias: 1872 },
        { name: 'May', ventas: 1890, gastos: 4800, ganancias: 1090 },
        { name: 'Jun', ventas: 2390, gastos: 3800, ganancias: 1590 },
    ], []);
    const pieData = useMemo(() => [
        { name: 'Comida', value: 400, color: '#8884d8' },
        { name: 'Bebidas', value: 300, color: '#82ca9d' },
        { name: 'Postres', value: 200, color: '#ffc658' },
        { name: 'Otros', value: 100, color: '#ff7300' },
    ], []);
    // Métricas de ejemplo
    const defaultMetrics = [
        {
            id: 'revenue',
            title: 'Ingresos Totales',
            value: 125000,
            change: 12.5,
            changeType: 'increase',
            format: 'currency',
            icon: _jsx(DollarSign, { className: "h-4 w-4" }),
            color: 'text-green-600',
            target: 150000,
            progress: 83,
        },
        {
            id: 'restaurants',
            title: 'Restaurantes Activos',
            value: 45,
            change: -2.1,
            changeType: 'decrease',
            format: 'number',
            icon: _jsx(Building2, { className: "h-4 w-4" }),
            color: 'text-blue-600',
            target: 50,
            progress: 90,
        },
        {
            id: 'customers',
            title: 'Clientes Atendidos',
            value: 12500,
            change: 8.3,
            changeType: 'increase',
            format: 'number',
            icon: _jsx(Users, { className: "h-4 w-4" }),
            color: 'text-purple-600',
            target: 15000,
            progress: 83,
        },
        {
            id: 'efficiency',
            title: 'Eficiencia Operativa',
            value: 87.5,
            change: 3.2,
            changeType: 'increase',
            format: 'percentage',
            icon: _jsx(Target, { className: "h-4 w-4" }),
            color: 'text-orange-600',
            target: 90,
            progress: 97,
        },
    ];
    useEffect(() => {
        setMetrics(defaultMetrics);
        loadDashboardConfig();
        startAutoRefresh();
        // Track dashboard view
        analytics.trackEvent('Dashboard', 'view', 'advanced');
        return () => stopAutoRefresh();
    }, []);
    const loadDashboardConfig = () => {
        const savedConfig = cache.get('dashboard-config');
        if (savedConfig) {
            setConfig(savedConfig);
        }
    };
    const saveDashboardConfig = (newConfig) => {
        setConfig(newConfig);
        cache.set('dashboard-config', newConfig, 24 * 60 * 60 * 1000); // 24 horas
    };
    const startAutoRefresh = () => {
        const interval = setInterval(() => {
            refreshData();
        }, config.refreshInterval);
        return () => clearInterval(interval);
    };
    const stopAutoRefresh = () => {
        // Cleanup handled by useEffect
    };
    const refreshData = async () => {
        setIsLoading(true);
        try {
            // Simular carga de datos
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Actualizar métricas con datos simulados
            const updatedMetrics = metrics.map(metric => ({
                ...metric,
                value: metric.value + Math.random() * 1000 - 500,
                change: metric.change + Math.random() * 10 - 5,
            }));
            setMetrics(updatedMetrics);
            setLastUpdate(new Date());
            addNotification(createNotification.success('Dashboard Actualizado', 'Los datos han sido actualizados correctamente'));
            analytics.trackEvent('Dashboard', 'refresh', 'success');
        }
        catch (error) {
            addNotification(createNotification.error('Error de Actualización', 'No se pudieron actualizar los datos del dashboard'));
            analytics.trackEvent('Dashboard', 'refresh', 'error');
        }
        finally {
            setIsLoading(false);
        }
    };
    const formatValue = (value, format) => {
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                }).format(value);
            case 'percentage':
                return `${value.toFixed(1)}%`;
            case 'time':
                return `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`;
            default:
                return new Intl.NumberFormat('es-ES').format(value);
        }
    };
    const getChangeIcon = (changeType) => {
        switch (changeType) {
            case 'increase':
                return _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" });
            case 'decrease':
                return _jsx(TrendingDown, { className: "h-4 w-4 text-red-600" });
            default:
                return _jsx(Activity, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const exportDashboard = () => {
        const data = {
            metrics,
            config,
            lastUpdate,
            timeRange: selectedTimeRange,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        analytics.trackEvent('Dashboard', 'export', 'json');
        addNotification(createNotification.success('Dashboard Exportado', 'Los datos han sido exportados correctamente'));
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 p-6", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Dashboard Avanzado" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["\u00DAltima actualizaci\u00F3n: ", lastUpdate.toLocaleTimeString()] })] }), _jsxs("div", { className: "flex items-center space-x-3", children: [_jsxs(Select, { value: selectedTimeRange, onValueChange: (value) => setSelectedTimeRange(value), children: [_jsx(SelectTrigger, { className: "w-32", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "1h", children: "\u00DAltima hora" }), _jsx(SelectItem, { value: "24h", children: "\u00DAltimas 24h" }), _jsx(SelectItem, { value: "7d", children: "\u00DAltimos 7 d\u00EDas" }), _jsx(SelectItem, { value: "30d", children: "\u00DAltimos 30 d\u00EDas" })] })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: refreshData, disabled: isLoading, children: [_jsx(RefreshCw, { className: `h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}` }), "Actualizar"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: exportDashboard, children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Exportar"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Share2, { className: "h-4 w-4 mr-2" }), "Compartir"] })] })] }) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: metrics.map((metric) => (_jsxs(Card, { className: "hover:shadow-lg transition-shadow", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: metric.title }), _jsx("div", { className: metric.color, children: metric.icon })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-gray-900", children: formatValue(metric.value, metric.format) }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [getChangeIcon(metric.changeType), _jsxs("span", { className: `text-sm ${metric.changeType === 'increase' ? 'text-green-600' :
                                                metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'}`, children: [metric.change > 0 ? '+' : '', metric.change.toFixed(1), "%"] }), _jsx("span", { className: "text-sm text-gray-500", children: "vs per\u00EDodo anterior" })] }), metric.progress && (_jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-1", children: [_jsx("span", { children: "Progreso" }), _jsxs("span", { children: [metric.progress, "%"] })] }), _jsx(Progress, { value: metric.progress, className: "h-2" })] }))] })] }, metric.id))) }), _jsxs(Tabs, { defaultValue: "overview", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "overview", children: "Vista General" }), _jsx(TabsTrigger, { value: "analytics", children: "Analytics" }), _jsx(TabsTrigger, { value: "performance", children: "Rendimiento" }), _jsx(TabsTrigger, { value: "custom", children: "Personalizado" })] }), _jsx(TabsContent, { value: "overview", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), _jsx("span", { children: "Evoluci\u00F3n de Ventas" })] }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "ventas", stroke: "#8884d8", strokeWidth: 2, dot: { fill: '#8884d8', strokeWidth: 2, r: 4 } }), _jsx(Line, { type: "monotone", dataKey: "gastos", stroke: "#82ca9d", strokeWidth: 2, dot: { fill: '#82ca9d', strokeWidth: 2, r: 4 } })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), _jsx("span", { children: "Ganancias Acumuladas" })] }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(AreaChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Area, { type: "monotone", dataKey: "ganancias", stroke: "#ffc658", fill: "#ffc658", fillOpacity: 0.6 })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), _jsx("span", { children: "Comparaci\u00F3n Mensual" })] }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: chartData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Bar, { dataKey: "ventas", fill: "#8884d8" }), _jsx(Bar, { dataKey: "gastos", fill: "#82ca9d" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(PieChart, { className: "h-5 w-5" }), _jsx("span", { children: "Distribuci\u00F3n de Ventas" })] }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(RechartsPieChart, { children: [_jsx(Pie, { data: pieData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: pieData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }) })] })] }) }), _jsx(TabsContent, { value: "analytics", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "lg:col-span-2", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Actividad Reciente" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: [
                                                    { action: 'Nueva valoración creada', time: '2 min', type: 'success' },
                                                    { action: 'Presupuesto actualizado', time: '5 min', type: 'info' },
                                                    { action: 'Error en API detectado', time: '10 min', type: 'error' },
                                                    { action: 'Usuario autenticado', time: '15 min', type: 'success' },
                                                ].map((item, index) => (_jsxs("div", { className: "flex items-center space-x-3 p-3 bg-gray-50 rounded-lg", children: [_jsx("div", { className: `p-2 rounded-full ${item.type === 'success' ? 'bg-green-100' :
                                                                item.type === 'error' ? 'bg-red-100' : 'bg-blue-100'}`, children: item.type === 'success' ? (_jsx(CheckCircle, { className: "h-4 w-4 text-green-600" })) : item.type === 'error' ? (_jsx(AlertTriangle, { className: "h-4 w-4 text-red-600" })) : (_jsx(Info, { className: "h-4 w-4 text-blue-600" })) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: item.action }), _jsxs("p", { className: "text-xs text-gray-500", children: [item.time, " atr\u00E1s"] })] })] }, index))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Estado del Sistema" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: [
                                                    { service: 'API Principal', status: 'online', uptime: '99.9%' },
                                                    { service: 'Base de Datos', status: 'online', uptime: '99.8%' },
                                                    { service: 'Cache', status: 'online', uptime: '99.7%' },
                                                    { service: 'Notificaciones', status: 'warning', uptime: '95.2%' },
                                                ].map((service, index) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", children: service.service }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Uptime: ", service.uptime] })] }), _jsx(Badge, { variant: service.status === 'online' ? 'default' :
                                                                service.status === 'warning' ? 'secondary' : 'destructive', children: service.status })] }, index))) }) })] })] }) }), _jsx(TabsContent, { value: "performance", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "M\u00E9tricas de Rendimiento" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: [
                                                    { name: 'Tiempo de Carga', value: 1.2, unit: 's', target: 2.0 },
                                                    { name: 'Tiempo de Respuesta API', value: 150, unit: 'ms', target: 200 },
                                                    { name: 'Uso de Memoria', value: 45, unit: '%', target: 80 },
                                                    { name: 'CPU', value: 12, unit: '%', target: 70 },
                                                ].map((metric, index) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { children: metric.name }), _jsxs("span", { children: [metric.value, metric.unit] })] }), _jsx(Progress, { value: (metric.value / metric.target) * 100, className: "h-2" })] }, index))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Alertas Activas" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: [
                                                    { level: 'high', message: 'Alto uso de CPU detectado', time: '5 min' },
                                                    { level: 'medium', message: 'Lentitud en respuesta de API', time: '15 min' },
                                                    { level: 'low', message: 'Actualización de caché pendiente', time: '1 hora' },
                                                ].map((alert, index) => (_jsxs("div", { className: `p-3 rounded-lg border-l-4 ${alert.level === 'high' ? 'border-red-500 bg-red-50' :
                                                        alert.level === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                                            'border-blue-500 bg-blue-50'}`, children: [_jsx("p", { className: "text-sm font-medium", children: alert.message }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: [alert.time, " atr\u00E1s"] })] }, index))) }) })] })] }) }), _jsx(TabsContent, { value: "custom", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Configuraci\u00F3n del Dashboard" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Layout" }), _jsxs(Select, { value: config.layout, onValueChange: (value) => saveDashboardConfig({ ...config, layout: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "grid", children: "Grid" }), _jsx(SelectItem, { value: "flexible", children: "Flexible" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Tema" }), _jsxs(Select, { value: config.theme, onValueChange: (value) => saveDashboardConfig({ ...config, theme: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "light", children: "Claro" }), _jsx(SelectItem, { value: "dark", children: "Oscuro" }), _jsx(SelectItem, { value: "auto", children: "Autom\u00E1tico" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Intervalo de Actualizaci\u00F3n" }), _jsxs(Select, { value: config.refreshInterval.toString(), onValueChange: (value) => saveDashboardConfig({ ...config, refreshInterval: parseInt(value) }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "10000", children: "10 segundos" }), _jsx(SelectItem, { value: "30000", children: "30 segundos" }), _jsx(SelectItem, { value: "60000", children: "1 minuto" }), _jsx(SelectItem, { value: "300000", children: "5 minutos" })] })] })] })] }) })] }) })] })] }));
};
export default AdvancedDashboard;
