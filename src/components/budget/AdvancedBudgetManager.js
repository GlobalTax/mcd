import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Save, Loader2, RefreshCw, Copy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
const AdvancedBudgetManager = () => {
    const { user, franchisee } = useAuth();
    const [activeScenario, setActiveScenario] = useState('base');
    const [scenarios, setScenarios] = useState([]);
    const [budgetData, setBudgetData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    // Inputs base para el presupuesto
    const [inputs, setInputs] = useState({
        baseRevenue: 2500000,
        baseExpenses: 2000000,
        growthRate: 0.05,
        inflationRate: 0.025,
        efficiencyImprovement: 0.02,
        projectionMonths: 12
    });
    // Escenarios predefinidos
    const defaultScenarios = [
        {
            id: 'base',
            name: 'Presupuesto Base',
            description: 'Proyección conservadora con crecimiento moderado',
            growth_rate: 0.05,
            inflation_rate: 0.025,
            efficiency_improvement: 0.02,
            total_budget: 0,
            created_at: new Date().toISOString()
        },
        {
            id: 'optimistic',
            name: 'Presupuesto Optimista',
            description: 'Crecimiento acelerado con mejoras operativas',
            growth_rate: 0.08,
            inflation_rate: 0.02,
            efficiency_improvement: 0.04,
            total_budget: 0,
            created_at: new Date().toISOString()
        },
        {
            id: 'pessimistic',
            name: 'Presupuesto Pesimista',
            description: 'Crecimiento lento con presiones inflacionarias',
            growth_rate: 0.02,
            inflation_rate: 0.04,
            efficiency_improvement: 0.01,
            total_budget: 0,
            created_at: new Date().toISOString()
        }
    ];
    // Datos de presupuesto de ejemplo
    const budgetCategories = [
        { category: 'Ingresos', subcategory: 'Ventas de Comida', base: 1800000 },
        { category: 'Ingresos', subcategory: 'Bebidas', base: 400000 },
        { category: 'Ingresos', subcategory: 'Otros', base: 300000 },
        { category: 'Costos', subcategory: 'Materia Prima', base: 600000 },
        { category: 'Costos', subcategory: 'Mano de Obra', base: 500000 },
        { category: 'Costos', subcategory: 'Gastos Operativos', base: 300000 },
        { category: 'Gastos', subcategory: 'Marketing', base: 100000 },
        { category: 'Gastos', subcategory: 'Administrativos', base: 150000 },
        { category: 'Gastos', subcategory: 'Mantenimiento', base: 80000 },
        { category: 'Gastos', subcategory: 'Servicios', base: 120000 }
    ];
    useEffect(() => {
        if (franchisee) {
            loadRestaurants();
            loadScenarios();
            generateBudgetData();
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
    const loadScenarios = async () => {
        try {
            // Por ahora usamos escenarios predefinidos
            // En el futuro esto vendría de la base de datos
            setScenarios(defaultScenarios);
        }
        catch (error) {
            console.error('Error loading scenarios:', error);
        }
    };
    const generateBudgetData = () => {
        const currentScenario = scenarios.find(s => s.id === activeScenario);
        if (!currentScenario)
            return;
        const budgetData = budgetCategories.map((category, index) => {
            const baseAmount = category.base;
            const growthFactor = Math.pow(1 + currentScenario.growth_rate, selectedMonth / 12);
            const inflationFactor = Math.pow(1 + currentScenario.inflation_rate, selectedMonth / 12);
            const efficiencyFactor = Math.pow(1 - currentScenario.efficiency_improvement, selectedMonth / 12);
            let budgetAmount = baseAmount;
            if (category.category === 'Ingresos') {
                budgetAmount = baseAmount * growthFactor;
            }
            else {
                budgetAmount = baseAmount * inflationFactor * efficiencyFactor;
            }
            const actualAmount = budgetAmount * (0.9 + Math.random() * 0.2); // Simulación de datos reales
            const variance = actualAmount - budgetAmount;
            const variancePercentage = (variance / budgetAmount) * 100;
            return {
                id: `budget-${index}`,
                name: `${category.category} - ${category.subcategory}`,
                description: `Presupuesto para ${category.subcategory.toLowerCase()}`,
                category: category.category,
                subcategory: category.subcategory,
                budget_amount: budgetAmount,
                actual_amount: actualAmount,
                variance: variance,
                variance_percentage: variancePercentage,
                month: selectedMonth,
                year: selectedYear
            };
        });
        setBudgetData(budgetData);
    };
    const updateScenario = (scenarioId, updates) => {
        setScenarios(prev => prev.map(scenario => scenario.id === scenarioId
            ? {
                ...scenario,
                ...updates,
                total_budget: calculateTotalBudget({ ...inputs, ...updates })
            }
            : scenario));
    };
    const calculateTotalBudget = (scenarioInputs) => {
        const currentScenario = scenarios.find(s => s.id === activeScenario);
        if (!currentScenario)
            return 0;
        let totalRevenue = 0;
        let totalExpenses = 0;
        budgetCategories.forEach(category => {
            const baseAmount = category.base;
            const growthFactor = Math.pow(1 + currentScenario.growth_rate, selectedMonth / 12);
            const inflationFactor = Math.pow(1 + currentScenario.inflation_rate, selectedMonth / 12);
            const efficiencyFactor = Math.pow(1 - currentScenario.efficiency_improvement, selectedMonth / 12);
            if (category.category === 'Ingresos') {
                totalRevenue += baseAmount * growthFactor;
            }
            else {
                totalExpenses += baseAmount * inflationFactor * efficiencyFactor;
            }
        });
        return totalRevenue - totalExpenses;
    };
    const saveBudget = async () => {
        if (!user || !selectedRestaurant)
            return;
        setSaving(true);
        try {
            const currentScenario = scenarios.find(s => s.id === activeScenario);
            if (!currentScenario)
                return;
            const { error } = await supabase
                .from('budget_scenarios')
                .insert({
                user_id: user.id,
                restaurant_id: selectedRestaurant.id,
                scenario_name: currentScenario.name,
                scenario_data: {
                    inputs: { ...inputs },
                    scenario: currentScenario,
                    budget_data: budgetData
                },
                total_budget: currentScenario.total_budget,
                year: selectedYear,
                month: selectedMonth,
                created_at: new Date().toISOString()
            });
            if (error)
                throw error;
            toast.success('Presupuesto guardado correctamente');
        }
        catch (error) {
            console.error('Error saving budget:', error);
            toast.error('Error al guardar el presupuesto');
        }
        finally {
            setSaving(false);
        }
    };
    const exportBudget = () => {
        const currentScenario = scenarios.find(s => s.id === activeScenario);
        if (!currentScenario)
            return;
        const csvContent = [
            ['Categoría', 'Subcategoría', 'Presupuesto (€)', 'Real (€)', 'Variación (€)', 'Variación (%)'].join(','),
            ...budgetData.map(item => [
                item.category,
                item.subcategory,
                item.budget_amount.toFixed(2),
                item.actual_amount.toFixed(2),
                item.variance.toFixed(2),
                `${item.variance_percentage.toFixed(1)}%`
            ].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `presupuesto_${selectedRestaurant?.base_restaurant?.restaurant_name || 'restaurante'}_${selectedYear}_${selectedMonth}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Presupuesto exportado correctamente');
    };
    const copyFromPreviousMonth = () => {
        // Simular copia del mes anterior
        toast.success('Datos copiados del mes anterior');
    };
    const currentScenario = scenarios.find(s => s.id === activeScenario);
    const currentTotalBudget = currentScenario ? calculateTotalBudget({ ...inputs, ...currentScenario }) : 0;
    const totalBudget = budgetData.reduce((sum, item) => sum + item.budget_amount, 0);
    const totalActual = budgetData.reduce((sum, item) => sum + item.actual_amount, 0);
    const totalVariance = totalActual - totalBudget;
    const totalVariancePercentage = (totalVariance / totalBudget) * 100;
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gesti\u00F3n de Presupuestos Anuales" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Planificaci\u00F3n y control presupuestario avanzado" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: copyFromPreviousMonth, children: [_jsx(Copy, { className: "h-4 w-4 mr-2" }), "Copiar Mes Anterior"] }), _jsxs(Button, { variant: "outline", onClick: generateBudgetData, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Recalcular"] }), _jsxs(Button, { variant: "outline", onClick: exportBudget, children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Exportar"] }), _jsxs(Button, { onClick: saveBudget, disabled: saving, children: [saving ? _jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : _jsx(Save, { className: "h-4 w-4 mr-2" }), "Guardar Presupuesto"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Restaurante" }) }), _jsx(CardContent, { children: _jsxs(Select, { value: selectedRestaurant?.id || '', onValueChange: (value) => {
                                        const restaurant = restaurants.find(r => r.id === value);
                                        setSelectedRestaurant(restaurant);
                                    }, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar restaurante" }) }), _jsx(SelectContent, { children: restaurants.map((restaurant) => (_jsx(SelectItem, { value: restaurant.id, children: restaurant.base_restaurant?.restaurant_name || 'Restaurante' }, restaurant.id))) })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "A\u00F1o" }) }), _jsx(CardContent, { children: _jsxs(Select, { value: selectedYear.toString(), onValueChange: (value) => setSelectedYear(parseInt(value)), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: [2023, 2024, 2025, 2026, 2027].map((year) => (_jsx(SelectItem, { value: year.toString(), children: year }, year))) })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Mes" }) }), _jsx(CardContent, { children: _jsxs(Select, { value: selectedMonth.toString(), onValueChange: (value) => setSelectedMonth(parseInt(value)), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (_jsx(SelectItem, { value: month.toString(), children: new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'long' }) }, month))) })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Escenario" }) }), _jsx(CardContent, { children: _jsxs(Select, { value: activeScenario, onValueChange: setActiveScenario, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: scenarios.map((scenario) => (_jsx(SelectItem, { value: scenario.id, children: scenario.name }, scenario.id))) })] }) })] })] }), _jsxs(Tabs, { defaultValue: "budget", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "budget", children: "Presupuesto" }), _jsx(TabsTrigger, { value: "scenarios", children: "Escenarios" }), _jsx(TabsTrigger, { value: "analysis", children: "An\u00E1lisis" }), _jsx(TabsTrigger, { value: "forecast", children: "Pron\u00F3sticos" })] }), _jsxs(TabsContent, { value: "budget", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Presupuesto Total" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["\u20AC", totalBudget.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-500", children: "Presupuesto planificado" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Real Total" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", totalActual.toLocaleString()] }), _jsx("p", { className: "text-xs text-gray-500", children: "Gastos reales" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Variaci\u00F3n" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["\u20AC", totalVariance.toLocaleString()] }), _jsxs("p", { className: "text-xs text-gray-500", children: [totalVariancePercentage >= 0 ? '+' : '', totalVariancePercentage.toFixed(1), "%"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Margen" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: [((currentTotalBudget / totalBudget) * 100).toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Margen presupuestario" })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Detalle del Presupuesto" }) }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b", children: [_jsx("th", { className: "text-left p-2", children: "Categor\u00EDa" }), _jsx("th", { className: "text-left p-2", children: "Subcategor\u00EDa" }), _jsx("th", { className: "text-right p-2", children: "Presupuesto (\u20AC)" }), _jsx("th", { className: "text-right p-2", children: "Real (\u20AC)" }), _jsx("th", { className: "text-right p-2", children: "Variaci\u00F3n (\u20AC)" }), _jsx("th", { className: "text-right p-2", children: "Variaci\u00F3n (%)" }), _jsx("th", { className: "text-center p-2", children: "Estado" })] }) }), _jsx("tbody", { children: budgetData.map((item) => (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "p-2 font-medium", children: item.category }), _jsx("td", { className: "p-2", children: item.subcategory }), _jsxs("td", { className: "p-2 text-right", children: ["\u20AC", item.budget_amount.toLocaleString()] }), _jsxs("td", { className: "p-2 text-right", children: ["\u20AC", item.actual_amount.toLocaleString()] }), _jsxs("td", { className: `p-2 text-right font-medium ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`, children: ["\u20AC", item.variance.toLocaleString()] }), _jsxs("td", { className: `p-2 text-right ${item.variance_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`, children: [item.variance_percentage >= 0 ? '+' : '', item.variance_percentage.toFixed(1), "%"] }), _jsx("td", { className: "p-2 text-center", children: _jsx(Badge, { variant: item.variance_percentage > 10 ? 'destructive' : item.variance_percentage > 5 ? 'secondary' : 'default', children: item.variance_percentage > 10 ? 'Crítico' : item.variance_percentage > 5 ? 'Atención' : 'OK' }) })] }, item.id))) })] }) }) })] })] }), _jsx(TabsContent, { value: "scenarios", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Escenarios de Presupuesto" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: scenarios.map((scenario) => (_jsx(Card, { className: `cursor-pointer transition-all ${activeScenario === scenario.id
                                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                                : 'hover:bg-gray-50'}`, onClick: () => setActiveScenario(scenario.id), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold", children: scenario.name }), _jsx(Badge, { variant: scenario.id === 'optimistic' ? 'default' : scenario.id === 'pessimistic' ? 'destructive' : 'secondary', children: scenario.id === 'optimistic' ? 'Optimista' : scenario.id === 'pessimistic' ? 'Pesimista' : 'Base' })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: scenario.description }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Crecimiento:" }), _jsxs("span", { className: "font-medium", children: [(scenario.growth_rate * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Inflaci\u00F3n:" }), _jsxs("span", { className: "font-medium", children: [(scenario.inflation_rate * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between font-semibold text-lg", children: [_jsx("span", { children: "Total:" }), _jsxs("span", { className: "text-green-600", children: ["\u20AC", calculateTotalBudget({ ...inputs, ...scenario }).toLocaleString()] })] })] })] }) }, scenario.id))) }) })] }) }), _jsx(TabsContent, { value: "analysis", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "An\u00E1lisis por Categor\u00EDa" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: budgetData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "subcategory", angle: -45, textAnchor: "end", height: 80 }), _jsx(YAxis, { tickFormatter: (value) => `€${(value / 1000).toFixed(0)}k` }), _jsx(Tooltip, { formatter: (value) => [`€${value.toLocaleString()}`, ''] }), _jsx(Bar, { dataKey: "budget_amount", fill: "#8884d8", name: "Presupuesto" }), _jsx(Bar, { dataKey: "actual_amount", fill: "#82ca9d", name: "Real" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n Mensual" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: Array.from({ length: 12 }, (_, i) => {
                                                        const month = i + 1;
                                                        const monthData = budgetData.filter(item => item.month === month);
                                                        const totalBudget = monthData.reduce((sum, item) => sum + item.budget_amount, 0);
                                                        const totalActual = monthData.reduce((sum, item) => sum + item.actual_amount, 0);
                                                        return {
                                                            month: new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'short' }),
                                                            budget: totalBudget / 1000000,
                                                            actual: totalActual / 1000000
                                                        };
                                                    }), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, { tickFormatter: (value) => `€${value}M` }), _jsx(Tooltip, { formatter: (value) => [`€${value}M`, ''] }), _jsx(Line, { type: "monotone", dataKey: "budget", stroke: "#8884d8", strokeWidth: 2, name: "Presupuesto" }), _jsx(Line, { type: "monotone", dataKey: "actual", stroke: "#82ca9d", strokeWidth: 2, name: "Real" })] }) }) })] })] }) }), _jsx(TabsContent, { value: "forecast", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Pron\u00F3sticos y Proyecciones" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: ["\u20AC", (totalBudget * 1.05).toLocaleString()] }), _jsx("p", { className: "text-sm text-blue-700", children: "Pron\u00F3stico 3 meses" })] }), _jsxs("div", { className: "text-center p-4 bg-green-50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", (totalBudget * 1.12).toLocaleString()] }), _jsx("p", { className: "text-sm text-green-700", children: "Pron\u00F3stico 6 meses" })] }), _jsxs("div", { className: "text-center p-4 bg-purple-50 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: ["\u20AC", (totalBudget * 1.20).toLocaleString()] }), _jsx("p", { className: "text-sm text-purple-700", children: "Pron\u00F3stico 12 meses" })] })] }) })] }) })] })] }));
};
export default AdvancedBudgetManager;
