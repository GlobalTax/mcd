
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Users, BarChart3, Settings, UserCheck, MapPin, Shield } from 'lucide-react';
import { BaseRestaurantsTable } from '@/components/BaseRestaurantsTable';
import { FranchiseesManagement } from '@/components/FranchiseesManagement';
import { RestaurantAssignments } from '@/components/RestaurantAssignments';
import { AdvisorReports } from '@/components/AdvisorReports';
import AdvisorManagement from '@/components/AdvisorManagement';
import { useBaseRestaurants } from '@/hooks/useBaseRestaurants';
import { useFranchisees } from '@/hooks/useFranchisees';
import { useAuth } from '@/hooks/useAuth';

const AdvisorPage = () => {
  const { user } = useAuth();
  const { restaurants, loading: restaurantsLoading, error: restaurantsError, refetch: refetchRestaurants } = useBaseRestaurants();
  const { franchisees, loading: franchiseesLoading, error: franchiseesError, refetch: refetchFranchisees } = useFranchisees();

  // Calcular estadísticas
  const totalAssignments = franchisees.reduce((sum, franchisee) => sum + (franchisee.total_restaurants || 0), 0);
  const unassignedRestaurants = restaurants.length - totalAssignments;

  if (!user || !['advisor', 'admin', 'superadmin'].includes(user.role)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const canManageAdvisors = user.role === 'superadmin' || user.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Asesor</h1>
        <p className="text-gray-600 mt-2">Gestiona restaurantes, franquiciados y asignaciones de forma integral</p>
      </div>

      {/* Dashboard Cards Mejorado */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurantes Base</CardTitle>
            <Building className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{restaurants.length}</div>
            <p className="text-xs text-muted-foreground">
              {unassignedRestaurants} sin asignar
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ 
                  width: `${restaurants.length > 0 ? ((restaurants.length - unassignedRestaurants) / restaurants.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Franquiciados</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{franchisees.length}</div>
            <p className="text-xs text-muted-foreground">
              {franchisees.filter(f => (f.total_restaurants || 0) > 0).length} con restaurantes
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ 
                  width: `${franchisees.length > 0 ? (franchisees.filter(f => (f.total_restaurants || 0) > 0).length / franchisees.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignaciones</CardTitle>
            <UserCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Restaurantes asignados
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full" 
                style={{ 
                  width: `${restaurants.length > 0 ? (totalAssignments / restaurants.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura</CardTitle>
            <MapPin className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {restaurants.length > 0 ? Math.round((totalAssignments / restaurants.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Tasa de ocupación
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ 
                  width: `${restaurants.length > 0 ? (totalAssignments / restaurants.length) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="restaurants" className="w-full">
        <TabsList className={`grid w-full ${canManageAdvisors ? 'grid-cols-5' : 'grid-cols-4'} mb-6`}>
          <TabsTrigger value="restaurants" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Restaurantes
          </TabsTrigger>
          <TabsTrigger value="franchisees" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Franquiciados
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Asignaciones
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Reportes
          </TabsTrigger>
          {canManageAdvisors && (
            <TabsTrigger value="advisors" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Asesores
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="restaurants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5 text-red-600" />
                Gestión de Restaurantes Base
              </CardTitle>
              <CardDescription>
                Añade, edita y gestiona los restaurantes disponibles en el sistema. 
                Estos restaurantes pueden ser asignados posteriormente a franquiciados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {restaurantsLoading ? (
                <div className="text-center py-8">Cargando restaurantes...</div>
              ) : restaurantsError ? (
                <div className="text-center py-8 text-red-600">Error: {restaurantsError}</div>
              ) : (
                <BaseRestaurantsTable restaurants={restaurants} onRefresh={refetchRestaurants} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="franchisees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Gestión de Franquiciados
              </CardTitle>
              <CardDescription>
                Crea, edita y gestiona los franquiciados del sistema. 
                Cada franquiciado puede tener múltiples restaurantes asignados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {franchiseesLoading ? (
                <div className="text-center py-8">Cargando franquiciados...</div>
              ) : franchiseesError ? (
                <div className="text-center py-8 text-red-600">Error: {franchiseesError}</div>
              ) : (
                <FranchiseesManagement franchisees={franchisees} onRefresh={refetchFranchisees} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                Asignaciones de Restaurantes
              </CardTitle>
              <CardDescription>
                Visualiza y gestiona las asignaciones de restaurantes a franquiciados. 
                Las asignaciones se realizan desde la pestaña de Restaurantes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RestaurantAssignments />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Reportes y Análisis
              </CardTitle>
              <CardDescription>
                Visualiza reportes detallados y análisis del sistema, incluyendo estadísticas de ocupación,
                distribución geográfica y tendencias de asignaciones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvisorReports />
            </CardContent>
          </Card>
        </TabsContent>

        {canManageAdvisors && (
          <TabsContent value="advisors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Gestión de Asesores
                </CardTitle>
                <CardDescription>
                  Crea y gestiona asesores del sistema. Los Super Admins pueden crear Admins y Asesores.
                  Los Admins pueden crear solo Asesores.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdvisorManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdvisorPage;
