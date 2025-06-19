import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Mail, Phone, MapPin, User, Clock, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFranchiseeDetail } from '@/hooks/useFranchiseeDetail';
import { FranchiseeRestaurantsTable } from '@/components/FranchiseeRestaurantsTable';
import { UserCreationPanel } from '@/components/admin/UserCreationPanel';
import { FranchiseeAccessHistory } from '@/components/franchisee/FranchiseeAccessHistory';
import FranchiseeActivityHistory from '@/components/franchisee/FranchiseeActivityHistory';
import { FranchiseeUsers } from '@/components/franchisee/FranchiseeUsers';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
export default function FranchiseeDetailPage() {
    const { franchiseeId } = useParams();
    const navigate = useNavigate();
    const { franchisee, restaurants, loading, error, refetch } = useFranchiseeDetail(franchiseeId);
    const franchiseeUsersRef = useRef(null);
    // Mostrar mensaje de carga
    if (loading) {
        return (_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex items-center space-x-2 text-gray-600 mb-6", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/advisor'), children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Volver"] }) }), _jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/3" }), _jsx("div", { className: "h-48 bg-gray-200 rounded" })] })] }));
    }
    // Mostrar mensaje de error con más detalles
    if (error || !franchisee) {
        return (_jsxs("div", { className: "p-6", children: [_jsx("div", { className: "flex items-center space-x-2 text-gray-600 mb-6", children: _jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/advisor'), children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Volver"] }) }), _jsxs("div", { className: "text-center py-8", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "Error al cargar el franquiciado" }), _jsx("p", { className: "text-gray-600 mb-4", children: error || 'Franquiciado no encontrado' }), _jsxs("p", { className: "text-sm text-gray-500 mb-4", children: ["ID del franquiciado: ", franchiseeId || 'No proporcionado'] }), _jsx(Button, { onClick: () => window.location.reload(), className: "mr-2", children: "Reintentar" }), _jsx(Button, { variant: "outline", onClick: () => navigate('/advisor'), children: "Volver al listado" })] })] }));
    }
    const getStatusBadge = () => {
        if (!franchisee.hasAccount) {
            return _jsx(Badge, { variant: "outline", className: "text-gray-600 border-gray-300", children: "Sin cuenta" });
        }
        if (franchisee.isOnline) {
            return _jsxs(Badge, { variant: "outline", className: "text-green-600 border-green-300", children: [_jsx(Wifi, { className: "w-3 h-3 mr-1" }), "En l\u00EDnea"] });
        }
        return _jsxs(Badge, { variant: "outline", className: "text-gray-600 border-gray-300", children: [_jsx(WifiOff, { className: "w-3 h-3 mr-1" }), "Desconectado"] });
    };
    const handleUserCreated = () => {
        // Refrescar la lista de usuarios cuando se crea uno nuevo
        franchiseeUsersRef.current?.refresh();
    };
    return (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => navigate('/advisor'), children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Volver"] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: franchisee.franchisee_name }), _jsx("p", { className: "text-gray-600", children: "Detalle del franquiciado" })] })] }), getStatusBadge()] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(User, { className: "w-5 h-5 mr-2" }), "Informaci\u00F3n del Franquiciado"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [franchisee.company_name && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Building, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "font-medium", children: "Empresa:" }), _jsx("span", { children: franchisee.company_name })] })), franchisee.profiles?.email && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Mail, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "font-medium", children: "Email:" }), _jsx("span", { children: franchisee.profiles.email })] })), franchisee.profiles?.phone && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Phone, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "font-medium", children: "Tel\u00E9fono:" }), _jsx("span", { children: franchisee.profiles.phone })] })), franchisee.tax_id && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("span", { className: "font-medium", children: "CIF/NIF:" }), _jsx("span", { children: franchisee.tax_id })] }))] }), _jsxs("div", { className: "space-y-3", children: [(franchisee.city || franchisee.state) && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "font-medium", children: "Ubicaci\u00F3n:" }), _jsxs("span", { children: [franchisee.city, franchisee.state ? `, ${franchisee.state}` : ''] })] })), franchisee.hasAccount && franchisee.lastAccess && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "font-medium", children: "\u00DAltimo acceso:" }), _jsx("span", { children: format(new Date(franchisee.lastAccess), 'dd/MM/yyyy HH:mm', { locale: es }) })] })), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Building, { className: "w-4 h-4 text-gray-500" }), _jsx("span", { className: "font-medium", children: "Restaurantes:" }), _jsx(Badge, { variant: "outline", children: restaurants.length })] })] })] }) })] }), _jsx(UserCreationPanel, { onUserCreated: handleUserCreated }), _jsx(FranchiseeUsers, { ref: franchiseeUsersRef, franchiseeId: franchisee.id, franchiseeName: franchisee.franchisee_name }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(FranchiseeAccessHistory, { franchiseeId: franchisee.id }), _jsx(FranchiseeActivityHistory, {})] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Building, { className: "w-5 h-5 mr-2" }), "Restaurantes Asignados (", restaurants.length, ")"] }) }), _jsx(CardContent, { children: restaurants.length > 0 ? (_jsx(FranchiseeRestaurantsTable, { franchiseeId: franchisee.id, restaurants: restaurants })) : (_jsx("p", { className: "text-gray-500 text-center py-8", children: "No hay restaurantes asignados" })) })] })] }));
}
