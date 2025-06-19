import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { useBaseRestaurants } from '@/hooks/useBaseRestaurants';
import { useFranchisees } from '@/hooks/useFranchisees';
import { toast } from 'sonner';
export const RestaurantAssignmentDialog = ({ isOpen, onClose, selectedFranchisee }) => {
    const { restaurants, loading } = useBaseRestaurants();
    const { assignRestaurant } = useFranchisees();
    const [selectedRestaurants, setSelectedRestaurants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [assigning, setAssigning] = useState(false);
    const availableRestaurants = restaurants.filter(restaurant => restaurant.site_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.city.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleRestaurantToggle = (restaurantId) => {
        setSelectedRestaurants(prev => prev.includes(restaurantId)
            ? prev.filter(id => id !== restaurantId)
            : [...prev, restaurantId]);
    };
    const handleAssign = async () => {
        if (!selectedFranchisee || selectedRestaurants.length === 0)
            return;
        setAssigning(true);
        try {
            let successCount = 0;
            for (const restaurantId of selectedRestaurants) {
                const success = await assignRestaurant(selectedFranchisee.id, restaurantId);
                if (success)
                    successCount++;
            }
            if (successCount > 0) {
                toast.success(`Se asignaron ${successCount} restaurante(s) correctamente`);
                setSelectedRestaurants([]);
                onClose();
            }
        }
        catch (error) {
            console.error('Error assigning restaurants:', error);
            toast.error('Error al asignar restaurantes');
        }
        finally {
            setAssigning(false);
        }
    };
    return (_jsx(Dialog, { open: isOpen, onOpenChange: onClose, children: _jsxs(DialogContent, { className: "max-w-4xl max-h-[80vh]", children: [_jsx(DialogHeader, { children: _jsxs(DialogTitle, { children: ["Asignar Restaurantes a ", selectedFranchisee?.franchisee_name] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "search", children: "Buscar Restaurantes" }), _jsx(Input, { id: "search", placeholder: "Buscar por n\u00FAmero de sitio, nombre o ciudad...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsx("div", { className: "max-h-96 overflow-y-auto border rounded-lg", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-12", children: "Seleccionar" }), _jsx(TableHead, { children: "Sitio" }), _jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Ciudad" }), _jsx(TableHead, { children: "Tipo" })] }) }), _jsx(TableBody, { children: loading ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "text-center py-8", children: "Cargando restaurantes..." }) })) : availableRestaurants.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "text-center py-8", children: "No se encontraron restaurantes" }) })) : (availableRestaurants.map((restaurant) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsx(Checkbox, { checked: selectedRestaurants.includes(restaurant.id), onCheckedChange: () => handleRestaurantToggle(restaurant.id) }) }), _jsx(TableCell, { className: "font-medium", children: restaurant.site_number }), _jsx(TableCell, { children: restaurant.restaurant_name }), _jsx(TableCell, { children: restaurant.city }), _jsx(TableCell, { children: restaurant.restaurant_type })] }, restaurant.id)))) })] }) }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("span", { className: "text-sm text-gray-500", children: [selectedRestaurants.length, " restaurante(s) seleccionado(s)"] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "outline", onClick: onClose, children: "Cancelar" }), _jsx(Button, { onClick: handleAssign, disabled: selectedRestaurants.length === 0 || assigning, className: "bg-red-600 hover:bg-red-700", children: assigning ? 'Asignando...' : 'Asignar Restaurantes' })] })] })] })] }) }));
};
