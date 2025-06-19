import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
export const BalanceSheetStatement = ({ restaurantId, year }) => {
    // Datos de ejemplo para el balance sheet
    const balanceSheetData = {
        assets: {
            current: [
                { item: 'Efectivo y equivalentes', amount: 45000 },
                { item: 'Cuentas por cobrar', amount: 15000 },
                { item: 'Inventario', amount: 25000 },
                { item: 'Gastos pagados por adelantado', amount: 8000 }
            ],
            nonCurrent: [
                { item: 'Equipo y maquinaria', amount: 180000 },
                { item: 'Mobiliario', amount: 35000 },
                { item: 'Mejoras en local arrendado', amount: 65000 },
                { item: 'Depreciación acumulada', amount: -45000 }
            ]
        },
        liabilities: {
            current: [
                { item: 'Cuentas por pagar', amount: 18000 },
                { item: 'Salarios por pagar', amount: 12000 },
                { item: 'Impuestos por pagar', amount: 8500 },
                { item: 'Préstamo corto plazo', amount: 15000 }
            ],
            nonCurrent: [
                { item: 'Préstamo a largo plazo', amount: 120000 },
                { item: 'Depósitos de clientes', amount: 5000 }
            ]
        }
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.abs(amount));
    };
    const totalCurrentAssets = balanceSheetData.assets.current.reduce((sum, item) => sum + item.amount, 0);
    const totalNonCurrentAssets = balanceSheetData.assets.nonCurrent.reduce((sum, item) => sum + item.amount, 0);
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
    const totalCurrentLiabilities = balanceSheetData.liabilities.current.reduce((sum, item) => sum + item.amount, 0);
    const totalNonCurrentLiabilities = balanceSheetData.liabilities.nonCurrent.reduce((sum, item) => sum + item.amount, 0);
    const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
    const equity = totalAssets - totalLiabilities;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Balance Sheet" }), _jsxs("p", { className: "text-gray-600", children: ["Estado de situaci\u00F3n financiera - A\u00F1o ", year] })] }), _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Agregar Datos"] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold text-green-700", children: "ACTIVOS" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-3", children: "Activos Corrientes" }), _jsxs("div", { className: "space-y-2", children: [balanceSheetData.assets.current.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center py-1", children: [_jsx("span", { className: "text-gray-700", children: item.item }), _jsx("span", { className: "font-medium", children: formatCurrency(item.amount) })] }, index))), _jsxs("div", { className: "border-t pt-2 flex justify-between items-center font-semibold", children: [_jsx("span", { children: "Total Activos Corrientes" }), _jsx("span", { children: formatCurrency(totalCurrentAssets) })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-3", children: "Activos No Corrientes" }), _jsxs("div", { className: "space-y-2", children: [balanceSheetData.assets.nonCurrent.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center py-1", children: [_jsx("span", { className: "text-gray-700", children: item.item }), _jsxs("span", { className: `font-medium ${item.amount < 0 ? 'text-red-600' : ''}`, children: [item.amount < 0 ? '-' : '', formatCurrency(item.amount)] })] }, index))), _jsxs("div", { className: "border-t pt-2 flex justify-between items-center font-semibold", children: [_jsx("span", { children: "Total Activos No Corrientes" }), _jsx("span", { children: formatCurrency(totalNonCurrentAssets) })] })] })] }), _jsxs("div", { className: "border-t-2 pt-3 flex justify-between items-center font-bold text-lg text-green-700", children: [_jsx("span", { children: "TOTAL ACTIVOS" }), _jsx("span", { children: formatCurrency(totalAssets) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold text-red-700", children: "PASIVOS Y PATRIMONIO" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-3", children: "Pasivos Corrientes" }), _jsxs("div", { className: "space-y-2", children: [balanceSheetData.liabilities.current.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center py-1", children: [_jsx("span", { className: "text-gray-700", children: item.item }), _jsx("span", { className: "font-medium", children: formatCurrency(item.amount) })] }, index))), _jsxs("div", { className: "border-t pt-2 flex justify-between items-center font-semibold", children: [_jsx("span", { children: "Total Pasivos Corrientes" }), _jsx("span", { children: formatCurrency(totalCurrentLiabilities) })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-3", children: "Pasivos No Corrientes" }), _jsxs("div", { className: "space-y-2", children: [balanceSheetData.liabilities.nonCurrent.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center py-1", children: [_jsx("span", { className: "text-gray-700", children: item.item }), _jsx("span", { className: "font-medium", children: formatCurrency(item.amount) })] }, index))), _jsxs("div", { className: "border-t pt-2 flex justify-between items-center font-semibold", children: [_jsx("span", { children: "Total Pasivos No Corrientes" }), _jsx("span", { children: formatCurrency(totalNonCurrentLiabilities) })] })] })] }), _jsxs("div", { className: "border-t pt-2 flex justify-between items-center font-semibold", children: [_jsx("span", { children: "TOTAL PASIVOS" }), _jsx("span", { children: formatCurrency(totalLiabilities) })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-3", children: "Patrimonio" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center py-1", children: [_jsx("span", { className: "text-gray-700", children: "Capital inicial" }), _jsx("span", { className: "font-medium", children: formatCurrency(150000) })] }), _jsxs("div", { className: "flex justify-between items-center py-1", children: [_jsx("span", { className: "text-gray-700", children: "Utilidades retenidas" }), _jsx("span", { className: "font-medium", children: formatCurrency(equity - 150000) })] }), _jsxs("div", { className: "border-t pt-2 flex justify-between items-center font-semibold", children: [_jsx("span", { children: "TOTAL PATRIMONIO" }), _jsx("span", { children: formatCurrency(equity) })] })] })] }), _jsxs("div", { className: "border-t-2 pt-3 flex justify-between items-center font-bold text-lg text-red-700", children: [_jsx("span", { children: "TOTAL PASIVOS Y PATRIMONIO" }), _jsx("span", { children: formatCurrency(totalLiabilities + equity) })] })] })] })] })] }));
};
