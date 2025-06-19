import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Store, Target, Activity, MapPin, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
const FranchiseeDashboard = () => {
    const { user, franchisee, restaurants } = useAuth();
    const [metrics, setMetrics] = useState({
        totalRestaurants: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        averageTicket: 0,
        customerSatisfaction: 0,
        employeeCount: 0,
        operationalEfficiency: 0
    });
    const [restaurantData, setRestaurantData] = useState([]);
    const [activityLog, setActivityLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTimeframe, setSelectedTimeframe] = useState('month');
    // Datos de ejemplo para gráficos
    const revenueData = [
        { month: 'Ene', revenue: 45000, target: 50000 },
        { month: 'Feb', revenue: 52000, target: 50000 },
        { month: 'Mar', revenue: 48000, target: 50000 },
        { month: 'Abr', revenue: 55000, target: 50000 },
        { month: 'May', revenue: 58000, target: 50000 },
        { month: 'Jun', revenue: 62000, target: 50000 },
    ];
    const performanceData = [
        { name: 'Ventas', value: 65, color: '#10B981' },
        { name: 'Costos', value: 25, color: '#EF4444' },
        { name: 'Beneficios', value: 10, color: '#3B82F6' },
    ];
    useEffect(() => {
        if (user && franchisee) {
            loadDashboardData();
        }
    }, [user, franchisee]);
    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Cargar métricas del franquiciado
            await loadFranchiseeMetrics();
            // Cargar datos de restaurantes
            await loadRestaurantData();
            // Cargar actividad reciente
            await loadActivityLog();
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
            toast.error('Error al cargar los datos del dashboard');
        }
        finally {
            setLoading(false);
        }
    };
    const loadFranchiseeMetrics = async () => {
        if (!franchisee)
            return;
        try {
            // Obtener métricas de restaurantes
            const { data: restaurantMetrics, error } = await supabase
                .from('franchisee_restaurants')
                .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
                .eq('franchisee_id', franchisee.id);
            if (error)
                throw error;
            // Calcular métricas
            const totalRestaurants = restaurantMetrics?.length || 0;
            const totalRevenue = restaurantMetrics?.reduce((sum, r) => sum + (r.last_year_revenue || 0), 0) || 0;
            const averageTicket = totalRevenue > 0 ? totalRevenue / (restaurantMetrics?.length || 1) : 0;
            setMetrics({
                totalRestaurants,
                totalRevenue,
                monthlyGrowth: 12.5, // Ejemplo
                averageTicket,
                customerSatisfaction: 4.2, // Ejemplo
                employeeCount: totalRestaurants * 25, // Estimación
                operationalEfficiency: 87.3 // Ejemplo
            });
        }
        catch (error) {
            console.error('Error loading franchisee metrics:', error);
        }
    };
    const loadRestaurantData = async () => {
        if (!franchisee)
            return;
        try {
            const { data, error } = await supabase
                .from('franchisee_restaurants')
                .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
                .eq('franchisee_id', franchisee.id);
            if (error)
                throw error;
            const formattedData = (data || []).map(item => ({
                id: item.id,
                restaurant_name: item.base_restaurant?.restaurant_name || 'Restaurante',
                site_number: item.base_restaurant?.site_number || '',
                address: item.base_restaurant?.address || '',
                city: item.base_restaurant?.city || '',
                status: item.status || 'activo',
                last_month_revenue: item.last_year_revenue || 0,
                monthly_growth: Math.random() * 20 - 10, // Ejemplo
                customer_count: Math.floor(Math.random() * 1000) + 500, // Ejemplo
                average_ticket: Math.floor(Math.random() * 20) + 8 // Ejemplo
            }));
            setRestaurantData(formattedData);
        }
        catch (error) {
            console.error('Error loading restaurant data:', error);
        }
    };
    const loadActivityLog = async () => {
        if (!franchisee)
            return;
        try {
            const { data, error } = await supabase
                .from('franchisee_activity_log')
                .select('*')
                .eq('franchisee_id', franchisee.id)
                .order('created_at', { ascending: false })
                .limit(10);
            if (error)
                throw error;
            // Mapear los datos para que coincidan con la interfaz ActivityLog
            const mappedData = (data || []).map(item => ({
                id: item.id,
                activity_type: item.activity_type,
                description: item.activity_description || '',
                created_at: item.created_at,
                entity_type: item.entity_type || '',
                metadata: item.metadata
            }));
            setActivityLog(mappedData);
        }
        catch (error) {
            console.error('Error loading activity log:', error);
        }
    };
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'activo': return 'bg-green-100 text-green-800';
            case 'inactivo': return 'bg-red-100 text-red-800';
            case 'mantenimiento': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getGrowthIcon = (growth) => {
        return growth >= 0 ? _jsx(TrendingUp, { className: "h-4 w-4 text-green-600" }) : _jsx(TrendingDown, { className: "h-4 w-4 text-red-600" });
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mx-auto mb-4" }), _jsx("p", { className: "text-gray-600", children: "Cargando dashboard..." })] }) }));
    }
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900", children: ["Dashboard de ", franchisee?.franchisee_name || 'Franquiciado'] }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["Bienvenido de vuelta, ", user?.full_name || user?.email] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs(Button, { variant: "outline", onClick: loadDashboardData, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Restaurantes" }), _jsx(Store, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: metrics.totalRestaurants }), _jsx("p", { className: "text-xs text-muted-foreground", children: "+2 este mes" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ingresos Totales" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["\u20AC", (metrics.totalRevenue / 1000).toFixed(1), "k"] }), _jsxs("div", { className: "flex items-center text-xs text-muted-foreground", children: [getGrowthIcon(metrics.monthlyGrowth), _jsxs("span", { className: "ml-1", children: [Math.abs(metrics.monthlyGrowth), "% vs mes anterior"] })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ticket Promedio" }), _jsx(Target, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["\u20AC", metrics.averageTicket.toFixed(2)] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "+\u20AC0.50 vs mes anterior" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Eficiencia Operativa" }), _jsx(Activity, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: [metrics.operationalEfficiency, "%"] }), _jsx(Progress, { value: metrics.operationalEfficiency, className: "mt-2" })] })] })] }), _jsxs(Tabs, { defaultValue: "overview", className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "overview", children: "Resumen" }), _jsx(TabsTrigger, { value: "restaurants", children: "Restaurantes" }), _jsx(TabsTrigger, { value: "analytics", children: "Analytics" }), _jsx(TabsTrigger, { value: "activity", children: "Actividad" })] }), _jsx(TabsContent, { value: "overview", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Evoluci\u00F3n de Ingresos" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(LineChart, { data: revenueData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "revenue", stroke: "#EF4444", strokeWidth: 2 }), _jsx(Line, { type: "monotone", dataKey: "target", stroke: "#6B7280", strokeWidth: 2, strokeDasharray: "5 5" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Distribuci\u00F3n de Performance" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(RechartsPieChart, { children: [_jsx(Pie, { data: performanceData, cx: "50%", cy: "50%", labelLine: false, label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: performanceData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) }) })] })] }) }), _jsx(TabsContent, { value: "restaurants", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Mis Restaurantes" }) }), _jsx(CardContent, { children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: restaurantData.map((restaurant) => (_jsxs("div", { className: "border rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: restaurant.restaurant_name }), _jsx(Badge, { className: getStatusColor(restaurant.status), children: restaurant.status })] }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx(MapPin, { className: "h-4 w-4 mr-2" }), restaurant.city] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Ingresos" }), _jsxs("p", { className: "font-medium", children: ["\u20AC", (restaurant.last_month_revenue / 1000).toFixed(1), "k"] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-500", children: "Crecimiento" }), _jsxs("div", { className: "flex items-center", children: [getGrowthIcon(restaurant.monthly_growth), _jsxs("span", { className: "ml-1", children: [Math.abs(restaurant.monthly_growth).toFixed(1), "%"] })] })] })] })] })] }, restaurant.id))) }) })] }) }), _jsx(TabsContent, { value: "analytics", className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Performance por Restaurante" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: restaurantData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "restaurant_name" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "last_month_revenue", fill: "#EF4444" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "M\u00E9tricas Detalladas" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Empleados Totales" }), _jsx("span", { className: "font-medium", children: metrics.employeeCount })] }), _jsx(Progress, { value: 75 })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Satisfacci\u00F3n del Cliente" }), _jsxs("span", { className: "font-medium", children: [metrics.customerSatisfaction, "/5"] })] }), _jsx(Progress, { value: metrics.customerSatisfaction * 20 })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "Eficiencia Operativa" }), _jsxs("span", { className: "font-medium", children: [metrics.operationalEfficiency, "%"] })] }), _jsx(Progress, { value: metrics.operationalEfficiency })] })] })] })] }) }), _jsx(TabsContent, { value: "activity", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Actividad Reciente" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: activityLog.length > 0 ? (activityLog.map((activity) => (_jsxs("div", { className: "flex items-start space-x-3 p-3 border rounded-lg", children: [_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full mt-2" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium", children: activity.activity_type }), _jsx("p", { className: "text-sm text-gray-600", children: activity.description }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: new Date(activity.created_at).toLocaleDateString('es-ES') })] })] }, activity.id)))) : (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Activity, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No hay actividad reciente" })] })) }) })] }) })] })] }));
};
export default FranchiseeDashboard;
