import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, TrendingUp, Download, Eye, AlertTriangle, CheckCircle, Clock, RefreshCw, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
const BudgetReports = () => {
    const { user, franchisee } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [filters, setFilters] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        restaurant_id: '',
        report_type: 'all'
    });
    // Reportes de ejemplo
    const exampleReports = [
        {
            id: '1',
            report_name: 'Reporte Mensual - Enero 2024',
            report_type: 'monthly',
            restaurant_name: 'McDonald\'s Plaza Mayor',
            year: 2024,
            month: 1,
            total_budget: 2500000,
            total_actual: 2450000,
            variance: -50000,
            variance_percentage: -2.0,
            created_at: new Date().toISOString(),
            status: 'on_track'
        },
        {
            id: '2',
            report_name: 'Reporte Trimestral - Q1 2024',
            report_type: 'quarterly',
            restaurant_name: 'McDonald\'s Centro Comercial',
            year: 2024,
            month: 3,
            total_budget: 7500000,
            total_actual: 7800000,
            variance: 300000,
            variance_percentage: 4.0,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            status: 'over_budget'
        },
        {
            id: '3',
            report_name: 'Reporte Anual - 2023',
            report_type: 'annual',
            restaurant_name: 'McDonald\'s Parque Central',
            year: 2023,
            month: 12,
            total_budget: 30000000,
            total_actual: 29500000,
            variance: -500000,
            variance_percentage: -1.7,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            status: 'at_risk'
        }
    ];
    useEffect(() => {
        if (franchisee) {
            loadRestaurants();
            loadReports();
        }
    }, [franchisee]);
    const loadRestaurants = async () => {
        if (!franchisee)
            return;
        try {
            const { data, error } = await supabase
                .from('franchisee_restaurants')
                .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
                .eq('franchisee_id', franchisee.id);
            if (error)
                throw error;
            setRestaurants(data || []);
            if (data && data.length > 0) {
                setSelectedRestaurant(data[0]);
                setFilters(prev => ({ ...prev, restaurant_id: data[0].id }));
            }
        }
        catch (error) {
            console.error('Error loading restaurants:', error);
            toast.error('Error al cargar los restaurantes');
        }
    };
    const loadReports = async () => {
        setLoading(true);
        try {
            // Por ahora usamos reportes de ejemplo
            // En el futuro esto vendría de la base de datos
            setReports(exampleReports);
        }
        catch (error) {
            console.error('Error loading reports:', error);
            toast.error('Error al cargar los reportes');
        }
        finally {
            setLoading(false);
        }
    };
    const generateReport = async () => {
        if (!selectedRestaurant) {
            toast.error('Selecciona un restaurante');
            return;
        }
        setLoading(true);
        try {
            // Simular generación de reporte
            await new Promise(resolve => setTimeout(resolve, 2000));
            const newReport = {
                id: Date.now().toString(),
                report_name: `Reporte ${filters.report_type === 'monthly' ? 'Mensual' : filters.report_type === 'quarterly' ? 'Trimestral' : 'Anual'} - ${new Date().toLocaleDateString('es-ES')}`,
                report_type: filters.report_type,
                restaurant_name: selectedRestaurant.base_restaurant?.restaurant_name || 'Restaurante',
                year: filters.year,
                month: filters.month,
                total_budget: 2500000 + Math.random() * 500000,
                total_actual: 2450000 + Math.random() * 500000,
                variance: 0,
                variance_percentage: 0,
                created_at: new Date().toISOString(),
                status: 'on_track'
            };
            newReport.variance = newReport.total_actual - newReport.total_budget;
            newReport.variance_percentage = (newReport.variance / newReport.total_budget) * 100;
            newReport.status = newReport.variance_percentage > 5 ? 'over_budget' : newReport.variance_percentage > 2 ? 'at_risk' : 'on_track';
            setReports(prev => [newReport, ...prev]);
            toast.success('Reporte generado correctamente');
        }
        catch (error) {
            console.error('Error generating report:', error);
            toast.error('Error al generar el reporte');
        }
        finally {
            setLoading(false);
        }
    };
    const exportReport = (report) => {
        const csvContent = [
            ['Reporte', 'Restaurante', 'Año', 'Mes', 'Presupuesto (€)', 'Real (€)', 'Variación (€)', 'Variación (%)', 'Estado'].join(','),
            [
                report.report_name,
                report.restaurant_name,
                report.year,
                report.month,
                report.total_budget.toFixed(2),
                report.total_actual.toFixed(2),
                report.variance.toFixed(2),
                `${report.variance_percentage.toFixed(1)}%`,
                report.status
            ].join(',')
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_presupuesto_${report.restaurant_name}_${report.year}_${report.month}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Reporte exportado correctamente');
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'on_track': return 'bg-green-100 text-green-800';
            case 'at_risk': return 'bg-yellow-100 text-yellow-800';
            case 'over_budget': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'on_track': return _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
            case 'at_risk': return _jsx(AlertTriangle, { className: "h-4 w-4 text-yellow-600" });
            case 'over_budget': return _jsx(TrendingUp, { className: "h-4 w-4 text-red-600" });
            default: return _jsx(Clock, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const filteredReports = reports.filter(report => {
        if (filters.year && report.year !== filters.year)
            return false;
        if (filters.month && report.month !== filters.month)
            return false;
        if (filters.restaurant_id && report.restaurant_name !== selectedRestaurant?.base_restaurant?.restaurant_name)
            return false;
        if (filters.report_type !== 'all' && report.report_type !== filters.report_type)
            return false;
        return true;
    });
    const totalBudget = reports.reduce((sum, report) => sum + report.total_budget, 0);
    const totalActual = reports.reduce((sum, report) => sum + report.total_actual, 0);
    const totalVariance = totalActual - totalBudget;
    const totalVariancePercentage = (totalVariance / totalBudget) * 100;
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Reportes de Presupuesto" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Genera y analiza reportes detallados de presupuestos" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: loadReports, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] }), _jsxs(Button, { onClick: generateReport, disabled: loading, children: [loading ? _jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : _jsx(FileText, { className: "h-4 w-4 mr-2" }), "Generar Reporte"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Filtros de Reportes" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Restaurante" }), _jsxs(Select, { value: filters.restaurant_id, onValueChange: (value) => {
                                                const restaurant = restaurants.find(r => r.id === value);
                                                setSelectedRestaurant(restaurant);
                                                setFilters(prev => ({ ...prev, restaurant_id: value }));
                                            }, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Todos los restaurantes" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos los restaurantes" }), restaurants.map((restaurant) => (_jsx(SelectItem, { value: restaurant.id, children: restaurant.base_restaurant?.restaurant_name || 'Restaurante' }, restaurant.id)))] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "A\u00F1o" }), _jsxs(Select, { value: filters.year.toString(), onValueChange: (value) => setFilters(prev => ({ ...prev, year: parseInt(value) })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: [2022, 2023, 2024, 2025].map((year) => (_jsx(SelectItem, { value: year.toString(), children: year }, year))) })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Mes" }), _jsxs(Select, { value: filters.month.toString(), onValueChange: (value) => setFilters(prev => ({ ...prev, month: parseInt(value) })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "0", children: "Todos los meses" }), Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (_jsx(SelectItem, { value: month.toString(), children: new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'long' }) }, month)))] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Tipo de Reporte" }), _jsxs(Select, { value: filters.report_type, onValueChange: (value) => setFilters(prev => ({ ...prev, report_type: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todos los tipos" }), _jsx(SelectItem, { value: "monthly", children: "Mensual" }), _jsx(SelectItem, { value: "quarterly", children: "Trimestral" }), _jsx(SelectItem, { value: "annual", children: "Anual" })] })] })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Total Presupuesto" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["\u20AC", totalBudget.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-500", children: "Presupuesto total" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Total Real" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", totalActual.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-500", children: "Gastos reales" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Variaci\u00F3n Total" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["\u20AC", totalVariance.toLocaleString()] }), _jsxs("p", { className: "text-xs text-gray-500", children: [totalVariancePercentage >= 0 ? '+' : '', totalVariancePercentage.toFixed(1), "%"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Reportes" }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: filteredReports.length }), _jsx("p", { className: "text-xs text-gray-500", children: "Reportes generados" })] })] })] }), _jsxs(Tabs, { defaultValue: "reports", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "reports", children: "Reportes" }), _jsx(TabsTrigger, { value: "analytics", children: "Analytics" }), _jsx(TabsTrigger, { value: "trends", children: "Tendencias" })] }), _jsx(TabsContent, { value: "reports", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Lista de Reportes" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando reportes..." })] })) : filteredReports.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(FileText, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No se encontraron reportes" })] })) : (_jsx("div", { className: "space-y-4", children: filteredReports.map((report) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", onClick: () => setSelectedReport(report), children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getStatusIcon(report.status) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: report.report_name }), _jsx(Badge, { className: getStatusColor(report.status), children: report.status === 'on_track' ? 'En Curso' : report.status === 'at_risk' ? 'En Riesgo' : 'Sobre Presupuesto' }), _jsx(Badge, { variant: "outline", children: report.report_type === 'monthly' ? 'Mensual' : report.report_type === 'quarterly' ? 'Trimestral' : 'Anual' })] }), _jsxs("p", { className: "text-sm text-gray-600", children: [report.restaurant_name, " - ", report.year] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Generado: ", formatDate(report.created_at)] })] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-medium", children: ["\u20AC", report.total_budget.toLocaleString()] }), _jsx("div", { className: "text-xs text-gray-500", children: "Presupuesto" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-medium", children: ["\u20AC", report.total_actual.toLocaleString()] }), _jsx("div", { className: "text-xs text-gray-500", children: "Real" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: `text-sm font-medium ${report.variance >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["\u20AC", report.variance.toLocaleString()] }), _jsxs("div", { className: "text-xs text-gray-500", children: [report.variance_percentage >= 0 ? '+' : '', report.variance_percentage.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                                        e.stopPropagation();
                                                                        exportReport(report);
                                                                    }, children: _jsx(Download, { className: "h-4 w-4" }) })] })] })] }, report.id))) })) })] }) }), _jsx(TabsContent, { value: "analytics", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "An\u00E1lisis por Restaurante" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: reports, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "restaurant_name", angle: -45, textAnchor: "end", height: 80 }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000000).toFixed(1)}M` }), _jsx(Tooltip, { formatter: (value) => [`€${(value / 1000000).toFixed(2)}M`, ''] }), _jsx(Bar, { dataKey: "total_budget", fill: "#8884d8", name: "Presupuesto" }), _jsx(Bar, { dataKey: "total_actual", fill: "#82ca9d", name: "Real" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n Temporal" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: reports
                                                        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                                        .map(report => ({
                                                        date: formatDate(report.created_at),
                                                        budget: report.total_budget / 1000000,
                                                        actual: report.total_actual / 1000000
                                                    })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, { tickFormatter: (value) => `€${value}M` }), _jsx(Tooltip, { formatter: (value) => [`€${value}M`, ''] }), _jsx(Line, { type: "monotone", dataKey: "budget", stroke: "#8884d8", strokeWidth: 2, name: "Presupuesto" }), _jsx(Line, { type: "monotone", dataKey: "actual", stroke: "#82ca9d", strokeWidth: 2, name: "Real" })] }) }) })] })] }) }), _jsx(TabsContent, { value: "trends", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Tendencias de Presupuesto" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [((reports.filter(r => r.status === 'on_track').length / reports.length) * 100).toFixed(1), "%"] }), _jsx("p", { className: "text-sm text-blue-700", children: "En Curso" })] }), _jsxs("div", { className: "text-center p-4 bg-yellow-50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-yellow-600", children: [((reports.filter(r => r.status === 'at_risk').length / reports.length) * 100).toFixed(1), "%"] }), _jsx("p", { className: "text-sm text-yellow-700", children: "En Riesgo" })] }), _jsxs("div", { className: "text-center p-4 bg-red-50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-red-600", children: [((reports.filter(r => r.status === 'over_budget').length / reports.length) * 100).toFixed(1), "%"] }), _jsx("p", { className: "text-sm text-red-700", children: "Sobre Presupuesto" })] })] }) })] }) })] })] }));
};
export default BudgetReports;
