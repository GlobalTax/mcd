import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
const ProtectedRoute = ({ children, allowedRoles, requiredRole }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin" }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/auth", replace: true });
    }
    // Check if user has required role - usando allowedRoles principalmente
    if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600 mt-2", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
        }
    }
    // Check if user has required role - para asesor permitir también admin y superadmin
    if (requiredRole) {
        if (requiredRole === 'asesor') {
            // Si se requiere asesor, permitir asesor, admin y superadmin
            if (!['asesor', 'admin', 'superadmin'].includes(user.role)) {
                return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600 mt-2", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
            }
        }
        else if (user.role !== requiredRole) {
            return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600", children: "Acceso Denegado" }), _jsx("p", { className: "text-gray-600 mt-2", children: "No tienes permisos para acceder a esta p\u00E1gina." })] }) }));
        }
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
