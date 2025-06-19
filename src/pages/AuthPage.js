import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Store } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [activeTab, setActiveTab] = useState('signin');
    const { signIn, signUp, user, loading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        console.log('AuthPage - Effect triggered');
        console.log('AuthPage - User:', user);
        console.log('AuthPage - Loading:', loading);
        if (user && !loading) {
            console.log('AuthPage - User role:', user.role);
            console.log('AuthPage - Determining redirect...');
            // Redirigir usuarios con roles de asesor, admin o superadmin al panel de asesor
            if (['asesor', 'admin', 'superadmin'].includes(user.role)) {
                console.log('AuthPage - Redirecting asesor/admin/superadmin to /advisor');
                navigate('/advisor', { replace: true });
            }
            else {
                console.log('AuthPage - Redirecting franchisee to /dashboard');
                navigate('/dashboard', { replace: true });
            }
        }
    }, [user, loading, navigate]);
    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        console.log('AuthPage - Starting sign in process');
        const result = await signIn(email, password);
        // Solo mostrar error si hay uno, el éxito se maneja en useAuth
        if (result?.error) {
            console.log('AuthPage - Sign in error:', result.error);
        }
        setIsLoading(false);
    };
    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await signUp(email, password, fullName);
        setIsLoading(false);
    };
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setIsResettingPassword(true);
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `${window.location.origin}/auth`,
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
        console.log('AuthPage - Showing loading state');
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    console.log('AuthPage - Rendering auth form');
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4", children: _jsx(Store, { className: "text-white w-8 h-8" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Portal de Franquiciados" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Gestiona tu restaurante McDonald's" })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-center", children: "Acceso para Franquiciados" }) }), _jsxs(CardContent, { children: [_jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "signin", children: "Iniciar Sesi\u00F3n" }), _jsx(TabsTrigger, { value: "signup", children: "Registrarse" }), _jsx(TabsTrigger, { value: "reset", children: "Recuperar" })] }), _jsx(TabsContent, { value: "signin", children: _jsxs("form", { onSubmit: handleSignIn, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "tu.email@ejemplo.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx(Input, { id: "password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "Tu contrase\u00F1a" })] }), _jsx(Button, { type: "submit", className: "w-full bg-red-600 hover:bg-red-700", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Iniciando sesi\u00F3n..."] })) : ('Iniciar Sesión') }), _jsx("div", { className: "text-center", children: _jsx("button", { type: "button", onClick: () => setActiveTab('reset'), className: "text-sm text-red-600 hover:text-red-700 underline", children: "\u00BFHas olvidado tu contrase\u00F1a?" }) })] }) }), _jsx(TabsContent, { value: "signup", children: _jsxs("form", { onSubmit: handleSignUp, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "fullName", children: "Nombre Completo" }), _jsx(Input, { id: "fullName", type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), required: true, placeholder: "Tu nombre completo" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "signupEmail", children: "Email" }), _jsx(Input, { id: "signupEmail", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, placeholder: "tu.email@ejemplo.com" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "signupPassword", children: "Contrase\u00F1a" }), _jsx(Input, { id: "signupPassword", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, placeholder: "M\u00EDnimo 6 caracteres", minLength: 6 })] }), _jsx(Button, { type: "submit", className: "w-full bg-red-600 hover:bg-red-700", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Creando cuenta..."] })) : ('Crear Cuenta de Franquiciado') })] }) }), _jsx(TabsContent, { value: "reset", children: _jsxs("form", { onSubmit: handlePasswordReset, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "resetEmail", children: "Email" }), _jsx(Input, { id: "resetEmail", type: "email", value: resetEmail, onChange: (e) => setResetEmail(e.target.value), required: true, placeholder: "tu.email@ejemplo.com" })] }), _jsx(Button, { type: "submit", className: "w-full bg-red-600 hover:bg-red-700", disabled: isResettingPassword, children: isResettingPassword ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Enviando enlace..."] })) : ('Enviar enlace de recuperación') }), _jsx("div", { className: "text-center", children: _jsx("button", { type: "button", onClick: () => setActiveTab('signin'), className: "text-sm text-gray-600 hover:text-gray-700 underline", children: "Volver al inicio de sesi\u00F3n" }) })] }) })] }), _jsx("div", { className: "mt-6 pt-4 border-t text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["\u00BFEres asesor de McDonald's?", ' ', _jsx("button", { onClick: () => navigate('/advisor-auth'), className: "text-blue-600 hover:text-blue-700 underline font-medium", children: "Accede aqu\u00ED" })] }) })] })] })] }) }));
};
export default AuthPage;
