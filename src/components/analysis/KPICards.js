import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfitLossCalculations } from '@/hooks/useProfitLossData';
export const KPICards = () => {
    const { formatCurrency, formatPercentage } = useProfitLossCalculations();
    const kpiData = [
        { metric: 'EBITDA', value: 315000, percentage: 23.1, trend: '+5.2%', color: 'text-green-600' },
        { metric: 'ROI', value: 24.8, percentage: 0, trend: '-1.2%', color: 'text-red-600' },
        { metric: 'Margen Neto', value: 18.5, percentage: 0, trend: '+2.1%', color: 'text-green-600' },
        { metric: 'Cash Flow', value: 285000, percentage: 20.9, trend: '+8.7%', color: 'text-green-600' }
    ];
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: kpiData.map((kpi, index) => (_jsxs(Card, { children: [_jsx(CardHeader, { className: "pb-2", children: _jsx(CardTitle, { className: "text-sm font-medium text-gray-600", children: kpi.metric }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: kpi.metric.includes('Margen') || kpi.metric === 'ROI'
                                ? formatPercentage(kpi.value)
                                : formatCurrency(kpi.value) }), _jsxs("p", { className: `text-xs ${kpi.color}`, children: [kpi.trend, " vs a\u00F1o anterior"] })] })] }, index))) }));
};
