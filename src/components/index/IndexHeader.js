import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Store, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
export const IndexHeader = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const handleUserRedirect = () => {
        console.log('IndexHeader - Manual navigation button clicked for user role:', user?.role);
        try {
            if (user && ['asesor', 'admin', 'superadmin'].includes(user.role)) {
                console.log('IndexHeader - Manual redirect to /advisor');
                navigate('/advisor');
            }
            else {
                console.log('IndexHeader - Manual redirect to /dashboard');
                navigate('/dashboard');
            }
        }
        catch (error) {
            console.error('IndexHeader - Error in manual navigation:', error);
        }
    };
    return (_jsx("header", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-lg", children: "M" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "McDonald's Portal" }), _jsx("p", { className: "text-sm text-gray-500", children: "Sistema de Gesti\u00F3n Integral" })] })] }), _jsx("div", { className: "flex items-center space-x-3", children: user ? (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["Hola, ", user.full_name || user.email] }), _jsx(Button, { onClick: handleUserRedirect, className: "bg-red-600 hover:bg-red-700 text-white", children: "Ir al Panel" })] })) : (_jsxs(_Fragment, { children: [_jsxs(Button, { variant: "outline", onClick: () => navigate('/auth'), className: "border-gray-300 text-gray-700 hover:bg-gray-50", children: [_jsx(Store, { className: "w-4 h-4 mr-2" }), "Franquiciados"] }), _jsxs(Button, { onClick: () => navigate('/advisor-auth'), className: "bg-blue-600 hover:bg-blue-700 text-white", children: [_jsx(Shield, { className: "w-4 h-4 mr-2" }), "Asesores"] })] })) })] }) }) }));
};
