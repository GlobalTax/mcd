
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calculator, TrendingUp, Users, Settings, LogOut } from 'lucide-react';

const DashboardPage = () => {
  const { user, franchisee, restaurants, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

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
              <div className="text-2xl font-bold">{restaurants?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total de establecimientos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Franquiciado</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{franchisee ? '1' : '0'}</div>
              <p className="text-xs text-muted-foreground">
                {franchisee?.franchisee_name || 'No configurado'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

          {restaurants && restaurants.length > 0 && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-red-600" />
                  Mis Restaurantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {restaurants.slice(0, 3).map((restaurant) => (
                    <div key={restaurant.id} className="flex justify-between items-center">
                      <span className="text-sm">{restaurant.restaurant_name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/restaurant/${restaurant.site_number}`)}
                      >
                        Ver
                      </Button>
                    </div>
                  ))}
                  {restaurants.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{restaurants.length - 3} más...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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
              {restaurants && restaurants.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate(`/restaurant/${restaurants[0].site_number}/profitloss`)}
                >
                  Ir a P&L
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        {(!franchisee || !restaurants || restaurants.length === 0) && (
          <Card className="mt-8 border-yellow-200 bg-yellow-50">
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
