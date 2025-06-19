import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Download,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Percent,
  Target,
  Zap,
  RefreshCw,
  Copy,
  History,
  Settings,
  FileText,
  Calculator
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  budget_amount: number;
  actual_amount: number;
  variance: number;
  variance_percentage: number;
  month: number;
  year: number;
}

interface BudgetScenario {
  id: string;
  name: string;
  description: string;
  growth_rate: number;
  inflation_rate: number;
  efficiency_improvement: number;
  total_budget: number;
  created_at: string;
}

interface BudgetInputs {
  baseRevenue: number;
  baseExpenses: number;
  growthRate: number;
  inflationRate: number;
  efficiencyImprovement: number;
  projectionMonths: number;
}

const AdvancedBudgetManager: React.FC = () => {
  const { user, franchisee } = useAuth();
  const [activeScenario, setActiveScenario] = useState<string>('base');
  const [scenarios, setScenarios] = useState<BudgetScenario[]>([]);
  const [budgetData, setBudgetData] = useState<BudgetTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  // Inputs base para el presupuesto
  const [inputs, setInputs] = useState<BudgetInputs>({
    baseRevenue: 2500000,
    baseExpenses: 2000000,
    growthRate: 0.05,
    inflationRate: 0.025,
    efficiencyImprovement: 0.02,
    projectionMonths: 12
  });

  // Escenarios predefinidos
  const defaultScenarios: BudgetScenario[] = [
    {
      id: 'base',
      name: 'Presupuesto Base',
      description: 'Proyección conservadora con crecimiento moderado',
      growth_rate: 0.05,
      inflation_rate: 0.025,
      efficiency_improvement: 0.02,
      total_budget: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 'optimistic',
      name: 'Presupuesto Optimista',
      description: 'Crecimiento acelerado con mejoras operativas',
      growth_rate: 0.08,
      inflation_rate: 0.02,
      efficiency_improvement: 0.04,
      total_budget: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 'pessimistic',
      name: 'Presupuesto Pesimista',
      description: 'Crecimiento lento con presiones inflacionarias',
      growth_rate: 0.02,
      inflation_rate: 0.04,
      efficiency_improvement: 0.01,
      total_budget: 0,
      created_at: new Date().toISOString()
    }
  ];

  // Datos de presupuesto de ejemplo
  const budgetCategories = [
    { category: 'Ingresos', subcategory: 'Ventas de Comida', base: 1800000 },
    { category: 'Ingresos', subcategory: 'Bebidas', base: 400000 },
    { category: 'Ingresos', subcategory: 'Otros', base: 300000 },
    { category: 'Costos', subcategory: 'Materia Prima', base: 600000 },
    { category: 'Costos', subcategory: 'Mano de Obra', base: 500000 },
    { category: 'Costos', subcategory: 'Gastos Operativos', base: 300000 },
    { category: 'Gastos', subcategory: 'Marketing', base: 100000 },
    { category: 'Gastos', subcategory: 'Administrativos', base: 150000 },
    { category: 'Gastos', subcategory: 'Mantenimiento', base: 80000 },
    { category: 'Gastos', subcategory: 'Servicios', base: 120000 }
  ];

  useEffect(() => {
    if (franchisee) {
      loadRestaurants();
      loadScenarios();
      generateBudgetData();
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

  const loadScenarios = async () => {
    try {
      // Por ahora usamos escenarios predefinidos
      // En el futuro esto vendría de la base de datos
      setScenarios(defaultScenarios);
    } catch (error) {
      console.error('Error loading scenarios:', error);
    }
  };

  const generateBudgetData = () => {
    const currentScenario = scenarios.find(s => s.id === activeScenario);
    if (!currentScenario) return;

    const budgetData: BudgetTemplate[] = budgetCategories.map((category, index) => {
      const baseAmount = category.base;
      const growthFactor = Math.pow(1 + currentScenario.growth_rate, selectedMonth / 12);
      const inflationFactor = Math.pow(1 + currentScenario.inflation_rate, selectedMonth / 12);
      const efficiencyFactor = Math.pow(1 - currentScenario.efficiency_improvement, selectedMonth / 12);
      
      let budgetAmount = baseAmount;
      
      if (category.category === 'Ingresos') {
        budgetAmount = baseAmount * growthFactor;
      } else {
        budgetAmount = baseAmount * inflationFactor * efficiencyFactor;
      }

      const actualAmount = budgetAmount * (0.9 + Math.random() * 0.2); // Simulación de datos reales
      const variance = actualAmount - budgetAmount;
      const variancePercentage = (variance / budgetAmount) * 100;

      return {
        id: `budget-${index}`,
        name: `${category.category} - ${category.subcategory}`,
        description: `Presupuesto para ${category.subcategory.toLowerCase()}`,
        category: category.category,
        subcategory: category.subcategory,
        budget_amount: budgetAmount,
        actual_amount: actualAmount,
        variance: variance,
        variance_percentage: variancePercentage,
        month: selectedMonth,
        year: selectedYear
      };
    });

    setBudgetData(budgetData);
  };

  const updateScenario = (scenarioId: string, updates: Partial<BudgetInputs>) => {
    setScenarios(prev => 
      prev.map(scenario => 
        scenario.id === scenarioId 
          ? { 
              ...scenario, 
              ...updates,
              total_budget: calculateTotalBudget({ ...inputs, ...updates })
            }
          : scenario
      )
    );
  };

  const calculateTotalBudget = (scenarioInputs: BudgetInputs): number => {
    const currentScenario = scenarios.find(s => s.id === activeScenario);
    if (!currentScenario) return 0;

    let totalRevenue = 0;
    let totalExpenses = 0;

    budgetCategories.forEach(category => {
      const baseAmount = category.base;
      const growthFactor = Math.pow(1 + currentScenario.growth_rate, selectedMonth / 12);
      const inflationFactor = Math.pow(1 + currentScenario.inflation_rate, selectedMonth / 12);
      const efficiencyFactor = Math.pow(1 - currentScenario.efficiency_improvement, selectedMonth / 12);
      
      if (category.category === 'Ingresos') {
        totalRevenue += baseAmount * growthFactor;
      } else {
        totalExpenses += baseAmount * inflationFactor * efficiencyFactor;
      }
    });

    return totalRevenue - totalExpenses;
  };

  const saveBudget = async () => {
    if (!user || !selectedRestaurant) return;

    setSaving(true);
    try {
      const currentScenario = scenarios.find(s => s.id === activeScenario);
      if (!currentScenario) return;

      const { error } = await supabase
        .from('budget_scenarios' as any)
        .insert({
          user_id: user.id,
          restaurant_id: selectedRestaurant.id,
          scenario_name: currentScenario.name,
          scenario_data: {
            inputs: { ...inputs },
            scenario: currentScenario,
            budget_data: budgetData
          },
          total_budget: currentScenario.total_budget,
          year: selectedYear,
          month: selectedMonth,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Presupuesto guardado correctamente');
    } catch (error) {
      console.error('Error saving budget:', error);
      toast.error('Error al guardar el presupuesto');
    } finally {
      setSaving(false);
    }
  };

  const exportBudget = () => {
    const currentScenario = scenarios.find(s => s.id === activeScenario);
    if (!currentScenario) return;

    const csvContent = [
      ['Categoría', 'Subcategoría', 'Presupuesto (€)', 'Real (€)', 'Variación (€)', 'Variación (%)'].join(','),
      ...budgetData.map(item => [
        item.category,
        item.subcategory,
        item.budget_amount.toFixed(2),
        item.actual_amount.toFixed(2),
        item.variance.toFixed(2),
        `${item.variance_percentage.toFixed(1)}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presupuesto_${selectedRestaurant?.base_restaurant?.restaurant_name || 'restaurante'}_${selectedYear}_${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Presupuesto exportado correctamente');
  };

  const copyFromPreviousMonth = () => {
    // Simular copia del mes anterior
    toast.success('Datos copiados del mes anterior');
  };

  const currentScenario = scenarios.find(s => s.id === activeScenario);
  const currentTotalBudget = currentScenario ? calculateTotalBudget({ ...inputs, ...currentScenario }) : 0;

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget_amount, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual_amount, 0);
  const totalVariance = totalActual - totalBudget;
  const totalVariancePercentage = (totalVariance / totalBudget) * 100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Presupuestos Anuales</h1>
          <p className="text-gray-600 mt-2">
            Planificación y control presupuestario avanzado
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={copyFromPreviousMonth}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar Mes Anterior
          </Button>
          <Button variant="outline" onClick={generateBudgetData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalcular
          </Button>
          <Button variant="outline" onClick={exportBudget}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={saveBudget} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar Presupuesto
          </Button>
        </div>
      </div>

      {/* Selectores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card>
          <CardHeader>
            <CardTitle>Año</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025, 2026, 2027].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Escenario</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={activeScenario} onValueChange={setActiveScenario}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budget" className="space-y-6">
        <TabsList>
          <TabsTrigger value="budget">Presupuesto</TabsTrigger>
          <TabsTrigger value="scenarios">Escenarios</TabsTrigger>
          <TabsTrigger value="analysis">Análisis</TabsTrigger>
          <TabsTrigger value="forecast">Pronósticos</TabsTrigger>
        </TabsList>

        <TabsContent value="budget" className="space-y-6">
          {/* Resumen del Presupuesto */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Presupuesto Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  €{totalBudget.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500">
                  Presupuesto planificado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Real Total</CardTitle>
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
                <CardTitle className="text-sm font-medium">Variación</CardTitle>
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
                <CardTitle className="text-sm font-medium">Margen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {((currentTotalBudget / totalBudget) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500">
                  Margen presupuestario
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de Presupuesto */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle del Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Categoría</th>
                      <th className="text-left p-2">Subcategoría</th>
                      <th className="text-right p-2">Presupuesto (€)</th>
                      <th className="text-right p-2">Real (€)</th>
                      <th className="text-right p-2">Variación (€)</th>
                      <th className="text-right p-2">Variación (%)</th>
                      <th className="text-center p-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgetData.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{item.category}</td>
                        <td className="p-2">{item.subcategory}</td>
                        <td className="p-2 text-right">€{item.budget_amount.toLocaleString()}</td>
                        <td className="p-2 text-right">€{item.actual_amount.toLocaleString()}</td>
                        <td className={`p-2 text-right font-medium ${item.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          €{item.variance.toLocaleString()}
                        </td>
                        <td className={`p-2 text-right ${item.variance_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {item.variance_percentage >= 0 ? '+' : ''}{item.variance_percentage.toFixed(1)}%
                        </td>
                        <td className="p-2 text-center">
                          <Badge variant={item.variance_percentage > 10 ? 'destructive' : item.variance_percentage > 5 ? 'secondary' : 'default'}>
                            {item.variance_percentage > 10 ? 'Crítico' : item.variance_percentage > 5 ? 'Atención' : 'OK'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Selector de Escenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Escenarios de Presupuesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <Card 
                    key={scenario.id}
                    className={`cursor-pointer transition-all ${
                      activeScenario === scenario.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveScenario(scenario.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{scenario.name}</h3>
                        <Badge variant={scenario.id === 'optimistic' ? 'default' : scenario.id === 'pessimistic' ? 'destructive' : 'secondary'}>
                          {scenario.id === 'optimistic' ? 'Optimista' : scenario.id === 'pessimistic' ? 'Pesimista' : 'Base'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Crecimiento:</span>
                          <span className="font-medium">{(scenario.growth_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inflación:</span>
                          <span className="font-medium">{(scenario.inflation_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-green-600">€{calculateTotalBudget({ ...inputs, ...scenario }).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Barras */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subcategory" angle={-45} textAnchor="end" height={80} />
                    <YAxis tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: any) => [`€${value.toLocaleString()}`, '']} />
                    <Bar dataKey="budget_amount" fill="#8884d8" name="Presupuesto" />
                    <Bar dataKey="actual_amount" fill="#82ca9d" name="Real" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Líneas */}
            <Card>
              <CardHeader>
                <CardTitle>Evolución Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    const monthData = budgetData.filter(item => item.month === month);
                    const totalBudget = monthData.reduce((sum, item) => sum + item.budget_amount, 0);
                    const totalActual = monthData.reduce((sum, item) => sum + item.actual_amount, 0);
                    
                    return {
                      month: new Date(2024, month - 1).toLocaleDateString('es-ES', { month: 'short' }),
                      budget: totalBudget / 1000000,
                      actual: totalActual / 1000000
                    };
                  })}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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

        <TabsContent value="forecast" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pronósticos y Proyecciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    €{(totalBudget * 1.05).toLocaleString()}
                  </div>
                  <p className="text-sm text-blue-700">Pronóstico 3 meses</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    €{(totalBudget * 1.12).toLocaleString()}
                  </div>
                  <p className="text-sm text-green-700">Pronóstico 6 meses</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    €{(totalBudget * 1.20).toLocaleString()}
                  </div>
                  <p className="text-sm text-purple-700">Pronóstico 12 meses</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedBudgetManager; 