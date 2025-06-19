import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, DollarSign, Calendar, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
export const DashboardSummary = ({ totalRestaurants, displayRestaurants, isTemporaryData = false }) => {
    console.log('DashboardSummary - Props:', {
        totalRestaurants,
        restaurantsCount: displayRestaurants?.length || 0,
        isTemporaryData
    });
    // Verificación exhaustiva de datos
    const safeRestaurants = Array.isArray(displayRestaurants) ? displayRestaurants.filter(r => r && typeof r === 'object') : [];
    const safeTotalRestaurants = typeof totalRestaurants === 'number' ? totalRestaurants : 0;
    // Calcular métricas con verificaciones adicionales
    const activeRestaurants = safeRestaurants.filter(r => {
        try {
            return r?.status === 'active' || !r?.status;
        }
        catch (error) {
            console.warn('DashboardSummary - Error filtering restaurant:', error);
            return false;
        }
    }).length;
    const totalRevenue = safeRestaurants.reduce((sum, r) => {
        try {
            const revenue = r?.lastYearRevenue;
            if (typeof revenue === 'number' && !isNaN(revenue)) {
                return sum + revenue;
            }
            return sum;
        }
        catch (error) {
            console.warn('DashboardSummary - Error calculating revenue:', error);
            return sum;
        }
    }, 0);
    const avgRevenue = safeTotalRestaurants > 0 ? totalRevenue / safeTotalRestaurants : 0;
    const handleRefresh = () => {
        console.log('DashboardSummary - Refreshing page');
        try {
            window.location.reload();
        }
        catch (error) {
            console.error('DashboardSummary - Error refreshing page:', error);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [isTemporaryData && (_jsx(Card, { className: "border-orange-200 bg-orange-50", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-orange-600" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-medium text-orange-900", children: "Trabajando con datos temporales" }), _jsx("p", { className: "text-sm text-orange-800", children: "No se pudo conectar con la base de datos. Los datos mostrados son temporales." })] }), _jsxs(Button, { onClick: handleRefresh, variant: "outline", size: "sm", className: "border-orange-300 text-orange-700 hover:bg-orange-100", children: [_jsx(RefreshCw, { className: "w-4 h-4 mr-2" }), "Reconectar"] })] }) }) })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Restaurantes Totales" }), _jsx(Building2, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: safeTotalRestaurants }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [activeRestaurants, " activos"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ingresos Totales" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["\u20AC", totalRevenue.toLocaleString()] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "A\u00F1o anterior" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Promedio por Restaurante" }), _jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["\u20AC", Math.round(avgRevenue).toLocaleString()] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Ingresos promedio" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Estado" }), _jsx(Calendar, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: `text-2xl font-bold ${isTemporaryData ? 'text-orange-600' : 'text-green-600'}`, children: isTemporaryData ? 'Temporal' : 'Activo' }), _jsx("p", { className: "text-xs text-muted-foreground", children: isTemporaryData ? 'Datos sin conexión' : 'Todos los sistemas operativos' })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Mis Restaurantes" }) }), _jsx(CardContent, { children: safeTotalRestaurants === 0 ? (_jsxs("div", { className: "text-center py-8 text-muted-foreground", children: [_jsx(Building2, { className: "h-12 w-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "No hay restaurantes asignados" }), _jsx("p", { className: "text-sm", children: isTemporaryData
                                        ? 'Reconecta para ver tus restaurantes reales'
                                        : 'Contacta con tu asesor para más información' })] })) : (_jsx("div", { className: "space-y-4", children: safeRestaurants.map((restaurant, index) => {
                                // Verificación exhaustiva de cada restaurant
                                if (!restaurant || typeof restaurant !== 'object') {
                                    console.warn('DashboardSummary - Invalid restaurant at index:', index);
                                    return null;
                                }
                                const restaurantId = restaurant.id || `restaurant-${index}-${Date.now()}`;
                                const restaurantName = restaurant.name || restaurant.restaurant_name || `Restaurante ${restaurant.siteNumber || restaurant.site_number || index + 1}`;
                                const location = restaurant.location || `${restaurant.city || 'Ciudad'}, ${restaurant.address || 'Dirección'}`;
                                const siteNumber = restaurant.siteNumber || restaurant.site_number || 'N/A';
                                const revenue = typeof restaurant.lastYearRevenue === 'number' ? restaurant.lastYearRevenue : 0;
                                const status = restaurant.status || 'active';
                                return (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", children: restaurantName }), _jsx("p", { className: "text-sm text-muted-foreground", children: location }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Site: ", siteNumber] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-medium", children: ["\u20AC", revenue.toLocaleString()] }), _jsx("div", { className: "text-xs text-muted-foreground", children: "A\u00F1o anterior" }), _jsx("div", { className: `text-xs px-2 py-1 rounded-full ${status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'}`, children: status === 'active' ? 'Activo' : 'Inactivo' })] })] }, restaurantId));
                            }) })) })] })] }));
};
