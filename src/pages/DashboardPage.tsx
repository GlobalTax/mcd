import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calculator, TrendingUp, Settings, LogOut, MapPin, Calendar, Hash, Euro, Building2, Shield, Plus, ArrowRight, BarChart3, Users } from 'lucide-react';
import { Franchisee } from '@/types/restaurant';
import { FranchiseeRestaurantsTable } from '@/components/FranchiseeRestaurantsTable';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { InvitationPanel } from '@/components/InvitationPanel';

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
  const { restaurants: franchiseeRestaurants, loading: restaurantsLoading } = useFranchiseeRestaurants();

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

  // Use franchisee restaurants from Supabase if available, otherwise fall back to local storage
  const hasSupabaseRestaurants = franchiseeRestaurants.length > 0;
  const displayRestaurants: DisplayRestaurant[] = hasSupabaseRestaurants ? 
    franchiseeRestaurants.map(fr => ({
      id: fr.id,
      name: fr.base_restaurant?.restaurant_name,
      restaurant_name: fr.base_restaurant?.restaurant_name,
      location: `${fr.base_restaurant?.city}, ${fr.base_restaurant?.address}`,
      city: fr.base_restaurant?.city,
      address: fr.base_restaurant?.address,
      siteNumber: fr.base_restaurant?.site_number,
      site_number: fr.base_restaurant?.site_number,
      franchiseeName: franchisee?.franchisee_name,
      franchise_start_date: fr.franchise_start_date,
      franchise_end_date: fr.franchise_end_date,
      restaurant_type: fr.base_restaurant?.restaurant_type,
      status: fr.status,
      lastYearRevenue: fr.last_year_revenue,
      baseRent: fr.monthly_rent,
      isOwnedByMcD: false,
    })) : 
    allLocalRestaurants;
  
  const totalRestaurants = displayRestaurants?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Bienvenido, {user?.full_name || user?.email}
                </h1>
                <p className="text-sm text-gray-500">
                  Portal de Franquiciados McDonald's
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Panel de invitaciones */}
        <InvitationPanel />

        {/* Main Content */}
        {hasSupabaseRestaurants || (!restaurantsLoading && franchiseeRestaurants.length === 0) ? (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Restaurantes</p>
                      <p className="text-3xl font-bold text-gray-900">{totalRestaurants}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ingresos Totales</p>
                      <p className="text-3xl font-bold text-gray-900">€2.4M</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Valoración Media</p>
                      <p className="text-3xl font-bold text-gray-900">€1.8M</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Rentabilidad</p>
                      <p className="text-3xl font-bold text-green-600">+12.5%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white cursor-pointer" 
                    onClick={() => navigate('/valuation')}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                    <Calculator className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Herramienta de Valoración</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Accede a la herramienta profesional de valoración
                  </p>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white cursor-pointer" 
                    onClick={() => navigate('/annual-budget')}>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Presupuestos Anuales</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Gestiona presupuestos anuales mensuales
                  </p>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Análisis P&L</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Analiza el rendimiento financiero
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 border-gray-300"
                    onClick={() => {
                      const firstRestaurant = displayRestaurants[0];
                      const siteNumber = getSiteNumber(firstRestaurant);
                      if (siteNumber) {
                        navigate(`/restaurant/${siteNumber}/profitloss`);
                      }
                    }}
                    disabled={displayRestaurants.length === 0}
                  >
                    Ir a P&L
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Gestión de Restaurantes</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Administra información de restaurantes
                  </p>
                  <div className="text-sm text-gray-500">
                    {totalRestaurants} restaurantes asignados
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Restaurants Table */}
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Mis Restaurantes</CardTitle>
              </CardHeader>
              <CardContent>
                <FranchiseeRestaurantsTable 
                  franchiseeId={franchisee?.id || ''}
                  restaurants={franchiseeRestaurants}
                />
              </CardContent>
            </Card>

            {/* Show legacy restaurants if we have local storage data but no Supabase data */}
            {!hasSupabaseRestaurants && allLocalRestaurants.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
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
                      <Card key={restaurant.id} className="bg-white border-yellow-200">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium">{restaurant.name}</h4>
                              <p className="text-sm text-gray-600">{restaurant.location}</p>
                            </div>
                            {restaurant.lastYearRevenue && (
                              <div className="flex items-center gap-2 text-sm">
                                <Euro className="w-4 h-4 text-green-600" />
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
          </div>
        ) : (
          /* Welcome Section - when no restaurants are assigned */
          <div className="space-y-8">
            {/* Welcome Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-yellow-50">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Building className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    ¡Bienvenido al Portal de McDonald's!
                  </h3>
                  <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                    Tu asesor aún no te ha asignado restaurantes. Mientras tanto, puedes usar la herramienta de valoración.
                  </p>
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
                    onClick={() => navigate('/valuation')}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ir a Herramienta de Valoración
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Step by Step Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="relative overflow-hidden">
                <div className="absolute top-4 right-4 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">1</span>
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
                  <span className="text-red-600 font-bold">2</span>
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
