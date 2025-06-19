import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Download, Calculator } from 'lucide-react';
export const BudgetDetail = ({ budget, onUpdate, onDelete, onBack }) => {
    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
            const success = await onDelete(budget.id);
            if (success) {
                onBack();
            }
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'draft':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'archived':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'draft':
                return 'Borrador';
            case 'approved':
                return 'Aprobado';
            case 'archived':
                return 'Archivado';
            default:
                return 'Desconocido';
        }
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "mb-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: budget.budget_name }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Badge, { variant: "outline", className: getStatusColor(budget.status), children: getStatusText(budget.status) }), _jsxs("span", { className: "text-gray-600", children: ["A\u00F1o: ", budget.budget_year] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Edit, { className: "w-4 h-4 mr-2" }), "Editar"] }), _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Download, { className: "w-4 h-4 mr-2" }), "Exportar"] }), _jsxs(Button, { variant: "destructive", size: "sm", onClick: handleDelete, children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "Eliminar"] })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Calculator, { className: "w-5 h-5" }), "Resumen Financiero"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-green-700", children: "Valoraci\u00F3n Final" }), _jsxs("p", { className: "text-2xl font-bold text-green-600", children: ["\u20AC", (budget.final_valuation || 0).toLocaleString('es-ES', {
                                                                maximumFractionDigits: 0
                                                            })] })] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-blue-700", children: "Ventas Iniciales" }), _jsxs("p", { className: "text-2xl font-bold text-blue-600", children: ["\u20AC", budget.initial_sales.toLocaleString('es-ES', {
                                                                maximumFractionDigits: 0
                                                            })] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3 pt-4 border-t", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Crecimiento" }), _jsxs("p", { className: "font-semibold text-green-600", children: [budget.sales_growth_rate, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Descuento" }), _jsxs("p", { className: "font-semibold text-purple-600", children: [budget.discount_rate, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Proyecci\u00F3n" }), _jsxs("p", { className: "font-semibold text-blue-600", children: [budget.years_projection, " a\u00F1os"] })] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Par\u00E1metros de Valoraci\u00F3n" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Tasa de Inflaci\u00F3n:" }), _jsxs("span", { className: "font-medium", children: [budget.inflation_rate, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "PAC:" }), _jsxs("span", { className: "font-medium", children: [budget.pac_percentage, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Alquiler:" }), _jsxs("span", { className: "font-medium", children: [budget.rent_percentage, "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Tarifas de Servicio:" }), _jsxs("span", { className: "font-medium", children: [budget.service_fees_percentage, "%"] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Costos Fijos Anuales" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Depreciaci\u00F3n:" }), _jsxs("span", { className: "font-medium", children: ["\u20AC", budget.depreciation.toLocaleString('es-ES')] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Intereses:" }), _jsxs("span", { className: "font-medium", children: ["\u20AC", budget.interest.toLocaleString('es-ES')] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Pago de Pr\u00E9stamo:" }), _jsxs("span", { className: "font-medium", children: ["\u20AC", budget.loan_payment.toLocaleString('es-ES')] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "\u00CDndice de Alquiler:" }), _jsxs("span", { className: "font-medium", children: ["\u20AC", budget.rent_index.toLocaleString('es-ES')] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Miscel\u00E1neos:" }), _jsxs("span", { className: "font-medium", children: ["\u20AC", budget.miscellaneous.toLocaleString('es-ES')] })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Informaci\u00F3n Adicional" }) }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Fecha de Creaci\u00F3n:" }), _jsx("p", { className: "font-medium", children: new Date(budget.created_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "\u00DAltima Actualizaci\u00F3n:" }), _jsx("p", { className: "font-medium", children: new Date(budget.updated_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) })] }), budget.notes && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500 mb-2", children: "Notas:" }), _jsx("p", { className: "text-sm bg-gray-50 p-3 rounded-lg", children: budget.notes })] }))] })] })] })] }));
};
