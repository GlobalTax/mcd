import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFastAuth } from '@/hooks/useFastAuth';
import { useValuationManager } from '@/hooks/useValuationManager';
import { Building2, RefreshCw, Zap } from 'lucide-react';
import { toast } from 'sonner';
import RestaurantSelectorCard from './RestaurantSelectorCard';
import ValuationActions from './ValuationActions';
import ValuationStatusCard from './ValuationStatusCard';
import SaveValuationDialog from './SaveValuationDialog';
import LoadValuationDialog from './LoadValuationDialog';
const SimpleValuationManager = ({ onRestaurantSelected, onValuationLoaded, currentData }) => {
    const { user, franchisee, restaurants, loading, isUsingCache } = useFastAuth();
    const { selectedRestaurantId, setSelectedRestaurantId, selectedRestaurantName, setSelectedRestaurantName, valuationName, setValuationName, currentValuationId, handleSaveValuation, handleLoadValuation, getRestaurantValuations } = useValuationManager();
    const [isNewValuationOpen, setIsNewValuationOpen] = useState(false);
    const [isLoadValuationOpen, setIsLoadValuationOpen] = useState(false);
    console.log('SimpleValuationManager - Fast auth data:', {
        user: user ? { id: user.id, role: user.role } : null,
        franchisee: franchisee ? { id: franchisee.id, name: franchisee.franchisee_name } : null,
        restaurantsCount: restaurants?.length || 0,
        loading,
        isUsingCache
    });
    const restaurantOptions = restaurants
        .filter(r => r.base_restaurant)
        .map(r => ({
        id: r.base_restaurant.id,
        name: r.base_restaurant.restaurant_name,
        site_number: r.base_restaurant.site_number
    }));
    const handleRestaurantChange = (restaurantId) => {
        const restaurant = restaurantOptions.find(r => r.id === restaurantId);
        if (restaurant) {
            console.log('Restaurant selected:', restaurant);
            setSelectedRestaurantId(restaurantId);
            setSelectedRestaurantName(restaurant.name);
            onRestaurantSelected(restaurantId, restaurant.name);
            toast.success(`Restaurante seleccionado: ${restaurant.name}`);
        }
    };
    const onSaveValuation = async () => {
        await handleSaveValuation(currentData);
        setIsNewValuationOpen(false);
    };
    const onLoadValuation = (valuation) => {
        handleLoadValuation(valuation, onValuationLoaded);
        onRestaurantSelected(valuation.restaurant_id, valuation.restaurant_name);
        setIsLoadValuationOpen(false);
    };
    if (loading) {
        return (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" }), _jsx("p", { children: "Cargando datos r\u00E1pidos..." })] }) }));
    }
    if (restaurantOptions.length === 0) {
        return (_jsx(Card, { children: _jsxs(CardContent, { className: "p-8 text-center", children: [_jsx(Building2, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "Datos predefinidos disponibles" }), _jsx("p", { className: "text-gray-600 mb-4", children: isUsingCache
                            ? 'Usando datos predefinidos para carga rápida. Los restaurantes están disponibles para valoración.'
                            : 'No hay restaurantes asignados para realizar valoraciones.' }), _jsxs(Button, { onClick: () => window.location.reload(), children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Recargar datos"] })] }) }));
    }
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Building2, { className: "w-5 h-5" }), "Gesti\u00F3n de Valoraciones", isUsingCache && (_jsxs("div", { className: "flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs", children: [_jsx(Zap, { className: "w-3 h-3" }), _jsx("span", { children: "Carga r\u00E1pida" })] }))] }), _jsxs(Button, { onClick: () => window.location.reload(), variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Actualizar"] })] }), isUsingCache && (_jsx("p", { className: "text-sm text-blue-600", children: "Usando datos predefinidos para experiencia r\u00E1pida. Recarga para sincronizar." }))] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(RestaurantSelectorCard, { restaurants: restaurantOptions, selectedRestaurantId: selectedRestaurantId, onRestaurantChange: handleRestaurantChange, onRefresh: () => window.location.reload() }), _jsx(ValuationActions, { selectedRestaurantId: selectedRestaurantId, onSaveClick: () => setIsNewValuationOpen(true), onLoadClick: () => setIsLoadValuationOpen(true), currentValuationId: currentValuationId }), _jsx(ValuationStatusCard, { selectedRestaurantId: selectedRestaurantId, selectedRestaurantName: selectedRestaurantName, currentValuationId: currentValuationId }), _jsx(SaveValuationDialog, { isOpen: isNewValuationOpen, onOpenChange: setIsNewValuationOpen, valuationName: valuationName, onValuationNameChange: setValuationName, onSave: onSaveValuation, currentValuationId: currentValuationId }), _jsx(LoadValuationDialog, { isOpen: isLoadValuationOpen, onOpenChange: setIsLoadValuationOpen, valuations: getRestaurantValuations(), onLoadValuation: onLoadValuation })] })] }));
};
export default SimpleValuationManager;
