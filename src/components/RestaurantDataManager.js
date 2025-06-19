import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog';
import { Plus, Edit, MapPin, Euro, Building2, Hash, Calendar, Shield, TrendingUp, Trash2 } from 'lucide-react';
export function RestaurantDataManager({ franchisees, onUpdateFranchisees, onSelectRestaurant }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        contractEndDate: '',
        siteNumber: '',
        lastYearRevenue: 0,
        baseRent: 0,
        rentIndex: 0,
        franchiseeId: '',
        franchiseEndDate: '',
        leaseEndDate: '',
        isOwnedByMcD: false
    });
    // Get all restaurants from all franchisees
    const allRestaurants = franchisees.flatMap(f => f.restaurants.map(r => ({ ...r, franchiseeName: f.name })));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.location || !formData.franchiseeId || !formData.franchiseEndDate)
            return;
        const restaurantData = {
            ...formData,
            id: editingRestaurant?.id || Date.now().toString(),
            valuationHistory: editingRestaurant?.valuationHistory || [],
            currentValuation: editingRestaurant?.currentValuation,
            createdAt: editingRestaurant?.createdAt || new Date(),
            // Don't include leaseEndDate if it's owned by McD
            leaseEndDate: formData.isOwnedByMcD ? undefined : formData.leaseEndDate
        };
        const updatedFranchisees = franchisees.map(f => {
            if (f.id === formData.franchiseeId) {
                if (editingRestaurant) {
                    // Update existing restaurant
                    return {
                        ...f,
                        restaurants: f.restaurants.map(r => r.id === editingRestaurant.id ? restaurantData : r)
                    };
                }
                else {
                    // Add new restaurant
                    return {
                        ...f,
                        restaurants: [...f.restaurants, restaurantData]
                    };
                }
            }
            return f;
        });
        onUpdateFranchisees(updatedFranchisees);
        resetForm();
    };
    const resetForm = () => {
        setFormData({
            name: '',
            location: '',
            contractEndDate: '',
            siteNumber: '',
            lastYearRevenue: 0,
            baseRent: 0,
            rentIndex: 0,
            franchiseeId: '',
            franchiseEndDate: '',
            leaseEndDate: '',
            isOwnedByMcD: false
        });
        setShowAddForm(false);
        setEditingRestaurant(null);
    };
    const handleEdit = (restaurant) => {
        setFormData({
            name: restaurant.name,
            location: restaurant.location,
            contractEndDate: restaurant.contractEndDate,
            siteNumber: restaurant.siteNumber,
            lastYearRevenue: restaurant.lastYearRevenue || 0,
            baseRent: restaurant.baseRent || 0,
            rentIndex: restaurant.rentIndex || 0,
            franchiseeId: restaurant.franchiseeId,
            franchiseEndDate: restaurant.franchiseEndDate || '',
            leaseEndDate: restaurant.leaseEndDate || '',
            isOwnedByMcD: restaurant.isOwnedByMcD || false
        });
        setEditingRestaurant(restaurant);
        setShowAddForm(true);
    };
    const handleValuationClick = (restaurant) => {
        if (onSelectRestaurant) {
            onSelectRestaurant(restaurant);
        }
    };
    const handleViewRestaurant = (restaurant) => {
        // Navigate to the restaurant's dedicated page
        window.open(`/restaurant/${restaurant.siteNumber}`, '_blank');
    };
    const handleNavigateToDemo = () => {
        window.open('/demo', '_blank');
    };
    const handleDeleteRestaurant = (restaurant) => {
        const updatedFranchisees = franchisees.map(f => ({
            ...f,
            restaurants: f.restaurants.filter(r => r.id !== restaurant.id)
        }));
        onUpdateFranchisees(updatedFranchisees);
    };
    const formatNumber = (value) => {
        if (value === undefined || value === null || isNaN(value)) {
            return '0';
        }
        return value.toLocaleString('es-ES');
    };
    return (_jsxs("div", { className: "p-8 font-manrope", children: [_jsxs("div", { className: "flex justify-between items-center mb-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2 font-manrope", children: "Panel Central de Restaurantes" }), _jsxs("p", { className: "text-gray-600 font-manrope", children: [allRestaurants.length, " restaurantes registrados en total"] })] }), _jsxs(Button, { onClick: () => setShowAddForm(!showAddForm), className: "bg-red-600 hover:bg-red-700 text-white font-medium px-6 font-manrope", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Nuevo Restaurante"] })] }), showAddForm && (_jsxs(Card, { className: "mb-8", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "font-manrope", children: editingRestaurant ? 'Editar Restaurante' : 'Agregar Nuevo Restaurante' }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 font-manrope", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "franchisee", className: "font-manrope", children: "Franquiciado *" }), _jsxs("select", { id: "franchisee", value: formData.franchiseeId, onChange: (e) => setFormData(prev => ({ ...prev, franchiseeId: e.target.value })), className: "w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-manrope", required: true, children: [_jsx("option", { value: "", children: "Seleccionar franquiciado" }), franchisees.map(f => (_jsx("option", { value: f.id, children: f.name }, f.id)))] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "siteNumber", className: "font-manrope", children: "N\u00FAmero de Site *" }), _jsx(Input, { id: "siteNumber", value: formData.siteNumber, onChange: (e) => setFormData(prev => ({ ...prev, siteNumber: e.target.value })), placeholder: "ej. MCB001", className: "font-manrope", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "restaurantName", className: "font-manrope", children: "Nombre del Restaurante *" }), _jsx(Input, { id: "restaurantName", value: formData.name, onChange: (e) => setFormData(prev => ({ ...prev, name: e.target.value })), placeholder: "ej. McDonald's Parc Central", className: "font-manrope", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "location", className: "font-manrope", children: "Ubicaci\u00F3n *" }), _jsx(Input, { id: "location", value: formData.location, onChange: (e) => setFormData(prev => ({ ...prev, location: e.target.value })), placeholder: "ej. Barcelona, Espa\u00F1a", className: "font-manrope", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "contractEnd", className: "font-manrope", children: "Fecha Fin de Contrato *" }), _jsx(Input, { id: "contractEnd", type: "date", value: formData.contractEndDate, onChange: (e) => setFormData(prev => ({ ...prev, contractEndDate: e.target.value })), className: "font-manrope", required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "franchiseEnd", className: "font-manrope", children: "Fecha Fin de Franquicia *" }), _jsx(Input, { id: "franchiseEnd", type: "date", value: formData.franchiseEndDate, onChange: (e) => setFormData(prev => ({ ...prev, franchiseEndDate: e.target.value })), className: "font-manrope", required: true })] }), _jsx("div", { children: _jsxs(Label, { htmlFor: "isOwnedByMcD", className: "flex items-center gap-2 font-manrope", children: [_jsx("input", { type: "checkbox", id: "isOwnedByMcD", checked: formData.isOwnedByMcD, onChange: (e) => setFormData(prev => ({ ...prev, isOwnedByMcD: e.target.checked })), className: "rounded" }), "Propiedad de McDonald's"] }) }), !formData.isOwnedByMcD && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "leaseEnd", className: "font-manrope", children: "Fecha Fin de Alquiler" }), _jsx(Input, { id: "leaseEnd", type: "date", value: formData.leaseEndDate, onChange: (e) => setFormData(prev => ({ ...prev, leaseEndDate: e.target.value })), className: "font-manrope" })] })), _jsxs("div", { children: [_jsx(Label, { htmlFor: "lastYearRevenue", className: "font-manrope", children: "Facturaci\u00F3n \u00DAltimo A\u00F1o (\u20AC)" }), _jsx(Input, { id: "lastYearRevenue", type: "number", value: formData.lastYearRevenue, onChange: (e) => setFormData(prev => ({ ...prev, lastYearRevenue: Number(e.target.value) })), placeholder: "2454919", className: "font-manrope" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "baseRent", className: "font-manrope", children: "Renta Base (\u20AC)" }), _jsx(Input, { id: "baseRent", type: "number", value: formData.baseRent, onChange: (e) => setFormData(prev => ({ ...prev, baseRent: Number(e.target.value) })), placeholder: "281579", className: "font-manrope" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "rentIndex", className: "font-manrope", children: "Rent Index (\u20AC)" }), _jsx(Input, { id: "rentIndex", type: "number", value: formData.rentIndex, onChange: (e) => setFormData(prev => ({ ...prev, rentIndex: Number(e.target.value) })), placeholder: "75925", className: "font-manrope" })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx(Button, { type: "submit", className: "bg-red-600 hover:bg-red-700 text-white font-manrope", children: editingRestaurant ? 'Actualizar' : 'Guardar' }), _jsx(Button, { type: "button", variant: "outline", onClick: resetForm, className: "font-manrope", children: "Cancelar" })] })] }) })] })), _jsx(Card, { children: _jsxs(CardContent, { className: "p-0", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[1200px] border-collapse font-manrope text-sm", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "border border-gray-300 p-4 text-left bg-gray-800 text-white font-semibold font-manrope min-w-[100px]", children: "Site #" }), _jsx("th", { className: "border border-gray-300 p-4 text-left bg-gray-800 text-white font-semibold font-manrope min-w-[180px]", children: "Restaurante" }), _jsx("th", { className: "border border-gray-300 p-4 text-left bg-gray-800 text-white font-semibold font-manrope min-w-[150px]", children: "Franquiciado" }), _jsx("th", { className: "border border-gray-300 p-4 text-left bg-gray-800 text-white font-semibold font-manrope min-w-[150px]", children: "Ubicaci\u00F3n" }), _jsx("th", { className: "border border-gray-300 p-4 text-left bg-gray-800 text-white font-semibold font-manrope min-w-[120px]", children: "Fin Franquicia" }), _jsx("th", { className: "border border-gray-300 p-4 text-left bg-gray-800 text-white font-semibold font-manrope min-w-[120px]", children: "Fin Alquiler" }), _jsx("th", { className: "border border-gray-300 p-4 text-left bg-gray-800 text-white font-semibold font-manrope min-w-[100px]", children: "Propiedad" }), _jsx("th", { className: "border border-gray-300 p-4 text-right bg-gray-800 text-white font-semibold font-manrope min-w-[120px]", children: "Facturaci\u00F3n" }), _jsx("th", { className: "border border-gray-300 p-4 text-right bg-gray-800 text-white font-semibold font-manrope min-w-[120px]", children: "Renta Base" }), _jsx("th", { className: "border border-gray-300 p-4 text-right bg-gray-800 text-white font-semibold font-manrope min-w-[100px]", children: "Rent Index" }), _jsx("th", { className: "border border-gray-300 p-4 text-center bg-gray-800 text-white font-semibold font-manrope min-w-[120px]", children: "Valoraci\u00F3n" }), _jsx("th", { className: "border border-gray-300 p-4 text-center bg-gray-800 text-white font-semibold font-manrope min-w-[120px]", children: "Acciones" })] }) }), _jsx("tbody", { children: allRestaurants.map((restaurant, index) => (_jsxs("tr", { className: "hover:bg-blue-50 transition-all duration-200", children: [_jsx("td", { className: "border border-gray-300 p-4 bg-white font-manrope", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Hash, { className: "w-4 h-4 text-gray-400" }), _jsx("span", { className: "font-medium", children: restaurant.siteNumber })] }) }), _jsx("td", { className: "border border-gray-300 p-4 bg-white font-semibold font-manrope", children: restaurant.name }), _jsx("td", { className: "border border-gray-300 p-4 bg-white font-manrope", children: restaurant.franchiseeName }), _jsx("td", { className: "border border-gray-300 p-4 bg-white font-manrope", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400" }), restaurant.location] }) }), _jsx("td", { className: "border border-gray-300 p-4 bg-white font-manrope", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-blue-600" }), restaurant.franchiseEndDate ? new Date(restaurant.franchiseEndDate).toLocaleDateString('es-ES') : 'N/A'] }) }), _jsx("td", { className: "border border-gray-300 p-4 bg-white font-manrope", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-orange-600" }), restaurant.isOwnedByMcD ?
                                                                _jsx("span", { className: "text-green-600 font-medium", children: "Propiedad McD" }) :
                                                                (restaurant.leaseEndDate ? new Date(restaurant.leaseEndDate).toLocaleDateString('es-ES') : 'N/A')] }) }), _jsx("td", { className: "border border-gray-300 p-4 bg-white font-manrope", children: restaurant.isOwnedByMcD ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Shield, { className: "w-4 h-4 text-green-600" }), _jsx("span", { className: "text-green-600 font-medium", children: "McD" })] })) : (_jsx("span", { className: "text-gray-500", children: "Alquiler" })) }), _jsx("td", { className: "border border-gray-300 p-4 bg-white text-right font-manrope", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [_jsx(Euro, { className: "w-4 h-4 text-green-600" }), _jsx("span", { className: "font-medium", children: formatNumber(restaurant.lastYearRevenue) })] }) }), _jsx("td", { className: "border border-gray-300 p-4 bg-white text-right font-manrope", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [_jsx(Building2, { className: "w-4 h-4 text-blue-600" }), _jsx("span", { className: "font-medium", children: formatNumber(restaurant.baseRent) })] }) }), _jsxs("td", { className: "border border-gray-300 p-4 bg-white text-right font-manrope font-medium", children: ["\u20AC", formatNumber(restaurant.rentIndex)] }), _jsx("td", { className: "border border-gray-300 p-4 bg-white text-center font-manrope", children: restaurant.currentValuation ? (_jsxs("div", { children: [_jsxs("p", { className: "text-sm font-semibold text-green-800", children: ["\u20AC", formatNumber(restaurant.currentValuation.finalValuation)] }), _jsx("p", { className: "text-xs text-green-600", children: new Date(restaurant.currentValuation.valuationDate).toLocaleDateString('es-ES') })] })) : (_jsx("span", { className: "text-gray-500 text-sm", children: "Sin valorar" })) }), _jsx("td", { className: "border border-gray-300 p-4 bg-white text-center", children: _jsxs("div", { className: "flex justify-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleEdit(restaurant), className: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-manrope", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleNavigateToDemo, className: "text-blue-600 hover:text-blue-900 hover:bg-blue-100 font-manrope", title: "Ir a Valoraci\u00F3n", children: _jsx(TrendingUp, { className: "w-4 h-4" }) }), _jsxs(AlertDialog, { children: [_jsx(AlertDialogTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "sm", className: "text-red-600 hover:text-red-900 hover:bg-red-100 font-manrope", title: "Eliminar Restaurante", children: _jsx(Trash2, { className: "w-4 h-4" }) }) }), _jsxs(AlertDialogContent, { className: "font-manrope", children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "\u00BFEst\u00E1s seguro?" }), _jsxs(AlertDialogDescription, { children: ["Esta acci\u00F3n no se puede deshacer. Se eliminar\u00E1 permanentemente el restaurante \"", restaurant.name, "\" y todos sus datos asociados."] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { className: "font-manrope", children: "Cancelar" }), _jsx(AlertDialogAction, { onClick: () => handleDeleteRestaurant(restaurant), className: "bg-red-600 hover:bg-red-700 font-manrope", children: "Eliminar" })] })] })] })] }) })] }, restaurant.id))) })] }) }), allRestaurants.length === 0 && (_jsxs("div", { className: "text-center py-16 font-manrope", children: [_jsx("div", { className: "w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Building2, { className: "w-10 h-10 text-gray-400" }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2 font-manrope", children: "No hay restaurantes registrados" }), _jsx("p", { className: "text-gray-600 mb-6 font-manrope", children: "Comienza agregando el primer restaurante al sistema" }), _jsxs(Button, { onClick: () => setShowAddForm(true), className: "bg-red-600 hover:bg-red-700 text-white font-medium px-6 font-manrope", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Agregar Restaurante"] })] }))] }) })] }));
}
