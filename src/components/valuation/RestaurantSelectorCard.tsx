
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, RefreshCw } from 'lucide-react';

interface RestaurantOption {
  id: string;
  name: string;
  site_number: string;
}

interface RestaurantSelectorCardProps {
  restaurants: RestaurantOption[];
  selectedRestaurantId: string;
  onRestaurantChange: (restaurantId: string) => void;
  onRefresh: () => void;
}

const RestaurantSelectorCard = ({
  restaurants,
  selectedRestaurantId,
  onRestaurantChange,
  onRefresh
}: RestaurantSelectorCardProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Seleccionar Restaurante ({restaurants.length} disponibles)
      </label>
      <Select value={selectedRestaurantId} onValueChange={onRestaurantChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona un restaurante..." />
        </SelectTrigger>
        <SelectContent>
          {restaurants.map((restaurant) => (
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
  );
};

export default RestaurantSelectorCard;
