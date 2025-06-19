import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfitLossCalculations } from '@/hooks/useProfitLossData';
export const ProfitLossTable = ({ data, showOnlyTotals = false }) => {
    const { formatCurrency, formatPercentage, calculateMetrics } = useProfitLossCalculations();
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    if (data.length === 0) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No hay datos disponibles para este a\u00F1o" }) }) }));
    }
    // Ordenar datos por mes
    const sortedData = [...data].sort((a, b) => a.month - b.month);
    // Calcular totales anuales
    const yearTotals = sortedData.reduce((acc, row) => ({
        net_sales: acc.net_sales + row.net_sales,
        total_revenue: acc.total_revenue + row.total_revenue,
        food_cost: acc.food_cost + row.food_cost,
        total_labor: acc.total_labor + row.total_labor,
        total_operating_expenses: acc.total_operating_expenses + row.total_operating_expenses,
        total_mcdonalds_fees: acc.total_mcdonalds_fees + row.total_mcdonalds_fees,
        operating_income: acc.operating_income + row.operating_income,
    }), {
        net_sales: 0,
        total_revenue: 0,
        food_cost: 0,
        total_labor: 0,
        total_operating_expenses: 0,
        total_mcdonalds_fees: 0,
        operating_income: 0,
    });
    const yearMetrics = calculateMetrics({
        ...yearTotals,
        year: data[0]?.year || new Date().getFullYear(),
        month: 0,
        restaurant_id: data[0]?.restaurant_id || '',
        id: 'yearly-total',
        other_revenue: 0,
        paper_cost: 0,
        total_cost_of_sales: 0,
        management_labor: 0,
        crew_labor: 0,
        benefits: 0,
        rent: 0,
        utilities: 0,
        maintenance: 0,
        advertising: 0,
        insurance: 0,
        supplies: 0,
        other_expenses: 0,
        franchise_fee: 0,
        advertising_fee: 0,
        rent_percentage: 0,
        gross_profit: 0,
        created_at: '',
        updated_at: '',
        created_by: null,
        notes: null,
    });
    const getColumnsToShow = () => {
        if (showOnlyTotals) {
            return [
                { key: 'total_revenue', label: 'Ingresos Totales', color: 'text-green-600' },
                { key: 'operating_income', label: 'Beneficio Operativo', color: 'text-blue-600' }
            ];
        }
        return [
            { key: 'net_sales', label: 'Ventas Netas', color: 'text-gray-900' },
            { key: 'total_revenue', label: 'Ingresos Totales', color: 'text-green-600' },
            { key: 'food_cost', label: 'Costo Comida', color: 'text-red-600' },
            { key: 'total_labor', label: 'Mano de Obra', color: 'text-orange-600' },
            { key: 'total_operating_expenses', label: 'Gastos Operativos', color: 'text-gray-700' },
            { key: 'total_mcdonalds_fees', label: 'Fees McDonald\'s', color: 'text-purple-600' },
            { key: 'operating_income', label: 'Beneficio Operativo', color: 'text-blue-600' }
        ];
    };
    const columns = getColumnsToShow();
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: showOnlyTotals ? 'Resumen P&L' : 'Datos Mensuales P&L' }) }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b bg-gray-50", children: [_jsx("th", { className: "text-left p-3 font-semibold sticky left-0 bg-gray-50 z-10", children: "Mes" }), columns.map(col => (_jsxs("th", { className: "text-right p-3 font-semibold min-w-[140px]", children: [col.label, !showOnlyTotals && col.key !== 'net_sales' && col.key !== 'total_revenue' && (_jsx("div", { className: "text-xs font-normal text-gray-500 mt-1", children: "% Ingresos" }))] }, col.key))), !showOnlyTotals && (_jsx("th", { className: "text-right p-3 font-semibold min-w-[100px]", children: "Margen %" }))] }) }), _jsx("tbody", { children: sortedData.map((row) => {
                                    const metrics = calculateMetrics(row);
                                    return (_jsxs("tr", { className: "border-b hover:bg-gray-50", children: [_jsx("td", { className: "p-3 font-medium sticky left-0 bg-white z-10", children: monthNames[row.month - 1] }), columns.map(col => (_jsxs("td", { className: `p-3 text-right ${col.color}`, children: [_jsx("div", { className: "font-semibold", children: formatCurrency(row[col.key]) }), !showOnlyTotals && col.key !== 'net_sales' && col.key !== 'total_revenue' && (_jsx("div", { className: "text-xs text-gray-500", children: formatPercentage(row.total_revenue > 0
                                                            ? (row[col.key] / row.total_revenue) * 100
                                                            : 0) }))] }, col.key))), !showOnlyTotals && (_jsx("td", { className: "p-3 text-right", children: _jsx("span", { className: metrics.operatingMargin >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold', children: formatPercentage(metrics.operatingMargin) }) }))] }, `${row.year}-${row.month}`));
                                }) }), _jsx("tfoot", { children: _jsxs("tr", { className: "border-t-2 bg-gray-100 font-bold", children: [_jsx("td", { className: "p-3 sticky left-0 bg-gray-100 z-10", children: "TOTAL ANUAL" }), columns.map(col => (_jsxs("td", { className: `p-3 text-right ${col.color}`, children: [_jsx("div", { className: "font-bold text-base", children: formatCurrency(yearTotals[col.key]) }), !showOnlyTotals && col.key !== 'net_sales' && col.key !== 'total_revenue' && (_jsx("div", { className: "text-xs text-gray-600", children: formatPercentage(yearTotals.total_revenue > 0
                                                        ? (yearTotals[col.key] / yearTotals.total_revenue) * 100
                                                        : 0) }))] }, col.key))), !showOnlyTotals && (_jsx("td", { className: "p-3 text-right", children: _jsx("span", { className: yearMetrics.operatingMargin >= 0 ? 'text-green-600 font-bold text-base' : 'text-red-600 font-bold text-base', children: formatPercentage(yearMetrics.operatingMargin) }) }))] }) })] }) }) })] }));
};
