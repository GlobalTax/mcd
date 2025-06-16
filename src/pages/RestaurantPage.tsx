
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Franchisee, Restaurant } from '@/types/restaurant';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Calendar, Euro, Building2, Hash, Shield, TrendingUp } from 'lucide-react';

export default function RestaurantPage() {
  const { siteNumber } = useParams<{ siteNumber: string }>();
  const navigate = useNavigate();
  const [franchisees] = useLocalStorage<Franchisee[]>('franchisees', []);

  // Find the restaurant by site number
  const restaurantData = franchisees.reduce<{
    restaurant: Restaurant | null;
    franchisee: Franchisee | null;
  }>((acc, franchisee) => {
    const restaurant = franchisee.restaurants.find(r => r.siteNumber === siteNumber);
    if (restaurant) {
      return { restaurant, franchisee };
    }
    return acc;
  }, { restaurant: null, franchisee: null });

  const { restaurant, franchisee } = restaurantData;

  if (!restaurant || !franchisee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-manrope">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurante no encontrado</h1>
          <p className="text-gray-600 mb-6">El restaurante con site #{siteNumber} no existe.</p>
          <Button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al panel
          </Button>
        </div>
      </div>
    );
  }

  const handleNavigateToValuation = () => {
    // Simulate selecting the restaurant and navigating to valuation
    // This will require updating the state in the main app
    navigate('/', { state: { selectRestaurant: restaurant } });
  };

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0';
    }
    return value.toLocaleString('es-ES');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-manrope">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al panel
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {restaurant.name}
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Site #{restaurant.siteNumber} - {franchisee.name}
                  </p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleNavigateToValuation}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Valorar Restaurante
            </Button>
          </div>
          
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-3 rounded-lg border border-gray-200">
            <span className="text-gray-700 font-medium">Panel Central</span>
            <span className="mx-3 text-gray-300">/</span>
            <span className="text-red-600 font-medium">{restaurant.name}</span>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información Básica</h2>
              
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Site Number</p>
                  <p className="font-semibold text-gray-900">{restaurant.siteNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-semibold text-gray-900">{restaurant.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Franquiciado</p>
                  <p className="font-semibold text-gray-900">{franchisee.name}</p>
                </div>
              </div>
            </div>

            {/* Financial Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información Financiera</h2>
              
              <div className="flex items-center gap-3">
                <Euro className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Facturación Último Año</p>
                  <p className="font-semibold text-gray-900">€{formatNumber(restaurant.lastYearRevenue)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Renta Base</p>
                  <p className="font-semibold text-gray-900">€{formatNumber(restaurant.baseRent)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Euro className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Rent Index</p>
                  <p className="font-semibold text-gray-900">€{formatNumber(restaurant.rentIndex)}</p>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Información Contractual</h2>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Fin de Franquicia</p>
                  <p className="font-semibold text-gray-900">
                    {restaurant.franchiseEndDate ? new Date(restaurant.franchiseEndDate).toLocaleDateString('es-ES') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-500">Fin de Alquiler</p>
                  <p className="font-semibold text-gray-900">
                    {restaurant.isOwnedByMcD ? (
                      <span className="text-green-600">Propiedad McDonald's</span>
                    ) : (
                      restaurant.leaseEndDate ? new Date(restaurant.leaseEndDate).toLocaleDateString('es-ES') : 'N/A'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Tipo de Propiedad</p>
                  <p className="font-semibold text-gray-900">
                    {restaurant.isOwnedByMcD ? 'Propiedad McDonald\'s' : 'Alquiler'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Valuation Info */}
          {restaurant.currentValuation && (
            <div className="border-t pt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Valoración Actual</h2>
                <Button 
                  onClick={handleNavigateToValuation}
                  variant="outline"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Nueva Valoración
                </Button>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Valoración Final</p>
                    <p className="text-3xl font-bold text-green-800">
                      €{formatNumber(restaurant.currentValuation.finalValuation)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600 font-medium">Fecha de Valoración</p>
                    <p className="text-lg font-semibold text-green-800">
                      {new Date(restaurant.currentValuation.valuationDate).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!restaurant.currentValuation && (
            <div className="border-t pt-8">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500 font-medium mb-4">Este restaurante aún no ha sido valorado</p>
                <Button 
                  onClick={handleNavigateToValuation}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Realizar Primera Valoración
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
