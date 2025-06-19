import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';
const RestaurantSelector = ({ restaurants, selectedRestaurant, onRestaurantChange, loading = false }) => {
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "w-5 h-5" }), "Seleccionar Restaurante para Valorar"] }) }), _jsxs(CardContent, { children: [_jsxs(Select, { value: selectedRestaurant?.id || '', onValueChange: (value) => {
                            const restaurant = restaurants.find(r => r.id === value);
                            if (restaurant) {
                                onRestaurantChange(restaurant);
                            }
                        }, disabled: loading, children: [_jsx(SelectTrigger, { className: "w-full", children: _jsx(SelectValue, { placeholder: "Selecciona un restaurante para valorar..." }) }), _jsx(SelectContent, { children: loading ? (_jsx(SelectItem, { value: "", disabled: true, children: "Cargando restaurantes..." })) : restaurants.length === 0 ? (_jsx(SelectItem, { value: "", disabled: true, children: "No hay restaurantes disponibles" })) : (restaurants.map((restaurant) => (_jsx(SelectItem, { value: restaurant.id, children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-medium", children: restaurant.name }), _jsxs("span", { className: "text-sm text-gray-500", children: ["#", restaurant.site_number] })] }) }, restaurant.id)))) })] }), selectedRestaurant && (_jsxs("div", { className: "mt-4 p-3 bg-green-50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-green-800", children: "Restaurante Seleccionado:" }), _jsx("p", { className: "text-green-700", children: selectedRestaurant.name }), _jsxs("p", { className: "text-sm text-green-600", children: ["N\u00FAmero de sitio: #", selectedRestaurant.site_number] })] }))] })] }));
};
export default RestaurantSelector;
