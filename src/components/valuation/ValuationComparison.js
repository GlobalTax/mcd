import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, Filter, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
const ValuationComparison = () => {
    const { user } = useAuth();
    const [valuations, setValuations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedValuations, setSelectedValuations] = useState([]);
    const [filterRestaurant, setFilterRestaurant] = useState('');
    const [filterScenario, setFilterScenario] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [scenarios, setScenarios] = useState([]);
    useEffect(() => {
        if (user) {
            loadValuations();
        }
    }, [user]);
    const loadValuations = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('valuation_scenarios')
                .select(`
          *,
          restaurant:franchisee_restaurants(
            base_restaurant:base_restaurants(restaurant_name)
          ),
          user:profiles(full_name)
        `)
                .order('created_at', { ascending: false });
            const { data, error } = await query;
            if (error)
                throw error;
            const formattedData = (data || []).map(item => ({
                id: item.id,
                scenario_name: item.scenario_name,
                restaurant_name: item.restaurant?.base_restaurant?.restaurant_name || 'Restaurante',
                calculated_value: item.calculated_value,
                scenario_data: item.scenario_data,
                created_at: item.created_at,
                user_name: item.user?.full_name || 'Usuario'
            }));
            setValuations(formattedData);
            // Extraer restaurantes y escenarios únicos para filtros
            const uniqueRestaurants = [...new Set(formattedData.map(v => v.restaurant_name))];
            const uniqueScenarios = [...new Set(formattedData.map(v => v.scenario_name))];
            setRestaurants(uniqueRestaurants);
            setScenarios(uniqueScenarios);
        }
        catch (error) {
            console.error('Error loading valuations:', error);
            toast.error('Error al cargar las valoraciones');
        }
        finally {
            setLoading(false);
        }
    };
    const filteredValuations = valuations.filter(valuation => {
        if (filterRestaurant && valuation.restaurant_name !== filterRestaurant)
            return false;
        if (filterScenario && valuation.scenario_name !== filterScenario)
            return false;
        return true;
    });
    const selectedValuationData = filteredValuations.filter(v => selectedValuations.includes(v.id));
    const toggleValuationSelection = (valuationId) => {
        setSelectedValuations(prev => prev.includes(valuationId)
            ? prev.filter(id => id !== valuationId)
            : [...prev, valuationId]);
    };
    const selectAllValuations = () => {
        setSelectedValuations(filteredValuations.map(v => v.id));
    };
    const clearSelection = () => {
        setSelectedValuations([]);
    };
    const deleteValuation = async (valuationId) => {
        try {
            const { error } = await supabase
                .from('valuation_scenarios')
                .delete()
                .eq('id', valuationId);
            if (error)
                throw error;
            setValuations(prev => prev.filter(v => v.id !== valuationId));
            setSelectedValuations(prev => prev.filter(id => id !== valuationId));
            toast.success('Valoración eliminada correctamente');
        }
        catch (error) {
            console.error('Error deleting valuation:', error);
            toast.error('Error al eliminar la valoración');
        }
    };
    const exportComparison = () => {
        if (selectedValuationData.length === 0) {
            toast.error('Selecciona al menos una valoración para exportar');
            return;
        }
        const csvContent = [
            ['Restaurante', 'Escenario', 'Valor (€)', 'Fecha', 'Usuario'].join(','),
            ...selectedValuationData.map(valuation => [
                valuation.restaurant_name,
                valuation.scenario_name,
                valuation.calculated_value.toFixed(2),
                new Date(valuation.created_at).toLocaleDateString('es-ES'),
                valuation.user_name
            ].join(','))
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `comparacion_valoraciones_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Comparación exportada correctamente');
    };
    const getValueColor = (value, maxValue) => {
        const percentage = value / maxValue;
        if (percentage >= 0.8)
            return 'text-green-600';
        if (percentage >= 0.6)
            return 'text-yellow-600';
        return 'text-red-600';
    };
    const maxValue = Math.max(...filteredValuations.map(v => v.calculated_value));
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Comparaci\u00F3n de Valoraciones" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Compara m\u00FAltiples valoraciones DCF y analiza las diferencias" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "outline", onClick: selectAllValuations, children: "Seleccionar Todas" }), _jsx(Button, { variant: "outline", onClick: clearSelection, children: "Limpiar Selecci\u00F3n" }), _jsxs(Button, { variant: "outline", onClick: exportComparison, disabled: selectedValuationData.length === 0, children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Exportar (", selectedValuationData.length, ")"] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Filter, { className: "h-5 w-5 mr-2" }), "Filtros"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Restaurante" }), _jsxs(Select, { value: filterRestaurant, onValueChange: setFilterRestaurant, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Todos los restaurantes" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos los restaurantes" }), restaurants.map(restaurant => (_jsx(SelectItem, { value: restaurant, children: restaurant }, restaurant)))] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Escenario" }), _jsxs(Select, { value: filterScenario, onValueChange: setFilterScenario, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Todos los escenarios" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos los escenarios" }), scenarios.map(scenario => (_jsx(SelectItem, { value: scenario, children: scenario }, scenario)))] })] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Valoraciones (", filteredValuations.length, ")", selectedValuationData.length > 0 && (_jsxs(Badge, { className: "ml-2", variant: "secondary", children: [selectedValuationData.length, " seleccionadas"] }))] }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando valoraciones..." })] })) : filteredValuations.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(BarChart3, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No se encontraron valoraciones" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-12", children: "Seleccionar" }), _jsx(TableHead, { children: "Restaurante" }), _jsx(TableHead, { children: "Escenario" }), _jsx(TableHead, { children: "Valor (\u20AC)" }), _jsx(TableHead, { children: "Fecha" }), _jsx(TableHead, { children: "Usuario" }), _jsx(TableHead, { className: "w-20", children: "Acciones" })] }) }), _jsx(TableBody, { children: filteredValuations.map((valuation) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx("input", { type: "checkbox", checked: selectedValuations.includes(valuation.id), onChange: () => toggleValuationSelection(valuation.id), className: "rounded border-gray-300" }) }), _jsx(TableCell, { className: "font-medium", children: valuation.restaurant_name }), _jsx(TableCell, { children: _jsx(Badge, { variant: "outline", children: valuation.scenario_name }) }), _jsxs(TableCell, { className: `font-bold ${getValueColor(valuation.calculated_value, maxValue)}`, children: ["\u20AC", valuation.calculated_value.toLocaleString()] }), _jsx(TableCell, { children: new Date(valuation.created_at).toLocaleDateString('es-ES') }), _jsx(TableCell, { children: valuation.user_name }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => deleteValuation(valuation.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, valuation.id))) })] }) })) })] }), selectedValuationData.length > 0 && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Comparaci\u00F3n de Valores" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: selectedValuationData.map(v => ({
                                            name: `${v.restaurant_name} - ${v.scenario_name}`,
                                            value: v.calculated_value / 1000000
                                        })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "name", angle: -45, textAnchor: "end", height: 80 }), _jsx(YAxis, { tickFormatter: (value) => `€${value}M` }), _jsx(Tooltip, { formatter: (value) => [`€${value}M`, 'Valor'] }), _jsx(Bar, { dataKey: "value", fill: "#8884d8" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n Temporal" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: selectedValuationData
                                            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                                            .map(v => ({
                                            date: new Date(v.created_at).toLocaleDateString('es-ES'),
                                            value: v.calculated_value / 1000000,
                                            name: `${v.restaurant_name} - ${v.scenario_name}`
                                        })), children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "date" }), _jsx(YAxis, { tickFormatter: (value) => `€${value}M` }), _jsx(Tooltip, { formatter: (value) => [`€${value}M`, 'Valor'] }), _jsx(Line, { type: "monotone", dataKey: "value", stroke: "#8884d8", strokeWidth: 2 })] }) }) })] })] })), selectedValuationData.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Estad\u00EDsticas de la Comparaci\u00F3n" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: selectedValuationData.length }), _jsx("p", { className: "text-sm text-gray-600", children: "Valoraciones" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", (Math.max(...selectedValuationData.map(v => v.calculated_value)) / 1000000).toFixed(1), "M"] }), _jsx("p", { className: "text-sm text-gray-600", children: "Valor M\u00E1ximo" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-red-600", children: ["\u20AC", (Math.min(...selectedValuationData.map(v => v.calculated_value)) / 1000000).toFixed(1), "M"] }), _jsx("p", { className: "text-sm text-gray-600", children: "Valor M\u00EDnimo" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: ["\u20AC", (selectedValuationData.reduce((sum, v) => sum + v.calculated_value, 0) / selectedValuationData.length / 1000000).toFixed(1), "M"] }), _jsx("p", { className: "text-sm text-gray-600", children: "Valor Promedio" })] })] }) })] }))] }));
};
export default ValuationComparison;
