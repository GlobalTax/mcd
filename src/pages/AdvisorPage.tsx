
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Building, Users, FileText, LogOut, Store } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdvisorManagement from '@/components/AdvisorManagement';
import FranchiseesManagement from '@/components/FranchiseesManagement';
import AdvisorReports from '@/components/AdvisorReports';
import { BaseRestaurantsTable } from '@/components/BaseRestaurantsTable';
import { useBaseRestaurants } from '@/hooks/useBaseRestaurants';

const AdvisorPage = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('advisors');
  const { restaurants, loading: restaurantsLoading, refetch: refetchRestaurants } = useBaseRestaurants();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !['advisor', 'admin', 'superadmin'].includes(user.role)) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Store className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Asesor</h1>
                <p className="text-sm text-gray-600">
                  {user.full_name} ({user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Asesor'})
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="advisors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Asesores
            </TabsTrigger>
            <TabsTrigger value="franchisees" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Franquiciados
            </TabsTrigger>
            <TabsTrigger value="restaurants" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Restaurantes
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reportes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="advisors">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Asesores y Administradores</CardTitle>
              </CardHeader>
              <CardContent>
                <AdvisorManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="franchisees">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Franquiciados</CardTitle>
              </CardHeader>
              <CardContent>
                <FranchiseesManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="restaurants">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Restaurantes Base</CardTitle>
              </CardHeader>
              <CardContent>
                {restaurantsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Cargando restaurantes...</p>
                  </div>
                ) : (
                  <BaseRestaurantsTable 
                    restaurants={restaurants} 
                    onRefresh={refetchRestaurants}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Análisis</CardTitle>
              </CardHeader>
              <CardContent>
                <AdvisorReports />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvisorPage;
