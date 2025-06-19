import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ValuationStatusCard = ({ selectedRestaurantId, selectedRestaurantName, currentValuationId }) => {
    if (!selectedRestaurantId)
        return null;
    return (_jsxs("div", { className: "p-3 bg-blue-50 rounded-lg", children: [_jsx("p", { className: "text-blue-800 font-medium", children: "Restaurante Seleccionado:" }), _jsx("p", { className: "text-blue-700", children: selectedRestaurantName }), currentValuationId && (_jsxs("p", { className: "text-sm text-blue-600 mt-1", children: ["Valoraci\u00F3n cargada (ID: ", currentValuationId.slice(0, 8), "...)"] }))] }));
};
export default ValuationStatusCard;
