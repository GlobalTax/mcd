
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { useRestaurantValuations } from '@/hooks/useRestaurantValuations';
import { useAuth } from '@/hooks/useAuth';
import { Building2, Save, FolderOpen, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface SimpleValuationManagerProps {
  onRestaurantSelected: (restaurantId: string, restaurantName: string) => void;
  onValuationLoaded: (valuation: any) => void;
  currentData: any;
}

const SimpleValuationManager = ({ 
  onRestaurantSelected, 
  onValuationLoaded, 
  currentData 
}: SimpleValuationManagerProps) => {
  const { user } = useAuth();
  const { restaurants, loading, error, refetch } = useFranchiseeRestaurants();
  const { valuations, saveValuation, updateValuation } = useRestaurantValuations();
  
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [selectedRestaurantName, setSelectedRestaurantName] = useState<string>('');
  const [valuationName, setValuationName] = useState<string>('');
  const [isNewValuationOpen, setIsNewValuationOpen] = useState(false);
  const [isLoadValuationOpen, setIsLoadValuationOpen] = useState(false);
  const [currentValuationId, setCurrentValuationId] = useState<string | null>(null);

  console.log('SimpleValuationManager - User:', user);
  console.log('SimpleValuationManager - Restaurants:', restaurants);
  console.log('SimpleValuationManager - Loading:', loading);
  console.log('SimpleValuationManager - Error:', error);

  const restaurantOptions = restaurants
    .filter(r => r.base_restaurant)
    .map(r => ({
      id: r.base_restaurant!.id,
      name: r.base_restaurant!.restaurant_name,
      site_number: r.base_restaurant!.site_number
    }));

  console.log('Restaurant options:', restaurantOptions);

  const handleRestaurantChange = (restaurantId: string) => {
    const restaurant = restaurantOptions.find(r => r.id === restaurantId);
    if (restaurant) {
      console.log('Restaurant selected:', restaurant);
      setSelectedRestaurantId(restaurantId);
      setSelectedRestaurantName(restaurant.name);
      onRestaurantSelected(restaurantId, restaurant.name);
      toast.success(`Restaurante seleccionado: ${restaurant.name}`);
    }
  };

  const handleSaveValuation = async () => {
    if (!selectedRestaurantId || !valuationName.trim()) {
      toast.error('Selecciona un restaurante e ingresa un nombre');
      return;
    }

    if (!currentData || !currentData.inputs) {
      toast.error('No hay datos para guardar');
      return;
    }

    try {
      const valuationData = {
        restaurant_id: selectedRestaurantId,
        restaurant_name: selectedRestaurantName,
        valuation_name: valuationName.trim(),
        valuation_date: new Date().toISOString().split('T')[0],
        change_date: currentData.inputs?.changeDate || null,
        franchise_end_date: currentData.inputs?.franchiseEndDate || null,
        remaining_years: currentData.inputs?.remainingYears || 0,
        inflation_rate: currentData.inputs?.inflationRate || 1.5,
        discount_rate: currentData.inputs?.discountRate || 21.0,
        growth_rate: currentData.inputs?.growthRate || 3.0,
        yearly_data: currentData.yearlyData || [],
        total_present_value: currentData.totalPrice || null,
        projections: currentData.projections || null
      };

      console.log('Saving valuation data:', valuationData);

      if (currentValuationId) {
        await updateValuation(currentValuationId, valuationData);
        toast.success('Valoración actualizada');
      } else {
        const newValuation = await saveValuation(valuationData);
        setCurrentValuationId(newValuation.id);
        toast.success('Valoración guardada');
      }
      
      setIsNewValuationOpen(false);
      setValuationName('');
    } catch (error) {
      console.error('Error saving valuation:', error);
      toast.error('Error al guardar la valoración');
    }
  };

  const handleLoadValuation = (valuation: any) => {
    console.log('Loading valuation:', valuation);
    setCurrentValuationId(valuation.id);
    setSelectedRestaurantId(valuation.restaurant_id);
    setSelectedRestaurantName(valuation.restaurant_name);
    onRestaurantSelected(valuation.restaurant_id, valuation.restaurant_name);
    onValuationLoaded(valuation);
    setIsLoadValuationOpen(false);
    toast.success(`Valoración "${valuation.valuation_name}" cargada`);
  };

  const restaurantValuations = selectedRestaurantId 
    ? valuations.filter(v => v.restaurant_id === selectedRestaurantId)
    : [];

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Cargando restaurantes...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay restaurantes disponibles
          </h3>
          <p className="text-gray-600 mb-4">
            No tienes restaurantes asignados para realizar valoraciones.
          </p>
          <Button onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Buscar restaurantes
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Gestión de Valoraciones
          </CardTitle>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selector de restaurante */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Seleccionar Restaurante ({restaurantOptions.length} disponibles)
          </label>
          <Select value={selectedRestaurantId} onValueChange={handleRestaurantChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un restaurante..." />
            </SelectTrigger>
            <SelectContent>
              {restaurantOptions.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{restaurant.name}</span>
                    <span className="text-sm text-gray-500">#{restaurant.site_number}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedRestaurantId && (
          <div className="flex gap-2">
            {/* Guardar nueva valoración */}
            <Dialog open={isNewValuationOpen} onOpenChange={setIsNewValuationOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Valoración
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Guardar Valoración</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre de la Valoración
                    </label>
                    <Input
                      value={valuationName}
                      onChange={(e) => setValuationName(e.target.value)}
                      placeholder="Ej: Valoración Base 2024"
                    />
                  </div>
                  <Button onClick={handleSaveValuation} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    {currentValuationId ? 'Actualizar' : 'Guardar'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Cargar valoración existente */}
            <Dialog open={isLoadValuationOpen} onOpenChange={setIsLoadValuationOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Cargar Valoración
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Cargar Valoración Existente</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {restaurantValuations.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No hay valoraciones guardadas para este restaurante
                    </p>
                  ) : (
                    restaurantValuations.map((valuation) => (
                      <div 
                        key={valuation.id} 
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleLoadValuation(valuation)}
                      >
                        <h4 className="font-medium">{valuation.valuation_name}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(valuation.valuation_date).toLocaleDateString('es-ES')}
                        </p>
                        {valuation.total_present_value && (
                          <p className="text-sm text-green-600 font-medium">
                            €{valuation.total_present_value.toLocaleString('es-ES')}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Estado actual */}
        {selectedRestaurantId && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 font-medium">Restaurante Seleccionado:</p>
            <p className="text-blue-700">{selectedRestaurantName}</p>
            {currentValuationId && (
              <p className="text-sm text-blue-600 mt-1">
                Valoración cargada (ID: {currentValuationId.slice(0, 8)}...)
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimpleValuationManager;
