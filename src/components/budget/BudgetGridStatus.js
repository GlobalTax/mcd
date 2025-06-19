import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export const BudgetGridStatus = ({ loading, error, onReload }) => {
    if (loading) {
        return (_jsx(Card, { className: "w-full", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Cargando presupuesto..." })] }) }));
    }
    if (error) {
        return (_jsx(Card, { className: "w-full", children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsxs("div", { className: "text-red-500 mb-4", children: [_jsx("p", { className: "font-semibold", children: "Error al cargar los datos" }), _jsx("p", { className: "text-sm", children: error })] }), _jsx(Button, { onClick: onReload, variant: "outline", children: "Reintentar" })] }) }));
    }
    return null;
};
