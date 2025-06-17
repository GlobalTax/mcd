import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calculator, TrendingUp, Users, Settings, LogOut, MapPin, Calendar, Hash, Euro, Building2, Shield, Plus, ArrowRight } from 'lucide-react';
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

        {/* Main Content - Show visual guide when no restaurants */}
        {displayRestaurants && displayRestaurants.length > 0 ? (
          <div>
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
                </CardContent>
              </Card>
            </div>

            {/* Restaurants Section */}
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
          </div>
        ) : (
          /* Visual Setup Guide */
          <div className="space-y-8">
            {/* Welcome Section */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-800 mb-4">
                    ¡Bienvenido al Portal de McDonald's!
                  </h3>
                  <p className="text-yellow-700 text-lg mb-6">
                    Para comenzar, configura tu información de franquiciado y añade tus restaurantes.
                  </p>
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
                    onClick={() => navigate('/valuation')}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Comenzar Configuración
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step by Step Guide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">1</span>
                </div>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Crear Franquiciado
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Configura tu información personal y de empresa como franquiciado de McDonald's.
                  </p>
                  <div className="text-sm text-gray-500">
                    • Nombre y datos de contacto<br />
                    • Información fiscal<br />
                    • Detalles de la empresa
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">2</span>
                </div>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Añadir Restaurantes
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Registra todos tus restaurantes McDonald's con sus datos operativos.
                  </p>
                  <div className="text-sm text-gray-500">
                    • Número de sitio<br />
                    • Ubicación y dirección<br />
                    • Datos financieros básicos
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">3</span>
                </div>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Calculator className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Realizar Valoraciones
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Utiliza la herramienta profesional para valorar tus restaurantes.
                  </p>
                  <div className="text-sm text-gray-500">
                    • Proyecciones de flujo de caja<br />
                    • Análisis de rentabilidad<br />
                    • Valoración de mercado
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Card */}
            <Card className="border-2 border-red-200 hover:border-red-300 transition-colors cursor-pointer" 
                  onClick={() => navigate('/valuation')}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
                      <Calculator className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        Herramienta de Valoración
                      </h4>
                      <p className="text-gray-600">
                        Accede directamente a la configuración y valoración de restaurantes
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-red-600" />
                </div>
              </CardContent>
            </Card>

            {/* Example Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Vista Previa: Así se verán tus restaurantes
              </h4>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Example Restaurant Card */}
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-semibold text-gray-700">McDonald's Centro</h5>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                          <Hash className="w-4 h-4" />
                          <span>Site: 12345</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">M</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>Madrid, Calle Principal 123</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4 text-green-600" />
                        <span className="text-xs">€850,000</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="text-xs">€45,000</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 opacity-60">
                  <div className="text-center text-gray-400 py-8">
                    <Plus className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Tus restaurantes aparecerán aquí</span>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50 opacity-40">
                  <div className="text-center text-gray-400 py-8">
                    <Plus className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">Y aquí también</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
