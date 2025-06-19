import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Mail, Calendar, Shield, Edit, X, Camera, Key, Bell } from 'lucide-react';
import ChangePasswordDialog from './ChangePasswordDialog';
const UserProfile = () => {
    const { user, signOut } = useAuth();
    const [profileData, setProfileData] = useState({
        full_name: '',
        phone: '',
        address: '',
        company_name: '',
        preferences: {
            notifications: true,
            email_alerts: true,
            language: 'es',
            theme: 'light'
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);
    const loadUserProfile = async () => {
        if (!user)
            return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error)
                throw error;
            if (data) {
                setProfileData({
                    full_name: data.full_name || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    company_name: data.company_name || '',
                    preferences: {
                        notifications: data.preferences?.notifications ?? true,
                        email_alerts: data.preferences?.email_alerts ?? true,
                        language: data.preferences?.language ?? 'es',
                        theme: data.preferences?.theme ?? 'light'
                    }
                });
            }
        }
        catch (error) {
            console.error('Error loading user profile:', error);
        }
    };
    const handleSaveProfile = async () => {
        if (!user)
            return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                full_name: profileData.full_name,
                phone: profileData.phone,
                address: profileData.address,
                company_name: profileData.company_name,
                preferences: profileData.preferences,
                updated_at: new Date().toISOString()
            })
                .eq('id', user.id);
            if (error)
                throw error;
            toast.success('Perfil actualizado correctamente');
            setIsEditing(false);
        }
        catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error al actualizar el perfil');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleAvatarUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !user)
            return;
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;
            const { error: uploadError } = await supabase.storage
                .from('user-avatars')
                .upload(filePath, file);
            if (uploadError)
                throw uploadError;
            const { data: { publicUrl } } = supabase.storage
                .from('user-avatars')
                .getPublicUrl(filePath);
            setAvatarUrl(publicUrl);
            // Actualizar el perfil con la nueva URL del avatar
            await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);
            toast.success('Avatar actualizado correctamente');
        }
        catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Error al subir el avatar');
        }
    };
    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'superadmin': return 'bg-purple-100 text-purple-800';
            case 'admin': return 'bg-red-100 text-red-800';
            case 'advisor': return 'bg-blue-100 text-blue-800';
            case 'asesor': return 'bg-green-100 text-green-800';
            case 'franchisee': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'superadmin': return 'Super Administrador';
            case 'admin': return 'Administrador';
            case 'advisor': return 'Asesor';
            case 'asesor': return 'Asesor';
            case 'franchisee': return 'Franquiciado';
            default: return role;
        }
    };
    if (!user) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx(User, { className: "h-12 w-12 mx-auto text-gray-400 mb-4" }), _jsx("p", { className: "text-gray-600", children: "No hay usuario autenticado" })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-4xl", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Mi Perfil" }), _jsx("p", { className: "text-gray-600", children: "Gestiona tu informaci\u00F3n personal y preferencias" })] }), _jsxs(Tabs, { defaultValue: "profile", className: "space-y-6", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-4", children: [_jsx(TabsTrigger, { value: "profile", children: "Perfil" }), _jsx(TabsTrigger, { value: "security", children: "Seguridad" }), _jsx(TabsTrigger, { value: "preferences", children: "Preferencias" }), _jsx(TabsTrigger, { value: "activity", children: "Actividad" })] }), _jsx(TabsContent, { value: "profile", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(CardTitle, { children: "Informaci\u00F3n Personal" }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => setIsEditing(!isEditing), children: [isEditing ? _jsx(X, { className: "h-4 w-4 mr-2" }) : _jsx(Edit, { className: "h-4 w-4 mr-2" }), isEditing ? 'Cancelar' : 'Editar'] })] }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsxs(Avatar, { className: "h-20 w-20", children: [_jsx(AvatarImage, { src: avatarUrl || user.avatar_url }), _jsx(AvatarFallback, { children: user.full_name?.charAt(0) || user.email?.charAt(0) || 'U' })] }), isEditing && (_jsxs("label", { className: "absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer", children: [_jsx(Camera, { className: "h-4 w-4 text-gray-600" }), _jsx("input", { type: "file", accept: "image/*", onChange: handleAvatarUpload, className: "hidden" })] }))] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold", children: user.full_name || 'Usuario' }), _jsx("p", { className: "text-gray-600", children: user.email }), _jsx(Badge, { className: `mt-2 ${getRoleBadgeColor(user.role)}`, children: getRoleDisplayName(user.role) })] })] }), _jsx(Separator, {}), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Nombre Completo" }), _jsx(Input, { id: "fullName", value: profileData.full_name, onChange: (e) => setProfileData({ ...profileData, full_name: e.target.value }), disabled: !isEditing, placeholder: "Tu nombre completo" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "phone", children: "Tel\u00E9fono" }), _jsx(Input, { id: "phone", value: profileData.phone, onChange: (e) => setProfileData({ ...profileData, phone: e.target.value }), disabled: !isEditing, placeholder: "+34 600 000 000" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "company", children: "Empresa" }), _jsx(Input, { id: "company", value: profileData.company_name, onChange: (e) => setProfileData({ ...profileData, company_name: e.target.value }), disabled: !isEditing, placeholder: "Nombre de tu empresa" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "address", children: "Direcci\u00F3n" }), _jsx(Input, { id: "address", value: profileData.address, onChange: (e) => setProfileData({ ...profileData, address: e.target.value }), disabled: !isEditing, placeholder: "Tu direcci\u00F3n" })] })] }), isEditing && (_jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { variant: "outline", onClick: () => setIsEditing(false), children: "Cancelar" }), _jsx(Button, { onClick: handleSaveProfile, disabled: isLoading, children: isLoading ? 'Guardando...' : 'Guardar Cambios' })] }))] })] }) }), _jsx(TabsContent, { value: "security", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Seguridad de la Cuenta" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Key, { className: "h-5 w-5 text-gray-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Cambiar Contrase\u00F1a" }), _jsx("p", { className: "text-sm text-gray-600", children: "Actualiza tu contrase\u00F1a regularmente" })] })] }), _jsx(ChangePasswordDialog, { trigger: _jsx(Button, { variant: "outline", size: "sm", children: "Cambiar" }) })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Shield, { className: "h-5 w-5 text-gray-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Autenticaci\u00F3n de Dos Factores" }), _jsx("p", { className: "text-sm text-gray-600", children: "A\u00F1ade una capa extra de seguridad" })] })] }), _jsx(Button, { variant: "outline", size: "sm", children: "Configurar" })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Calendar, { className: "h-5 w-5 text-gray-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Sesiones Activas" }), _jsx("p", { className: "text-sm text-gray-600", children: "Gestiona tus sesiones abiertas" })] })] }), _jsx(Button, { variant: "outline", size: "sm", children: "Ver Sesiones" })] })] })] }) }), _jsx(TabsContent, { value: "preferences", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Preferencias de Notificaciones" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Bell, { className: "h-5 w-5 text-gray-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Notificaciones Push" }), _jsx("p", { className: "text-sm text-gray-600", children: "Recibe notificaciones en tiempo real" })] })] }), _jsx(Button, { variant: "outline", size: "sm", children: profileData.preferences.notifications ? 'Activadas' : 'Desactivadas' })] }), _jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Mail, { className: "h-5 w-5 text-gray-500" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium", children: "Alertas por Email" }), _jsx("p", { className: "text-sm text-gray-600", children: "Recibe reportes importantes por email" })] })] }), _jsx(Button, { variant: "outline", size: "sm", children: profileData.preferences.email_alerts ? 'Activadas' : 'Desactivadas' })] })] })] }) }), _jsx(TabsContent, { value: "activity", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Actividad Reciente" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-3 p-3 border rounded-lg", children: [_jsx("div", { className: "w-2 h-2 bg-green-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: "Inicio de sesi\u00F3n exitoso" }), _jsx("p", { className: "text-xs text-gray-500", children: "Hace 2 horas" })] })] }), _jsxs("div", { className: "flex items-center space-x-3 p-3 border rounded-lg", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: "Actualizaci\u00F3n de perfil" }), _jsx("p", { className: "text-xs text-gray-500", children: "Hace 1 d\u00EDa" })] })] }), _jsxs("div", { className: "flex items-center space-x-3 p-3 border rounded-lg", children: [_jsx("div", { className: "w-2 h-2 bg-yellow-500 rounded-full" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: "Cambio de contrase\u00F1a" }), _jsx("p", { className: "text-xs text-gray-500", children: "Hace 3 d\u00EDas" })] })] })] }) })] }) })] })] }));
};
export default UserProfile;
