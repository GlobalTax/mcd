import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Activity, Calculator, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
const BudgetAnalysis = () => {
    const { user, franchisee } = useAuth();
    const [analysisData, setAnalysisData] = useState([]);
    const [metrics, setMetrics] = useState({
        total_budget: 0,
        total_actual: 0,
        total_variance: 0,
        variance_percentage: 0,
        efficiency_score: 0,
        risk_score: 0,
        forecast_accuracy: 0
    });
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    // Datos de ejemplo para el análisis
    const exampleAnalysisData = [
        {
            category: 'Ingresos por Ventas',
            budget: 1800000,
            actual: 1750000,
            variance: -50000,
            variance_percentage: -2.8,
            trend: 'down',
            risk_level: 'medium'
        },
        {
            category: 'Costos de Materia Prima',
            budget: 600000,
            actual: 580000,
            variance: 20000,
            variance_percentage: 3.3,
            trend: 'up',
            risk_level: 'low'
        },
        {
            category: 'Gastos de Personal',
            budget: 500000,
            actual: 520000,
            variance: -20000,
            variance_percentage: -4.0,
            trend: 'down',
            risk_level: 'high'
        },
        {
            category: 'Gastos Operativos',
            budget: 300000,
            actual: 310000,
            variance: -10000,
            variance_percentage: -3.3,
            trend: 'down',
            risk_level: 'medium'
        },
        {
            category: 'Marketing',
            budget: 100000,
            actual: 95000,
            variance: 5000,
            variance_percentage: 5.0,
            trend: 'up',
            risk_level: 'low'
        },
        {
            category: 'Gastos Administrativos',
            budget: 150000,
            actual: 145000,
            variance: 5000,
            variance_percentage: 3.3,
            trend: 'up',
            risk_level: 'low'
        }
    ];
    useEffect(() => {
        if (franchisee) {
            loadRestaurants();
            loadAnalysisData();
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
            }
        }
        catch (error) {
            console.error('Error loading restaurants:', error);
            toast.error('Error al cargar los restaurantes');
        }
    };
    const loadAnalysisData = async () => {
        setLoading(true);
        try {
            // Simular carga de datos
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAnalysisData(exampleAnalysisData);
            // Calcular métricas
            const totalBudget = exampleAnalysisData.reduce((sum, item) => sum + item.budget, 0);
            const totalActual = exampleAnalysisData.reduce((sum, item) => sum + item.actual, 0);
            const totalVariance = totalActual - totalBudget;
            const variancePercentage = (totalVariance / totalBudget) * 100;
            // Calcular score de eficiencia (basado en variaciones positivas)
            const positiveVariances = exampleAnalysisData.filter(item => item.variance > 0);
            const efficiencyScore = (positiveVariances.length / exampleAnalysisData.length) * 100;
            // Calcular score de riesgo (basado en variaciones negativas grandes)
            const highRiskItems = exampleAnalysisData.filter(item => item.variance_percentage < -5 || item.risk_level === 'high');
            const riskScore = (highRiskItems.length / exampleAnalysisData.length) * 100;
            // Calcular precisión del pronóstico (basado en qué tan cerca están los valores reales de los presupuestados)
            const forecastAccuracy = 100 - Math.abs(variancePercentage);
            setMetrics({
                total_budget: totalBudget,
                total_actual: totalActual,
                total_variance: totalVariance,
                variance_percentage: variancePercentage,
                efficiency_score: efficiencyScore,
                risk_score: riskScore,
                forecast_accuracy: forecastAccuracy
            });
        }
        catch (error) {
            console.error('Error loading analysis data:', error);
            toast.error('Error al cargar los datos de análisis');
        }
        finally {
            setLoading(false);
        }
    };
    const getRiskColor = (riskLevel) => {
        switch (riskLevel) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" });
            case 'down': return _jsx(TrendingDown, { className: "h-4 w-4 text-red-600" });
            case 'stable': return _jsx(Activity, { className: "h-4 w-4 text-blue-600" });
            default: return _jsx(Activity, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const getEfficiencyColor = (score) => {
        if (score >= 80)
            return 'text-green-600';
        if (score >= 60)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const getRiskColorByScore = (score) => {
        if (score <= 20)
            return 'text-green-600';
        if (score <= 40)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "An\u00E1lisis de Presupuesto" }), _jsx("p", { className: "text-gray-600 mt-2", children: "An\u00E1lisis detallado y m\u00E9tricas de rendimiento presupuestario" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Select, { value: selectedPeriod, onValueChange: setSelectedPeriod, children: [_jsx(SelectTrigger, { className: "w-32", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "week", children: "Semana" }), _jsx(SelectItem, { value: "month", children: "Mes" }), _jsx(SelectItem, { value: "quarter", children: "Trimestre" }), _jsx(SelectItem, { value: "year", children: "A\u00F1o" })] })] }), _jsxs(Button, { variant: "outline", onClick: loadAnalysisData, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Restaurante" }) }), _jsx(CardContent, { children: _jsxs(Select, { value: selectedRestaurant?.id || '', onValueChange: (value) => {
                                const restaurant = restaurants.find(r => r.id === value);
                                setSelectedRestaurant(restaurant);
                            }, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar restaurante" }) }), _jsx(SelectContent, { children: restaurants.map((restaurant) => (_jsx(SelectItem, { value: restaurant.id, children: restaurant.base_restaurant?.restaurant_name || 'Restaurante' }, restaurant.id))) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Eficiencia" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${getEfficiencyColor(metrics.efficiency_score)}`, children: [metrics.efficiency_score.toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Score de eficiencia" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Riesgo" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${getRiskColorByScore(metrics.risk_score)}`, children: [metrics.risk_score.toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Nivel de riesgo" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Precisi\u00F3n" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [metrics.forecast_accuracy.toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Precisi\u00F3n del pron\u00F3stico" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Variaci\u00F3n" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${metrics.variance_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`, children: [metrics.variance_percentage >= 0 ? '+' : '', metrics.variance_percentage.toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Variaci\u00F3n total" })] })] })] }), _jsxs(Tabs, { defaultValue: "overview", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "overview", children: "Resumen" }), _jsx(TabsTrigger, { value: "details", children: "Detalles" }), _jsx(TabsTrigger, { value: "trends", children: "Tendencias" }), _jsx(TabsTrigger, { value: "forecast", children: "Pron\u00F3sticos" })] }), _jsx(TabsContent, { value: "overview", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "An\u00E1lisis por Categor\u00EDa" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: analysisData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "category", angle: -45, textAnchor: "end", height: 80 }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}k` }), _jsx(Tooltip, { formatter: (value) => [`€${value.toLocaleString()}`, ''] }), _jsx(Bar, { dataKey: "budget", fill: "#8884d8", name: "Presupuesto" }), _jsx(Bar, { dataKey: "actual", fill: "#82ca9d", name: "Real" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n de Variaciones" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(AreaChart, { data: analysisData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "category", angle: -45, textAnchor: "end", height: 80 }), _jsx(YAxis, { tickFormatter: (value) => `${value.toFixed(1)}%` }), _jsx(Tooltip, { formatter: (value) => [`${value.toFixed(1)}%`, ''] }), _jsx(Area, { type: "monotone", dataKey: "variance_percentage", stroke: "#8884d8", fill: "#8884d8", fillOpacity: 0.3 })] }) }) })] })] }) }), _jsx(TabsContent, { value: "details", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "An\u00E1lisis Detallado por Categor\u00EDa" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando an\u00E1lisis..." })] })) : (_jsx("div", { className: "space-y-4", children: analysisData.map((item, index) => (_jsx("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getTrendIcon(item.trend) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: item.category }), _jsx(Badge, { className: getRiskColor(item.risk_level), children: item.risk_level === 'low' ? 'Bajo' : item.risk_level === 'medium' ? 'Medio' : 'Alto' })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Presupuesto:" }), _jsxs("div", { className: "font-medium", children: ["\u20AC", item.budget.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Real:" }), _jsxs("div", { className: "font-medium", children: ["\u20AC", item.actual.toLocaleString()] })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-500", children: "Variaci\u00F3n:" }), _jsxs("div", { className: `font-medium ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["\u20AC", item.variance.toLocaleString(), " (", item.variance_percentage >= 0 ? '+' : '', item.variance_percentage.toFixed(1), "%)"] })] })] })] })] }) }, index))) })) })] }) }), _jsx(TabsContent, { value: "trends", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Tendencias de Variaci\u00F3n" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(RechartsLineChart, { data: analysisData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "category", angle: -45, textAnchor: "end", height: 80 }), _jsx(YAxis, { tickFormatter: (value) => `${value.toFixed(1)}%` }), _jsx(Tooltip, { formatter: (value) => [`${value.toFixed(1)}%`, ''] }), _jsx(Line, { type: "monotone", dataKey: "variance_percentage", stroke: "#8884d8", strokeWidth: 2 })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Distribuci\u00F3n de Riesgo" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(RechartsPieChart, { children: [_jsx(Pie, { data: [
                                                                { name: 'Bajo Riesgo', value: analysisData.filter(item => item.risk_level === 'low').length, color: '#10b981' },
                                                                { name: 'Medio Riesgo', value: analysisData.filter(item => item.risk_level === 'medium').length, color: '#f59e0b' },
                                                                { name: 'Alto Riesgo', value: analysisData.filter(item => item.risk_level === 'high').length, color: '#ef4444' }
                                                            ], cx: "50%", cy: "50%", outerRadius: 80, dataKey: "value", children: [
                                                                { name: 'Bajo Riesgo', value: analysisData.filter(item => item.risk_level === 'low').length, color: '#10b981' },
                                                                { name: 'Medio Riesgo', value: analysisData.filter(item => item.risk_level === 'medium').length, color: '#f59e0b' },
                                                                { name: 'Alto Riesgo', value: analysisData.filter(item => item.risk_level === 'high').length, color: '#ef4444' }
                                                            ].map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }) })] })] }) }), _jsx(TabsContent, { value: "forecast", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Pron\u00F3sticos y Recomendaciones" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["\u20AC", (metrics.total_budget * 1.05).toLocaleString()] }), _jsx("p", { className: "text-sm text-blue-700", children: "Pron\u00F3stico 3 meses" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: metrics.efficiency_score > 70 ? 'Excelente' : metrics.efficiency_score > 50 ? 'Bueno' : 'Necesita Mejora' }), _jsx("p", { className: "text-sm text-green-700", children: "Estado General" })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: metrics.risk_score < 30 ? 'Bajo' : metrics.risk_score < 60 ? 'Moderado' : 'Alto' }), _jsx("p", { className: "text-sm text-purple-700", children: "Nivel de Riesgo" })] })] }), _jsxs("div", { className: "mt-6 p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Recomendaciones:" }), _jsxs("ul", { className: "space-y-1 text-sm", children: [metrics.risk_score > 50 && (_jsxs("li", { className: "flex items-center", children: [_jsx(AlertTriangle, { className: "h-4 w-4 text-red-600 mr-2" }), "Revisar categor\u00EDas con alto riesgo de sobrepresupuesto"] })), metrics.efficiency_score < 60 && (_jsxs("li", { className: "flex items-center", children: [_jsx(Target, { className: "h-4 w-4 text-yellow-600 mr-2" }), "Implementar controles m\u00E1s estrictos en categor\u00EDas problem\u00E1ticas"] })), metrics.forecast_accuracy < 90 && (_jsxs("li", { className: "flex items-center", children: [_jsx(Calculator, { className: "h-4 w-4 text-blue-600 mr-2" }), "Mejorar la precisi\u00F3n de los pron\u00F3sticos presupuestarios"] })), _jsxs("li", { className: "flex items-center", children: [_jsx(CheckCircle, { className: "h-4 w-4 text-green-600 mr-2" }), "Mantener el seguimiento mensual de todas las categor\u00EDas"] })] })] })] })] }) })] })] }));
};
export default BudgetAnalysis;
