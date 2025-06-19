import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Globe, Monitor } from 'lucide-react';
import { useFranchiseeActivity } from '@/hooks/useFranchiseeActivity';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
export const FranchiseeAccessHistory = ({ franchiseeId }) => {
    const { accessLogs, loading } = useFranchiseeActivity(franchiseeId);
    const formatDuration = (minutes) => {
        if (!minutes)
            return 'N/A';
        if (minutes < 60)
            return `${Math.round(minutes)} min`;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);
        return `${hours}h ${remainingMinutes}m`;
    };
    const getStatusBadge = (log) => {
        if (log.logout_time) {
            return _jsx(Badge, { variant: "outline", className: "text-gray-600", children: "Sesi\u00F3n finalizada" });
        }
        return _jsx(Badge, { variant: "outline", className: "text-green-600", children: "Activo" });
    };
    return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Clock, { className: "w-5 h-5 mr-2" }), "Historial de Acceso"] }) }), _jsx(CardContent, { children: loading ? (_jsx("p", { className: "text-sm text-gray-500", children: "Cargando historial..." })) : accessLogs.length > 0 ? (_jsx("div", { className: "space-y-3 max-h-96 overflow-y-auto", children: accessLogs.map((log) => (_jsxs("div", { className: "p-3 bg-gray-50 rounded-lg space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center text-sm", children: [_jsx(User, { className: "w-4 h-4 mr-2 text-gray-500" }), _jsx("span", { className: "font-medium", children: format(new Date(log.login_time), 'dd/MM/yyyy HH:mm', { locale: es }) })] }), getStatusBadge(log)] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-xs text-gray-600", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Clock, { className: "w-3 h-3 mr-1" }), "Duraci\u00F3n: ", formatDuration(log.session_duration)] }), log.ip_address && (_jsxs("div", { className: "flex items-center", children: [_jsx(Globe, { className: "w-3 h-3 mr-1" }), "IP: ", log.ip_address] }))] }), log.user_agent && (_jsxs("div", { className: "flex items-center text-xs text-gray-600", children: [_jsx(Monitor, { className: "w-3 h-3 mr-1" }), _jsx("span", { className: "truncate", children: log.user_agent })] }))] }, log.id))) })) : (_jsx("p", { className: "text-sm text-gray-500", children: "No hay registros de acceso" })) })] }));
};
