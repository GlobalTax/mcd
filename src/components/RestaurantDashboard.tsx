
import { Restaurant, Franchisee } from '@/types/restaurant';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, TrendingUp, Hash, Euro, Building2, Shield } from 'lucide-react';

interface RestaurantDashboardProps {
  franchisees: Franchisee[];
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

// Helper function to safely format numbers
const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0';
  }
  return value.toLocaleString('es-ES');
};

export function RestaurantDashboard({ franchisees, onSelectRestaurant }: RestaurantDashboardProps) {
  // Get all restaurants from all franchisees
  const allRestaurants = franchisees.flatMap(f => 
    f.restaurants.map(r => ({ ...r, franchiseeName: f.name }))
  );

  if (allRestaurants.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay restaurantes registrados</h3>
          <p className="text-gray-600 mb-6">Comienza agregando franquiciados y restaurantes al sistema</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Restaurantes</h2>
        <p className="text-gray-600">{allRestaurants.length} restaurantes disponibles para valoración</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allRestaurants.map((restaurant) => (
          <Card
            key={restaurant.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-red-200 group"
            onClick={() => onSelectRestaurant(restaurant)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <Hash className="w-4 h-4" />
                      <span>Site: {restaurant.siteNumber}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{restaurant.franchiseeName}</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-lg">M</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">{restaurant.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Euro className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-500">Facturación</p>
                        <p className="font-medium">€{formatNumber(restaurant.lastYearRevenue)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500">Renta Base</p>
                        <p className="font-medium">€{formatNumber(restaurant.baseRent)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>Contrato hasta: <span className="font-medium">{new Date(restaurant.contractEndDate).toLocaleDateString('es-ES')}</span></span>
                  </div>
                  
                  {restaurant.isOwnedByMcD ? (
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 text-sm font-medium">Propiedad de McDonald's</span>
                    </div>
                  ) : restaurant.leaseEndDate && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>Alquiler hasta: <span className="font-medium">{new Date(restaurant.leaseEndDate).toLocaleDateString('es-ES')}</span></span>
                    </div>
                  )}
                </div>
                
                {restaurant.currentValuation ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Valoración Actual</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800">
                      €{formatNumber(restaurant.currentValuation.finalValuation)}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Actualizada: {new Date(restaurant.currentValuation.valuationDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">Sin valoración</p>
                      <p className="text-sm text-gray-500">Haz clic para valorar</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    {restaurant.valuationHistory.length} valoraciones históricas
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
