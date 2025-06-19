import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
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
  Calendar,
  Target,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface DCFScenario {
  id: string;
  name: string;
  description: string;
  growthRate: number;
  discountRate: number;
  terminalGrowth: number;
  marginAssumption: number;
  capexAssumption: number;
  workingCapitalAssumption: number;
  totalValue: number;
  created_at: string;
}

interface SensitivityAnalysis {
  discountRate: number;
  growthRate: number;
  terminalGrowth: number;
  value: number;
}

interface ValuationInputs {
  baseRevenue: number;
  baseEBITDA: number;
  baseCapex: number;
  baseWorkingCapital: number;
  growthRate: number;
  discountRate: number;
  terminalGrowth: number;
  projectionYears: number;
  marginImprovement: number;
  capexReduction: number;
  workingCapitalEfficiency: number;
}

const AdvancedDCFValuation: React.FC = () => {
  const { user, franchisee } = useAuth();
  const [activeScenario, setActiveScenario] = useState<string>('base');
  const [scenarios, setScenarios] = useState<DCFScenario[]>([]);
  const [sensitivityData, setSensitivityData] = useState<SensitivityAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  // Inputs base para el modelo DCF
  const [inputs, setInputs] = useState<ValuationInputs>({
    baseRevenue: 2500000,
    baseEBITDA: 375000,
    baseCapex: 125000,
    baseWorkingCapital: 187500,
    growthRate: 0.05,
    discountRate: 0.12,
    terminalGrowth: 0.025,
    projectionYears: 10,
    marginImprovement: 0.02,
    capexReduction: 0.05,
    workingCapitalEfficiency: 0.03
  });

  // Escenarios predefinidos
  const defaultScenarios: DCFScenario[] = [
    {
      id: 'base',
      name: 'Escenario Base',
      description: 'Proyección conservadora con crecimiento moderado',
      growthRate: 0.05,
      discountRate: 0.12,
      terminalGrowth: 0.025,
      marginAssumption: 0.15,
      capexAssumption: 0.05,
      workingCapitalAssumption: 0.075,
      totalValue: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 'optimistic',
      name: 'Escenario Optimista',
      description: 'Crecimiento acelerado con mejoras operativas',
      growthRate: 0.08,
      discountRate: 0.10,
      terminalGrowth: 0.03,
      marginAssumption: 0.18,
      capexAssumption: 0.04,
      workingCapitalAssumption: 0.06,
      totalValue: 0,
      created_at: new Date().toISOString()
    },
    {
      id: 'pessimistic',
      name: 'Escenario Pesimista',
      description: 'Crecimiento lento con presiones competitivas',
      growthRate: 0.02,
      discountRate: 0.15,
      terminalGrowth: 0.015,
      marginAssumption: 0.12,
      capexAssumption: 0.06,
      workingCapitalAssumption: 0.09,
      totalValue: 0,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    if (franchisee) {
      loadRestaurants();
      loadScenarios();
      generateSensitivityAnalysis();
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

  const generateSensitivityAnalysis = () => {
    const sensitivityData: SensitivityAnalysis[] = [];
    
    // Análisis de sensibilidad para diferentes tasas de descuento y crecimiento
    const discountRates = [0.08, 0.10, 0.12, 0.14, 0.16];
    const growthRates = [0.02, 0.04, 0.06, 0.08, 0.10];
    
    discountRates.forEach(dr => {
      growthRates.forEach(gr => {
        const value = calculateDCFValue({
          ...inputs,
          discountRate: dr,
          growthRate: gr
        });
        
        sensitivityData.push({
          discountRate: dr,
          growthRate: gr,
          terminalGrowth: inputs.terminalGrowth,
          value
        });
      });
    });
    
    setSensitivityData(sensitivityData);
  };

  const calculateDCFValue = (scenarioInputs: ValuationInputs): number => {
    let presentValue = 0;
    let currentRevenue = scenarioInputs.baseRevenue;
    let currentEBITDA = scenarioInputs.baseEBITDA;
    let currentCapex = scenarioInputs.baseCapex;
    let currentWorkingCapital = scenarioInputs.baseWorkingCapital;

    // Calcular flujos de caja proyectados
    for (let year = 1; year <= scenarioInputs.projectionYears; year++) {
      // Proyección de ingresos
      currentRevenue *= (1 + scenarioInputs.growthRate);
      
      // Proyección de EBITDA con mejora de márgenes
      const marginImprovement = 1 + (scenarioInputs.marginImprovement * year);
      currentEBITDA = currentRevenue * (scenarioInputs.baseEBITDA / scenarioInputs.baseRevenue) * marginImprovement;
      
      // Proyección de Capex
      const capexReduction = 1 - (scenarioInputs.capexReduction * year);
      currentCapex = currentRevenue * (scenarioInputs.baseCapex / scenarioInputs.baseRevenue) * capexReduction;
      
      // Proyección de Capital de Trabajo
      const workingCapitalEfficiency = 1 - (scenarioInputs.workingCapitalEfficiency * year);
      currentWorkingCapital = currentRevenue * (scenarioInputs.baseWorkingCapital / scenarioInputs.baseRevenue) * workingCapitalEfficiency;
      
      // Flujo de caja libre
      const freeCashFlow = currentEBITDA - currentCapex - (currentWorkingCapital - (currentRevenue * (scenarioInputs.baseWorkingCapital / scenarioInputs.baseRevenue)));
      
      // Valor presente
      presentValue += freeCashFlow / Math.pow(1 + scenarioInputs.discountRate, year);
    }

    // Valor terminal
    const terminalValue = (currentEBITDA * (1 - scenarioInputs.capexReduction * scenarioInputs.projectionYears)) / 
                         (scenarioInputs.discountRate - scenarioInputs.terminalGrowth);
    const presentTerminalValue = terminalValue / Math.pow(1 + scenarioInputs.discountRate, scenarioInputs.projectionYears);

    return presentValue + presentTerminalValue;
  };

  const updateScenario = (scenarioId: string, updates: Partial<ValuationInputs>) => {
    setScenarios(prev => 
      prev.map(scenario => 
        scenario.id === scenarioId 
          ? { 
              ...scenario, 
              ...updates,
              totalValue: calculateDCFValue({ ...inputs, ...updates })
            }
          : scenario
      )
    );
  };

  const saveScenario = async () => {
    if (!user || !selectedRestaurant) return;

    setSaving(true);
    try {
      const currentScenario = scenarios.find(s => s.id === activeScenario);
      if (!currentScenario) return;

      const { error } = await supabase
        .from('valuation_scenarios')
        .insert({
          user_id: user.id as any,
          restaurant_id: selectedRestaurant.id,
          scenario_name: currentScenario.name,
          scenario_data: {
            inputs: { ...inputs },
            scenario: currentScenario
          },
          calculated_value: currentScenario.totalValue,
          created_at: new Date().toISOString()
        } as any);

      if (error) throw error;

      toast.success('Escenario guardado correctamente');
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast.error('Error al guardar el escenario');
    } finally {
      setSaving(false);
    }
  };

  const exportValuation = () => {
    const currentScenario = scenarios.find(s => s.id === activeScenario);
    if (!currentScenario) return;

    const csvContent = [
      ['Parámetro', 'Valor'].join(','),
      ['Ingresos Base', inputs.baseRevenue].join(','),
      ['EBITDA Base', inputs.baseEBITDA].join(','),
      ['Tasa de Crecimiento', `${(currentScenario.growthRate * 100).toFixed(1)}%`].join(','),
      ['Tasa de Descuento', `${(currentScenario.discountRate * 100).toFixed(1)}%`].join(','),
      ['Crecimiento Terminal', `${(currentScenario.terminalGrowth * 100).toFixed(1)}%`].join(','),
      ['Valor Total', currentScenario.totalValue.toFixed(2)].join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `valoracion_dcf_${selectedRestaurant?.base_restaurant?.restaurant_name || 'restaurante'}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Valoración exportada correctamente');
  };

  const currentScenario = scenarios.find(s => s.id === activeScenario);
  const currentValue = currentScenario ? calculateDCFValue({ ...inputs, ...currentScenario }) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Valoración DCF Avanzada</h1>
          <p className="text-gray-600 mt-2">
            Modelo de valoración por flujo de caja descontado con múltiples escenarios
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={generateSensitivityAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Recalcular
          </Button>
          <Button variant="outline" onClick={exportValuation}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={saveScenario} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Guardar Escenario
          </Button>
        </div>
      </div>

      {/* Selector de Restaurante */}
      <Card>
        <CardHeader>
          <CardTitle>Restaurante a Valorar</CardTitle>
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

      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scenarios">Escenarios</TabsTrigger>
          <TabsTrigger value="sensitivity">Análisis de Sensibilidad</TabsTrigger>
          <TabsTrigger value="projections">Proyecciones</TabsTrigger>
          <TabsTrigger value="comparison">Comparativas</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Selector de Escenarios */}
          <Card>
            <CardHeader>
              <CardTitle>Escenarios de Valoración</CardTitle>
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
                          <span className="font-medium">{(scenario.growthRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Descuento:</span>
                          <span className="font-medium">{(scenario.discountRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Valor:</span>
                          <span className="text-green-600">€{calculateDCFValue({ ...inputs, ...scenario }).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Parámetros del Escenario Activo */}
          {currentScenario && (
            <Card>
              <CardHeader>
                <CardTitle>Parámetros del Escenario: {currentScenario.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Parámetros de Crecimiento</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="growthRate">Tasa de Crecimiento (%)</Label>
                        <Input
                          id="growthRate"
                          type="number"
                          step="0.01"
                          value={(currentScenario.growthRate * 100).toFixed(1)}
                          onChange={(e) => updateScenario(activeScenario, { growthRate: parseFloat(e.target.value) / 100 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="terminalGrowth">Crecimiento Terminal (%)</Label>
                        <Input
                          id="terminalGrowth"
                          type="number"
                          step="0.01"
                          value={(currentScenario.terminalGrowth * 100).toFixed(1)}
                          onChange={(e) => updateScenario(activeScenario, { terminalGrowth: parseFloat(e.target.value) / 100 })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Parámetros de Descuento</h4>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="discountRate">Tasa de Descuento (%)</Label>
                        <Input
                          id="discountRate"
                          type="number"
                          step="0.01"
                          value={(currentScenario.discountRate * 100).toFixed(1)}
                          onChange={(e) => updateScenario(activeScenario, { discountRate: parseFloat(e.target.value) / 100 })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Resultado</h4>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        €{currentValue.toLocaleString()}
                      </div>
                      <p className="text-sm text-green-700">Valor Total DCF</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sensitivity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Sensibilidad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={sensitivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="discountRate" 
                    name="Tasa de Descuento"
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <YAxis 
                    dataKey="value" 
                    name="Valor"
                    tickFormatter={(value) => `€${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: any) => [
                      `€${(value / 1000000).toFixed(2)}M`, 
                      'Valor'
                    ]}
                    labelFormatter={(label) => `Descuento: ${(label * 100).toFixed(1)}%`}
                  />
                  <Scatter dataKey="value" fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Proyecciones de Flujo de Caja</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={Array.from({ length: inputs.projectionYears }, (_, i) => {
                  const year = i + 1;
                  const revenue = inputs.baseRevenue * Math.pow(1 + (currentScenario?.growthRate || 0.05), year);
                  const ebitda = revenue * (inputs.baseEBITDA / inputs.baseRevenue);
                  const capex = revenue * (inputs.baseCapex / inputs.baseRevenue);
                  const fcf = ebitda - capex;
                  
                  return {
                    year,
                    revenue: revenue / 1000000,
                    ebitda: ebitda / 1000000,
                    fcf: fcf / 1000000
                  };
                })}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(value) => `€${value}M`} />
                  <Tooltip 
                    formatter={(value: any) => [`€${value}M`, '']}
                    labelFormatter={(label) => `Año ${label}`}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} name="Ingresos" />
                  <Line type="monotone" dataKey="ebitda" stroke="#82ca9d" strokeWidth={2} name="EBITDA" />
                  <Line type="monotone" dataKey="fcf" stroke="#ffc658" strokeWidth={2} name="FCF" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparativa de Escenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={scenarios.map(scenario => ({
                  name: scenario.name,
                  value: calculateDCFValue({ ...inputs, ...scenario }) / 1000000
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `€${value}M`} />
                  <Tooltip formatter={(value: any) => [`€${value}M`, 'Valor']} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDCFValuation; 