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
  FileText, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download,
  Calendar,
  Filter,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Clock,
  Users,
  DollarSign,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  Star,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'financial' | 'custom';
  category: string;
  data_source: string;
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'manual';
  last_generated: string;
  next_generation: string;
  status: 'active' | 'inactive' | 'draft';
  created_by: string;
  created_at: string;
  parameters: any;
}

interface Dashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'franchisee' | 'advisor' | 'custom';
  widgets: DashboardWidget[];
  layout: any;
  created_by: string;
  created_at: string;
}

interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'kpi';
  title: string;
  data_source: string;
  position: { x: number; y: number; w: number; h: number };
  config: any;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: any;
  sample_data: any;
}

const AdvancedReportingSystem: React.FC = () => {
  const { user, franchisee } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [showCreateDashboard, setShowCreateDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboards');

  // Reportes de ejemplo
  const exampleReports: Report[] = [
    {
      id: '1',
      name: 'Reporte Ejecutivo Mensual',
      description: 'Resumen ejecutivo de rendimiento mensual',
      type: 'executive',
      category: 'Performance',
      data_source: 'franchisee_metrics',
      schedule: 'monthly',
      last_generated: new Date().toISOString(),
      next_generation: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      created_by: user?.email || 'admin',
      created_at: new Date().toISOString(),
      parameters: { date_range: 'last_30_days', include_charts: true }
    },
    {
      id: '2',
      name: 'Análisis de Rentabilidad por Restaurante',
      description: 'Análisis detallado de rentabilidad por ubicación',
      type: 'financial',
      category: 'Financial',
      data_source: 'restaurant_performance',
      schedule: 'weekly',
      last_generated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      next_generation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      created_by: user?.email || 'admin',
      created_at: new Date().toISOString(),
      parameters: { group_by: 'restaurant', include_comparison: true }
    },
    {
      id: '3',
      name: 'Reporte de Actividad de Usuarios',
      description: 'Actividad y uso del sistema por usuarios',
      type: 'operational',
      category: 'Operations',
      data_source: 'user_activity',
      schedule: 'daily',
      last_generated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      next_generation: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      created_by: user?.email || 'admin',
      created_at: new Date().toISOString(),
      parameters: { user_type: 'all', include_details: true }
    }
  ];

  // Dashboards de ejemplo
  const exampleDashboards: Dashboard[] = [
    {
      id: '1',
      name: 'Dashboard Ejecutivo',
      description: 'Vista general para ejecutivos',
      type: 'executive',
      widgets: [
        {
          id: 'w1',
          type: 'metric',
          title: 'Total de Franquiciados',
          data_source: 'franchisee_count',
          position: { x: 0, y: 0, w: 3, h: 2 },
          config: { format: 'number', color: 'blue' }
        },
        {
          id: 'w2',
          type: 'chart',
          title: 'Rendimiento Mensual',
          data_source: 'monthly_performance',
          position: { x: 3, y: 0, w: 6, h: 4 },
          config: { chart_type: 'line', metrics: ['revenue', 'profit'] }
        },
        {
          id: 'w3',
          type: 'kpi',
          title: 'ROI Promedio',
          data_source: 'average_roi',
          position: { x: 9, y: 0, w: 3, h: 2 },
          config: { format: 'percentage', target: 15 }
        }
      ],
      layout: {},
      created_by: user?.email || 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Dashboard de Franquiciado',
      description: 'Vista personalizada para franquiciados',
      type: 'franchisee',
      widgets: [
        {
          id: 'w4',
          type: 'metric',
          title: 'Mis Restaurantes',
          data_source: 'my_restaurants',
          position: { x: 0, y: 0, w: 4, h: 2 },
          config: { format: 'number', color: 'green' }
        },
        {
          id: 'w5',
          type: 'chart',
          title: 'Rendimiento de Mis Restaurantes',
          data_source: 'my_performance',
          position: { x: 4, y: 0, w: 8, h: 4 },
          config: { chart_type: 'bar', metrics: ['sales', 'costs'] }
        }
      ],
      layout: {},
      created_by: user?.email || 'admin',
      created_at: new Date().toISOString()
    }
  ];

  // Templates de ejemplo
  const exampleTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Reporte de Ventas',
      description: 'Template para reportes de ventas',
      category: 'Sales',
      parameters: {
        date_range: { type: 'date_range', required: true },
        group_by: { type: 'select', options: ['restaurant', 'region', 'month'], required: true },
        include_charts: { type: 'boolean', default: true }
      },
      sample_data: {
        total_sales: 1500000,
        growth_rate: 12.5,
        top_performers: ['Restaurant A', 'Restaurant B', 'Restaurant C']
      }
    },
    {
      id: '2',
      name: 'Análisis de Costos',
      description: 'Template para análisis de costos',
      category: 'Financial',
      parameters: {
        cost_type: { type: 'select', options: ['operational', 'fixed', 'variable'], required: true },
        comparison_period: { type: 'date_range', required: true }
      },
      sample_data: {
        total_costs: 1200000,
        cost_reduction: 8.3,
        savings_opportunities: ['Utilities', 'Labor', 'Supplies']
      }
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
      setReports(exampleReports);
      setDashboards(exampleDashboards);
      setTemplates(exampleTemplates);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`Reporte "${report.name}" generado correctamente`);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte');
    }
  };

  const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Reporte exportado en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Error al exportar el reporte');
    }
  };

  const scheduleReport = async (reportId: string, schedule: string) => {
    try {
      const { error } = await supabase
        .from('report_schedules' as any)
        .insert({
          report_id: reportId as any,
          schedule: schedule,
          user_id: user?.id,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Reporte programado correctamente');
    } catch (error) {
      console.error('Error scheduling report:', error);
      toast.error('Error al programar el reporte');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'executive': return <Star className="h-4 w-4 text-blue-600" />;
      case 'financial': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'operational': return <Activity className="h-4 w-4 text-purple-600" />;
      case 'custom': return <Settings className="h-4 w-4 text-orange-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Reportes Avanzados</h1>
          <p className="text-gray-600 mt-2">
            Dashboards ejecutivos, reportes personalizables y análisis avanzados
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowCreateDashboard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Dashboard
          </Button>
          <Button onClick={() => setShowCreateReport(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Nuevo Reporte
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="schedules">Programación</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboards" className="space-y-6">
          {/* Dashboard Ejecutivo en Vivo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Dashboard Ejecutivo en Vivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Franquiciados</p>
                        <p className="text-2xl font-bold text-blue-600">247</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1">+12% este mes</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                        <p className="text-2xl font-bold text-green-600">€2.4M</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1">+8.5% vs mes anterior</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">ROI Promedio</p>
                        <p className="text-2xl font-bold text-purple-600">18.2%</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-green-600 mt-1">+2.1% vs objetivo</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rendimiento Mensual</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={[
                        { month: 'Ene', revenue: 2100000, profit: 420000 },
                        { month: 'Feb', revenue: 2200000, profit: 440000 },
                        { month: 'Mar', revenue: 2300000, profit: 460000 },
                        { month: 'Abr', revenue: 2400000, profit: 480000 },
                        { month: 'May', revenue: 2350000, profit: 470000 },
                        { month: 'Jun', revenue: 2500000, profit: 500000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value: any) => [`€${(value / 1000).toFixed(0)}k`, '']} />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Ingresos" />
                        <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} name="Beneficios" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribución por Región</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Madrid', value: 35, color: '#3b82f6' },
                            { name: 'Barcelona', value: 28, color: '#10b981' },
                            { name: 'Valencia', value: 22, color: '#f59e0b' },
                            { name: 'Sevilla', value: 15, color: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {[
                            { name: 'Madrid', value: 35, color: '#3b82f6' },
                            { name: 'Barcelona', value: 28, color: '#10b981' },
                            { name: 'Valencia', value: 22, color: '#f59e0b' },
                            { name: 'Sevilla', value: 15, color: '#ef4444' }
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
            </CardContent>
          </Card>

          {/* Lista de Dashboards */}
          <Card>
            <CardHeader>
              <CardTitle>Mis Dashboards</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
                  <span className="ml-2">Cargando dashboards...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboards.map((dashboard) => (
                    <div
                      key={dashboard.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(dashboard.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{dashboard.name}</h3>
                            <Badge variant="outline">
                              {dashboard.type === 'executive' ? 'Ejecutivo' : 
                               dashboard.type === 'franchisee' ? 'Franquiciado' : 
                               dashboard.type === 'advisor' ? 'Asesor' : 'Personalizado'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">{dashboard.description}</p>
                          
                          <p className="text-xs text-gray-500">
                            Creado: {formatDate(dashboard.created_at)} | 
                            Widgets: {dashboard.widgets.length}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedDashboard(dashboard)}
                          title="Ver dashboard"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Editar dashboard"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Eliminar dashboard"
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

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reportes Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
                  <span className="ml-2">Cargando reportes...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(report.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{report.name}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status === 'active' ? 'Activo' : 
                               report.status === 'inactive' ? 'Inactivo' : 'Borrador'}
                            </Badge>
                            <Badge variant="outline">
                              {report.schedule === 'daily' ? 'Diario' : 
                               report.schedule === 'weekly' ? 'Semanal' : 
                               report.schedule === 'monthly' ? 'Mensual' : 
                               report.schedule === 'quarterly' ? 'Trimestral' : 'Manual'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">{report.description}</p>
                          
                          <p className="text-xs text-gray-500">
                            Última generación: {formatDate(report.last_generated)} | 
                            Próxima: {formatDate(report.next_generation)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => generateReport(report.id)}
                          title="Generar reporte"
                        >
                          <Zap className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => exportReport(report.id, 'pdf')}
                          title="Exportar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedReport(report)}
                          title="Ver reporte"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Editar reporte"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Templates de Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-gray-50">
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Categoría:</span>
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Parámetros:</span>
                          <span className="text-sm text-gray-600">
                            {Object.keys(template.parameters).length} configuraciones
                          </span>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4" variant="outline">
                        Usar Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Programación de Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.filter(r => r.schedule !== 'manual').map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Clock className="h-5 w-5 text-blue-600" />
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600">
                          Programado: {report.schedule === 'daily' ? 'Diario' : 
                                      report.schedule === 'weekly' ? 'Semanal' : 
                                      report.schedule === 'monthly' ? 'Mensual' : 'Trimestral'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Próxima ejecución: {formatDate(report.next_generation)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Pausar
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedReportingSystem; 