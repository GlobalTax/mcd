import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building } from 'lucide-react';
export const BasicInfoSection = ({ formData, restaurants, onInputChange }) => {
    console.log('BasicInfoSection - restaurants data:', restaurants);
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-5 h-5" }), "Informaci\u00F3n B\u00E1sica"] }) }), _jsxs(CardContent, { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "budget_name", children: "Nombre del Presupuesto" }), _jsx(Input, { id: "budget_name", value: formData.budget_name, onChange: (e) => onInputChange('budget_name', e.target.value), placeholder: "Ej: Presupuesto 2024 - Restaurante Centro", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "budget_year", children: "A\u00F1o del Presupuesto" }), _jsx(Input, { id: "budget_year", type: "number", value: formData.budget_year, onChange: (e) => onInputChange('budget_year', parseInt(e.target.value)), required: true })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { htmlFor: "restaurant", children: "Restaurante - Empresa" }), _jsxs(Select, { value: formData.franchisee_restaurant_id, onValueChange: (value) => onInputChange('franchisee_restaurant_id', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar restaurante y empresa" }) }), _jsx(SelectContent, { children: restaurants.map((restaurant) => {
                                            const restaurantName = restaurant.base_restaurant?.restaurant_name || 'Sin nombre';
                                            const siteNumber = restaurant.base_restaurant?.site_number || 'Sin número';
                                            const franchiseeName = restaurant.base_restaurant?.franchisee_name || 'Sin empresa';
                                            const displayText = `${restaurantName} - #${siteNumber} (${franchiseeName})`;
                                            console.log(`Restaurant ${restaurant.id}: ${displayText}`);
                                            return (_jsx(SelectItem, { value: restaurant.id, children: displayText }, restaurant.id));
                                        }) })] })] })] })] }));
};
