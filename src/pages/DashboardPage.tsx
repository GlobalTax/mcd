
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  TrendingUp, 
  Settings,
  LogOut,
  Plus,
  BarChart3
} from 'lucide-react';

const DashboardPage = () => {
  const { user, franchisee, restaurants, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'traditional':
        return 'Tradicional';
      case 'mccafe':
        return 'McCafé';
      case 'drive_thru':
        return 'Drive Thru';
      case 'express':
        return 'Express';
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">McDonald's Portal</h1>
                <p className="text-sm text-gray-500">Bienvenido, {user?.full_name || user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Restaurantes</p>
                  <p className="text-2xl font-bold text-gray-900">{restaurants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {restaurants.filter(r => r.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Capacidad Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {restaurants.reduce((sum, r) => sum + (r.seating_capacity || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Promedio m²</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {restaurants.length > 0 
                      ? Math.round(restaurants.reduce((sum, r) => sum + (r.square_meters || 0), 0) / restaurants.length)
                      : 0
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Franchisee Info */}
        {franchisee && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Información del Franquiciado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nombre</p>
                  <p className="text-lg font-semibold">{franchisee.franchisee_name}</p>
                </div>
                {franchisee.company_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Empresa</p>
                    <p className="text-lg font-semibold">{franchisee.company_name}</p>
                  </div>
                )}
                {franchisee.city && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ciudad</p>
                    <p className="text-lg font-semibold">{franchisee.city}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restaurants List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Mis Restaurantes</CardTitle>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Restaurante
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {restaurants.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay restaurantes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza agregando tu primer restaurante.
                </p>
                <div className="mt-6">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Primer Restaurante
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <Card key={restaurant.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {restaurant.restaurant_name}
                          </h3>
                          <p className="text-sm text-gray-500">Site #{restaurant.site_number}</p>
                        </div>
                        <Badge className={getStatusColor(restaurant.status)}>
                          {restaurant.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          {restaurant.city}, {restaurant.country}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Building2 className="w-4 h-4 mr-2" />
                          {getTypeLabel(restaurant.restaurant_type)}
                        </div>
                        {restaurant.seating_capacity && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {restaurant.seating_capacity} asientos
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/restaurant/${restaurant.site_number}`)}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                          onClick={() => navigate(`/restaurant/${restaurant.site_number}/profitloss`)}
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />
                          P&L
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;
