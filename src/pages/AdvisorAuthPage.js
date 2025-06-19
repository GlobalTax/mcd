import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const AdvisorAuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('signin');
    const { signIn, user, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (user && !loading) {
            // Verificar si el usuario tiene permisos de asesor (asesor, admin o superadmin)
            if (['asesor', 'admin', 'superadmin'].includes(user.role)) {
                navigate('/advisor');
            }
            else {
                toast.error('No tienes permisos de asesor');
                navigate('/auth');
            }
        }
    }, [user, loading, navigate]);
    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await signIn(email, password);
        if (!error && user && !['asesor', 'admin', 'superadmin'].includes(user.role)) {
            toast.error('Esta cuenta no tiene permisos de asesor');
        }
        setIsLoading(false);
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const redirectUrl = `${window.location.origin}/advisor-auth`;
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    full_name: fullName,
                    role: 'asesor'
                },
            },
        });
        if (error) {
            toast.error(error.message);
        }
        else {
            toast.success('Solicitud de cuenta de asesor enviada. Contacta con el administrador para activar tu cuenta.');
        }
        setIsLoading(false);
    };
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsResettingPassword(true);
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `${window.location.origin}/advisor-auth`,
        });
        if (error) {
            toast.error(error.message);
        }
        else {
            toast.success('Se ha enviado un enlace de recuperación a tu correo electrónico');
            setResetEmail('');
        }
        setIsResettingPassword(false);
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4", children: _jsx(Shield, { className: "text-white w-8 h-8" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Portal de Asesores" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Acceso exclusivo para asesores McDonald's" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-center", children: "Acceso de Asesores" }) }), _jsxs(CardContent, { children: [_jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "signin", children: "Iniciar Sesi\u00F3n" }), _jsx(TabsTrigger, { value: "signup", children: "Solicitar Acceso" }), _jsx(TabsTrigger, { value: "reset", children: "Recuperar" })] }), _jsx(TabsContent, { value: "signin", children: _jsxs("form", { onSubmit: handleSignIn, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email Corporativo" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "asesor@mcdonalds.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "Tu contrase\u00F1a" })] }), _jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Iniciando sesi\u00F3n..."] })) : ('Acceder al Panel de Asesor') }), _jsx("div", { className: "text-center", children: _jsx("button", { type: "button", onClick: () => setActiveTab('reset'), className: "text-sm text-blue-600 hover:text-blue-700 underline", children: "\u00BFHas olvidado tu contrase\u00F1a?" }) })] }) }), _jsx(TabsContent, { value: "signup", children: _jsxs("form", { onSubmit: handleSignUp, className: "space-y-4", children: [_jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-md p-3 mb-4", children: _jsxs("p", { className: "text-sm text-amber-800", children: [_jsx("strong", { children: "Nota:" }), " Las cuentas de asesor requieren aprobaci\u00F3n del administrador."] }) }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Nombre Completo" }), _jsx(Input, { id: "fullName", type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), required: true, placeholder: "Tu nombre completo" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "signupEmail", children: "Email Corporativo" }), _jsx(Input, { id: "signupEmail", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "asesor@mcdonalds.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "signupPassword", children: "Contrase\u00F1a" }), _jsx(Input, { id: "signupPassword", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "M\u00EDnimo 6 caracteres", minLength: 6 })] }), _jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Enviando solicitud..."] })) : ('Solicitar Acceso de Asesor') })] }) }), _jsx(TabsContent, { value: "reset", children: _jsxs("form", { onSubmit: handlePasswordReset, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "resetEmail", children: "Email" }), _jsx(Input, { id: "resetEmail", type: "email", value: resetEmail, onChange: (e) => setResetEmail(e.target.value), required: true, placeholder: "asesor@mcdonalds.com" })] }), _jsx(Button, { type: "submit", className: "w-full bg-blue-600 hover:bg-blue-700", disabled: isResettingPassword, children: isResettingPassword ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Enviando enlace..."] })) : ('Enviar enlace de recuperación') }), _jsx("div", { className: "text-center", children: _jsx("button", { type: "button", onClick: () => setActiveTab('signin'), className: "text-sm text-gray-600 hover:text-gray-700 underline", children: "Volver al inicio de sesi\u00F3n" }) })] }) })] }), _jsx("div", { className: "mt-6 pt-4 border-t text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["\u00BFEres franquiciado?", ' ', _jsx("button", { onClick: () => navigate('/auth'), className: "text-red-600 hover:text-red-700 underline font-medium", children: "Accede aqu\u00ED" })] }) })] })] })] }) }));
};
export default AdvisorAuthPage;
