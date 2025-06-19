import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, DollarSign, Users, CheckCircle, Clock, XCircle, Plus, Edit, Trash2, Eye, Zap, Lightbulb, Award, Activity, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
const ImprovementsManagement = () => {
    const { user, franchisee } = useAuth();
    const [improvements, setImprovements] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImprovement, setSelectedImprovement] = useState(null);
    const [showCreateImprovement, setShowCreateImprovement] = useState(false);
    const [showCreatePlan, setShowCreatePlan] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    // Mejoras de ejemplo
    const exampleImprovements = [
        {
            id: '1',
            title: 'Implementación de Sistema de Pedidos Digital',
            description: 'Sistema de pedidos online para aumentar ventas y reducir errores',
            category: 'technology',
            priority: 'high',
            status: 'completed',
            restaurant_id: 'rest-1',
            restaurant_name: 'McDonald\'s Plaza Mayor',
            estimated_cost: 15000,
            actual_cost: 14200,
            estimated_roi: 25,
            actual_roi: 32,
            implementation_date: '2024-01-15',
            completion_date: '2024-02-15',
            created_by: user?.email || 'admin',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-02-15T00:00:00Z',
            metrics: {
                revenue_impact: 18000,
                cost_savings: 5000,
                efficiency_gain: 15,
                customer_satisfaction: 8.5,
                employee_satisfaction: 7.8,
                time_savings: 120
            }
        },
        {
            id: '2',
            title: 'Optimización de Inventario',
            description: 'Sistema de gestión de inventario para reducir desperdicios',
            category: 'operational',
            priority: 'medium',
            status: 'in_progress',
            restaurant_id: 'rest-2',
            restaurant_name: 'McDonald\'s Centro Comercial',
            estimated_cost: 8000,
            actual_cost: 6500,
            estimated_roi: 18,
            actual_roi: 0,
            implementation_date: '2024-03-01',
            created_by: user?.email || 'admin',
            created_at: '2024-02-15T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
            metrics: {
                revenue_impact: 0,
                cost_savings: 0,
                efficiency_gain: 0,
                customer_satisfaction: 0,
                employee_satisfaction: 0,
                time_savings: 0
            }
        },
        {
            id: '3',
            title: 'Programa de Capacitación de Empleados',
            description: 'Mejora de habilidades del personal para mayor eficiencia',
            category: 'process',
            priority: 'high',
            status: 'approved',
            estimated_cost: 12000,
            actual_cost: 0,
            estimated_roi: 20,
            actual_roi: 0,
            implementation_date: '2024-04-01',
            created_by: user?.email || 'admin',
            created_at: '2024-03-01T00:00:00Z',
            updated_at: '2024-03-01T00:00:00Z',
            metrics: {
                revenue_impact: 0,
                cost_savings: 0,
                efficiency_gain: 0,
                customer_satisfaction: 0,
                employee_satisfaction: 0,
                time_savings: 0
            }
        }
    ];
    // Planes de ejemplo
    const examplePlans = [
        {
            id: '1',
            name: 'Plan de Digitalización 2024',
            description: 'Transformación digital completa de operaciones',
            target_date: '2024-12-31',
            status: 'active',
            improvements: ['1', '2'],
            total_estimated_cost: 23000,
            total_estimated_roi: 43,
            created_by: user?.email || 'admin',
            created_at: '2024-01-01T00:00:00Z'
        },
        {
            id: '2',
            name: 'Optimización de Costos Q2',
            description: 'Reducción de costos operativos',
            target_date: '2024-06-30',
            status: 'draft',
            improvements: ['3'],
            total_estimated_cost: 12000,
            total_estimated_roi: 20,
            created_by: user?.email || 'admin',
            created_at: '2024-03-01T00:00:00Z'
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
            setImprovements(exampleImprovements);
            setPlans(examplePlans);
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast.error('Error al cargar los datos');
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'proposed': return 'bg-gray-100 text-gray-800';
            case 'approved': return 'bg-blue-100 text-blue-800';
            case 'in_progress': return 'bg-yellow-100 text-yellow-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'operational': return _jsx(Activity, { className: "h-4 w-4 text-blue-600" });
            case 'financial': return _jsx(DollarSign, { className: "h-4 w-4 text-green-600" });
            case 'customer': return _jsx(Users, { className: "h-4 w-4 text-purple-600" });
            case 'technology': return _jsx(Zap, { className: "h-4 w-4 text-yellow-600" });
            case 'process': return _jsx(Target, { className: "h-4 w-4 text-red-600" });
            default: return _jsx(Lightbulb, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    const calculateTotalROI = () => {
        const completed = improvements.filter(imp => imp.status === 'completed');
        const totalInvestment = completed.reduce((sum, imp) => sum + imp.actual_cost, 0);
        const totalReturn = completed.reduce((sum, imp) => sum + imp.metrics.revenue_impact + imp.metrics.cost_savings, 0);
        return totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;
    };
    const getImprovementStatus = (improvement) => {
        if (improvement.status === 'completed') {
            return improvement.actual_roi >= improvement.estimated_roi ? 'success' : 'partial';
        }
        return improvement.status;
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
            case 'in_progress': return _jsx(Clock, { className: "h-4 w-4 text-yellow-600" });
            case 'approved': return _jsx(Target, { className: "h-4 w-4 text-blue-600" });
            case 'proposed': return _jsx(Lightbulb, { className: "h-4 w-4 text-gray-600" });
            case 'cancelled': return _jsx(XCircle, { className: "h-4 w-4 text-red-600" });
            default: return _jsx(Activity, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const totalInvestment = improvements.reduce((sum, imp) => sum + imp.actual_cost, 0);
    const totalReturn = improvements
        .filter(imp => imp.status === 'completed')
        .reduce((sum, imp) => sum + imp.metrics.revenue_impact + imp.metrics.cost_savings, 0);
    const overallROI = totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gesti\u00F3n de Mejoras y Optimizaciones" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Seguimiento de mejoras implementadas, ROI y m\u00E9tricas de impacto" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: loadData, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] }), _jsxs(Button, { onClick: () => setShowCreatePlan(true), children: [_jsx(Plus, { className: "h-4 w-4 mr-2" }), "Nuevo Plan"] }), _jsxs(Button, { onClick: () => setShowCreateImprovement(true), children: [_jsx(Lightbulb, { className: "h-4 w-4 mr-2" }), "Nueva Mejora"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "ROI Total" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [overallROI.toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Retorno sobre inversi\u00F3n" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Inversi\u00F3n Total" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["\u20AC", totalInvestment.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-500", children: "Costo total implementado" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Retorno Total" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: ["\u20AC", totalReturn.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-500", children: "Beneficios generados" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Mejoras Activas" }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: improvements.filter(imp => imp.status === 'in_progress').length }), _jsx("p", { className: "text-xs text-gray-500", children: "En implementaci\u00F3n" })] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "overview", children: "Resumen" }), _jsx(TabsTrigger, { value: "improvements", children: "Mejoras" }), _jsx(TabsTrigger, { value: "plans", children: "Planes" }), _jsx(TabsTrigger, { value: "analytics", children: "Analytics" })] }), _jsxs(TabsContent, { value: "overview", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "ROI por Categor\u00EDa" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: [
                                                            { category: 'Tecnología', roi: 32 },
                                                            { category: 'Operacional', roi: 18 },
                                                            { category: 'Procesos', roi: 20 },
                                                            { category: 'Financiero', roi: 15 },
                                                            { category: 'Cliente', roi: 25 }
                                                        ], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "category" }), _jsx(YAxis, { tickFormatter: (value) => `${value}%` }), _jsx(Tooltip, { formatter: (value) => [`${value}%`, 'ROI'] }), _jsx(Bar, { dataKey: "roi", fill: "#10b981" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Estado de Mejoras" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: [
                                                                    { name: 'Completadas', value: improvements.filter(imp => imp.status === 'completed').length, color: '#10b981' },
                                                                    { name: 'En Progreso', value: improvements.filter(imp => imp.status === 'in_progress').length, color: '#f59e0b' },
                                                                    { name: 'Aprobadas', value: improvements.filter(imp => imp.status === 'approved').length, color: '#3b82f6' },
                                                                    { name: 'Propuestas', value: improvements.filter(imp => imp.status === 'proposed').length, color: '#6b7280' }
                                                                ], cx: "50%", cy: "50%", outerRadius: 80, dataKey: "value", children: [
                                                                    { name: 'Completadas', value: improvements.filter(imp => imp.status === 'completed').length, color: '#10b981' },
                                                                    { name: 'En Progreso', value: improvements.filter(imp => imp.status === 'in_progress').length, color: '#f59e0b' },
                                                                    { name: 'Aprobadas', value: improvements.filter(imp => imp.status === 'approved').length, color: '#3b82f6' },
                                                                    { name: 'Propuestas', value: improvements.filter(imp => imp.status === 'proposed').length, color: '#6b7280' }
                                                                ].map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Mejoras Destacadas" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: improvements
                                                .filter(imp => imp.status === 'completed')
                                                .sort((a, b) => b.actual_roi - a.actual_roi)
                                                .slice(0, 3)
                                                .map((improvement) => (_jsx("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Award, { className: "h-8 w-8 text-yellow-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: improvement.title }), _jsxs(Badge, { className: "bg-green-100 text-green-800", children: ["ROI: ", improvement.actual_roi, "%"] })] }), _jsx("p", { className: "text-sm text-gray-600", children: improvement.description }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { children: ["Inversi\u00F3n: \u20AC", improvement.actual_cost.toLocaleString()] }), _jsxs("span", { children: ["Retorno: \u20AC", (improvement.metrics.revenue_impact + improvement.metrics.cost_savings).toLocaleString()] }), _jsxs("span", { children: ["Completada: ", formatDate(improvement.completion_date)] })] })] })] }) }, improvement.id))) }) })] })] }), _jsx(TabsContent, { value: "improvements", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Todas las Mejoras" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando mejoras..." })] })) : (_jsx("div", { className: "space-y-4", children: improvements.map((improvement) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getCategoryIcon(improvement.category) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: improvement.title }), _jsx(Badge, { className: getStatusColor(improvement.status), children: improvement.status === 'proposed' ? 'Propuesta' :
                                                                                improvement.status === 'approved' ? 'Aprobada' :
                                                                                    improvement.status === 'in_progress' ? 'En Progreso' :
                                                                                        improvement.status === 'completed' ? 'Completada' : 'Cancelada' }), _jsx(Badge, { className: getPriorityColor(improvement.priority), children: improvement.priority === 'low' ? 'Baja' :
                                                                                improvement.priority === 'medium' ? 'Media' :
                                                                                    improvement.priority === 'high' ? 'Alta' : 'Crítica' }), improvement.status === 'completed' && (_jsxs(Badge, { className: "bg-green-100 text-green-800", children: ["ROI: ", improvement.actual_roi, "%"] }))] }), _jsx("p", { className: "text-sm text-gray-600", children: improvement.description }), improvement.restaurant_name && (_jsxs("p", { className: "text-xs text-gray-500", children: ["Restaurante: ", improvement.restaurant_name] })), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { children: ["Inversi\u00F3n: \u20AC", improvement.actual_cost.toLocaleString()] }), improvement.status === 'completed' && (_jsxs("span", { children: ["Retorno: \u20AC", (improvement.metrics.revenue_impact + improvement.metrics.cost_savings).toLocaleString()] })), _jsxs("span", { children: ["Implementaci\u00F3n: ", formatDate(improvement.implementation_date)] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedImprovement(improvement), title: "Ver detalles", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Editar mejora", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Eliminar mejora", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, improvement.id))) })) })] }) }), _jsx(TabsContent, { value: "plans", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Planes de Mejora" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: plans.map((plan) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Target, { className: "h-8 w-8 text-blue-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: plan.name }), _jsx(Badge, { variant: plan.status === 'active' ? 'default' : plan.status === 'completed' ? 'secondary' : 'outline', children: plan.status === 'draft' ? 'Borrador' :
                                                                                plan.status === 'active' ? 'Activo' : 'Completado' })] }), _jsx("p", { className: "text-sm text-gray-600", children: plan.description }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { children: ["Objetivo: ", formatDate(plan.target_date)] }), _jsxs("span", { children: ["Inversi\u00F3n: \u20AC", plan.total_estimated_cost.toLocaleString()] }), _jsxs("span", { children: ["ROI Estimado: ", plan.total_estimated_roi, "%"] }), _jsxs("span", { children: ["Mejoras: ", plan.improvements.length] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", title: "Ver plan", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Editar plan", children: _jsx(Edit, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Eliminar plan", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, plan.id))) }) })] }) }), _jsx(TabsContent, { value: "analytics", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n del ROI" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: [
                                                        { month: 'Ene', roi: 0 },
                                                        { month: 'Feb', roi: 32 },
                                                        { month: 'Mar', roi: 28 },
                                                        { month: 'Abr', roi: 35 },
                                                        { month: 'May', roi: 42 },
                                                        { month: 'Jun', roi: 38 }
                                                    ], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `${value}%` }), _jsx(Tooltip, { formatter: (value) => [`${value}%`, 'ROI'] }), _jsx(Line, { type: "monotone", dataKey: "roi", stroke: "#10b981", strokeWidth: 2 })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Inversi\u00F3n por Categor\u00EDa" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: [
                                                        { category: 'Tecnología', investment: 14200 },
                                                        { category: 'Operacional', investment: 6500 },
                                                        { category: 'Procesos', investment: 0 },
                                                        { category: 'Financiero', investment: 0 },
                                                        { category: 'Cliente', investment: 0 }
                                                    ], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "category" }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}k` }), _jsx(Tooltip, { formatter: (value) => [`€${value.toLocaleString()}`, 'Inversión'] }), _jsx(Bar, { dataKey: "investment", fill: "#3b82f6" })] }) }) })] })] }) })] })] }));
};
export default ImprovementsManagement;
