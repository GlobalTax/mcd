
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calculator, TrendingUp, Users, Settings, LogOut, MapPin, Calendar, Hash, Euro, Building2, Shield } from 'lucide-react';
import { Franchisee } from '@/types/restaurant';

// Tipo extendido para manejar ambos formatos de restaurant
type DisplayRestaurant = {
  id: string;
  name?: string;
  restaurant_name?: string;
  location?: string;
  city?: string;
  address?: string;
  siteNumber?: string;
  site_number?: string;
  franchiseeName?: string;
  opening_date?: string;
  contractEndDate?: string;
  restaurant_type?: string;
  status?: string;
  lastYearRevenue?: number;
  baseRent?: number;
  isOwnedByMcD?: boolean;
  currentValuation?: any;
};

const DashboardPage = () => {
  const { user, franchisee, restaurants, signOut } = useAuth();
  const navigate = useNavigate();
  const [localFranchisees] = useLocalStorage<Franchisee[]>('franchisees', []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null || isNaN(value)) {
      return '0';
    }
    return value.toLocaleString('es-ES');
  };

  // Helper function to get site number safely
  const getSiteNumber = (restaurant: DisplayRestaurant): string | undefined => {
    return restaurant.siteNumber || restaurant.site_number;
  };

  // Get all restaurants from localStorage (from valuation tool)
  const allLocalRestaurants = localFranchisees.flatMap(f => 
    f.restaurants.map(r => ({ ...r, franchiseeName: f.name }))
  );

  // Use local restaurants if available, otherwise fall back to Supabase restaurants
  const displayRestaurants: DisplayRestaurant[] = allLocalRestaurants.length > 0 ? allLocalRestaurants : (restaurants || []);
  const totalRestaurants = displayRestaurants?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Bienvenido, {user?.full_name || user?.email}
              </h1>
              <p className="text-gray-600 text-lg">
                Portal de Franquiciados McDonald's
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configuración
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restaurantes</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRestaurants}</div>
              <p className="text-xs text-muted-foreground">
                Total de establecimientos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Franquiciados</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{localFranchisees.length || (franchisee ? 1 : 0)}</div>
              <p className="text-xs text-muted-foreground">
                {localFranchisees.length > 0 ? 
                  `${localFranchisees.length} franquiciados configurados` :
                  (franchisee?.franchisee_name || 'No configurado')
                }
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Activo</div>
              <p className="text-xs text-muted-foreground">
                Sistema operativo
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => navigate('/valuation')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-red-600" />
                Herramienta de Valoración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Accede a la herramienta profesional de valoración de restaurantes McDonald's
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                Análisis P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Analiza el rendimiento financiero de tus restaurantes
              </p>
              {displayRestaurants && displayRestaurants.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    const firstRestaurant = displayRestaurants[0];
                    const siteNumber = getSiteNumber(firstRestaurant);
                    if (siteNumber) {
                      navigate(`/restaurant/${siteNumber}/profitloss`);
                    }
                  }}
                >
                  Ir a P&L
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Restaurants Section */}
        {displayRestaurants && displayRestaurants.length > 0 ? (
          <div className="mb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Mis Restaurantes</h2>
              <p className="text-gray-600">{displayRestaurants.length} restaurantes disponibles</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {displayRestaurants.map((restaurant) => (
                <Card
                  key={restaurant.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-red-200 group"
                  onClick={() => {
                    const siteNumber = getSiteNumber(restaurant);
                    if (siteNumber) {
                      navigate(`/restaurant/${siteNumber}`);
                    }
                  }}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                            {restaurant.name || restaurant.restaurant_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <Hash className="w-4 h-4" />
                            <span>Site: {getSiteNumber(restaurant)}</span>
                          </div>
                          {(restaurant.franchiseeName || franchisee) && (
                            <p className="text-sm text-gray-600 mt-1">
                              {restaurant.franchiseeName || franchisee?.franchisee_name}
                            </p>
                          )}
                        </div>
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-600 font-bold text-lg">M</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-5 h-5" />
                          <span className="font-medium">
                            {restaurant.location || `${restaurant.city}, ${restaurant.address}`}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-gray-600">
                          <Building2 className="w-5 h-5" />
                          <span className="capitalize">
                            {restaurant.restaurant_type ? 
                              restaurant.restaurant_type.replace('_', ' ') : 
                              'Restaurante'
                            }
                          </span>
                        </div>

                        {/* Show financial data if available (from local storage) */}
                        {restaurant.lastYearRevenue && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Euro className="w-4 h-4 text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Facturación</p>
                                <p className="font-medium">€{formatNumber(restaurant.lastYearRevenue)}</p>
                              </div>
                            </div>
                            {restaurant.baseRent && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                <div>
                                  <p className="text-xs text-gray-500">Renta Base</p>
                                  <p className="font-medium">€{formatNumber(restaurant.baseRent)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {(restaurant.opening_date || restaurant.contractEndDate) && (
                          <div className="flex items-center gap-3 text-gray-600">
                            <Calendar className="w-5 h-5" />
                            <span>
                              {restaurant.opening_date ? 
                                `Apertura: ${new Date(restaurant.opening_date).toLocaleDateString('es-ES')}` :
                                `Contrato hasta: ${new Date(restaurant.contractEndDate).toLocaleDateString('es-ES')}`
                              }
                            </span>
                          </div>
                        )}

                        {/* Show ownership status for local restaurants */}
                        {restaurant.isOwnedByMcD && (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 text-sm font-medium">Propiedad McDonald's</span>
                          </div>
                        )}

                        {/* Show current valuation if available */}
                        {restaurant.currentValuation && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-green-800 font-medium text-sm">Valoración Actual</span>
                            </div>
                            <p className="text-lg font-bold text-green-800">
                              €{formatNumber(restaurant.currentValuation.finalValuation)}
                            </p>
                            <p className="text-xs text-green-600">
                              {new Date(restaurant.currentValuation.valuationDate).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (restaurant.status === 'active' || !restaurant.status) ? 'bg-green-100 text-green-800' :
                            restaurant.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {restaurant.status === 'active' || !restaurant.status ? 'Activo' :
                             restaurant.status === 'inactive' ? 'Inactivo' :
                             restaurant.status === 'pending' ? 'Pendiente' :
                             restaurant.status === 'closed' ? 'Cerrado' :
                             restaurant.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              const siteNumber = getSiteNumber(restaurant);
                              if (siteNumber) {
                                navigate(`/restaurant/${siteNumber}/profitloss`);
                              }
                            }}
                          >
                            Ver P&L
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Welcome Message */
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                ¡Bienvenido al Portal de McDonald's!
              </h3>
              <p className="text-yellow-700">
                Para comenzar, configura tu información de franquiciado y añade tus restaurantes.
                Puedes hacerlo accediendo a la herramienta de valoración.
              </p>
              <Button
                className="mt-4 bg-red-600 hover:bg-red-700"
                onClick={() => navigate('/valuation')}
              >
                Comenzar Configuración
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
