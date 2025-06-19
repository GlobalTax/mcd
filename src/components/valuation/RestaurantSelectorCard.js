import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
const RestaurantSelectorCard = ({ restaurants, selectedRestaurantId, onRestaurantChange, onRefresh }) => {
    return (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium mb-2", children: ["Seleccionar Restaurante (", restaurants.length, " disponibles)"] }), _jsxs(Select, { value: selectedRestaurantId, onValueChange: onRestaurantChange, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Selecciona un restaurante..." }) }), _jsx(SelectContent, { children: restaurants.map((restaurant) => (_jsx(SelectItem, { value: restaurant.id, children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium", children: restaurant.name }), _jsxs("span", { className: "text-sm text-gray-500", children: ["#", restaurant.site_number] })] }) }, restaurant.id))) })] })] }));
};
export default RestaurantSelectorCard;
