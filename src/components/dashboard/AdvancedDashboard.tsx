import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Building2, 
  Target,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  RefreshCw,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '@/utils/analytics';
import { useCache } from '@/utils/cache';
import { useNotifications, createNotification } from '@/components/NotificationSystem';

interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage' | 'time';
  icon: React.ReactNode;
  color: string;
  target?: number;
  progress?: number;
}

interface DashboardWidget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'table' | 'list';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  config: any;
  isVisible: boolean;
  isMinimized: boolean;
}

interface DashboardConfig {
  layout: 'grid' | 'flexible';
  theme: 'light' | 'dark' | 'auto';
  refreshInterval: number;
  widgets: DashboardWidget[];
}

const AdvancedDashboard: React.FC = () => {
  const [config, setConfig] = useState<DashboardConfig>({
    layout: 'grid',
    theme: 'auto',
    refreshInterval: 30000, // 30 segundos
    widgets: [],
  });
  
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  
  const analytics = useAnalytics();
  const cache = useCache();
  const { addNotification } = useNotifications();

  // Datos de ejemplo para gráficos
  const chartData = useMemo(() => [
    { name: 'Ene', ventas: 4000, gastos: 2400, ganancias: 1600 },
    { name: 'Feb', ventas: 3000, gastos: 1398, ganancias: 1602 },
    { name: 'Mar', ventas: 2000, gastos: 9800, ganancias: 1200 },
    { name: 'Abr', ventas: 2780, gastos: 3908, ganancias: 1872 },
    { name: 'May', ventas: 1890, gastos: 4800, ganancias: 1090 },
    { name: 'Jun', ventas: 2390, gastos: 3800, ganancias: 1590 },
  ], []);

  const pieData = useMemo(() => [
    { name: 'Comida', value: 400, color: '#8884d8' },
    { name: 'Bebidas', value: 300, color: '#82ca9d' },
    { name: 'Postres', value: 200, color: '#ffc658' },
    { name: 'Otros', value: 100, color: '#ff7300' },
  ], []);

  // Métricas de ejemplo
  const defaultMetrics: DashboardMetric[] = [
    {
      id: 'revenue',
      title: 'Ingresos Totales',
      value: 125000,
      change: 12.5,
      changeType: 'increase',
      format: 'currency',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-green-600',
      target: 150000,
      progress: 83,
    },
    {
      id: 'restaurants',
      title: 'Restaurantes Activos',
      value: 45,
      change: -2.1,
      changeType: 'decrease',
      format: 'number',
      icon: <Building2 className="h-4 w-4" />,
      color: 'text-blue-600',
      target: 50,
      progress: 90,
    },
    {
      id: 'customers',
      title: 'Clientes Atendidos',
      value: 12500,
      change: 8.3,
      changeType: 'increase',
      format: 'number',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600',
      target: 15000,
      progress: 83,
    },
    {
      id: 'efficiency',
      title: 'Eficiencia Operativa',
      value: 87.5,
      change: 3.2,
      changeType: 'increase',
      format: 'percentage',
      icon: <Target className="h-4 w-4" />,
      color: 'text-orange-600',
      target: 90,
      progress: 97,
    },
  ];

  useEffect(() => {
    setMetrics(defaultMetrics);
    loadDashboardConfig();
    startAutoRefresh();
    
    // Track dashboard view
    analytics.trackEvent('Dashboard', 'view', 'advanced');
    
    return () => stopAutoRefresh();
  }, []);

  const loadDashboardConfig = () => {
    const savedConfig = cache.get('dashboard-config') as DashboardConfig | null;
    if (savedConfig) {
      setConfig(savedConfig);
    }
  };

  const saveDashboardConfig = (newConfig: DashboardConfig) => {
    setConfig(newConfig);
    cache.set('dashboard-config', newConfig, 24 * 60 * 60 * 1000); // 24 horas
  };

  const startAutoRefresh = () => {
    const interval = setInterval(() => {
      refreshData();
    }, config.refreshInterval);
    
    return () => clearInterval(interval);
  };

  const stopAutoRefresh = () => {
    // Cleanup handled by useEffect
  };

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar métricas con datos simulados
      const updatedMetrics = metrics.map(metric => ({
        ...metric,
        value: metric.value + Math.random() * 1000 - 500,
        change: metric.change + Math.random() * 10 - 5,
      }));
      
      setMetrics(updatedMetrics);
      setLastUpdate(new Date());
      
      addNotification(createNotification.success(
        'Dashboard Actualizado',
        'Los datos han sido actualizados correctamente'
      ));
      
      analytics.trackEvent('Dashboard', 'refresh', 'success');
    } catch (error) {
      addNotification(createNotification.error(
        'Error de Actualización',
        'No se pudieron actualizar los datos del dashboard'
      ));
      
      analytics.trackEvent('Dashboard', 'refresh', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatValue = (value: number, format: DashboardMetric['format']): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'EUR',
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'time':
        return `${Math.floor(value / 60)}:${(value % 60).toString().padStart(2, '0')}`;
      default:
        return new Intl.NumberFormat('es-ES').format(value);
    }
  };

  const getChangeIcon = (changeType: DashboardMetric['changeType']) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const exportDashboard = () => {
    const data = {
      metrics,
      config,
      lastUpdate,
      timeRange: selectedTimeRange,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    analytics.trackEvent('Dashboard', 'export', 'json');
    addNotification(createNotification.success('Dashboard Exportado', 'Los datos han sido exportados correctamente'));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header del Dashboard */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Avanzado</h1>
            <p className="text-gray-600 mt-1">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedTimeRange} onValueChange={(value: any) => setSelectedTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">Última hora</SelectItem>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportDashboard}>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <div className={metric.color}>
                {metric.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatValue(metric.value, metric.format)}
              </div>
              <div className="flex items-center space-x-2 mt-2">
                {getChangeIcon(metric.changeType)}
                <span className={`text-sm ${
                  metric.changeType === 'increase' ? 'text-green-600' : 
                  metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs período anterior</span>
              </div>
              {metric.progress && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progreso</span>
                    <span>{metric.progress}%</span>
                  </div>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos y Widgets */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="custom">Personalizado</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Líneas - Ventas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Evolución de Ventas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="gastos" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Área - Ganancias */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Ganancias Acumuladas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="ganancias" 
                      stroke="#ffc658" 
                      fill="#ffc658" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Barras - Comparación */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Comparación Mensual</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ventas" fill="#8884d8" />
                    <Bar dataKey="gastos" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Pastel - Distribución */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Distribución de Ventas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Widget de Actividad Reciente */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'Nueva valoración creada', time: '2 min', type: 'success' },
                    { action: 'Presupuesto actualizado', time: '5 min', type: 'info' },
                    { action: 'Error en API detectado', time: '10 min', type: 'error' },
                    { action: 'Usuario autenticado', time: '15 min', type: 'success' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        item.type === 'success' ? 'bg-green-100' :
                        item.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {item.type === 'success' ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : item.type === 'error' ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <Info className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.time} atrás</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Widget de Estado del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { service: 'API Principal', status: 'online', uptime: '99.9%' },
                    { service: 'Base de Datos', status: 'online', uptime: '99.8%' },
                    { service: 'Cache', status: 'online', uptime: '99.7%' },
                    { service: 'Notificaciones', status: 'warning', uptime: '95.2%' },
                  ].map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{service.service}</p>
                        <p className="text-xs text-gray-500">Uptime: {service.uptime}</p>
                      </div>
                      <Badge variant={
                        service.status === 'online' ? 'default' :
                        service.status === 'warning' ? 'secondary' : 'destructive'
                      }>
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métricas de Rendimiento */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Tiempo de Carga', value: 1.2, unit: 's', target: 2.0 },
                    { name: 'Tiempo de Respuesta API', value: 150, unit: 'ms', target: 200 },
                    { name: 'Uso de Memoria', value: 45, unit: '%', target: 80 },
                    { name: 'CPU', value: 12, unit: '%', target: 70 },
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{metric.name}</span>
                        <span>{metric.value}{metric.unit}</span>
                      </div>
                      <Progress 
                        value={(metric.value / metric.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alertas y Notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle>Alertas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: 'high', message: 'Alto uso de CPU detectado', time: '5 min' },
                    { level: 'medium', message: 'Lentitud en respuesta de API', time: '15 min' },
                    { level: 'low', message: 'Actualización de caché pendiente', time: '1 hora' },
                  ].map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg border-l-4 ${
                      alert.level === 'high' ? 'border-red-500 bg-red-50' :
                      alert.level === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time} atrás</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium">Layout</label>
                  <Select 
                    value={config.layout} 
                    onValueChange={(value: 'grid' | 'flexible') => 
                      saveDashboardConfig({ ...config, layout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Tema</label>
                  <Select 
                    value={config.theme} 
                    onValueChange={(value: 'light' | 'dark' | 'auto') => 
                      saveDashboardConfig({ ...config, theme: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Oscuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Intervalo de Actualización</label>
                  <Select 
                    value={config.refreshInterval.toString()} 
                    onValueChange={(value) => 
                      saveDashboardConfig({ ...config, refreshInterval: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10000">10 segundos</SelectItem>
                      <SelectItem value="30000">30 segundos</SelectItem>
                      <SelectItem value="60000">1 minuto</SelectItem>
                      <SelectItem value="300000">5 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDashboard; 