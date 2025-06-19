import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Building, MapPin, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
export const RestaurantAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('franchisee_restaurants')
                .select(`
          *,
          base_restaurant:base_restaurants(*),
          franchisee:franchisees(*)
        `)
                .order('assigned_at', { ascending: false });
            if (error) {
                console.error('Error fetching assignments:', error);
                toast.error('Error al cargar las asignaciones');
                return;
            }
            setAssignments(data);
        }
        catch (err) {
            console.error('Error in fetchAssignments:', err);
            toast.error('Error al cargar las asignaciones');
        }
        finally {
            setLoading(false);
        }
    };
    const handleRemoveAssignment = async (assignmentId) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta asignación?')) {
            return;
        }
        try {
            const { error } = await supabase
                .from('franchisee_restaurants')
                .delete()
                .eq('id', assignmentId);
            if (error) {
                toast.error('Error al eliminar la asignación');
                return;
            }
            toast.success('Asignación eliminada correctamente');
            fetchAssignments();
        }
        catch (err) {
            console.error('Error removing assignment:', err);
            toast.error('Error al eliminar la asignación');
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'inactive':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'inactive':
                return 'Inactivo';
            case 'pending':
                return 'Pendiente';
            default:
                return status;
        }
    };
    useEffect(() => {
        fetchAssignments();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "text-center py-8", children: _jsx("p", { children: "Cargando asignaciones..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Asignaciones de Restaurantes" }), _jsxs(Badge, { variant: "outline", className: "text-sm", children: [assignments.length, " asignaciones activas"] })] }), assignments.length === 0 ? (_jsx(Card, { children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx(Building, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { className: "text-gray-500", children: "No hay asignaciones de restaurantes" }), _jsx("p", { className: "text-sm text-gray-400 mt-2", children: "Asigna restaurantes a franquiciados desde la pesta\u00F1a de Restaurantes" })] }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: assignments.map((assignment) => (_jsxs(Card, { className: "hover:shadow-lg transition-shadow", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-lg flex items-center", children: [_jsx(Building, { className: "w-5 h-5 mr-2 text-red-600" }), assignment.base_restaurant.restaurant_name] }), _jsx(Badge, { className: getStatusColor(assignment.status), children: getStatusLabel(assignment.status) })] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "text-sm font-medium", children: "Site:" }), _jsx("span", { className: "text-sm", children: assignment.base_restaurant.site_number })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-500" }), _jsxs("span", { className: "text-sm", children: [assignment.base_restaurant.city, ", ", assignment.base_restaurant.state] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(User, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "text-sm font-medium", children: assignment.franchisee.franchisee_name })] }), assignment.franchisee.company_name && (_jsx("div", { className: "text-sm text-gray-600", children: assignment.franchisee.company_name })), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { className: "w-4 h-4 text-gray-500" }), _jsxs("span", { className: "text-sm", children: ["Asignado: ", new Date(assignment.assigned_at).toLocaleDateString('es-ES')] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsxs(Button, { size: "sm", variant: "destructive", onClick: () => handleRemoveAssignment(assignment.id), children: [_jsx(Trash2, { className: "w-4 h-4 mr-2" }), "Eliminar Asignaci\u00F3n"] }) })] })] }, assignment.id))) }))] }));
};
