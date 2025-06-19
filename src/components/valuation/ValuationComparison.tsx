import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  Download,
  Filter,
  Eye,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface ValuationComparison {
  id: string;
  scenario_name: string;
  restaurant_name: string;
  calculated_value: number;
  scenario_data: any;
  created_at: string;
  user_name: string;
}

const ValuationComparison: React.FC = () => {
  const { user } = useAuth();
  const [valuations, setValuations] = useState<ValuationComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedValuations, setSelectedValuations] = useState<string[]>([]);
  const [filterRestaurant, setFilterRestaurant] = useState<string>('');
  const [filterScenario, setFilterScenario] = useState<string>('');
  const [restaurants, setRestaurants] = useState<string[]>([]);
  const [scenarios, setScenarios] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadValuations();
    }
  }, [user]);

  const loadValuations = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('valuation_scenarios')
        .select(`
          *,
          restaurant:franchisee_restaurants(
            base_restaurant:base_restaurants(restaurant_name)
          ),
          user:profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      const formattedData: ValuationComparison[] = (data || []).map(item => ({
        id: item.id,
        scenario_name: item.scenario_name,
        restaurant_name: (item.restaurant as any)?.base_restaurant?.restaurant_name || 'Restaurante',
        calculated_value: (item as any).calculated_value,
        scenario_data: (item as any).scenario_data,
        created_at: item.created_at,
        user_name: (item.user as any)?.full_name || 'Usuario'
      }));

      setValuations(formattedData);

      // Extraer restaurantes y escenarios únicos para filtros
      const uniqueRestaurants = [...new Set(formattedData.map(v => v.restaurant_name))];
      const uniqueScenarios = [...new Set(formattedData.map(v => v.scenario_name))];
      
      setRestaurants(uniqueRestaurants);
      setScenarios(uniqueScenarios);

    } catch (error) {
      console.error('Error loading valuations:', error);
      toast.error('Error al cargar las valoraciones');
    } finally {
      setLoading(false);
    }
  };

  const filteredValuations = valuations.filter(valuation => {
    if (filterRestaurant && valuation.restaurant_name !== filterRestaurant) return false;
    if (filterScenario && valuation.scenario_name !== filterScenario) return false;
    return true;
  });

  const selectedValuationData = filteredValuations.filter(v => selectedValuations.includes(v.id));

  const toggleValuationSelection = (valuationId: string) => {
    setSelectedValuations(prev => 
      prev.includes(valuationId) 
        ? prev.filter(id => id !== valuationId)
        : [...prev, valuationId]
    );
  };

  const selectAllValuations = () => {
    setSelectedValuations(filteredValuations.map(v => v.id));
  };

  const clearSelection = () => {
    setSelectedValuations([]);
  };

  const deleteValuation = async (valuationId: string) => {
    try {
      const { error } = await supabase
        .from('valuation_scenarios')
        .delete()
        .eq('id', valuationId);

      if (error) throw error;

      setValuations(prev => prev.filter(v => v.id !== valuationId));
      setSelectedValuations(prev => prev.filter(id => id !== valuationId));
      
      toast.success('Valoración eliminada correctamente');
    } catch (error) {
      console.error('Error deleting valuation:', error);
      toast.error('Error al eliminar la valoración');
    }
  };

  const exportComparison = () => {
    if (selectedValuationData.length === 0) {
      toast.error('Selecciona al menos una valoración para exportar');
      return;
    }

    const csvContent = [
      ['Restaurante', 'Escenario', 'Valor (€)', 'Fecha', 'Usuario'].join(','),
      ...selectedValuationData.map(valuation => [
        valuation.restaurant_name,
        valuation.scenario_name,
        valuation.calculated_value.toFixed(2),
        new Date(valuation.created_at).toLocaleDateString('es-ES'),
        valuation.user_name
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparacion_valoraciones_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Comparación exportada correctamente');
  };

  const getValueColor = (value: number, maxValue: number) => {
    const percentage = value / maxValue;
    if (percentage >= 0.8) return 'text-green-600';
    if (percentage >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const maxValue = Math.max(...filteredValuations.map(v => v.calculated_value));

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Comparación de Valoraciones</h1>
          <p className="text-gray-600 mt-2">
            Compara múltiples valoraciones DCF y analiza las diferencias
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={selectAllValuations}>
            Seleccionar Todas
          </Button>
          <Button variant="outline" onClick={clearSelection}>
            Limpiar Selección
          </Button>
          <Button 
            variant="outline" 
            onClick={exportComparison}
            disabled={selectedValuationData.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar ({selectedValuationData.length})
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Restaurante</label>
              <Select value={filterRestaurant} onValueChange={setFilterRestaurant}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los restaurantes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los restaurantes</SelectItem>
                  {restaurants.map(restaurant => (
                    <SelectItem key={restaurant} value={restaurant}>
                      {restaurant}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Escenario</label>
              <Select value={filterScenario} onValueChange={setFilterScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los escenarios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los escenarios</SelectItem>
                  {scenarios.map(scenario => (
                    <SelectItem key={scenario} value={scenario}>
                      {scenario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Valoraciones */}
      <Card>
        <CardHeader>
          <CardTitle>
            Valoraciones ({filteredValuations.length})
            {selectedValuationData.length > 0 && (
              <Badge className="ml-2" variant="secondary">
                {selectedValuationData.length} seleccionadas
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
              <span className="ml-2">Cargando valoraciones...</span>
            </div>
          ) : filteredValuations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron valoraciones</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Seleccionar</TableHead>
                    <TableHead>Restaurante</TableHead>
                    <TableHead>Escenario</TableHead>
                    <TableHead>Valor (€)</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead className="w-20">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredValuations.map((valuation) => (
                    <TableRow key={valuation.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedValuations.includes(valuation.id)}
                          onChange={() => toggleValuationSelection(valuation.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {valuation.restaurant_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {valuation.scenario_name}
                        </Badge>
                      </TableCell>
                      <TableCell className={`font-bold ${getValueColor(valuation.calculated_value, maxValue)}`}>
                        €{valuation.calculated_value.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(valuation.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        {valuation.user_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteValuation(valuation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráficos de Comparación */}
      {selectedValuationData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Barras */}
          <Card>
            <CardHeader>
              <CardTitle>Comparación de Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={selectedValuationData.map(v => ({
                  name: `${v.restaurant_name} - ${v.scenario_name}`,
                  value: v.calculated_value / 1000000
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis tickFormatter={(value) => `€${value}M`} />
                  <Tooltip formatter={(value: any) => [`€${value}M`, 'Valor']} />
                  <Bar dataKey="value" fill="#8884d8" />
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
                <LineChart data={selectedValuationData
                  .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                  .map(v => ({
                    date: new Date(v.created_at).toLocaleDateString('es-ES'),
                    value: v.calculated_value / 1000000,
                    name: `${v.restaurant_name} - ${v.scenario_name}`
                  }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `€${value}M`} />
                  <Tooltip formatter={(value: any) => [`€${value}M`, 'Valor']} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Estadísticas */}
      {selectedValuationData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de la Comparación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedValuationData.length}
                </div>
                <p className="text-sm text-gray-600">Valoraciones</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  €{(Math.max(...selectedValuationData.map(v => v.calculated_value)) / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-600">Valor Máximo</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  €{(Math.min(...selectedValuationData.map(v => v.calculated_value)) / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-600">Valor Mínimo</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  €{(selectedValuationData.reduce((sum, v) => sum + v.calculated_value, 0) / selectedValuationData.length / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-gray-600">Valor Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ValuationComparison; 