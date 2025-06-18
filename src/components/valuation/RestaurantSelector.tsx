
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2 } from 'lucide-react';

interface RestaurantOption {
  id: string;
  name: string;
  site_number: string;
}

interface RestaurantSelectorProps {
  restaurants: RestaurantOption[];
  selectedRestaurant: RestaurantOption | null;
  onRestaurantChange: (restaurant: RestaurantOption) => void;
  loading?: boolean;
}

const RestaurantSelector = ({ 
  restaurants, 
  selectedRestaurant, 
  onRestaurantChange, 
  loading = false 
}: RestaurantSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Seleccionar Restaurante para Valorar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedRestaurant?.id || ''}
          onValueChange={(value) => {
            const restaurant = restaurants.find(r => r.id === value);
            if (restaurant) {
              onRestaurantChange(restaurant);
            }
          }}
          disabled={loading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un restaurante para valorar..." />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <SelectItem value="" disabled>
                Cargando restaurantes...
              </SelectItem>
            ) : restaurants.length === 0 ? (
              <SelectItem value="" disabled>
                No hay restaurantes disponibles
              </SelectItem>
            ) : (
              restaurants.map((restaurant) => (
                <SelectItem key={restaurant.id} value={restaurant.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{restaurant.name}</span>
                    <span className="text-sm text-gray-500">#{restaurant.site_number}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        
        {selectedRestaurant && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800">Restaurante Seleccionado:</h4>
            <p className="text-green-700">{selectedRestaurant.name}</p>
            <p className="text-sm text-green-600">Número de sitio: #{selectedRestaurant.site_number}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantSelector;
