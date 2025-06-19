import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calendar, 
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  BarChart3,
  Zap,
  Lightbulb,
  Award,
  Activity,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Improvement {
  id: string;
  title: string;
  description: string;
  category: 'operational' | 'financial' | 'customer' | 'technology' | 'process';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'proposed' | 'approved' | 'in_progress' | 'completed' | 'cancelled';
  restaurant_id?: string;
  restaurant_name?: string;
  estimated_cost: number;
  actual_cost: number;
  estimated_roi: number;
  actual_roi: number;
  implementation_date: string;
  completion_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  metrics: ImprovementMetrics;
}

interface ImprovementMetrics {
  revenue_impact: number;
  cost_savings: number;
  efficiency_gain: number;
  customer_satisfaction: number;
  employee_satisfaction: number;
  time_savings: number;
}

interface ImprovementPlan {
  id: string;
  name: string;
  description: string;
  target_date: string;
  status: 'draft' | 'active' | 'completed';
  improvements: string[];
  total_estimated_cost: number;
  total_estimated_roi: number;
  created_by: string;
  created_at: string;
}

const ImprovementsManagement: React.FC = () => {
  const { user, franchisee } = useAuth();
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [plans, setPlans] = useState<ImprovementPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImprovement, setSelectedImprovement] = useState<Improvement | null>(null);
  const [showCreateImprovement, setShowCreateImprovement] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mejoras de ejemplo
  const exampleImprovements: Improvement[] = [
    {
      id: '1',
      title: 'Implementación de Sistema de Pedidos Digital',
      description: 'Sistema de pedidos online para aumentar ventas y reducir errores',
      category: 'technology',
      priority: 'high',
      status: 'completed',
      restaurant_id: 'rest-1',
      restaurant_name: 'McDonald\'s Plaza Mayor',
      estimated_cost: 15000,
      actual_cost: 14200,
      estimated_roi: 25,
      actual_roi: 32,
      implementation_date: '2024-01-15',
      completion_date: '2024-02-15',
      created_by: user?.email || 'admin',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-02-15T00:00:00Z',
      metrics: {
        revenue_impact: 18000,
        cost_savings: 5000,
        efficiency_gain: 15,
        customer_satisfaction: 8.5,
        employee_satisfaction: 7.8,
        time_savings: 120
      }
    },
    {
      id: '2',
      title: 'Optimización de Inventario',
      description: 'Sistema de gestión de inventario para reducir desperdicios',
      category: 'operational',
      priority: 'medium',
      status: 'in_progress',
      restaurant_id: 'rest-2',
      restaurant_name: 'McDonald\'s Centro Comercial',
      estimated_cost: 8000,
      actual_cost: 6500,
      estimated_roi: 18,
      actual_roi: 0,
      implementation_date: '2024-03-01',
      created_by: user?.email || 'admin',
      created_at: '2024-02-15T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      metrics: {
        revenue_impact: 0,
        cost_savings: 0,
        efficiency_gain: 0,
        customer_satisfaction: 0,
        employee_satisfaction: 0,
        time_savings: 0
      }
    },
    {
      id: '3',
      title: 'Programa de Capacitación de Empleados',
      description: 'Mejora de habilidades del personal para mayor eficiencia',
      category: 'process',
      priority: 'high',
      status: 'approved',
      estimated_cost: 12000,
      actual_cost: 0,
      estimated_roi: 20,
      actual_roi: 0,
      implementation_date: '2024-04-01',
      created_by: user?.email || 'admin',
      created_at: '2024-03-01T00:00:00Z',
      updated_at: '2024-03-01T00:00:00Z',
      metrics: {
        revenue_impact: 0,
        cost_savings: 0,
        efficiency_gain: 0,
        customer_satisfaction: 0,
        employee_satisfaction: 0,
        time_savings: 0
      }
    }
  ];

  // Planes de ejemplo
  const examplePlans: ImprovementPlan[] = [
    {
      id: '1',
      name: 'Plan de Digitalización 2024',
      description: 'Transformación digital completa de operaciones',
      target_date: '2024-12-31',
      status: 'active',
      improvements: ['1', '2'],
      total_estimated_cost: 23000,
      total_estimated_roi: 43,
      created_by: user?.email || 'admin',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Optimización de Costos Q2',
      description: 'Reducción de costos operativos',
      target_date: '2024-06-30',
      status: 'draft',
      improvements: ['3'],
      total_estimated_cost: 12000,
      total_estimated_roi: 20,
      created_by: user?.email || 'admin',
      created_at: '2024-03-01T00:00:00Z'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Por ahora usamos datos de ejemplo
      // En el futuro esto vendría de la base de datos
      setImprovements(exampleImprovements);
      setPlans(examplePlans);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proposed': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'operational': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'financial': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'customer': return <Users className="h-4 w-4 text-purple-600" />;
      case 'technology': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'process': return <Target className="h-4 w-4 text-red-600" />;
      default: return <Lightbulb className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotalROI = () => {
    const completed = improvements.filter(imp => imp.status === 'completed');
    const totalInvestment = completed.reduce((sum, imp) => sum + imp.actual_cost, 0);
    const totalReturn = completed.reduce((sum, imp) => sum + imp.metrics.revenue_impact + imp.metrics.cost_savings, 0);
    return totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;
  };

  const getImprovementStatus = (improvement: Improvement) => {
    if (improvement.status === 'completed') {
      return improvement.actual_roi >= improvement.estimated_roi ? 'success' : 'partial';
    }
    return improvement.status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'approved': return <Target className="h-4 w-4 text-blue-600" />;
      case 'proposed': return <Lightbulb className="h-4 w-4 text-gray-600" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const totalInvestment = improvements.reduce((sum, imp) => sum + imp.actual_cost, 0);
  const totalReturn = improvements
    .filter(imp => imp.status === 'completed')
    .reduce((sum, imp) => sum + imp.metrics.revenue_impact + imp.metrics.cost_savings, 0);
  const overallROI = totalInvestment > 0 ? ((totalReturn - totalInvestment) / totalInvestment) * 100 : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mejoras y Optimizaciones</h1>
          <p className="text-gray-600 mt-2">
            Seguimiento de mejoras implementadas, ROI y métricas de impacto
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowCreatePlan(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Plan
          </Button>
          <Button onClick={() => setShowCreateImprovement(true)}>
            <Lightbulb className="h-4 w-4 mr-2" />
            Nueva Mejora
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ROI Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overallROI.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Retorno sobre inversión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Inversión Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              €{totalInvestment.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Costo total implementado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Retorno Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              €{totalReturn.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Beneficios generados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Mejoras Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {improvements.filter(imp => imp.status === 'in_progress').length}
            </div>
            <p className="text-xs text-gray-500">
              En implementación
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="improvements">Mejoras</TabsTrigger>
          <TabsTrigger value="plans">Planes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de ROI por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle>ROI por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { category: 'Tecnología', roi: 32 },
                    { category: 'Operacional', roi: 18 },
                    { category: 'Procesos', roi: 20 },
                    { category: 'Financiero', roi: 15 },
                    { category: 'Cliente', roi: 25 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'ROI']} />
                    <Bar dataKey="roi" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Estado de Mejoras */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de Mejoras</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completadas', value: improvements.filter(imp => imp.status === 'completed').length, color: '#10b981' },
                        { name: 'En Progreso', value: improvements.filter(imp => imp.status === 'in_progress').length, color: '#f59e0b' },
                        { name: 'Aprobadas', value: improvements.filter(imp => imp.status === 'approved').length, color: '#3b82f6' },
                        { name: 'Propuestas', value: improvements.filter(imp => imp.status === 'proposed').length, color: '#6b7280' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Completadas', value: improvements.filter(imp => imp.status === 'completed').length, color: '#10b981' },
                        { name: 'En Progreso', value: improvements.filter(imp => imp.status === 'in_progress').length, color: '#f59e0b' },
                        { name: 'Aprobadas', value: improvements.filter(imp => imp.status === 'approved').length, color: '#3b82f6' },
                        { name: 'Propuestas', value: improvements.filter(imp => imp.status === 'proposed').length, color: '#6b7280' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Mejoras Destacadas */}
          <Card>
            <CardHeader>
              <CardTitle>Mejoras Destacadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvements
                  .filter(imp => imp.status === 'completed')
                  .sort((a, b) => b.actual_roi - a.actual_roi)
                  .slice(0, 3)
                  .map((improvement) => (
                    <div
                      key={improvement.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Award className="h-8 w-8 text-yellow-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{improvement.title}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              ROI: {improvement.actual_roi}%
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">{improvement.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Inversión: €{improvement.actual_cost.toLocaleString()}</span>
                            <span>Retorno: €{(improvement.metrics.revenue_impact + improvement.metrics.cost_savings).toLocaleString()}</span>
                            <span>Completada: {formatDate(improvement.completion_date!)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Mejoras</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
                  <span className="ml-2">Cargando mejoras...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {improvements.map((improvement) => (
                    <div
                      key={improvement.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getCategoryIcon(improvement.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{improvement.title}</h3>
                            <Badge className={getStatusColor(improvement.status)}>
                              {improvement.status === 'proposed' ? 'Propuesta' : 
                               improvement.status === 'approved' ? 'Aprobada' : 
                               improvement.status === 'in_progress' ? 'En Progreso' : 
                               improvement.status === 'completed' ? 'Completada' : 'Cancelada'}
                            </Badge>
                            <Badge className={getPriorityColor(improvement.priority)}>
                              {improvement.priority === 'low' ? 'Baja' : 
                               improvement.priority === 'medium' ? 'Media' : 
                               improvement.priority === 'high' ? 'Alta' : 'Crítica'}
                            </Badge>
                            {improvement.status === 'completed' && (
                              <Badge className="bg-green-100 text-green-800">
                                ROI: {improvement.actual_roi}%
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600">{improvement.description}</p>
                          
                          {improvement.restaurant_name && (
                            <p className="text-xs text-gray-500">
                              Restaurante: {improvement.restaurant_name}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Inversión: €{improvement.actual_cost.toLocaleString()}</span>
                            {improvement.status === 'completed' && (
                              <span>Retorno: €{(improvement.metrics.revenue_impact + improvement.metrics.cost_savings).toLocaleString()}</span>
                            )}
                            <span>Implementación: {formatDate(improvement.implementation_date)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedImprovement(improvement)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Editar mejora"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Eliminar mejora"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planes de Mejora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{plan.name}</h3>
                          <Badge variant={plan.status === 'active' ? 'default' : plan.status === 'completed' ? 'secondary' : 'outline'}>
                            {plan.status === 'draft' ? 'Borrador' : 
                             plan.status === 'active' ? 'Activo' : 'Completado'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{plan.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Objetivo: {formatDate(plan.target_date)}</span>
                          <span>Inversión: €{plan.total_estimated_cost.toLocaleString()}</span>
                          <span>ROI Estimado: {plan.total_estimated_roi}%</span>
                          <span>Mejoras: {plan.improvements.length}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Ver plan"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Editar plan"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Eliminar plan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de ROI en el Tiempo */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución del ROI</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { month: 'Ene', roi: 0 },
                    { month: 'Feb', roi: 32 },
                    { month: 'Mar', roi: 28 },
                    { month: 'Abr', roi: 35 },
                    { month: 'May', roi: 42 },
                    { month: 'Jun', roi: 38 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: any) => [`${value}%`, 'ROI']} />
                    <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Inversión por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle>Inversión por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { category: 'Tecnología', investment: 14200 },
                    { category: 'Operacional', investment: 6500 },
                    { category: 'Procesos', investment: 0 },
                    { category: 'Financiero', investment: 0 },
                    { category: 'Cliente', investment: 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: any) => [`€${value.toLocaleString()}`, 'Inversión']} />
                    <Bar dataKey="investment" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImprovementsManagement; 