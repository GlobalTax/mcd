import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Save, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
const AdvancedDCFValuation = () => {
    const { user, franchisee } = useAuth();
    const [activeScenario, setActiveScenario] = useState('base');
    const [scenarios, setScenarios] = useState([]);
    const [sensitivityData, setSensitivityData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    // Inputs base para el modelo DCF
    const [inputs, setInputs] = useState({
        baseRevenue: 2500000,
        baseEBITDA: 375000,
        baseCapex: 125000,
        baseWorkingCapital: 187500,
        growthRate: 0.05,
        discountRate: 0.12,
        terminalGrowth: 0.025,
        projectionYears: 10,
        marginImprovement: 0.02,
        capexReduction: 0.05,
        workingCapitalEfficiency: 0.03
    });
    // Escenarios predefinidos
    const defaultScenarios = [
        {
            id: 'base',
            name: 'Escenario Base',
            description: 'Proyección conservadora con crecimiento moderado',
            growthRate: 0.05,
            discountRate: 0.12,
            terminalGrowth: 0.025,
            marginAssumption: 0.15,
            capexAssumption: 0.05,
            workingCapitalAssumption: 0.075,
            totalValue: 0,
            created_at: new Date().toISOString()
        },
        {
            id: 'optimistic',
            name: 'Escenario Optimista',
            description: 'Crecimiento acelerado con mejoras operativas',
            growthRate: 0.08,
            discountRate: 0.10,
            terminalGrowth: 0.03,
            marginAssumption: 0.18,
            capexAssumption: 0.04,
            workingCapitalAssumption: 0.06,
            totalValue: 0,
            created_at: new Date().toISOString()
        },
        {
            id: 'pessimistic',
            name: 'Escenario Pesimista',
            description: 'Crecimiento lento con presiones competitivas',
            growthRate: 0.02,
            discountRate: 0.15,
            terminalGrowth: 0.015,
            marginAssumption: 0.12,
            capexAssumption: 0.06,
            workingCapitalAssumption: 0.09,
            totalValue: 0,
            created_at: new Date().toISOString()
        }
    ];
    useEffect(() => {
        if (franchisee) {
            loadRestaurants();
            loadScenarios();
            generateSensitivityAnalysis();
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
    const generateSensitivityAnalysis = () => {
        const sensitivityData = [];
        // Análisis de sensibilidad para diferentes tasas de descuento y crecimiento
        const discountRates = [0.08, 0.10, 0.12, 0.14, 0.16];
        const growthRates = [0.02, 0.04, 0.06, 0.08, 0.10];
        discountRates.forEach(dr => {
            growthRates.forEach(gr => {
                const value = calculateDCFValue({
                    ...inputs,
                    discountRate: dr,
                    growthRate: gr
                });
                sensitivityData.push({
                    discountRate: dr,
                    growthRate: gr,
                    terminalGrowth: inputs.terminalGrowth,
                    value
                });
            });
        });
        setSensitivityData(sensitivityData);
    };
    const calculateDCFValue = (scenarioInputs) => {
        let presentValue = 0;
        let currentRevenue = scenarioInputs.baseRevenue;
        let currentEBITDA = scenarioInputs.baseEBITDA;
        let currentCapex = scenarioInputs.baseCapex;
        let currentWorkingCapital = scenarioInputs.baseWorkingCapital;
        // Calcular flujos de caja proyectados
        for (let year = 1; year <= scenarioInputs.projectionYears; year++) {
            // Proyección de ingresos
            currentRevenue *= (1 + scenarioInputs.growthRate);
            // Proyección de EBITDA con mejora de márgenes
            const marginImprovement = 1 + (scenarioInputs.marginImprovement * year);
            currentEBITDA = currentRevenue * (scenarioInputs.baseEBITDA / scenarioInputs.baseRevenue) * marginImprovement;
            // Proyección de Capex
            const capexReduction = 1 - (scenarioInputs.capexReduction * year);
            currentCapex = currentRevenue * (scenarioInputs.baseCapex / scenarioInputs.baseRevenue) * capexReduction;
            // Proyección de Capital de Trabajo
            const workingCapitalEfficiency = 1 - (scenarioInputs.workingCapitalEfficiency * year);
            currentWorkingCapital = currentRevenue * (scenarioInputs.baseWorkingCapital / scenarioInputs.baseRevenue) * workingCapitalEfficiency;
            // Flujo de caja libre
            const freeCashFlow = currentEBITDA - currentCapex - (currentWorkingCapital - (currentRevenue * (scenarioInputs.baseWorkingCapital / scenarioInputs.baseRevenue)));
            // Valor presente
            presentValue += freeCashFlow / Math.pow(1 + scenarioInputs.discountRate, year);
        }
        // Valor terminal
        const terminalValue = (currentEBITDA * (1 - scenarioInputs.capexReduction * scenarioInputs.projectionYears)) /
            (scenarioInputs.discountRate - scenarioInputs.terminalGrowth);
        const presentTerminalValue = terminalValue / Math.pow(1 + scenarioInputs.discountRate, scenarioInputs.projectionYears);
        return presentValue + presentTerminalValue;
    };
    const updateScenario = (scenarioId, updates) => {
        setScenarios(prev => prev.map(scenario => scenario.id === scenarioId
            ? {
                ...scenario,
                ...updates,
                totalValue: calculateDCFValue({ ...inputs, ...updates })
            }
            : scenario));
    };
    const saveScenario = async () => {
        if (!user || !selectedRestaurant)
            return;
        setSaving(true);
        try {
            const currentScenario = scenarios.find(s => s.id === activeScenario);
            if (!currentScenario)
                return;
            const { error } = await supabase
                .from('valuation_scenarios')
                .insert({
                user_id: user.id,
                restaurant_id: selectedRestaurant.id,
                scenario_name: currentScenario.name,
                scenario_data: {
                    inputs: { ...inputs },
                    scenario: currentScenario
                },
                calculated_value: currentScenario.totalValue,
                created_at: new Date().toISOString()
            });
            if (error)
                throw error;
            toast.success('Escenario guardado correctamente');
        }
        catch (error) {
            console.error('Error saving scenario:', error);
            toast.error('Error al guardar el escenario');
        }
        finally {
            setSaving(false);
        }
    };
    const exportValuation = () => {
        const currentScenario = scenarios.find(s => s.id === activeScenario);
        if (!currentScenario)
            return;
        const csvContent = [
            ['Parámetro', 'Valor'].join(','),
            ['Ingresos Base', inputs.baseRevenue].join(','),
            ['EBITDA Base', inputs.baseEBITDA].join(','),
            ['Tasa de Crecimiento', `${(currentScenario.growthRate * 100).toFixed(1)}%`].join(','),
            ['Tasa de Descuento', `${(currentScenario.discountRate * 100).toFixed(1)}%`].join(','),
            ['Crecimiento Terminal', `${(currentScenario.terminalGrowth * 100).toFixed(1)}%`].join(','),
            ['Valor Total', currentScenario.totalValue.toFixed(2)].join(','),
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `valoracion_dcf_${selectedRestaurant?.base_restaurant?.restaurant_name || 'restaurante'}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Valoración exportada correctamente');
    };
    const currentScenario = scenarios.find(s => s.id === activeScenario);
    const currentValue = currentScenario ? calculateDCFValue({ ...inputs, ...currentScenario }) : 0;
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Valoraci\u00F3n DCF Avanzada" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Modelo de valoraci\u00F3n por flujo de caja descontado con m\u00FAltiples escenarios" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: generateSensitivityAnalysis, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Recalcular"] }), _jsxs(Button, { variant: "outline", onClick: exportValuation, children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Exportar"] }), _jsxs(Button, { onClick: saveScenario, disabled: saving, children: [saving ? _jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }) : _jsx(Save, { className: "h-4 w-4 mr-2" }), "Guardar Escenario"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Restaurante a Valorar" }) }), _jsx(CardContent, { children: _jsxs(Select, { value: selectedRestaurant?.id || '', onValueChange: (value) => {
                                const restaurant = restaurants.find(r => r.id === value);
                                setSelectedRestaurant(restaurant);
                            }, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar restaurante" }) }), _jsx(SelectContent, { children: restaurants.map((restaurant) => (_jsx(SelectItem, { value: restaurant.id, children: restaurant.base_restaurant?.restaurant_name || 'Restaurante' }, restaurant.id))) })] }) })] }), _jsxs(Tabs, { defaultValue: "scenarios", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "scenarios", children: "Escenarios" }), _jsx(TabsTrigger, { value: "sensitivity", children: "An\u00E1lisis de Sensibilidad" }), _jsx(TabsTrigger, { value: "projections", children: "Proyecciones" }), _jsx(TabsTrigger, { value: "comparison", children: "Comparativas" })] }), _jsxs(TabsContent, { value: "scenarios", className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Escenarios de Valoraci\u00F3n" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: scenarios.map((scenario) => (_jsx(Card, { className: `cursor-pointer transition-all ${activeScenario === scenario.id
                                                    ? 'ring-2 ring-blue-500 bg-blue-50'
                                                    : 'hover:bg-gray-50'}`, onClick: () => setActiveScenario(scenario.id), children: _jsxs(CardContent, { className: "p-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h3", { className: "font-semibold", children: scenario.name }), _jsx(Badge, { variant: scenario.id === 'optimistic' ? 'default' : scenario.id === 'pessimistic' ? 'destructive' : 'secondary', children: scenario.id === 'optimistic' ? 'Optimista' : scenario.id === 'pessimistic' ? 'Pesimista' : 'Base' })] }), _jsx("p", { className: "text-sm text-gray-600 mb-3", children: scenario.description }), _jsxs("div", { className: "space-y-1 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Crecimiento:" }), _jsxs("span", { className: "font-medium", children: [(scenario.growthRate * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Descuento:" }), _jsxs("span", { className: "font-medium", children: [(scenario.discountRate * 100).toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between font-semibold text-lg", children: [_jsx("span", { children: "Valor:" }), _jsxs("span", { className: "text-green-600", children: ["\u20AC", calculateDCFValue({ ...inputs, ...scenario }).toLocaleString()] })] })] })] }) }, scenario.id))) }) })] }), currentScenario && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Par\u00E1metros del Escenario: ", currentScenario.name] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Par\u00E1metros de Crecimiento" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "growthRate", children: "Tasa de Crecimiento (%)" }), _jsx(Input, { id: "growthRate", type: "number", step: "0.01", value: (currentScenario.growthRate * 100).toFixed(1), onChange: (e) => updateScenario(activeScenario, { growthRate: parseFloat(e.target.value) / 100 }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "terminalGrowth", children: "Crecimiento Terminal (%)" }), _jsx(Input, { id: "terminalGrowth", type: "number", step: "0.01", value: (currentScenario.terminalGrowth * 100).toFixed(1), onChange: (e) => updateScenario(activeScenario, { terminalGrowth: parseFloat(e.target.value) / 100 }) })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Par\u00E1metros de Descuento" }), _jsx("div", { className: "space-y-3", children: _jsxs("div", { children: [_jsx(Label, { htmlFor: "discountRate", children: "Tasa de Descuento (%)" }), _jsx(Input, { id: "discountRate", type: "number", step: "0.01", value: (currentScenario.discountRate * 100).toFixed(1), onChange: (e) => updateScenario(activeScenario, { discountRate: parseFloat(e.target.value) / 100 }) })] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-medium", children: "Resultado" }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", currentValue.toLocaleString()] }), _jsx("p", { className: "text-sm text-green-700", children: "Valor Total DCF" })] })] })] }) })] }))] }), _jsx(TabsContent, { value: "sensitivity", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "An\u00E1lisis de Sensibilidad" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(ScatterChart, { data: sensitivityData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "discountRate", name: "Tasa de Descuento", tickFormatter: (value) => `${(value * 100).toFixed(0)}%` }), _jsx(YAxis, { dataKey: "value", name: "Valor", tickFormatter: (value) => `€${(value / 1000000).toFixed(1)}M` }), _jsx(Tooltip, { formatter: (value, name) => [
                                                        `€${(value / 1000000).toFixed(2)}M`,
                                                        'Valor'
                                                    ], labelFormatter: (label) => `Descuento: ${(label * 100).toFixed(1)}%` }), _jsx(Scatter, { dataKey: "value", fill: "#8884d8" })] }) }) })] }) }), _jsx(TabsContent, { value: "projections", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Proyecciones de Flujo de Caja" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(LineChart, { data: Array.from({ length: inputs.projectionYears }, (_, i) => {
                                                const year = i + 1;
                                                const revenue = inputs.baseRevenue * Math.pow(1 + (currentScenario?.growthRate || 0.05), year);
                                                const ebitda = revenue * (inputs.baseEBITDA / inputs.baseRevenue);
                                                const capex = revenue * (inputs.baseCapex / inputs.baseRevenue);
                                                const fcf = ebitda - capex;
                                                return {
                                                    year,
                                                    revenue: revenue / 1000000,
                                                    ebitda: ebitda / 1000000,
                                                    fcf: fcf / 1000000
                                                };
                                            }), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "year" }), _jsx(YAxis, { tickFormatter: (value) => `€${value}M` }), _jsx(Tooltip, { formatter: (value) => [`€${value}M`, ''], labelFormatter: (label) => `Año ${label}` }), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#8884d8", strokeWidth: 2, name: "Ingresos" }), _jsx(Line, { type: "monotone", dataKey: "ebitda", stroke: "#82ca9d", strokeWidth: 2, name: "EBITDA" }), _jsx(Line, { type: "monotone", dataKey: "fcf", stroke: "#ffc658", strokeWidth: 2, name: "FCF" })] }) }) })] }) }), _jsx(TabsContent, { value: "comparison", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Comparativa de Escenarios" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 400, children: _jsxs(BarChart, { data: scenarios.map(scenario => ({
                                                name: scenario.name,
                                                value: calculateDCFValue({ ...inputs, ...scenario }) / 1000000
                                            })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name" }), _jsx(YAxis, { tickFormatter: (value) => `€${value}M` }), _jsx(Tooltip, { formatter: (value) => [`€${value}M`, 'Valor'] }), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) }) })] }) })] })] }));
};
export default AdvancedDCFValuation;
