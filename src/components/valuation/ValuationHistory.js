import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/valuationUtils';
import { Calendar, DollarSign, Trash2, Copy } from 'lucide-react';
const ValuationHistory = ({ valuations, selectedRestaurantId, onLoadValuation, onDeleteValuation, onDuplicateValuation }) => {
    const filteredValuations = selectedRestaurantId
        ? valuations.filter(v => v.restaurant_id === selectedRestaurantId)
        : [];
    if (!selectedRestaurantId) {
        return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Historial de Valoraciones" }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-500", children: "Selecciona un restaurante para ver su historial de valoraciones." }) })] }));
    }
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Historial de Valoraciones" }) }), _jsx(CardContent, { children: filteredValuations.length === 0 ? (_jsx("p", { className: "text-gray-500", children: "No hay valoraciones guardadas para este restaurante." })) : (_jsx("div", { className: "space-y-3", children: filteredValuations.map((valuation) => (_jsxs("div", { className: "border rounded-lg p-4 hover:bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: valuation.valuation_name }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(Calendar, { className: "w-4 h-4" }), new Date(valuation.valuation_date).toLocaleDateString('es-ES')] })] }), _jsx("div", { className: "flex items-center gap-2", children: _jsxs(Badge, { variant: "secondary", children: [_jsx(DollarSign, { className: "w-3 h-3 mr-1" }), valuation.total_present_value ? formatCurrency(valuation.total_present_value) : 'Sin calcular'] }) })] }), _jsxs("div", { className: "flex gap-2 mt-3", children: [_jsx(Button, { size: "sm", onClick: () => onLoadValuation(valuation), className: "flex-1", children: "Cargar Valoraci\u00F3n" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => onDuplicateValuation(valuation), children: _jsx(Copy, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "destructive", onClick: () => onDeleteValuation(valuation.id), children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, valuation.id))) })) })] }));
};
export default ValuationHistory;
