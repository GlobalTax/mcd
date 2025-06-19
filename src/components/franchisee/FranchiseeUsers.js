import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Users, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
export const FranchiseeUsers = forwardRef(({ franchiseeId, franchiseeName }, ref) => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchFranchiseeUsers = async () => {
        try {
            setLoading(true);
            console.log('Fetching users for franchisee:', franchiseeId, franchiseeName);
            // Obtener el usuario directo del franquiciado
            const { data: franchiseeData, error: franchiseeError } = await supabase
                .from('franchisees')
                .select('user_id')
                .eq('id', franchiseeId)
                .maybeSingle();
            if (franchiseeError) {
                console.error('Error fetching franchisee:', franchiseeError);
                toast.error('Error al cargar el franquiciado');
                return;
            }
            let userIds = [];
            // Incluir el usuario asociado directamente al franquiciado si existe
            if (franchiseeData?.user_id) {
                userIds.push(franchiseeData.user_id);
            }
            // Buscar usuarios que podrían estar relacionados con este franquiciado
            // por nombre o email similar
            const { data: relatedProfiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .or(`full_name.ilike.%${franchiseeName}%,email.ilike.%${franchiseeName.toLowerCase()}%`);
            if (profilesError) {
                console.error('Error fetching related profiles:', profilesError);
            }
            else if (relatedProfiles) {
                relatedProfiles.forEach(profile => {
                    if (!userIds.includes(profile.id)) {
                        userIds.push(profile.id);
                    }
                });
            }
            // Obtener perfiles completos de todos los usuarios identificados
            if (userIds.length > 0) {
                const { data: userProfiles, error: usersError } = await supabase
                    .from('profiles')
                    .select('*')
                    .in('id', userIds)
                    .order('created_at', { ascending: false });
                if (usersError) {
                    console.error('Error fetching user profiles:', usersError);
                    toast.error('Error al cargar los usuarios');
                    return;
                }
                const typedUsers = (userProfiles || []).map(userData => ({
                    ...userData,
                    role: userData.role
                }));
                console.log('Found users for franchisee:', typedUsers);
                setUsers(typedUsers);
            }
            else {
                console.log('No users found for franchisee');
                setUsers([]);
            }
        }
        catch (error) {
            console.error('Error in fetchFranchiseeUsers:', error);
            toast.error('Error al cargar los usuarios');
        }
        finally {
            setLoading(false);
        }
    };
    useImperativeHandle(ref, () => ({
        refresh: fetchFranchiseeUsers
    }));
    useEffect(() => {
        fetchFranchiseeUsers();
    }, [franchiseeId]);
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
            fetchFranchiseeUsers();
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
        return null;
    }
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5" }), "Usuarios Asociados (", users.length, ")"] }), _jsxs(Button, { onClick: fetchFranchiseeUsers, disabled: loading, variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Actualizar"] })] }) }), _jsx(CardContent, { children: loading ? (_jsx("div", { className: "text-center py-8", children: _jsx("p", { children: "Cargando usuarios..." }) })) : users.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Usuario" }), _jsx(TableHead, { children: "Email" }), _jsx(TableHead, { children: "Rol" }), _jsx(TableHead, { children: "Fecha de Creaci\u00F3n" }), _jsx(TableHead, { children: "Acciones" })] }) }), _jsx(TableBody, { children: users.map((userItem) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: userItem.full_name || 'Sin nombre' }), _jsx(TableCell, { children: userItem.email }), _jsx(TableCell, { children: _jsx(Badge, { className: getRoleBadgeColor(userItem.role), children: getRoleLabel(userItem.role) }) }), _jsx(TableCell, { children: new Date(userItem.created_at || '').toLocaleDateString('es-ES') }), _jsx(TableCell, { children: userItem.id !== user?.id && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteUser(userItem.id, userItem.full_name || userItem.email), className: "text-red-600 hover:text-red-700 hover:bg-red-50", children: _jsx(Trash2, { className: "w-4 h-4" }) })) })] }, userItem.id))) })] })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(Users, { className: "w-12 h-12 mx-auto mb-4 text-gray-400" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No hay usuarios asociados" }), _jsx("p", { className: "text-gray-600", children: "Crea un nuevo usuario usando el panel de arriba para asociarlo a este franquiciado." })] })) })] }));
});
FranchiseeUsers.displayName = 'FranchiseeUsers';
