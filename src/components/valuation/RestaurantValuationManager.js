import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRestaurantValuations } from '@/hooks/useRestaurantValuations';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import RestaurantSelector from './RestaurantSelector';
import ValuationHistory from './ValuationHistory';
import { Save, Plus } from 'lucide-react';
import { toast } from 'sonner';
const RestaurantValuationManager = ({ currentValuationData, onLoadValuation, onSaveSuccess }) => {
    const { restaurants, loading: restaurantsLoading } = useFranchiseeRestaurants();
    const { valuations, saveValuation, updateValuation, deleteValuation, fetchValuations } = useRestaurantValuations();
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [isNewValuationOpen, setIsNewValuationOpen] = useState(false);
    const [valuationName, setValuationName] = useState('');
    const [currentValuationId, setCurrentValuationId] = useState(null);
    // Convertir restaurantes de franquiciado a opciones para el selector
    const restaurantOptions = restaurants
        .filter(r => r.base_restaurant) // Solo restaurantes con información base
        .map(r => ({
        id: r.base_restaurant.id,
        name: r.base_restaurant.restaurant_name,
        site_number: r.base_restaurant.site_number
    }));
    const handleSaveValuation = async () => {
        if (!selectedRestaurant) {
            toast.error('Selecciona un restaurante primero');
            return;
        }
        if (!valuationName.trim()) {
            toast.error('Ingresa un nombre para la valoración');
            return;
        }
        try {
            const valuationData = {
                restaurant_id: selectedRestaurant.id,
                restaurant_name: selectedRestaurant.name,
                valuation_name: valuationName,
                valuation_date: new Date().toISOString().split('T')[0],
                change_date: currentValuationData.inputs?.changeDate || null,
                franchise_end_date: currentValuationData.inputs?.franchiseEndDate || null,
                remaining_years: currentValuationData.inputs?.remainingYears || 0,
                inflation_rate: currentValuationData.inputs?.inflationRate || 1.5,
                discount_rate: currentValuationData.inputs?.discountRate || 21.0,
                growth_rate: currentValuationData.inputs?.growthRate || 3.0,
                yearly_data: currentValuationData.yearlyData || [],
                total_present_value: currentValuationData.totalPrice || null,
                projections: currentValuationData.projections || null
            };
            if (currentValuationId) {
                await updateValuation(currentValuationId, valuationData);
            }
            else {
                const newValuation = await saveValuation(valuationData);
                setCurrentValuationId(newValuation.id);
            }
            setValuationName('');
            setIsNewValuationOpen(false);
            onSaveSuccess();
        }
        catch (error) {
            console.error('Error saving valuation:', error);
        }
    };
    const handleLoadValuation = (valuation) => {
        setCurrentValuationId(valuation.id);
        setValuationName(valuation.valuation_name);
        setSelectedRestaurant({
            id: valuation.restaurant_id,
            name: valuation.restaurant_name,
            site_number: 'N/A' // Será actualizado cuando se seleccione
        });
        onLoadValuation(valuation);
        toast.success(`Valoración "${valuation.valuation_name}" cargada correctamente`);
    };
    const handleDuplicateValuation = (valuation) => {
        setValuationName(`${valuation.valuation_name} - Copia`);
        setCurrentValuationId(null);
        onLoadValuation(valuation);
    };
    const handleDeleteValuation = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta valoración?')) {
            await deleteValuation(id);
            if (currentValuationId === id) {
                setCurrentValuationId(null);
                setValuationName('');
            }
        }
    };
    const handleNewValuation = () => {
        setCurrentValuationId(null);
        setValuationName('');
        setIsNewValuationOpen(true);
    };
    if (restaurantsLoading) {
        return (_jsx("div", { className: "space-y-6", children: _jsx(Card, { children: _jsx(CardContent, { className: "p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Cargando restaurantes..." })] }) }) }) }));
    }
    if (restaurants.length === 0) {
        return (_jsx("div", { className: "space-y-6", children: _jsx(Card, { children: _jsx(CardContent, { className: "p-8", children: _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No hay restaurantes disponibles" }), _jsx("p", { className: "text-gray-600", children: "No tienes restaurantes asignados para realizar valoraciones." })] }) }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(RestaurantSelector, { restaurants: restaurantOptions, selectedRestaurant: selectedRestaurant, onRestaurantChange: setSelectedRestaurant, loading: restaurantsLoading }), selectedRestaurant && (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Gesti\u00F3n de Valoraciones" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs(Dialog, { open: isNewValuationOpen, onOpenChange: setIsNewValuationOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { onClick: handleNewValuation, className: "flex-1", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Nueva Valoraci\u00F3n"] }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Guardar Valoraci\u00F3n" }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Nombre de la Valoraci\u00F3n" }), _jsx(Input, { value: valuationName, onChange: (e) => setValuationName(e.target.value), placeholder: "Ej: Valoraci\u00F3n Base, Escenario Optimista..." })] }), _jsxs(Button, { onClick: handleSaveValuation, className: "w-full", children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Guardar Valoraci\u00F3n"] })] })] })] }), currentValuationId && (_jsxs(Button, { variant: "outline", onClick: () => setIsNewValuationOpen(true), children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Actualizar"] }))] }), currentValuationId && (_jsxs("div", { className: "p-3 bg-blue-50 rounded-lg", children: [_jsx("p", { className: "text-blue-800 font-medium", children: "Valoraci\u00F3n Actual:" }), _jsx("p", { className: "text-blue-700", children: valuationName })] }))] })] }), _jsx(ValuationHistory, { valuations: valuations, selectedRestaurantId: selectedRestaurant.id, onLoadValuation: handleLoadValuation, onDeleteValuation: handleDeleteValuation, onDuplicateValuation: handleDuplicateValuation })] }))] }));
};
export default RestaurantValuationManager;
