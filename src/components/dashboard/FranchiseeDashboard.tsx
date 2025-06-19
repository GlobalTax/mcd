import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Store, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Phone,
  Mail,
  Building,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface FranchiseeMetrics {
  totalRestaurants: number;
  totalRevenue: number;
  monthlyGrowth: number;
  averageTicket: number;
  customerSatisfaction: number;
  employeeCount: number;
  operationalEfficiency: number;
}

interface RestaurantData {
  id: string;
  restaurant_name: string;
  site_number: string;
  address: string;
  city: string;
  status: string;
  last_month_revenue: number;
  monthly_growth: number;
  customer_count: number;
  average_ticket: number;
}

interface ActivityLog {
  id: string;
  activity_type: string;
  description: string;
  created_at: string;
  entity_type: string;
  metadata: any;
}

const FranchiseeDashboard: React.FC = () => {
  const { user, franchisee, restaurants } = useAuth();
  const [metrics, setMetrics] = useState<FranchiseeMetrics>({
    totalRestaurants: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    averageTicket: 0,
    customerSatisfaction: 0,
    employeeCount: 0,
    operationalEfficiency: 0
  });
  const [restaurantData, setRestaurantData] = useState<RestaurantData[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

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
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadFranchiseeMetrics = async () => {
    if (!franchisee) return;

    try {
      // Obtener métricas de restaurantes
      const { data: restaurantMetrics, error } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
        .eq('franchisee_id', franchisee.id);

      if (error) throw error;

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

    } catch (error) {
      console.error('Error loading franchisee metrics:', error);
    }
  };

  const loadRestaurantData = async () => {
    if (!franchisee) return;

    try {
      const { data, error } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
        .eq('franchisee_id', franchisee.id);

      if (error) throw error;

      const formattedData: RestaurantData[] = (data || []).map(item => ({
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

    } catch (error) {
      console.error('Error loading restaurant data:', error);
    }
  };

  const loadActivityLog = async () => {
    if (!franchisee) return;

    try {
      const { data, error } = await supabase
        .from('franchisee_activity_log')
        .select('*')
        .eq('franchisee_id', franchisee.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Mapear los datos para que coincidan con la interfaz ActivityLog
      const mappedData: ActivityLog[] = (data || []).map(item => ({
        id: item.id,
        activity_type: item.activity_type,
        description: item.activity_description || '',
        created_at: item.created_at,
        entity_type: item.entity_type || '',
        metadata: item.metadata
      }));

      setActivityLog(mappedData);

    } catch (error) {
      console.error('Error loading activity log:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo': return 'bg-green-100 text-green-800';
      case 'inactivo': return 'bg-red-100 text-red-800';
      case 'mantenimiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard de {franchisee?.franchisee_name || 'Franquiciado'}
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenido de vuelta, {user?.full_name || user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurantes</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRestaurants}</div>
            <p className="text-xs text-muted-foreground">
              +2 este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{(metrics.totalRevenue / 1000).toFixed(1)}k
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {getGrowthIcon(metrics.monthlyGrowth)}
              <span className="ml-1">{Math.abs(metrics.monthlyGrowth)}% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{metrics.averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +€0.50 vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Operativa</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.operationalEfficiency}%</div>
            <Progress value={metrics.operationalEfficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurantes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Ingresos */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Distribución de Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
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

        <TabsContent value="restaurants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mis Restaurantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurantData.map((restaurant) => (
                  <div key={restaurant.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{restaurant.restaurant_name}</h3>
                      <Badge className={getStatusColor(restaurant.status)}>
                        {restaurant.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {restaurant.city}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-gray-500">Ingresos</p>
                          <p className="font-medium">€{(restaurant.last_month_revenue / 1000).toFixed(1)}k</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Crecimiento</p>
                          <div className="flex items-center">
                            {getGrowthIcon(restaurant.monthly_growth)}
                            <span className="ml-1">{Math.abs(restaurant.monthly_growth).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Restaurante</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={restaurantData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="restaurant_name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="last_month_revenue" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Métricas Detalladas */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Detalladas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Empleados Totales</span>
                    <span className="font-medium">{metrics.employeeCount}</span>
                  </div>
                  <Progress value={75} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Satisfacción del Cliente</span>
                    <span className="font-medium">{metrics.customerSatisfaction}/5</span>
                  </div>
                  <Progress value={metrics.customerSatisfaction * 20} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Eficiencia Operativa</span>
                    <span className="font-medium">{metrics.operationalEfficiency}%</span>
                  </div>
                  <Progress value={metrics.operationalEfficiency} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLog.length > 0 ? (
                  activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.activity_type}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.created_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay actividad reciente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FranchiseeDashboard; 