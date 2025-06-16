
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Restaurant, Franchisee } from '@/types/restaurant';
import { Plus, MapPin, Calendar } from 'lucide-react';

interface RestaurantManagerProps {
  franchisee: Franchisee;
  onAddRestaurant: (restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'currentValuation' | 'valuationHistory'>) => void;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  selectedRestaurant: Restaurant | null;
}

export function RestaurantManager({ 
  franchisee, 
  onAddRestaurant, 
  onSelectRestaurant,
  selectedRestaurant 
}: RestaurantManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    location: '',
    contractEndDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRestaurant.name && newRestaurant.location && newRestaurant.contractEndDate) {
      onAddRestaurant({
        ...newRestaurant,
        franchiseeId: franchisee.id
      });
      setNewRestaurant({ name: '', location: '', contractEndDate: '' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Restaurantes de {franchisee.name}</h2>
          <p className="text-gray-600">{franchisee.restaurants.length} restaurantes</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Restaurante
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nuevo Restaurante</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="restaurantName">Nombre del Restaurante *</Label>
                <Input
                  id="restaurantName"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ej. McDonald's Parc Central"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  value={newRestaurant.location}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="ej. Barcelona, España"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contractEnd">Fecha Fin de Contrato *</Label>
                <Input
                  id="contractEnd"
                  type="date"
                  value={newRestaurant.contractEndDate}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, contractEndDate: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {franchisee.restaurants.map((restaurant) => (
          <Card 
            key={restaurant.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-green-500' : ''
            }`}
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <CardContent className="p-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {restaurant.location}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Contrato hasta: {new Date(restaurant.contractEndDate).toLocaleDateString('es-ES')}
                </div>
                
                {restaurant.currentValuation && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">
                      Valoración Actual: €{restaurant.currentValuation.finalValuation.toLocaleString('es-ES')}
                    </p>
                    <p className="text-xs text-green-600">
                      Actualizada: {new Date(restaurant.currentValuation.valuationDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  {restaurant.valuationHistory.length} valoraciones realizadas
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {franchisee.restaurants.length === 0 && !showAddForm && (
        <Card>
          <CardContent className="p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay restaurantes</h3>
            <p className="text-gray-600 mb-4">Agrega el primer restaurante para {franchisee.name}</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Restaurante
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
