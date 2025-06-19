import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Calendar, TrendingUp, DollarSign } from 'lucide-react';
export const BudgetList = ({ budgets, onSelectBudget, onDeleteBudget }) => {
    const handleDelete = async (e, budgetId) => {
        e.stopPropagation();
        if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
            await onDeleteBudget(budgetId);
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
    if (budgets.length === 0) {
        return (_jsxs("div", { className: "p-8 text-center", children: [_jsx(TrendingUp, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No hay presupuestos de valoraci\u00F3n" }), _jsx("p", { className: "text-gray-500 mb-6", children: "Comienza creando tu primer presupuesto para proyectar las finanzas de tus restaurantes." })] }));
    }
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Presupuestos de Valoraci\u00F3n" }), _jsx("p", { className: "text-gray-600", children: "Gestiona y revisa las proyecciones financieras de tus restaurantes" })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: budgets.map((budget) => (_jsxs(Card, { className: "hover:shadow-lg transition-shadow cursor-pointer", onClick: () => onSelectBudget(budget), children: [_jsx(CardHeader, { children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { className: "flex-1", children: [_jsx(CardTitle, { className: "text-lg mb-2", children: budget.budget_name }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), _jsx("span", { children: budget.budget_year })] }), _jsx(Badge, { variant: "outline", className: getStatusColor(budget.status), children: getStatusText(budget.status) })] })] }) }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-green-50 p-3 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(DollarSign, { className: "w-4 h-4 text-green-600" }), _jsx("span", { className: "text-sm font-medium text-green-700", children: "Valoraci\u00F3n Final" })] }), _jsxs("p", { className: "text-lg font-bold text-green-600", children: ["\u20AC", (budget.final_valuation || 0).toLocaleString('es-ES', {
                                                            maximumFractionDigits: 0
                                                        })] })] }), _jsxs("div", { className: "bg-blue-50 p-3 rounded-lg", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(TrendingUp, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "text-sm font-medium text-blue-700", children: "Ventas Iniciales" })] }), _jsxs("p", { className: "text-lg font-bold text-blue-600", children: ["\u20AC", budget.initial_sales.toLocaleString('es-ES', {
                                                            maximumFractionDigits: 0
                                                        })] })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-3 text-sm", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-500", children: "Crecimiento" }), _jsxs("p", { className: "font-semibold text-green-600", children: [budget.sales_growth_rate, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-500", children: "Descuento" }), _jsxs("p", { className: "font-semibold text-purple-600", children: [budget.discount_rate, "%"] })] }), _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-gray-500", children: "Proyecci\u00F3n" }), _jsxs("p", { className: "font-semibold text-blue-600", children: [budget.years_projection, " a\u00F1os"] })] })] }), _jsxs("div", { className: "text-xs text-gray-500 pt-2 border-t", children: ["Creado: ", new Date(budget.created_at).toLocaleDateString('es-ES')] }), _jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                                e.stopPropagation();
                                                onSelectBudget(budget);
                                            }, children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "destructive", onClick: (e) => handleDelete(e, budget.id), children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] }, budget.id))) })] }));
};
