import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const months = [
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
export const formatCurrency = (value) => {
    return `€${value.toLocaleString('es-ES')}`;
};
export const getCellValue = (row, field) => {
    return row[field];
};
export const getActualValue = (row, field, actualData) => {
    const actualRow = actualData.find(actual => actual.category === row.category && actual.subcategory === row.subcategory);
    return actualRow ? (actualRow[field] || 0) : 0;
};
export const calculateCategoryTotals = (data, categoryName, field) => {
    return data
        .filter(row => row.category === categoryName && !row.isCategory)
        .reduce((sum, row) => sum + (getCellValue(row, field) || 0), 0);
};
export const calculateCategoryActualTotals = (data, actualData, categoryName, field) => {
    return data
        .filter(row => row.category === categoryName && !row.isCategory)
        .reduce((sum, row) => sum + (getActualValue(row, field, actualData) || 0), 0);
};
export const getVarianceColor = (budget, actual) => {
    if (budget === 0 && actual === 0)
        return '';
    const variance = ((actual - budget) / Math.abs(budget)) * 100;
    if (Math.abs(variance) < 5)
        return 'text-gray-600';
    return variance > 0 ? 'text-green-600' : 'text-red-600';
};
export const getVariancePercentage = (budget, actual) => {
    if (budget === 0)
        return actual === 0 ? '0%' : '∞%';
    const variance = ((actual - budget) / Math.abs(budget)) * 100;
    return `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
};
export const getHeaderLabels = (viewMode) => {
    switch (viewMode) {
        case 'comparison':
            return {
                monthSubheaders: (_jsxs("div", { className: "grid grid-cols-3 gap-1 text-xs", children: [_jsx("div", { className: "text-blue-700 font-semibold bg-blue-50 py-1 px-1 rounded", children: "Presup." }), _jsx("div", { className: "text-green-700 font-semibold bg-green-50 py-1 px-1 rounded", children: "Real" }), _jsx("div", { className: "text-orange-700 font-semibold bg-orange-50 py-1 px-1 rounded", children: "Var." })] })),
                totalSubheaders: (_jsxs("div", { className: "grid grid-cols-3 gap-1 text-xs", children: [_jsx("div", { className: "text-blue-700 font-semibold", children: "Presup." }), _jsx("div", { className: "text-green-700 font-semibold", children: "Real" }), _jsx("div", { className: "text-orange-700 font-semibold", children: "Var." })] }))
            };
        case 'actuals':
            return {
                monthSubheaders: (_jsx("div", { className: "text-green-700 font-semibold bg-green-50 py-1 px-2 rounded text-sm", children: "Reales" })),
                totalSubheaders: (_jsx("div", { className: "text-green-700 font-semibold text-sm", children: "Reales" }))
            };
        default:
            return {
                monthSubheaders: (_jsx("div", { className: "text-blue-700 font-semibold bg-blue-50 py-1 px-2 rounded text-sm", children: "Presupuesto" })),
                totalSubheaders: (_jsx("div", { className: "text-blue-700 font-semibold text-sm", children: "Presupuesto" }))
            };
    }
};
