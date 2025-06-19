import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
export const CashFlowStatement = ({ restaurantId, year }) => {
    // Datos de ejemplo para el cash flow statement
    const cashFlowData = {
        operating: [
            { item: 'Beneficio neto', amount: 85000 },
            { item: 'Depreciación', amount: 15000 },
            { item: 'Cambios en cuentas por cobrar', amount: -5000 },
            { item: 'Cambios en inventario', amount: -3000 },
            { item: 'Cambios en cuentas por pagar', amount: 8000 }
        ],
        investing: [
            { item: 'Compra de equipos', amount: -25000 },
            { item: 'Mejoras en local', amount: -15000 },
            { item: 'Venta de activos', amount: 5000 }
        ],
        financing: [
            { item: 'Préstamo bancario', amount: 30000 },
            { item: 'Pago de préstamo', amount: -20000 },
            { item: 'Retiros de capital', amount: -25000 }
        ]
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.abs(amount));
    };
    const operatingCashFlow = cashFlowData.operating.reduce((sum, item) => sum + item.amount, 0);
    const investingCashFlow = cashFlowData.investing.reduce((sum, item) => sum + item.amount, 0);
    const financingCashFlow = cashFlowData.financing.reduce((sum, item) => sum + item.amount, 0);
    const netCashFlow = operatingCashFlow + investingCashFlow + financingCashFlow;
    const getIcon = (flow) => {
        if (flow > 0)
            return _jsx(TrendingUp, { className: "w-4 h-4 text-green-600" });
        if (flow < 0)
            return _jsx(TrendingDown, { className: "w-4 h-4 text-red-600" });
        return _jsx(Minus, { className: "w-4 h-4 text-gray-400" });
    };
    const getFlowColor = (flow) => {
        if (flow > 0)
            return 'text-green-600';
        if (flow < 0)
            return 'text-red-600';
        return 'text-gray-600';
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Cash Flow Statement" }), _jsxs("p", { className: "text-gray-600", children: ["Estado de flujos de efectivo - A\u00F1o ", year] })] }), _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Agregar Datos"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Flujo Operacional" }), getIcon(operatingCashFlow)] }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${getFlowColor(operatingCashFlow)}`, children: [operatingCashFlow < 0 ? '-' : '', formatCurrency(operatingCashFlow)] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Actividades operativas" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Flujo de Inversi\u00F3n" }), getIcon(investingCashFlow)] }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${getFlowColor(investingCashFlow)}`, children: [investingCashFlow < 0 ? '-' : '', formatCurrency(investingCashFlow)] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Actividades de inversi\u00F3n" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Flujo de Financiaci\u00F3n" }), getIcon(financingCashFlow)] }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${getFlowColor(financingCashFlow)}`, children: [financingCashFlow < 0 ? '-' : '', formatCurrency(financingCashFlow)] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Actividades financieras" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Flujo Neto" }), getIcon(netCashFlow)] }), _jsxs(CardContent, { children: [_jsxs("div", { className: `text-2xl font-bold ${getFlowColor(netCashFlow)}`, children: [netCashFlow < 0 ? '-' : '', formatCurrency(netCashFlow)] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Cambio neto en efectivo" })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Estado de Flujos de Efectivo Detallado" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-blue-700 mb-4", children: "Actividades Operacionales" }), _jsxs("div", { className: "space-y-2", children: [cashFlowData.operating.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-gray-700", children: item.item }), _jsxs("span", { className: `font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`, children: [item.amount < 0 ? '-' : '', formatCurrency(item.amount)] })] }, index))), _jsxs("div", { className: "flex justify-between items-center pt-3 font-semibold text-blue-700 border-t-2", children: [_jsx("span", { children: "Flujo neto de actividades operacionales" }), _jsxs("span", { className: operatingCashFlow < 0 ? 'text-red-600' : 'text-green-600', children: [operatingCashFlow < 0 ? '-' : '', formatCurrency(operatingCashFlow)] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-purple-700 mb-4", children: "Actividades de Inversi\u00F3n" }), _jsxs("div", { className: "space-y-2", children: [cashFlowData.investing.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-gray-700", children: item.item }), _jsxs("span", { className: `font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`, children: [item.amount < 0 ? '-' : '', formatCurrency(item.amount)] })] }, index))), _jsxs("div", { className: "flex justify-between items-center pt-3 font-semibold text-purple-700 border-t-2", children: [_jsx("span", { children: "Flujo neto de actividades de inversi\u00F3n" }), _jsxs("span", { className: investingCashFlow < 0 ? 'text-red-600' : 'text-green-600', children: [investingCashFlow < 0 ? '-' : '', formatCurrency(investingCashFlow)] })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-orange-700 mb-4", children: "Actividades de Financiaci\u00F3n" }), _jsxs("div", { className: "space-y-2", children: [cashFlowData.financing.map((item, index) => (_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-100", children: [_jsx("span", { className: "text-gray-700", children: item.item }), _jsxs("span", { className: `font-medium ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`, children: [item.amount < 0 ? '-' : '', formatCurrency(item.amount)] })] }, index))), _jsxs("div", { className: "flex justify-between items-center pt-3 font-semibold text-orange-700 border-t-2", children: [_jsx("span", { children: "Flujo neto de actividades de financiaci\u00F3n" }), _jsxs("span", { className: financingCashFlow < 0 ? 'text-red-600' : 'text-green-600', children: [financingCashFlow < 0 ? '-' : '', formatCurrency(financingCashFlow)] })] })] })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsxs("div", { className: "flex justify-between items-center font-bold text-lg", children: [_jsx("span", { children: "Cambio neto en efectivo y equivalentes" }), _jsxs("span", { className: netCashFlow < 0 ? 'text-red-600' : 'text-green-600', children: [netCashFlow < 0 ? '-' : '', formatCurrency(netCashFlow)] })] }), _jsxs("div", { className: "mt-2 text-sm text-gray-600", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Efectivo al inicio del per\u00EDodo" }), _jsx("span", { children: formatCurrency(25000) })] }), _jsxs("div", { className: "flex justify-between font-semibold", children: [_jsx("span", { children: "Efectivo al final del per\u00EDodo" }), _jsx("span", { children: formatCurrency(25000 + netCashFlow) })] })] })] })] }) })] })] }));
};
