import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
export const DebugSection = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    if (!user)
        return null;
    return (_jsxs("div", { className: "mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800 mb-2", children: "Debug Info:" }), _jsxs("p", { className: "text-sm text-yellow-700", children: ["Usuario: ", user.email] }), _jsxs("p", { className: "text-sm text-yellow-700", children: ["Rol: ", user.role] }), _jsxs("p", { className: "text-sm text-yellow-700", children: ["Loading: ", loading ? 'true' : 'false'] }), _jsx(Button, { onClick: () => {
                    console.log('DebugSection - Force redirect clicked');
                    navigate('/dashboard', { replace: true });
                }, className: "mt-2 text-xs", size: "sm", children: "Forzar redirecci\u00F3n al Dashboard" })] }));
};
