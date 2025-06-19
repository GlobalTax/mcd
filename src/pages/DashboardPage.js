import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useFastAuth } from '@/hooks/useFastAuth';
import { useNavigate } from 'react-router-dom';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
const DashboardPage = () => {
    const { user, franchisee, restaurants, loading, isUsingCache } = useFastAuth();
    const navigate = useNavigate();
    console.log('DashboardPage - Fast loading state:', {
        user: user ? { id: user.id, role: user.role } : null,
        franchisee: franchisee ? { id: franchisee.id, name: franchisee.franchisee_name } : null,
        restaurantsCount: restaurants?.length || 0,
        loading,
        isUsingCache
    });
    // Transformar datos para el componente
    const displayRestaurants = restaurants.map(r => ({
        id: r.id || `restaurant-${Math.random()}`,
        name: r.base_restaurant?.restaurant_name || 'Restaurante',
        restaurant_name: r.base_restaurant?.restaurant_name || 'Restaurante',
        location: r.base_restaurant ?
            `${r.base_restaurant.city || 'Ciudad'}, ${r.base_restaurant.address || 'Dirección'}` :
            'Ubicación',
        city: r.base_restaurant?.city || 'Ciudad',
        address: r.base_restaurant?.address || 'Dirección',
        siteNumber: r.base_restaurant?.site_number || 'N/A',
        site_number: r.base_restaurant?.site_number || 'N/A',
        franchiseeName: franchisee?.franchisee_name || 'Franquiciado',
        franchise_start_date: r.franchise_start_date,
        franchise_end_date: r.franchise_end_date,
        restaurant_type: r.base_restaurant?.restaurant_type || 'traditional',
        status: r.status || 'active',
        lastYearRevenue: typeof r.last_year_revenue === 'number' ? r.last_year_revenue : 0,
        baseRent: typeof r.monthly_rent === 'number' ? r.monthly_rent : 0,
        isOwnedByMcD: false,
    }));
    const totalRestaurants = displayRestaurants?.length || 0;
    // Loading rápido - máximo 1 segundo
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Cargando dashboard r\u00E1pido..." })] }) }));
    }
    return (_jsx(SidebarProvider, { children: _jsxs("div", { className: "min-h-screen flex w-full bg-gray-50", children: [_jsx(AppSidebar, {}), _jsxs(SidebarInset, { className: "flex-1", children: [_jsxs("header", { className: "flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6", children: [_jsx(SidebarTrigger, { className: "-ml-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "Dashboard" }), isUsingCache ? (_jsxs("div", { className: "flex items-center gap-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs", children: [_jsx(WifiOff, { className: "w-3 h-3" }), _jsx("span", { children: "Modo offline" })] })) : (_jsxs("div", { className: "flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs", children: [_jsx(Wifi, { className: "w-3 h-3" }), _jsx("span", { children: "En l\u00EDnea" })] }))] }), _jsx("p", { className: "text-sm text-gray-500", children: isUsingCache ? 'Datos predefinidos - Carga rápida' : 'Datos actualizados' })] }), _jsxs(Button, { onClick: () => window.location.reload(), variant: "outline", size: "sm", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Actualizar"] })] }), _jsx("main", { className: "flex-1 p-6", children: _jsx(DashboardSummary, { totalRestaurants: totalRestaurants, displayRestaurants: displayRestaurants, isTemporaryData: isUsingCache }) })] })] }) }));
};
export default DashboardPage;
