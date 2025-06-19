import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Target, DollarSign, Users, Clock } from 'lucide-react';
import { useAnalytics } from '@/utils/analytics';

interface MetricData {
  current: number;
  previous: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}

interface AdvancedMetricsProps {
  totalRestaurants: number;
  totalRevenue: number;
  avgRevenue: number;
  activeRestaurants: number;
  previousMonthData?: {
    totalRestaurants: number;
    totalRevenue: number;
    avgRevenue: number;
    activeRestaurants: number;
  };
  targets?: {
    totalRevenue: number;
    avgRevenue: number;
    activeRestaurants: number;
  };
}

export const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({
  totalRestaurants,
  totalRevenue,
  avgRevenue,
  activeRestaurants,
  previousMonthData,
  targets
}) => {
  const { trackUserAction } = useAnalytics();

  const metrics = useMemo(() => {
    const calculateMetric = (
      current: number,
      previous: number,
      target: number
    ): MetricData => {
      const change = current - previous;
      const percentageChange = previous > 0 ? (change / previous) * 100 : 0;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (percentageChange > 2) trend = 'up';
      else if (percentageChange < -2) trend = 'down';

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
      revenue: calculateMetric(
        totalRevenue,
        previousMonthData?.totalRevenue || totalRevenue,
        targets?.totalRevenue || totalRevenue
      ),
      avgRevenue: calculateMetric(
        avgRevenue,
        previousMonthData?.avgRevenue || avgRevenue,
        targets?.avgRevenue || avgRevenue
      ),
      activeRestaurants: calculateMetric(
        activeRestaurants,
        previousMonthData?.activeRestaurants || activeRestaurants,
        targets?.activeRestaurants || activeRestaurants
      )
    };
  }, [totalRevenue, avgRevenue, activeRestaurants, previousMonthData, targets]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'down':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPerformanceStatus = (current: number, target: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    const percentage = (current / target) * 100;
    if (percentage >= 110) return 'excellent';
    if (percentage >= 100) return 'good';
    if (percentage >= 80) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: 'excellent' | 'good' | 'warning' | 'critical') => {
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

  const handleMetricClick = (metricName: string) => {
    trackUserAction('metric_clicked', metricName);
  };

  return (
    <div className="space-y-6">
      {/* Métricas Principales con Comparativas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMetricClick('revenue')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{metrics.revenue.current.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {getTrendIcon(metrics.revenue.trend)}
              <span className={`text-sm ${getTrendColor(metrics.revenue.trend)}`}>
                {metrics.revenue.percentageChange.toFixed(1)}% vs mes anterior
              </span>
            </div>
            {targets && (
              <div className="mt-2">
                <Badge className={getStatusColor(getPerformanceStatus(metrics.revenue.current, metrics.revenue.target))}>
                  {getPerformanceStatus(metrics.revenue.current, metrics.revenue.target).toUpperCase()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMetricClick('avg_revenue')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Restaurante</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Math.round(metrics.avgRevenue.current).toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {getTrendIcon(metrics.avgRevenue.trend)}
              <span className={`text-sm ${getTrendColor(metrics.avgRevenue.trend)}`}>
                {metrics.avgRevenue.percentageChange.toFixed(1)}% vs mes anterior
              </span>
            </div>
            {targets && (
              <div className="mt-2">
                <Badge className={getStatusColor(getPerformanceStatus(metrics.avgRevenue.current, metrics.avgRevenue.target))}>
                  {getPerformanceStatus(metrics.avgRevenue.current, metrics.avgRevenue.target).toUpperCase()}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMetricClick('active_restaurants')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurantes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.activeRestaurants.current}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {getTrendIcon(metrics.activeRestaurants.trend)}
              <span className={`text-sm ${getTrendColor(metrics.activeRestaurants.trend)}`}>
                {metrics.activeRestaurants.percentageChange.toFixed(1)}% vs mes anterior
              </span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {totalRestaurants - activeRestaurants} inactivos
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Automáticas */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-900">
            <AlertTriangle className="h-5 w-5" />
            <span>Alertas y Recomendaciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.revenue.trend === 'down' && (
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span>Los ingresos han disminuido un {metrics.revenue.percentageChange.toFixed(1)}% respecto al mes anterior</span>
            </div>
          )}
          
          {activeRestaurants < totalRestaurants * 0.9 && (
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span>{(totalRestaurants - activeRestaurants)} restaurantes están inactivos</span>
            </div>
          )}

          {targets && metrics.revenue.current < metrics.revenue.target * 0.8 && (
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span>Los ingresos están un {(100 - (metrics.revenue.current / metrics.revenue.target) * 100).toFixed(1)}% por debajo del objetivo</span>
            </div>
          )}

          {metrics.revenue.trend === 'up' && metrics.revenue.percentageChange > 10 && (
            <div className="flex items-center space-x-2 text-green-800">
              <TrendingUp className="h-4 w-4" />
              <span>¡Excelente crecimiento! Los ingresos han aumentado un {metrics.revenue.percentageChange.toFixed(1)}%</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de Rendimiento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Resumen de Rendimiento</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {metrics.revenue.trend === 'up' ? '+' : ''}{metrics.revenue.percentageChange.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Crecimiento Ingresos</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {((activeRestaurants / totalRestaurants) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Tasa de Actividad</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                €{Math.round(avgRevenue / 1000)}k
              </div>
              <div className="text-sm text-muted-foreground">Promedio por Restaurante</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totalRestaurants}
              </div>
              <div className="text-sm text-muted-foreground">Total Restaurantes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 