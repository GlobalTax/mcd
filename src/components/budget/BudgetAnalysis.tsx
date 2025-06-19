import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  AlertTriangle,
  CheckCircle,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface BudgetAnalysisData {
  category: string;
  budget: number;
  actual: number;
  variance: number;
  variance_percentage: number;
  trend: 'up' | 'down' | 'stable';
  risk_level: 'low' | 'medium' | 'high';
}

interface AnalysisMetrics {
  total_budget: number;
  total_actual: number;
  total_variance: number;
  variance_percentage: number;
  efficiency_score: number;
  risk_score: number;
  forecast_accuracy: number;
}

const BudgetAnalysis: React.FC = () => {
  const { user, franchisee } = useAuth();
  const [analysisData, setAnalysisData] = useState<BudgetAnalysisData[]>([]);
  const [metrics, setMetrics] = useState<AnalysisMetrics>({
    total_budget: 0,
    total_actual: 0,
    total_variance: 0,
    variance_percentage: 0,
    efficiency_score: 0,
    risk_score: 0,
    forecast_accuracy: 0
  });
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo para el análisis
  const exampleAnalysisData: BudgetAnalysisData[] = [
    {
      category: 'Ingresos por Ventas',
      budget: 1800000,
      actual: 1750000,
      variance: -50000,
      variance_percentage: -2.8,
      trend: 'down',
      risk_level: 'medium'
    },
    {
      category: 'Costos de Materia Prima',
      budget: 600000,
      actual: 580000,
      variance: 20000,
      variance_percentage: 3.3,
      trend: 'up',
      risk_level: 'low'
    },
    {
      category: 'Gastos de Personal',
      budget: 500000,
      actual: 520000,
      variance: -20000,
      variance_percentage: -4.0,
      trend: 'down',
      risk_level: 'high'
    },
    {
      category: 'Gastos Operativos',
      budget: 300000,
      actual: 310000,
      variance: -10000,
      variance_percentage: -3.3,
      trend: 'down',
      risk_level: 'medium'
    },
    {
      category: 'Marketing',
      budget: 100000,
      actual: 95000,
      variance: 5000,
      variance_percentage: 5.0,
      trend: 'up',
      risk_level: 'low'
    },
    {
      category: 'Gastos Administrativos',
      budget: 150000,
      actual: 145000,
      variance: 5000,
      variance_percentage: 3.3,
      trend: 'up',
      risk_level: 'low'
    }
  ];

  useEffect(() => {
    if (franchisee) {
      loadRestaurants();
      loadAnalysisData();
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
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Error al cargar los restaurantes');
    }
  };

  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisData(exampleAnalysisData);
      
      // Calcular métricas
      const totalBudget = exampleAnalysisData.reduce((sum, item) => sum + item.budget, 0);
      const totalActual = exampleAnalysisData.reduce((sum, item) => sum + item.actual, 0);
      const totalVariance = totalActual - totalBudget;
      const variancePercentage = (totalVariance / totalBudget) * 100;
      
      // Calcular score de eficiencia (basado en variaciones positivas)
      const positiveVariances = exampleAnalysisData.filter(item => item.variance > 0);
      const efficiencyScore = (positiveVariances.length / exampleAnalysisData.length) * 100;
      
      // Calcular score de riesgo (basado en variaciones negativas grandes)
      const highRiskItems = exampleAnalysisData.filter(item => 
        item.variance_percentage < -5 || item.risk_level === 'high'
      );
      const riskScore = (highRiskItems.length / exampleAnalysisData.length) * 100;
      
      // Calcular precisión del pronóstico (basado en qué tan cerca están los valores reales de los presupuestados)
      const forecastAccuracy = 100 - Math.abs(variancePercentage);
      
      setMetrics({
        total_budget: totalBudget,
        total_actual: totalActual,
        total_variance: totalVariance,
        variance_percentage: variancePercentage,
        efficiency_score: efficiencyScore,
        risk_score: riskScore,
        forecast_accuracy: forecastAccuracy
      });
    } catch (error) {
      console.error('Error loading analysis data:', error);
      toast.error('Error al cargar los datos de análisis');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEfficiencyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColorByScore = (score: number) => {
    if (score <= 20) return 'text-green-600';
    if (score <= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Presupuesto</h1>
          <p className="text-gray-600 mt-2">
            Análisis detallado y métricas de rendimiento presupuestario
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadAnalysisData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Selector de Restaurante */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <Select 
            value={selectedRestaurant?.id || ''} 
            onValueChange={(value) => {
              const restaurant = restaurants.find(r => r.id === value);
              setSelectedRestaurant(restaurant);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar restaurante" />
            </SelectTrigger>
            <SelectContent>
              {restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  {restaurant.base_restaurant?.restaurant_name || 'Restaurante'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(metrics.efficiency_score)}`}>
              {metrics.efficiency_score.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Score de eficiencia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Riesgo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColorByScore(metrics.risk_score)}`}>
              {metrics.risk_score.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Nivel de riesgo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Precisión</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {metrics.forecast_accuracy.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Precisión del pronóstico
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Variación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metrics.variance_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.variance_percentage >= 0 ? '+' : ''}{metrics.variance_percentage.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Variación total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="forecast">Pronósticos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: any) => [`€${value.toLocaleString()}`, '']} />
                    <Bar dataKey="budget" fill="#8884d8" name="Presupuesto" />
                    <Bar dataKey="actual" fill="#82ca9d" name="Real" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Área */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Variaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
                    <Area type="monotone" dataKey="variance_percentage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Detallado por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
                  <span className="ml-2">Cargando análisis...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTrendIcon(item.trend)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{item.category}</h3>
                            <Badge className={getRiskColor(item.risk_level)}>
                              {item.risk_level === 'low' ? 'Bajo' : item.risk_level === 'medium' ? 'Medio' : 'Alto'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Presupuesto:</span>
                              <div className="font-medium">€{item.budget.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Real:</span>
                              <div className="font-medium">€{item.actual.toLocaleString()}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Variación:</span>
                              <div className={`font-medium ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                €{item.variance.toLocaleString()} ({item.variance_percentage >= 0 ? '+' : ''}{item.variance_percentage.toFixed(1)}%)
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Líneas */}
            <Card>
              <CardHeader>
                <CardTitle>Tendencias de Variación</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={analysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                    <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
                    <Line type="monotone" dataKey="variance_percentage" stroke="#8884d8" strokeWidth={2} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Pastel */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Riesgo</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Bajo Riesgo', value: analysisData.filter(item => item.risk_level === 'low').length, color: '#10b981' },
                        { name: 'Medio Riesgo', value: analysisData.filter(item => item.risk_level === 'medium').length, color: '#f59e0b' },
                        { name: 'Alto Riesgo', value: analysisData.filter(item => item.risk_level === 'high').length, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Bajo Riesgo', value: analysisData.filter(item => item.risk_level === 'low').length, color: '#10b981' },
                        { name: 'Medio Riesgo', value: analysisData.filter(item => item.risk_level === 'medium').length, color: '#f59e0b' },
                        { name: 'Alto Riesgo', value: analysisData.filter(item => item.risk_level === 'high').length, color: '#ef4444' }
                      ].map((entry, index) => (
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

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pronósticos y Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    €{(metrics.total_budget * 1.05).toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-700">Pronóstico 3 meses</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.efficiency_score > 70 ? 'Excelente' : metrics.efficiency_score > 50 ? 'Bueno' : 'Necesita Mejora'}
                  </div>
                  <p className="text-sm text-green-700">Estado General</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {metrics.risk_score < 30 ? 'Bajo' : metrics.risk_score < 60 ? 'Moderado' : 'Alto'}
                  </div>
                  <p className="text-sm text-purple-700">Nivel de Riesgo</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Recomendaciones:</h3>
                <ul className="space-y-1 text-sm">
                  {metrics.risk_score > 50 && (
                    <li className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                      Revisar categorías con alto riesgo de sobrepresupuesto
                    </li>
                  )}
                  {metrics.efficiency_score < 60 && (
                    <li className="flex items-center">
                      <Target className="h-4 w-4 text-yellow-600 mr-2" />
                      Implementar controles más estrictos en categorías problemáticas
                    </li>
                  )}
                  {metrics.forecast_accuracy < 90 && (
                    <li className="flex items-center">
                      <Calculator className="h-4 w-4 text-blue-600 mr-2" />
                      Mejorar la precisión de los pronósticos presupuestarios
                    </li>
                  )}
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Mantener el seguimiento mensual de todas las categorías
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetAnalysis; 