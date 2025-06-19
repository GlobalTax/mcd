import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, BarChart3, PieChart, Download, Settings, Eye, Edit, Trash2, Plus, RefreshCw, Clock, Users, DollarSign, Target, Zap, Star, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Pie, Cell } from 'recharts';
const AdvancedReportingSystem = () => {
    const { user, franchisee } = useAuth();
    const [reports, setReports] = useState([]);
    const [dashboards, setDashboards] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedDashboard, setSelectedDashboard] = useState(null);
    const [showCreateReport, setShowCreateReport] = useState(false);
    const [showCreateDashboard, setShowCreateDashboard] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboards');
    // Reportes de ejemplo
    const exampleReports = [
        {
            id: '1',
            name: 'Reporte Ejecutivo Mensual',
            description: 'Resumen ejecutivo de rendimiento mensual',
            type: 'executive',
            category: 'Performance',
            data_source: 'franchisee_metrics',
            schedule: 'monthly',
            last_generated: new Date().toISOString(),
            next_generation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            created_by: user?.email || 'admin',
            created_at: new Date().toISOString(),
            parameters: { date_range: 'last_30_days', include_charts: true }
        },
        {
            id: '2',
            name: 'Análisis de Rentabilidad por Restaurante',
            description: 'Análisis detallado de rentabilidad por ubicación',
            type: 'financial',
            category: 'Financial',
            data_source: 'restaurant_performance',
            schedule: 'weekly',
            last_generated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            next_generation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            created_by: user?.email || 'admin',
            created_at: new Date().toISOString(),
            parameters: { group_by: 'restaurant', include_comparison: true }
        },
        {
            id: '3',
            name: 'Reporte de Actividad de Usuarios',
            description: 'Actividad y uso del sistema por usuarios',
            type: 'operational',
            category: 'Operations',
            data_source: 'user_activity',
            schedule: 'daily',
            last_generated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            next_generation: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'active',
            created_by: user?.email || 'admin',
            created_at: new Date().toISOString(),
            parameters: { user_type: 'all', include_details: true }
        }
    ];
    // Dashboards de ejemplo
    const exampleDashboards = [
        {
            id: '1',
            name: 'Dashboard Ejecutivo',
            description: 'Vista general para ejecutivos',
            type: 'executive',
            widgets: [
                {
                    id: 'w1',
                    type: 'metric',
                    title: 'Total de Franquiciados',
                    data_source: 'franchisee_count',
                    position: { x: 0, y: 0, w: 3, h: 2 },
                    config: { format: 'number', color: 'blue' }
                },
                {
                    id: 'w2',
                    type: 'chart',
                    title: 'Rendimiento Mensual',
                    data_source: 'monthly_performance',
                    position: { x: 3, y: 0, w: 6, h: 4 },
                    config: { chart_type: 'line', metrics: ['revenue', 'profit'] }
                },
                {
                    id: 'w3',
                    type: 'kpi',
                    title: 'ROI Promedio',
                    data_source: 'average_roi',
                    position: { x: 9, y: 0, w: 3, h: 2 },
                    config: { format: 'percentage', target: 15 }
                }
            ],
            layout: {},
            created_by: user?.email || 'admin',
            created_at: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Dashboard de Franquiciado',
            description: 'Vista personalizada para franquiciados',
            type: 'franchisee',
            widgets: [
                {
                    id: 'w4',
                    type: 'metric',
                    title: 'Mis Restaurantes',
                    data_source: 'my_restaurants',
                    position: { x: 0, y: 0, w: 4, h: 2 },
                    config: { format: 'number', color: 'green' }
                },
                {
                    id: 'w5',
                    type: 'chart',
                    title: 'Rendimiento de Mis Restaurantes',
                    data_source: 'my_performance',
                    position: { x: 4, y: 0, w: 8, h: 4 },
                    config: { chart_type: 'bar', metrics: ['sales', 'costs'] }
                }
            ],
            layout: {},
            created_by: user?.email || 'admin',
            created_at: new Date().toISOString()
        }
    ];
    // Templates de ejemplo
    const exampleTemplates = [
        {
            id: '1',
            name: 'Reporte de Ventas',
            description: 'Template para reportes de ventas',
            category: 'Sales',
            parameters: {
                date_range: { type: 'date_range', required: true },
                group_by: { type: 'select', options: ['restaurant', 'region', 'month'], required: true },
                include_charts: { type: 'boolean', default: true }
            },
            sample_data: {
                total_sales: 1500000,
                growth_rate: 12.5,
                top_performers: ['Restaurant A', 'Restaurant B', 'Restaurant C']
            }
        },
        {
            id: '2',
            name: 'Análisis de Costos',
            description: 'Template para análisis de costos',
            category: 'Financial',
            parameters: {
                cost_type: { type: 'select', options: ['operational', 'fixed', 'variable'], required: true },
                comparison_period: { type: 'date_range', required: true }
            },
            sample_data: {
                total_costs: 1200000,
                cost_reduction: 8.3,
                savings_opportunities: ['Utilities', 'Labor', 'Supplies']
            }
        }
    ];
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        setLoading(true);
        try {
            // Por ahora usamos datos de ejemplo
            // En el futuro esto vendría de la base de datos
            setReports(exampleReports);
            setDashboards(exampleDashboards);
            setTemplates(exampleTemplates);
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast.error('Error al cargar los datos');
        }
        finally {
            setLoading(false);
        }
    };
    const generateReport = async (reportId) => {
        try {
            const report = reports.find(r => r.id === reportId);
            if (!report)
                return;
            // Simular generación de reporte
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success(`Reporte "${report.name}" generado correctamente`);
        }
        catch (error) {
            console.error('Error generating report:', error);
            toast.error('Error al generar el reporte');
        }
    };
    const exportReport = async (reportId, format) => {
        try {
            const report = reports.find(r => r.id === reportId);
            if (!report)
                return;
            // Simular exportación
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Reporte exportado en formato ${format.toUpperCase()}`);
        }
        catch (error) {
            console.error('Error exporting report:', error);
            toast.error('Error al exportar el reporte');
        }
    };
    const scheduleReport = async (reportId, schedule) => {
        try {
            const { error } = await supabase
                .from('report_schedules')
                .insert({
                report_id: reportId,
                schedule: schedule,
                user_id: user?.id,
                created_at: new Date().toISOString()
            });
            if (error)
                throw error;
            toast.success('Reporte programado correctamente');
        }
        catch (error) {
            console.error('Error scheduling report:', error);
            toast.error('Error al programar el reporte');
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case 'executive': return _jsx(Star, { className: "h-4 w-4 text-blue-600" });
            case 'financial': return _jsx(DollarSign, { className: "h-4 w-4 text-green-600" });
            case 'operational': return _jsx(Activity, { className: "h-4 w-4 text-purple-600" });
            case 'custom': return _jsx(Settings, { className: "h-4 w-4 text-orange-600" });
            default: return _jsx(FileText, { className: "h-4 w-4 text-gray-600" });
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
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Sistema de Reportes Avanzados" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Dashboards ejecutivos, reportes personalizables y an\u00E1lisis avanzados" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: loadData, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] }), _jsxs(Button, { onClick: () => setShowCreateDashboard(true), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Nuevo Dashboard"] }), _jsxs(Button, { onClick: () => setShowCreateReport(true), children: [_jsx(FileText, { className: "h-4 w-4 mr-2" }), "Nuevo Reporte"] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "dashboards", children: "Dashboards" }), _jsx(TabsTrigger, { value: "reports", children: "Reportes" }), _jsx(TabsTrigger, { value: "templates", children: "Templates" }), _jsx(TabsTrigger, { value: "schedules", children: "Programaci\u00F3n" })] }), _jsxs(TabsContent, { value: "dashboards", className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(BarChart3, { className: "h-5 w-5 mr-2" }), "Dashboard Ejecutivo en Vivo"] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Franquiciados" }), _jsx("p", { className: "text-2xl font-bold text-blue-600", children: "247" })] }), _jsx(Users, { className: "h-8 w-8 text-blue-600" })] }), _jsx("p", { className: "text-xs text-green-600 mt-1", children: "+12% este mes" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Ingresos Totales" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: "\u20AC2.4M" })] }), _jsx(DollarSign, { className: "h-8 w-8 text-green-600" })] }), _jsx("p", { className: "text-xs text-green-600 mt-1", children: "+8.5% vs mes anterior" })] }) }), _jsx(Card, { children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "ROI Promedio" }), _jsx("p", { className: "text-2xl font-bold text-purple-600", children: "18.2%" })] }), _jsx(Target, { className: "h-8 w-8 text-purple-600" })] }), _jsx("p", { className: "text-xs text-green-600 mt-1", children: "+2.1% vs objetivo" })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Rendimiento Mensual" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: [
                                                                            { month: 'Ene', revenue: 2100000, profit: 420000 },
                                                                            { month: 'Feb', revenue: 2200000, profit: 440000 },
                                                                            { month: 'Mar', revenue: 2300000, profit: 460000 },
                                                                            { month: 'Abr', revenue: 2400000, profit: 480000 },
                                                                            { month: 'May', revenue: 2350000, profit: 470000 },
                                                                            { month: 'Jun', revenue: 2500000, profit: 500000 }
                                                                        ], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000000).toFixed(1)}M` }), _jsx(Tooltip, { formatter: (value) => [`€${(value / 1000).toFixed(0)}k`, ''] }), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#10b981", strokeWidth: 2, name: "Ingresos" }), _jsx(Line, { type: "monotone", dataKey: "profit", stroke: "#3b82f6", strokeWidth: 2, name: "Beneficios" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Distribuci\u00F3n por Regi\u00F3n" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: [
                                                                                    { name: 'Madrid', value: 35, color: '#3b82f6' },
                                                                                    { name: 'Barcelona', value: 28, color: '#10b981' },
                                                                                    { name: 'Valencia', value: 22, color: '#f59e0b' },
                                                                                    { name: 'Sevilla', value: 15, color: '#ef4444' }
                                                                                ], cx: "50%", cy: "50%", outerRadius: 80, dataKey: "value", children: [
                                                                                    { name: 'Madrid', value: 35, color: '#3b82f6' },
                                                                                    { name: 'Barcelona', value: 28, color: '#10b981' },
                                                                                    { name: 'Valencia', value: 22, color: '#f59e0b' },
                                                                                    { name: 'Sevilla', value: 15, color: '#ef4444' }
                                                                                ].map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }) })] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Mis Dashboards" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando dashboards..." })] })) : (_jsx("div", { className: "space-y-4", children: dashboards.map((dashboard) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getTypeIcon(dashboard.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: dashboard.name }), _jsx(Badge, { variant: "outline", children: dashboard.type === 'executive' ? 'Ejecutivo' :
                                                                                    dashboard.type === 'franchisee' ? 'Franquiciado' :
                                                                                        dashboard.type === 'advisor' ? 'Asesor' : 'Personalizado' })] }), _jsx("p", { className: "text-sm text-gray-600", children: dashboard.description }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Creado: ", formatDate(dashboard.created_at), " | Widgets: ", dashboard.widgets.length] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedDashboard(dashboard), title: "Ver dashboard", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Editar dashboard", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Eliminar dashboard", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, dashboard.id))) })) })] })] }), _jsx(TabsContent, { value: "reports", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Reportes Disponibles" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando reportes..." })] })) : (_jsx("div", { className: "space-y-4", children: reports.map((report) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getTypeIcon(report.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: report.name }), _jsx(Badge, { className: getStatusColor(report.status), children: report.status === 'active' ? 'Activo' :
                                                                                report.status === 'inactive' ? 'Inactivo' : 'Borrador' }), _jsx(Badge, { variant: "outline", children: report.schedule === 'daily' ? 'Diario' :
                                                                                report.schedule === 'weekly' ? 'Semanal' :
                                                                                    report.schedule === 'monthly' ? 'Mensual' :
                                                                                        report.schedule === 'quarterly' ? 'Trimestral' : 'Manual' })] }), _jsx("p", { className: "text-sm text-gray-600", children: report.description }), _jsxs("p", { className: "text-xs text-gray-500", children: ["\u00DAltima generaci\u00F3n: ", formatDate(report.last_generated), " | Pr\u00F3xima: ", formatDate(report.next_generation)] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => generateReport(report.id), title: "Generar reporte", children: _jsx(Zap, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => exportReport(report.id, 'pdf'), title: "Exportar PDF", children: _jsx(Download, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedReport(report), title: "Ver reporte", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Editar reporte", children: _jsx(Edit, { className: "h-4 w-4" }) })] })] }, report.id))) })) })] }) }), _jsx(TabsContent, { value: "templates", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Templates de Reportes" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: templates.map((template) => (_jsxs(Card, { className: "cursor-pointer hover:bg-gray-50", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg", children: template.name }) }), _jsxs(CardContent, { children: [_jsx("p", { className: "text-sm text-gray-600 mb-4", children: template.description }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: "Categor\u00EDa:" }), _jsx(Badge, { variant: "outline", children: template.category })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: "Par\u00E1metros:" }), _jsxs("span", { className: "text-sm text-gray-600", children: [Object.keys(template.parameters).length, " configuraciones"] })] })] }), _jsx(Button, { className: "w-full mt-4", variant: "outline", children: "Usar Template" })] })] }, template.id))) }) })] }) }), _jsx(TabsContent, { value: "schedules", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Programaci\u00F3n de Reportes" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: reports.filter(r => r.schedule !== 'manual').map((report) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Clock, { className: "h-5 w-5 text-blue-600" }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900", children: report.name }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Programado: ", report.schedule === 'daily' ? 'Diario' :
                                                                            report.schedule === 'weekly' ? 'Semanal' :
                                                                                report.schedule === 'monthly' ? 'Mensual' : 'Trimestral'] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Pr\u00F3xima ejecuci\u00F3n: ", formatDate(report.next_generation)] })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", children: "Pausar" }), _jsx(Button, { variant: "outline", size: "sm", children: "Editar" })] })] }, report.id))) }) })] }) })] })] }));
};
export default AdvancedReportingSystem;
