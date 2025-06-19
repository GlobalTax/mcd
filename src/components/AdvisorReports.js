import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building, Users, MapPin, TrendingUp, Calendar, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#65a30d', '#059669', '#0891b2', '#2563eb', '#7c3aed'];
export const AdvisorReports = () => {
    const [reportData, setReportData] = useState({
        totalRestaurants: 0,
        totalFranchisees: 0,
        totalAssignments: 0,
        unassignedRestaurants: 0,
        franchiseesByCity: [],
        restaurantsByType: [],
        assignmentsByMonth: []
    });
    const [loading, setLoading] = useState(true);
    const fetchReportData = async () => {
        try {
            setLoading(true);
            // Obtener datos de restaurantes
            const { data: restaurants, error: restaurantsError } = await supabase
                .from('base_restaurants')
                .select('*');
            if (restaurantsError) {
                console.error('Error fetching restaurants:', restaurantsError);
                return;
            }
            // Obtener datos de franquiciados
            const { data: franchisees, error: franchiseesError } = await supabase
                .from('franchisees')
                .select('*');
            if (franchiseesError) {
                console.error('Error fetching franchisees:', franchiseesError);
                return;
            }
            // Obtener datos de asignaciones
            const { data: assignments, error: assignmentsError } = await supabase
                .from('franchisee_restaurants')
                .select('*, base_restaurant:base_restaurants(*)');
            if (assignmentsError) {
                console.error('Error fetching assignments:', assignmentsError);
                return;
            }
            // Procesar datos para reportes
            const totalRestaurants = restaurants?.length || 0;
            const totalFranchisees = franchisees?.length || 0;
            const totalAssignments = assignments?.length || 0;
            const unassignedRestaurants = totalRestaurants - totalAssignments;
            // Franquiciados por ciudad
            const cityCount = franchisees?.reduce((acc, franchisee) => {
                const city = franchisee.city || 'Sin especificar';
                acc[city] = (acc[city] || 0) + 1;
                return acc;
            }, {}) || {};
            const franchiseesByCity = Object.entries(cityCount).map(([city, count]) => ({
                city,
                count
            }));
            // Restaurantes por tipo
            const typeCount = restaurants?.reduce((acc, restaurant) => {
                const type = restaurant.restaurant_type || 'traditional';
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {}) || {};
            const restaurantsByType = Object.entries(typeCount).map(([type, count], index) => ({
                type: type === 'traditional' ? 'Tradicional' :
                    type === 'mccafe' ? 'McCafé' :
                        type === 'drive_thru' ? 'Drive Thru' :
                            type === 'express' ? 'Express' : type,
                count,
                color: COLORS[index % COLORS.length]
            }));
            // Asignaciones por mes (últimos 6 meses)
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const monthlyAssignments = assignments?.filter(assignment => new Date(assignment.assigned_at) >= sixMonthsAgo).reduce((acc, assignment) => {
                const month = new Date(assignment.assigned_at).toLocaleDateString('es-ES', {
                    month: 'short',
                    year: 'numeric'
                });
                acc[month] = (acc[month] || 0) + 1;
                return acc;
            }, {}) || {};
            const assignmentsByMonth = Object.entries(monthlyAssignments).map(([month, count]) => ({
                month,
                count
            }));
            setReportData({
                totalRestaurants,
                totalFranchisees,
                totalAssignments,
                unassignedRestaurants,
                franchiseesByCity,
                restaurantsByType,
                assignmentsByMonth
            });
        }
        catch (err) {
            console.error('Error in fetchReportData:', err);
            toast.error('Error al cargar los datos de reporte');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReportData();
    }, []);
    if (loading) {
        return (_jsx("div", { className: "text-center py-8", children: _jsx("p", { children: "Cargando reportes..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold", children: "Reportes y An\u00E1lisis" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Restaurantes" }), _jsx(Building, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: reportData.totalRestaurants }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [reportData.unassignedRestaurants, " sin asignar"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Total Franquiciados" }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: reportData.totalFranchisees }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Registrados en el sistema" })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Asignaciones Activas" }), _jsx(TrendingUp, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: reportData.totalAssignments }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [((reportData.totalAssignments / reportData.totalRestaurants) * 100).toFixed(1), "% del total"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Tasa de Ocupaci\u00F3n" }), _jsx(Globe, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: [reportData.totalRestaurants > 0
                                                ? ((reportData.totalAssignments / reportData.totalRestaurants) * 100).toFixed(1)
                                                : 0, "%"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Restaurantes asignados" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(MapPin, { className: "w-5 h-5 mr-2" }), "Franquiciados por Ciudad"] }) }), _jsx(CardContent, { children: reportData.franchiseesByCity.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: reportData.franchiseesByCity, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "city" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#dc2626" })] }) })) : (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No hay datos disponibles" })) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Building, { className: "w-5 h-5 mr-2" }), "Restaurantes por Tipo"] }) }), _jsx(CardContent, { children: reportData.restaurantsByType.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: reportData.restaurantsByType, cx: "50%", cy: "50%", labelLine: false, label: ({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`, outerRadius: 80, fill: "#8884d8", dataKey: "count", children: reportData.restaurantsByType.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, {})] }) })) : (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No hay datos disponibles" })) })] })] }), reportData.assignmentsByMonth.length > 0 && (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Calendar, { className: "w-5 h-5 mr-2" }), "Asignaciones por Mes (\u00DAltimos 6 meses)"] }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: reportData.assignmentsByMonth, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "count", fill: "#059669" })] }) }) })] }))] }));
};
