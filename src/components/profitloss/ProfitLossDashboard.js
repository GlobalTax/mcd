import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Download, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react';
import { useProfitLossData, useProfitLossCalculations } from '@/hooks/useProfitLossData';
import { ProfitLossTable } from './ProfitLossTable';
import { ProfitLossCharts } from './ProfitLossCharts';
import { ProfitLossForm } from './ProfitLossForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
const ProfitLossDashboard = ({ restaurantId }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showForm, setShowForm] = useState(false);
    const [viewMode, setViewMode] = useState('table');
    const [showOnlyTotals, setShowOnlyTotals] = useState(false);
    const { profitLossData, isLoading, error } = useProfitLossData(restaurantId, selectedYear);
    const { calculateMetrics, formatCurrency, formatPercentage } = useProfitLossCalculations();
    // Generar años disponibles (último 5 años + próximo año)
    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);
    // Calcular métricas del año actual
    const yearTotals = profitLossData.reduce((acc, month) => ({
        totalRevenue: acc.totalRevenue + month.total_revenue,
        totalExpenses: acc.totalExpenses + (month.total_cost_of_sales + month.total_labor + month.total_operating_expenses + month.total_mcdonalds_fees),
        operatingIncome: acc.operatingIncome + month.operating_income,
    }), { totalRevenue: 0, totalExpenses: 0, operatingIncome: 0 });
    const yearMetrics = yearTotals.totalRevenue > 0 ? {
        operatingMargin: (yearTotals.operatingIncome / yearTotals.totalRevenue) * 100,
        expenseRatio: (yearTotals.totalExpenses / yearTotals.totalRevenue) * 100,
    } : { operatingMargin: 0, expenseRatio: 0 };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Cargando datos de P&L..." })] }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-red-600 mb-4", children: "Error al cargar los datos de P&L" }), _jsx(Button, { onClick: () => window.location.reload(), children: "Reintentar" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "P&L Hist\u00F3rico" }), _jsxs("p", { className: "text-gray-600", children: ["Datos de Profit & Loss del restaurante ", restaurantId] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: selectedYear.toString(), onValueChange: (value) => setSelectedYear(parseInt(value)), children: [_jsx(SelectTrigger, { className: "w-32", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: availableYears.map(year => (_jsx(SelectItem, { value: year.toString(), children: year }, year))) })] }), _jsxs(Dialog, { open: showForm, onOpenChange: setShowForm, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Agregar Datos"] }) }), _jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh] overflow-y-auto", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Agregar Datos P&L" }) }), _jsx(ProfitLossForm, { restaurantId: restaurantId, onClose: () => setShowForm(false) })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ingresos Totales" }), _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: formatCurrency(yearTotals.totalRevenue) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["A\u00F1o ", selectedYear] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Gastos Totales" }), _jsx(TrendingDown, { className: "h-4 w-4 text-red-600" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: formatCurrency(yearTotals.totalExpenses) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [formatPercentage(yearMetrics.expenseRatio), " de ingresos"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Beneficio Operativo" }), _jsx(TrendingUp, { className: "h-4 w-4 text-blue-600" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: formatCurrency(yearTotals.operatingIncome) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [formatPercentage(yearMetrics.operatingMargin), " margen"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Registros" }), _jsx("span", { className: "h-4 w-4 text-gray-600" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: profitLossData.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "meses registrados" })] })] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: viewMode === 'table' ? 'default' : 'outline', onClick: () => setViewMode('table'), children: "Tabla" }), _jsx(Button, { variant: viewMode === 'charts' ? 'default' : 'outline', onClick: () => setViewMode('charts'), children: "Gr\u00E1ficos" }), viewMode === 'table' && (_jsxs(Button, { variant: "outline", onClick: () => setShowOnlyTotals(!showOnlyTotals), className: "flex items-center gap-2", children: [showOnlyTotals ? _jsx(Eye, { className: "w-4 h-4" }) : _jsx(EyeOff, { className: "w-4 h-4" }), showOnlyTotals ? 'Mostrar Detalle' : 'Solo Totales'] }))] }), _jsxs(Button, { variant: "outline", children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Exportar"] })] }), viewMode === 'table' ? (_jsx(ProfitLossTable, { data: profitLossData, showOnlyTotals: showOnlyTotals })) : (_jsx(ProfitLossCharts, { data: profitLossData }))] }));
};
export default ProfitLossDashboard;
