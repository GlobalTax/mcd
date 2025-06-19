import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserCreation } from '@/hooks/useUserCreation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
export const UserCreationPanel = ({ onUserCreated }) => {
    const { user } = useAuth();
    const { createUser, creating } = useUserCreation();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: ''
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
            toast.error('Todos los campos son obligatorios');
            return;
        }
        const success = await createUser(formData.email, formData.password, formData.fullName, formData.role);
        if (success) {
            setFormData({
                fullName: '',
                email: '',
                password: '',
                role: ''
            });
            // Notificar al componente padre que se creó un usuario
            onUserCreated?.();
        }
    };
    const canCreateUser = user?.role === 'admin' || user?.role === 'superadmin';
    if (!canCreateUser) {
        return null;
    }
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(UserPlus, { className: "w-5 h-5" }), "Crear Nuevo Usuario"] }) }), _jsx(CardContent, { children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Nombre Completo" }), _jsx(Input, { id: "fullName", type: "text", value: formData.fullName, onChange: (e) => setFormData(prev => ({ ...prev, fullName: e.target.value })), placeholder: "Nombre completo", required: true })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: formData.email, onChange: (e) => setFormData(prev => ({ ...prev, email: e.target.value })), placeholder: "email@ejemplo.com", required: true })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx(Input, { id: "password", type: "password", value: formData.password, onChange: (e) => setFormData(prev => ({ ...prev, password: e.target.value })), placeholder: "M\u00EDnimo 6 caracteres", required: true, minLength: 6 })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "role", children: "Rol" }), _jsxs(Select, { value: formData.role, onValueChange: (value) => setFormData(prev => ({ ...prev, role: value })), required: true, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar rol..." }) }), _jsxs(SelectContent, { children: [user?.role === 'superadmin' && (_jsxs(_Fragment, { children: [_jsx(SelectItem, { value: "superadmin", children: "Super Admin" }), _jsx(SelectItem, { value: "admin", children: "Admin" }), _jsx(SelectItem, { value: "asesor", children: "Asesor" }), _jsx(SelectItem, { value: "franchisee", children: "Franquiciado" }), _jsx(SelectItem, { value: "manager", children: "Gerente" }), _jsx(SelectItem, { value: "asistente", children: "Asistente" })] })), user?.role === 'admin' && (_jsxs(_Fragment, { children: [_jsx(SelectItem, { value: "asesor", children: "Asesor" }), _jsx(SelectItem, { value: "franchisee", children: "Franquiciado" }), _jsx(SelectItem, { value: "manager", children: "Gerente" }), _jsx(SelectItem, { value: "asistente", children: "Asistente" })] }))] })] })] })] }), _jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", disabled: creating, children: creating ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Creando usuario..."] })) : ('Crear Usuario') })] }) })] }));
};
