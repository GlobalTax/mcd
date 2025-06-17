
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FranchiseeRestaurantsTable } from '@/components/FranchiseeRestaurantsTable';
import { Building, Euro, Hash, MapPin } from 'lucide-react';

interface DisplayRestaurant {
  id: string;
  name?: string;
  restaurant_name?: string;
  location?: string;
  city?: string;
  address?: string;
  siteNumber?: string;
  site_number?: string;
  franchiseeName?: string;
  franchise_start_date?: string;
  franchise_end_date?: string;
  restaurant_type?: string;
  status?: string;
  lastYearRevenue?: number;
  baseRent?: number;
  isOwnedByMcD?: boolean;
}

interface RestaurantsSectionProps {
  franchiseeId: string;
  franchiseeRestaurants: any[];
  hasSupabaseRestaurants: boolean;
  allLocalRestaurants: DisplayRestaurant[];
}

export const RestaurantsSection: React.FC<RestaurantsSectionProps> = ({
  franchiseeId,
  franchiseeRestaurants,
  hasSupabaseRestaurants,
  allLocalRestaurants
}) => {
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0';
    }
    return value.toLocaleString('es-ES');
  };

  return (
    <div className="space-y-8">
      {/* Main Restaurants Table */}
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Mis Restaurantes</h3>
        </div>
        <FranchiseeRestaurantsTable 
          franchiseeId={franchiseeId}
          restaurants={franchiseeRestaurants}
        />
      </div>

      {/* Legacy Restaurants if available */}
      {!hasSupabaseRestaurants && allLocalRestaurants.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building className="w-5 h-5 text-amber-600" />
            <div>
              <h4 className="font-medium text-amber-900">
                Restaurantes de la Herramienta de Valoración
              </h4>
              <p className="text-sm text-amber-700">
                {allLocalRestaurants.length} restaurantes disponibles. 
                Contacta a tu asesor para asignación oficial.
              </p>
            </div>
          </div>
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {allLocalRestaurants.slice(0, 3).map((restaurant) => (
              <div key={restaurant.id} className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-gray-900">{restaurant.name}</h5>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{restaurant.location}</span>
                  </div>
                  {restaurant.lastYearRevenue && (
                    <div className="flex items-center gap-2 text-xs text-green-600">
                      <Euro className="w-3 h-3" />
                      <span>€{formatNumber(restaurant.lastYearRevenue)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {allLocalRestaurants.length > 3 && (
            <p className="text-sm text-amber-700 mt-3">
              +{allLocalRestaurants.length - 3} restaurantes más
            </p>
          )}
        </div>
      )}
    </div>
  );
};
