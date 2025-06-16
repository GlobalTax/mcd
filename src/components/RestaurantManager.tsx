
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Restaurant, Franchisee } from '@/types/restaurant';
import { Plus, MapPin, Calendar, TrendingUp } from 'lucide-react';

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurantes de {franchisee.name}</h2>
          <p className="text-gray-600">{franchisee.restaurants.length} restaurantes registrados</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-6"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Restaurante
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nuevo Restaurante</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restaurantName" className="text-gray-700 font-medium">Nombre del Restaurante *</Label>
                <Input
                  id="restaurantName"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ej. McDonald's Parc Central"
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-gray-700 font-medium">Ubicación *</Label>
                <Input
                  id="location"
                  value={newRestaurant.location}
                  onChange={(e) => setNewRestaurant(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="ej. Barcelona, España"
                  className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contractEnd" className="text-gray-700 font-medium">Fecha Fin de Contrato *</Label>
              <Input
                id="contractEnd"
                type="date"
                value={newRestaurant.contractEndDate}
                onChange={(e) => setNewRestaurant(prev => ({ ...prev, contractEndDate: e.target.value }))}
                className="mt-1 border-gray-300 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                Guardar
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {franchisee.restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={`bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-red-200 ${
              selectedRestaurant?.id === restaurant.id ? 'ring-2 ring-red-500 border-red-500' : ''
            }`}
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-xl text-gray-900">{restaurant.name}</h3>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-lg">M</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">{restaurant.location}</span>
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>Contrato hasta: <span className="font-medium">{new Date(restaurant.contractEndDate).toLocaleDateString('es-ES')}</span></span>
                </div>
              </div>
              
              {restaurant.currentValuation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Valoración Actual</span>
                  </div>
                  <p className="text-2xl font-bold text-green-800">
                    €{restaurant.currentValuation.finalValuation.toLocaleString('es-ES')}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Actualizada: {new Date(restaurant.currentValuation.valuationDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  {restaurant.valuationHistory.length} valoraciones realizadas
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {franchisee.restaurants.length === 0 && !showAddForm && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay restaurantes</h3>
          <p className="text-gray-600 mb-6">Agrega el primer restaurante para {franchisee.name}</p>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-medium px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Restaurante
          </Button>
        </div>
      )}
    </div>
  );
}
