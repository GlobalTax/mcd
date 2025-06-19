import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  Download,
  Eye,
  Calendar,
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface BudgetReport {
  id: string;
  report_name: string;
  report_type: string;
  restaurant_name: string;
  year: number;
  month: number;
  total_budget: number;
  total_actual: number;
  variance: number;
  variance_percentage: number;
  created_at: string;
  status: 'on_track' | 'at_risk' | 'over_budget';
}

interface ReportFilters {
  year: number;
  month: number;
  restaurant_id: string;
  report_type: string;
}

const BudgetReports: React.FC = () => {
  const { user, franchisee } = useAuth();
  const [reports, setReports] = useState<BudgetReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<BudgetReport | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    restaurant_id: '',
    report_type: 'all'
  });

  // Reportes de ejemplo
  const exampleReports: BudgetReport[] = [
    {
      id: '1',
      report_name: 'Reporte Mensual - Enero 2024',
      report_type: 'monthly',
      restaurant_name: 'McDonald\'s Plaza Mayor',
      year: 2024,
      month: 1,
      total_budget: 2500000,
      total_actual: 2450000,
      variance: -50000,
      variance_percentage: -2.0,
      created_at: new Date().toISOString(),
      status: 'on_track'
    },
    {
      id: '2',
      report_name: 'Reporte Trimestral - Q1 2024',
      report_type: 'quarterly',
      restaurant_name: 'McDonald\'s Centro Comercial',
      year: 2024,
      month: 3,
      total_budget: 7500000,
      total_actual: 7800000,
      variance: 300000,
      variance_percentage: 4.0,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      status: 'over_budget'
    },
    {
      id: '3',
      report_name: 'Reporte Anual - 2023',
      report_type: 'annual',
      restaurant_name: 'McDonald\'s Parque Central',
      year: 2023,
      month: 12,
      total_budget: 30000000,
      total_actual: 29500000,
      variance: -500000,
      variance_percentage: -1.7,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      status: 'at_risk'
    }
  ];

  useEffect(() => {
    if (franchisee) {
      loadRestaurants();
      loadReports();
    }
  }, [franchisee]);

  const loadRestaurants = async () => {
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

      setRestaurants(data || []);
      if (data && data.length > 0) {
        setSelectedRestaurant(data[0]);
        setFilters(prev => ({ ...prev, restaurant_id: data[0].id }));
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Error al cargar los restaurantes');
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      // Por ahora usamos reportes de ejemplo
      // En el futuro esto vendría de la base de datos
      setReports(exampleReports);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Error al cargar los reportes');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedRestaurant) {
      toast.error('Selecciona un restaurante');
      return;
    }

    setLoading(true);
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newReport: BudgetReport = {
        id: Date.now().toString(),
        report_name: `Reporte ${filters.report_type === 'monthly' ? 'Mensual' : filters.report_type === 'quarterly' ? 'Trimestral' : 'Anual'} - ${new Date().toLocaleDateString('es-ES')}`,
        report_type: filters.report_type,
        restaurant_name: selectedRestaurant.base_restaurant?.restaurant_name || 'Restaurante',
        year: filters.year,
        month: filters.month,
        total_budget: 2500000 + Math.random() * 500000,
        total_actual: 2450000 + Math.random() * 500000,
        variance: 0,
        variance_percentage: 0,
        created_at: new Date().toISOString(),
        status: 'on_track'
      };

      newReport.variance = newReport.total_actual - newReport.total_budget;
      newReport.variance_percentage = (newReport.variance / newReport.total_budget) * 100;
      newReport.status = newReport.variance_percentage > 5 ? 'over_budget' : newReport.variance_percentage > 2 ? 'at_risk' : 'on_track';

      setReports(prev => [newReport, ...prev]);
      toast.success('Reporte generado correctamente');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (report: BudgetReport) => {
    const csvContent = [
      ['Reporte', 'Restaurante', 'Año', 'Mes', 'Presupuesto (€)', 'Real (€)', 'Variación (€)', 'Variación (%)', 'Estado'].join(','),
      [
        report.report_name,
        report.restaurant_name,
        report.year,
        report.month,
        report.total_budget.toFixed(2),
        report.total_actual.toFixed(2),
        report.variance.toFixed(2),
        `${report.variance_percentage.toFixed(1)}%`,
        report.status
      ].join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_presupuesto_${report.restaurant_name}_${report.year}_${report.month}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Reporte exportado correctamente');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-green-100 text-green-800';
      case 'at_risk': return 'bg-yellow-100 text-yellow-800';
      case 'over_budget': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on_track': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'at_risk': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'over_budget': return <TrendingUp className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
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

  const filteredReports = reports.filter(report => {
    if (filters.year && report.year !== filters.year) return false;
    if (filters.month && report.month !== filters.month) return false;
    if (filters.restaurant_id && report.restaurant_name !== selectedRestaurant?.base_restaurant?.restaurant_name) return false;
    if (filters.report_type !== 'all' && report.report_type !== filters.report_type) return false;
    return true;
  });

  const totalBudget = reports.reduce((sum, report) => sum + report.total_budget, 0);
  const totalActual = reports.reduce((sum, report) => sum + report.total_actual, 0);
  const totalVariance = totalActual - totalBudget;
  const totalVariancePercentage = (totalVariance / totalBudget) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes de Presupuesto</h1>
          <p className="text-gray-600 mt-2">
            Genera y analiza reportes detallados de presupuestos
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadReports}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={generateReport} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Restaurante</label>
              <Select 
                value={filters.restaurant_id} 
                onValueChange={(value) => {
                  const restaurant = restaurants.find(r => r.id === value);
                  setSelectedRestaurant(restaurant);
                  setFilters(prev => ({ ...prev, restaurant_id: value }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los restaurantes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los restaurantes</SelectItem>
                  {restaurants.map((restaurant) => (
                    <SelectItem key={restaurant.id} value={restaurant.id}>
                      {restaurant.base_restaurant?.restaurant_name || 'Restaurante'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Año</label>
              <Select 
                value={filters.year.toString()} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, year: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2022, 2023, 2024, 2025].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Mes</label>
              <Select 
                value={filters.month.toString()} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, month: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos los meses</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <SelectItem key={month} value={month.toString()}>
                      {new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo de Reporte</label>
              <Select 
                value={filters.report_type} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, report_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Presupuesto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              €{totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Presupuesto total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Real</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{totalActual.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              Gastos reales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Variación Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              €{totalVariance.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500">
              {totalVariancePercentage >= 0 ? '+' : ''}{totalVariancePercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {filteredReports.length}
            </div>
            <p className="text-xs text-gray-500">
              Reportes generados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Reportes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
                  <span className="ml-2">Cargando reportes...</span>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No se encontraron reportes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(report.status)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{report.report_name}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status === 'on_track' ? 'En Curso' : report.status === 'at_risk' ? 'En Riesgo' : 'Sobre Presupuesto'}
                            </Badge>
                            <Badge variant="outline">
                              {report.report_type === 'monthly' ? 'Mensual' : report.report_type === 'quarterly' ? 'Trimestral' : 'Anual'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            {report.restaurant_name} - {report.year}
                          </p>
                          
                          <p className="text-xs text-gray-500">
                            Generado: {formatDate(report.created_at)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            €{report.total_budget.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Presupuesto</div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            €{report.total_actual.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">Real</div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`text-sm font-medium ${report.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            €{report.variance.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {report.variance_percentage >= 0 ? '+' : ''}{report.variance_percentage.toFixed(1)}%
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportReport(report);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis por Restaurante</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reports}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="restaurant_name" angle={-45} textAnchor="end" height={80} />
                    <YAxis tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(value: any) => [`€${(value / 1000000).toFixed(2)}M`, '']} />
                    <Bar dataKey="total_budget" fill="#8884d8" name="Presupuesto" />
                    <Bar dataKey="total_actual" fill="#82ca9d" name="Real" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Líneas */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución Temporal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reports
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                    .map(report => ({
                      date: formatDate(report.created_at),
                      budget: report.total_budget / 1000000,
                      actual: report.total_actual / 1000000
                    }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `€${value}M`} />
                    <Tooltip formatter={(value: any) => [`€${value}M`, '']} />
                    <Line type="monotone" dataKey="budget" stroke="#8884d8" strokeWidth={2} name="Presupuesto" />
                    <Line type="monotone" dataKey="actual" stroke="#82ca9d" strokeWidth={2} name="Real" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias de Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {((reports.filter(r => r.status === 'on_track').length / reports.length) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-blue-700">En Curso</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {((reports.filter(r => r.status === 'at_risk').length / reports.length) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-yellow-700">En Riesgo</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {((reports.filter(r => r.status === 'over_budget').length / reports.length) * 100).toFixed(1)}%
                  </div>
                  <p className="text-sm text-red-700">Sobre Presupuesto</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetReports; 