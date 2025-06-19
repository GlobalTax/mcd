import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
export const BudgetComparison = ({ budgetData, actualData, year }) => {
    const months = [
        { key: 'jan', label: 'Ene' },
        { key: 'feb', label: 'Feb' },
        { key: 'mar', label: 'Mar' },
        { key: 'apr', label: 'Abr' },
        { key: 'may', label: 'May' },
        { key: 'jun', label: 'Jun' },
        { key: 'jul', label: 'Jul' },
        { key: 'aug', label: 'Ago' },
        { key: 'sep', label: 'Sep' },
        { key: 'oct', label: 'Oct' },
        { key: 'nov', label: 'Nov' },
        { key: 'dec', label: 'Dic' }
    ];
    const formatCurrency = (value) => {
        return `€${value.toLocaleString()}`;
    };
    const getVariance = (actual, budget) => {
        return actual - budget;
    };
    const getVariancePercentage = (actual, budget) => {
        if (budget === 0)
            return 0;
        return ((actual - budget) / budget) * 100;
    };
    const getVarianceIcon = (variance) => {
        if (variance > 0)
            return _jsx(TrendingUp, { className: "w-4 h-4 text-green-600" });
        if (variance < 0)
            return _jsx(TrendingDown, { className: "w-4 h-4 text-red-600" });
        return _jsx(Minus, { className: "w-4 h-4 text-gray-400" });
    };
    const getVarianceBadge = (variance, percentage) => {
        const absPercentage = Math.abs(percentage);
        if (absPercentage < 5) {
            return _jsxs(Badge, { variant: "secondary", children: ["\u00B1", absPercentage.toFixed(1), "%"] });
        }
        else if (variance > 0) {
            return _jsxs(Badge, { variant: "default", className: "bg-green-100 text-green-800", children: ["+", absPercentage.toFixed(1), "%"] });
        }
        else {
            return _jsxs(Badge, { variant: "destructive", children: ["-", absPercentage.toFixed(1), "%"] });
        }
    };
    const getActualValue = (category, subcategory, month) => {
        const actualItem = actualData.find(item => item.category === category && item.subcategory === subcategory);
        return actualItem ? actualItem[month] : 0;
    };
    const getBudgetValue = (category, subcategory, month) => {
        const budgetItem = budgetData.find(item => item.category === category && item.subcategory === subcategory && !item.isCategory);
        return budgetItem ? budgetItem[month] : 0;
    };
    const getUniqueItems = () => {
        const items = new Set();
        budgetData.filter(item => !item.isCategory).forEach(item => {
            items.add(`${item.category}|${item.subcategory}`);
        });
        actualData.forEach(item => {
            items.add(`${item.category}|${item.subcategory}`);
        });
        return Array.from(items).map(item => {
            const [category, subcategory] = item.split('|');
            return { category, subcategory };
        });
    };
    const uniqueItems = getUniqueItems();
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { children: ["Comparativo Presupuesto vs Real ", year] }), _jsx("p", { className: "text-sm text-gray-600", children: "An\u00E1lisis de variaciones entre datos presupuestados y reales" })] }), _jsx(CardContent, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "sticky left-0 bg-white z-10 min-w-[200px]", children: "Concepto" }), months.map(month => (_jsx(TableHead, { className: "text-center min-w-[150px]", children: month.label }, month.key))), _jsx(TableHead, { className: "text-center min-w-[150px] bg-blue-50 font-bold", children: "Total Anual" })] }) }), _jsx(TableBody, { children: uniqueItems.map((item, index) => {
                                    const key = `${item.category}-${item.subcategory}`;
                                    return (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "sticky left-0 bg-white z-10 font-medium", children: _jsxs("div", { className: "text-gray-700", children: [_jsx("div", { className: "font-medium", children: item.category }), _jsx("div", { className: "text-sm text-gray-500", children: item.subcategory })] }) }), months.map(month => {
                                                const actualValue = getActualValue(item.category, item.subcategory || '', month.key);
                                                const budgetValue = getBudgetValue(item.category, item.subcategory || '', month.key);
                                                const variance = getVariance(actualValue, budgetValue);
                                                const variancePercentage = getVariancePercentage(actualValue, budgetValue);
                                                return (_jsx(TableCell, { className: "text-center", children: _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Real: ", formatCurrency(actualValue)] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Ppto: ", formatCurrency(budgetValue)] }), _jsxs("div", { className: "flex items-center justify-center gap-1", children: [getVarianceIcon(variance), getVarianceBadge(variance, variancePercentage)] })] }) }, month.key));
                                            }), _jsx(TableCell, { className: "text-center bg-blue-50", children: (() => {
                                                    const actualTotal = months.reduce((sum, month) => sum + getActualValue(item.category, item.subcategory || '', month.key), 0);
                                                    const budgetTotal = months.reduce((sum, month) => sum + getBudgetValue(item.category, item.subcategory || '', month.key), 0);
                                                    const totalVariance = getVariance(actualTotal, budgetTotal);
                                                    const totalVariancePercentage = getVariancePercentage(actualTotal, budgetTotal);
                                                    return (_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "text-xs text-gray-500", children: ["Real: ", formatCurrency(actualTotal)] }), _jsxs("div", { className: "text-xs text-gray-500", children: ["Ppto: ", formatCurrency(budgetTotal)] }), _jsxs("div", { className: "flex items-center justify-center gap-1", children: [getVarianceIcon(totalVariance), getVarianceBadge(totalVariance, totalVariancePercentage)] })] }));
                                                })() })] }, key));
                                }) })] }) }) })] }));
};
