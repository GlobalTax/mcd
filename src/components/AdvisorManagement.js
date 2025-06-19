import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Shield, RefreshCw } from 'lucide-react';
import { UserCreationPanel } from '@/components/admin/UserCreationPanel';
import { toast } from 'sonner';
const AdvisorManagement = () => {
    const { user } = useAuth();
    const [advisors, setAdvisors] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchAdvisors();
    }, []);
    const fetchAdvisors = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .in('role', ['admin', 'asesor', 'superadmin'])
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching advisors:', error);
                toast.error('Error al cargar asesores');
                return;
            }
            // Mantener los roles como están en la base de datos
            const typedAdvisors = (data || []).map(advisorData => ({
                ...advisorData,
                role: advisorData.role
            }));
            setAdvisors(typedAdvisors);
        }
        catch (error) {
            console.error('Error in fetchAdvisors:', error);
            toast.error('Error al cargar asesores');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteAdvisor = async (advisorId, advisorName) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar el asesor ${advisorName}?`)) {
            return;
        }
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', advisorId);
            if (error) {
                console.error('Error deleting advisor:', error);
                toast.error('Error al eliminar asesor');
                return;
            }
            toast.success('Asesor eliminado exitosamente');
            fetchAdvisors();
        }
        catch (error) {
            console.error('Error in handleDeleteAdvisor:', error);
            toast.error('Error al eliminar asesor');
        }
    };
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'superadmin':
                return 'bg-red-100 text-red-800';
            case 'admin':
                return 'bg-blue-100 text-blue-800';
            case 'asesor':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getRoleLabel = (role) => {
        switch (role) {
            case 'superadmin':
                return 'Super Admin';
            case 'admin':
                return 'Admin';
            case 'asesor':
                return 'Asesor';
            default:
                return role;
        }
    };
    const canDeleteAdvisor = (advisorRole) => {
        if (user?.role === 'superadmin')
            return true;
        if (user?.role === 'admin' && advisorRole === 'asesor')
            return true;
        return false;
    };
    if (!user || !['superadmin', 'admin', 'asesor'].includes(user.role)) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx(Shield, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { children: "No tienes permisos para gestionar asesores" })] }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(UserCreationPanel, {}), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "w-5 h-5" }), "Lista de Asesores"] }), _jsxs(Button, { onClick: fetchAdvisors, disabled: loading, variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Actualizar"] })] }) }), _jsx(CardContent, { children: loading ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { children: "Cargando asesores..." }) })) : (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Rol" }), _jsx(TableHead, { children: "Fecha de Creaci\u00F3n" }), _jsx(TableHead, { children: "Acciones" })] }) }), _jsx(TableBody, { children: advisors.map((advisor) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: advisor.full_name || 'Sin nombre' }), _jsx(TableCell, { children: advisor.email }), _jsx(TableCell, { children: _jsx(Badge, { className: getRoleBadgeColor(advisor.role), children: getRoleLabel(advisor.role) }) }), _jsx(TableCell, { children: new Date(advisor.created_at).toLocaleDateString('es-ES') }), _jsx(TableCell, { children: advisor.id !== user?.id && canDeleteAdvisor(advisor.role) && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteAdvisor(advisor.id, advisor.full_name || advisor.email), className: "text-red-600 hover:text-red-700 hover:bg-red-50", children: _jsx(Trash2, { className: "w-4 h-4" }) })) })] }, advisor.id))) })] })) })] })] }));
};
export default AdvisorManagement;
