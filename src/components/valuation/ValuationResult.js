import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/valuationUtils';
const ValuationResult = ({ totalPrice, remainingYears }) => {
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-lg font-semibold text-green-700", children: "Precio Final" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-4xl font-bold text-green-600", children: formatCurrency(totalPrice) }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Valor Presente Total" }), _jsxs("p", { className: "text-xs text-gray-500 mt-1", children: ["(", remainingYears.toFixed(4), " a\u00F1os exactos)"] })] }) })] }));
};
export default ValuationResult;
