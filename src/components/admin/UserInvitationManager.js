import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Mail, UserPlus, CheckCircle, AlertCircle, Clock, Trash2, RefreshCw, Send, Copy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const UserInvitationManager = () => {
    const { user } = useAuth();
    const [invitations, setInvitations] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        role: 'franchisee',
        restaurant_id: '',
        message: ''
    });
    // Invitaciones de ejemplo
    const exampleInvitations = [
        {
            id: '1',
            email: 'franquiciado1@example.com',
            role: 'franchisee',
            restaurant_id: 'rest-1',
            restaurant_name: 'McDonald\'s Plaza Mayor',
            status: 'pending',
            created_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            invited_by: user?.email || 'admin@example.com',
            message: 'Bienvenido al sistema de gestión de franquicias McDonald\'s'
        },
        {
            id: '2',
            email: 'asesor1@example.com',
            role: 'asesor',
            status: 'accepted',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            invited_by: user?.email || 'admin@example.com',
            message: 'Invitación para asesor de franquicias'
        },
        {
            id: '3',
            email: 'franquiciado2@example.com',
            role: 'franchisee',
            restaurant_id: 'rest-2',
            restaurant_name: 'McDonald\'s Centro Comercial',
            status: 'expired',
            created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            expires_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            invited_by: user?.email || 'admin@example.com',
            message: 'Invitación para nuevo franquiciado'
        }
    ];
    useEffect(() => {
        loadInvitations();
        loadRestaurants();
    }, []);
    const loadInvitations = async () => {
        setLoading(true);
        try {
            // Por ahora usamos datos de ejemplo
            // En el futuro esto vendría de la base de datos
            setInvitations(exampleInvitations);
        }
        catch (error) {
            console.error('Error loading invitations:', error);
            toast.error('Error al cargar las invitaciones');
        }
        finally {
            setLoading(false);
        }
    };
    const loadRestaurants = async () => {
        try {
            const { data, error } = await supabase
                .from('base_restaurants')
                .select('*')
                .order('restaurant_name');
            if (error)
                throw error;
            setRestaurants(data || []);
        }
        catch (error) {
            console.error('Error loading restaurants:', error);
            toast.error('Error al cargar los restaurantes');
        }
    };
    const sendInvitation = async () => {
        if (!formData.email || !formData.role) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }
        setSending(true);
        try {
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Por favor ingresa un email válido');
                return;
            }
            // Verificar si el usuario ya existe
            const { data: existingUser } = await supabase.auth.admin.listUsers();
            const userExists = existingUser.users?.some((u) => u.email === formData.email);
            if (userExists) {
                toast.error('Este usuario ya existe en el sistema');
                return;
            }
            // Enviar invitación usando la API de Supabase
            const { data: existingInvitation, error: checkError } = await supabase
                .from('user_invitations')
                .select('*')
                .eq('email', formData.email)
                .single();
            if (existingInvitation) {
                toast.error('Este usuario ya tiene una invitación pendiente');
                return;
            }
            const invitationData = {
                email: formData.email,
                role: formData.role,
                restaurant_id: formData.restaurant_id,
                message: formData.message,
                invited_by: user?.id,
                status: 'pending',
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };
            const { data: invitation, error } = await supabase
                .from('user_invitations')
                .insert([invitationData])
                .select()
                .single();
            if (error)
                throw error;
            toast.success('Invitación enviada correctamente');
            // Limpiar formulario
            setFormData({
                email: '',
                role: 'franchisee',
                restaurant_id: '',
                message: ''
            });
            setShowForm(false);
            // Recargar invitaciones
            loadInvitations();
        }
        catch (error) {
            console.error('Error sending invitation:', error);
            toast.error('Error al enviar la invitación');
        }
        finally {
            setSending(false);
        }
    };
    const resendInvitation = async (invitationId) => {
        try {
            const invitation = invitations.find(inv => inv.id === invitationId);
            if (!invitation)
                return;
            const { error } = await supabase.auth.admin.inviteUserByEmail(invitation.email);
            if (error)
                throw error;
            toast.success('Invitación reenviada correctamente');
        }
        catch (error) {
            console.error('Error resending invitation:', error);
            toast.error('Error al reenviar la invitación');
        }
    };
    const deleteInvitation = async (invitationId) => {
        try {
            const { error } = await supabase
                .from('user_invitations')
                .delete()
                .eq('id', invitationId);
            if (error)
                throw error;
            setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
            toast.success('Invitación eliminada correctamente');
        }
        catch (error) {
            console.error('Error deleting invitation:', error);
            toast.error('Error al eliminar la invitación');
        }
    };
    const copyInvitationLink = (invitation) => {
        // En un caso real, esto sería el link de invitación de Supabase
        const link = `${window.location.origin}/auth/invite?token=${invitation.id}`;
        navigator.clipboard.writeText(link);
        toast.success('Link copiado al portapapeles');
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'expired': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return _jsx(Clock, { className: "h-4 w-4 text-yellow-600" });
            case 'accepted': return _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
            case 'expired': return _jsx(AlertCircle, { className: "h-4 w-4 text-red-600" });
            default: return _jsx(Clock, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const isExpired = (expiresAt) => {
        return new Date(expiresAt) < new Date();
    };
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Gesti\u00F3n de Invitaciones" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Invita usuarios al sistema de gesti\u00F3n de franquicias" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: loadInvitations, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] }), _jsxs(Button, { onClick: () => setShowForm(!showForm), children: [_jsx(UserPlus, { className: "h-4 w-4 mr-2" }), "Nueva Invitaci\u00F3n"] })] })] }), showForm && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Nueva Invitaci\u00F3n" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email *" }), _jsx(Input, { id: "email", type: "email", placeholder: "usuario@ejemplo.com", value: formData.email, onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "role", children: "Rol *" }), _jsxs(Select, { value: formData.role, onValueChange: (value) => setFormData(prev => ({ ...prev, role: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "franchisee", children: "Franquiciado" }), _jsx(SelectItem, { value: "asesor", children: "Asesor" }), _jsx(SelectItem, { value: "admin", children: "Administrador" })] })] })] }), formData.role === 'franchisee' && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "restaurant", children: "Restaurante" }), _jsxs(Select, { value: formData.restaurant_id || '', onValueChange: (value) => setFormData(prev => ({ ...prev, restaurant_id: value })), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar restaurante" }) }), _jsx(SelectContent, { children: restaurants.map((restaurant) => (_jsx(SelectItem, { value: restaurant.id, children: restaurant.restaurant_name }, restaurant.id))) })] })] })), _jsxs("div", { className: "md:col-span-2", children: [_jsx(Label, { htmlFor: "message", children: "Mensaje Personalizado" }), _jsx(Textarea, { id: "message", placeholder: "Mensaje opcional para el usuario invitado...", value: formData.message, onChange: (e) => setFormData(prev => ({ ...prev, message: e.target.value })), rows: 3 })] })] }), _jsxs("div", { className: "flex justify-end space-x-2 mt-4", children: [_jsx(Button, { variant: "outline", onClick: () => setShowForm(false), children: "Cancelar" }), _jsxs(Button, { onClick: sendInvitation, disabled: sending, children: [sending ? _jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }) : _jsx(Send, { className: "h-4 w-4 mr-2" }), "Enviar Invitaci\u00F3n"] })] })] })] })), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Invitaciones Enviadas" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando invitaciones..." })] })) : invitations.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Mail, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No hay invitaciones enviadas" })] })) : (_jsx("div", { className: "space-y-4", children: invitations.map((invitation) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getStatusIcon(invitation.status) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: invitation.email }), _jsx(Badge, { className: getStatusColor(invitation.status), children: invitation.status === 'pending' ? 'Pendiente' :
                                                                    invitation.status === 'accepted' ? 'Aceptada' : 'Expirada' }), _jsx(Badge, { variant: "outline", children: invitation.role === 'franchisee' ? 'Franquiciado' :
                                                                    invitation.role === 'asesor' ? 'Asesor' : 'Administrador' })] }), invitation.restaurant_name && (_jsxs("p", { className: "text-sm text-gray-600", children: ["Restaurante: ", invitation.restaurant_name] })), _jsxs("p", { className: "text-xs text-gray-500", children: ["Enviada: ", formatDate(invitation.created_at), " | Expira: ", formatDate(invitation.expires_at)] }), invitation.message && (_jsxs("p", { className: "text-sm text-gray-600 mt-1", children: ["\"", invitation.message, "\""] }))] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => copyInvitationLink(invitation), title: "Copiar link de invitaci\u00F3n", children: _jsx(Copy, { className: "h-4 w-4" }) }), invitation.status === 'pending' && !isExpired(invitation.expires_at) && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => resendInvitation(invitation.id), title: "Reenviar invitaci\u00F3n", children: _jsx(Send, { className: "h-4 w-4" }) })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => deleteInvitation(invitation.id), title: "Eliminar invitaci\u00F3n", children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] }, invitation.id))) })) })] })] }));
};
export default UserInvitationManager;
