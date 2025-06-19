import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, RefreshCw } from 'lucide-react';
import { UserCreationPanel } from '@/components/admin/UserCreationPanel';
import { toast } from 'sonner';
const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchUsers();
    }, []);
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) {
                console.error('Error fetching users:', error);
                toast.error('Error al cargar usuarios');
                return;
            }
            // Map database roles to TypeScript types - mantener roles como están en la base de datos
            const typedUsers = (data || []).map(userData => ({
                ...userData,
                role: userData.role
            }));
            setUsers(typedUsers);
        }
        catch (error) {
            console.error('Error in fetchUsers:', error);
            toast.error('Error al cargar usuarios');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDeleteUser = async (userId, userName) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar a ${userName}?`)) {
            return;
        }
        try {
            // Eliminar perfil (esto también eliminará el usuario de auth por cascade)
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);
            if (error) {
                console.error('Error deleting user:', error);
                toast.error('Error al eliminar usuario');
                return;
            }
            toast.success('Usuario eliminado exitosamente');
            fetchUsers();
        }
        catch (error) {
            console.error('Error in handleDeleteUser:', error);
            toast.error('Error al eliminar usuario');
        }
    };
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'superadmin':
                return 'bg-red-100 text-red-800';
            case 'manager':
                return 'bg-blue-100 text-blue-800';
            case 'franchisee':
                return 'bg-green-100 text-green-800';
            case 'asesor':
                return 'bg-purple-100 text-purple-800';
            case 'asistente':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'superadmin':
                return 'Super Admin';
            case 'manager':
                return 'Gerente';
            case 'franchisee':
                return 'Franquiciado';
            case 'asesor':
                return 'Asesor';
            case 'asistente':
                return 'Asistente';
            default:
                return role;
        }
    };
    // Solo admins pueden gestionar usuarios
    if (!user || !['admin', 'asesor', 'superadmin'].includes(user.role)) {
        return (_jsx(Card, { children: _jsx(CardContent, { className: "p-6", children: _jsxs("div", { className: "text-center text-gray-500", children: [_jsx(Users, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("p", { children: "No tienes permisos para gestionar usuarios" })] }) }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(UserCreationPanel, {}), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5" }), "Lista de Usuarios"] }), _jsxs(Button, { onClick: fetchUsers, disabled: loading, variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Actualizar"] })] }) }), _jsx(CardContent, { children: loading ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { children: "Cargando usuarios..." }) })) : (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Usuario" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Rol" }), _jsx(TableHead, { children: "Fecha de Creaci\u00F3n" }), _jsx(TableHead, { children: "Acciones" })] }) }), _jsx(TableBody, { children: users.map((userItem) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: userItem.full_name || 'Sin nombre' }), _jsx(TableCell, { children: userItem.email }), _jsx(TableCell, { children: _jsx(Badge, { className: getRoleBadgeColor(userItem.role), children: getRoleLabel(userItem.role) }) }), _jsx(TableCell, { children: new Date(userItem.created_at).toLocaleDateString('es-ES') }), _jsx(TableCell, { children: userItem.id !== user?.id && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteUser(userItem.id, userItem.full_name || userItem.email), className: "text-red-600 hover:text-red-700 hover:bg-red-50", children: _jsx(Trash2, { className: "w-4 h-4" }) })) })] }, userItem.id))) })] })) })] })] }));
};
export default UserManagement;
