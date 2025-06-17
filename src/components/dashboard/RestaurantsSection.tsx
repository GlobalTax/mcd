
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FranchiseeRestaurantsTable } from '@/components/FranchiseeRestaurantsTable';
import { Building, Euro, Hash, MapPin, Building2 } from 'lucide-react';

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
    <>
      {/* Restaurants Table */}
      <Card className="border border-gray-200/60 shadow-sm bg-white">
        <CardHeader className="border-b border-gray-200/60 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold text-gray-900">Mis Restaurantes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <FranchiseeRestaurantsTable 
            franchiseeId={franchiseeId}
            restaurants={franchiseeRestaurants}
          />
        </CardContent>
      </Card>

      {/* Show legacy restaurants if we have local storage data but no Supabase data */}
      {!hasSupabaseRestaurants && allLocalRestaurants.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Datos de Herramienta de Valoración
                </h3>
                <p className="text-yellow-700 text-sm">
                  Tienes {allLocalRestaurants.length} restaurantes de la herramienta de valoración. 
                  Contacta con tu asesor para que te asigne restaurantes oficiales.
                </p>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allLocalRestaurants.slice(0, 3).map((restaurant) => (
                <Card key={restaurant.id} className="bg-white/80 backdrop-blur-sm border-yellow-200 shadow-sm">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">{restaurant.name}</h4>
                        <p className="text-xs text-gray-600">{restaurant.location}</p>
                      </div>
                      {restaurant.lastYearRevenue && (
                        <div className="flex items-center gap-2 text-xs">
                          <Euro className="w-3 h-3 text-green-600" />
                          <span>€{formatNumber(restaurant.lastYearRevenue)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {allLocalRestaurants.length > 3 && (
              <p className="text-yellow-700 text-sm mt-3">
                Y {allLocalRestaurants.length - 3} restaurantes más...
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
