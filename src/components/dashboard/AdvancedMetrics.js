import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Target, DollarSign, Users, Clock } from 'lucide-react';
import { useAnalytics } from '@/utils/analytics';
export const AdvancedMetrics = ({ totalRestaurants, totalRevenue, avgRevenue, activeRestaurants, previousMonthData, targets }) => {
    const { trackUserAction } = useAnalytics();
    const metrics = useMemo(() => {
        const calculateMetric = (current, previous, target) => {
            const change = current - previous;
            const percentageChange = previous > 0 ? (change / previous) * 100 : 0;
            let trend = 'stable';
            if (percentageChange > 2)
                trend = 'up';
            else if (percentageChange < -2)
                trend = 'down';
            return {
                current,
                previous,
                target,
                unit: '€',
                trend,
                percentageChange: Math.abs(percentageChange)
            };
        };
        return {
            revenue: calculateMetric(totalRevenue, previousMonthData?.totalRevenue || totalRevenue, targets?.totalRevenue || totalRevenue),
            avgRevenue: calculateMetric(avgRevenue, previousMonthData?.avgRevenue || avgRevenue, targets?.avgRevenue || avgRevenue),
            activeRestaurants: calculateMetric(activeRestaurants, previousMonthData?.activeRestaurants || activeRestaurants, targets?.activeRestaurants || activeRestaurants)
        };
    }, [totalRevenue, avgRevenue, activeRestaurants, previousMonthData, targets]);
    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up':
                return _jsx(TrendingUp, { className: "w-4 h-4 text-green-600" });
            case 'down':
                return _jsx(TrendingDown, { className: "w-4 h-4 text-red-600" });
            default:
                return _jsx(Minus, { className: "w-4 h-4 text-gray-400" });
        }
    };
    const getTrendColor = (trend) => {
        switch (trend) {
            case 'up':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'down':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
    const getPerformanceStatus = (current, target) => {
        const percentage = (current / target) * 100;
        if (percentage >= 110)
            return 'excellent';
        if (percentage >= 100)
            return 'good';
        if (percentage >= 80)
            return 'warning';
        return 'critical';
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'excellent':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'good':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'critical':
                return 'bg-red-100 text-red-800 border-red-200';
        }
    };
    const handleMetricClick = (metricName) => {
        trackUserAction('metric_clicked', metricName);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleMetricClick('revenue'), children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Ingresos Totales" }), _jsx(DollarSign, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["\u20AC", metrics.revenue.current.toLocaleString()] }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [getTrendIcon(metrics.revenue.trend), _jsxs("span", { className: `text-sm ${getTrendColor(metrics.revenue.trend)}`, children: [metrics.revenue.percentageChange.toFixed(1), "% vs mes anterior"] })] }), targets && (_jsx("div", { className: "mt-2", children: _jsx(Badge, { className: getStatusColor(getPerformanceStatus(metrics.revenue.current, metrics.revenue.target)), children: getPerformanceStatus(metrics.revenue.current, metrics.revenue.target).toUpperCase() }) }))] })] }), _jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleMetricClick('avg_revenue'), children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Promedio por Restaurante" }), _jsx(Target, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold", children: ["\u20AC", Math.round(metrics.avgRevenue.current).toLocaleString()] }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [getTrendIcon(metrics.avgRevenue.trend), _jsxs("span", { className: `text-sm ${getTrendColor(metrics.avgRevenue.trend)}`, children: [metrics.avgRevenue.percentageChange.toFixed(1), "% vs mes anterior"] })] }), targets && (_jsx("div", { className: "mt-2", children: _jsx(Badge, { className: getStatusColor(getPerformanceStatus(metrics.avgRevenue.current, metrics.avgRevenue.target)), children: getPerformanceStatus(metrics.avgRevenue.current, metrics.avgRevenue.target).toUpperCase() }) }))] })] }), _jsxs(Card, { className: "cursor-pointer hover:shadow-md transition-shadow", onClick: () => handleMetricClick('active_restaurants'), children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between space-y-0 pb-2", children: [_jsx(CardTitle, { className: "text-sm font-medium", children: "Restaurantes Activos" }), _jsx(Users, { className: "h-4 w-4 text-muted-foreground" })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold", children: metrics.activeRestaurants.current }), _jsxs("div", { className: "flex items-center space-x-2 mt-2", children: [getTrendIcon(metrics.activeRestaurants.trend), _jsxs("span", { className: `text-sm ${getTrendColor(metrics.activeRestaurants.trend)}`, children: [metrics.activeRestaurants.percentageChange.toFixed(1), "% vs mes anterior"] })] }), _jsxs("div", { className: "mt-2 text-sm text-muted-foreground", children: [totalRestaurants - activeRestaurants, " inactivos"] })] })] })] }), _jsxs(Card, { className: "border-orange-200 bg-orange-50", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2 text-orange-900", children: [_jsx(AlertTriangle, { className: "h-5 w-5" }), _jsx("span", { children: "Alertas y Recomendaciones" })] }) }), _jsxs(CardContent, { className: "space-y-3", children: [metrics.revenue.trend === 'down' && (_jsxs("div", { className: "flex items-center space-x-2 text-orange-800", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsxs("span", { children: ["Los ingresos han disminuido un ", metrics.revenue.percentageChange.toFixed(1), "% respecto al mes anterior"] })] })), activeRestaurants < totalRestaurants * 0.9 && (_jsxs("div", { className: "flex items-center space-x-2 text-orange-800", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsxs("span", { children: [(totalRestaurants - activeRestaurants), " restaurantes est\u00E1n inactivos"] })] })), targets && metrics.revenue.current < metrics.revenue.target * 0.8 && (_jsxs("div", { className: "flex items-center space-x-2 text-red-800", children: [_jsx(AlertTriangle, { className: "h-4 w-4" }), _jsxs("span", { children: ["Los ingresos est\u00E1n un ", (100 - (metrics.revenue.current / metrics.revenue.target) * 100).toFixed(1), "% por debajo del objetivo"] })] })), metrics.revenue.trend === 'up' && metrics.revenue.percentageChange > 10 && (_jsxs("div", { className: "flex items-center space-x-2 text-green-800", children: [_jsx(TrendingUp, { className: "h-4 w-4" }), _jsxs("span", { children: ["\u00A1Excelente crecimiento! Los ingresos han aumentado un ", metrics.revenue.percentageChange.toFixed(1), "%"] })] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Clock, { className: "h-5 w-5" }), _jsx("span", { children: "Resumen de Rendimiento" })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [metrics.revenue.trend === 'up' ? '+' : '', metrics.revenue.percentageChange.toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Crecimiento Ingresos" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-blue-600", children: [((activeRestaurants / totalRestaurants) * 100).toFixed(1), "%"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Tasa de Actividad" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-purple-600", children: ["\u20AC", Math.round(avgRevenue / 1000), "k"] }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Promedio por Restaurante" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: totalRestaurants }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Total Restaurantes" })] })] }) })] })] }));
};
