import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useFranchiseeDetail } from '@/hooks/useFranchiseeDetail';
import { FranchiseeRestaurantsTable } from '@/components/FranchiseeRestaurantsTable';

const FranchiseeDetailPage = () => {
  const { franchiseeId } = useParams<{ franchiseeId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { franchisee, restaurants, loading, error } = useFranchiseeDetail(franchiseeId);

  console.log('FranchiseeDetailPage - Render with:', { 
    franchiseeId, 
    franchisee: franchisee?.franchisee_name,
    restaurantsCount: restaurants.length,
    loading,
    restaurants: restaurants.map(r => ({ id: r.id, name: r.base_restaurant?.restaurant_name }))
  });

  if (authLoading) {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando detalles del franquiciado...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !franchisee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Franquiciado no encontrado'}</p>
            <Button onClick={() => navigate('/advisor')} variant="outline">
              Volver al Panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              onClick={() => navigate('/advisor')}
              variant="ghost"
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Building className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {franchisee.franchisee_name}
                </h1>
                <p className="text-sm text-gray-600">
                  Detalles del Franquiciado
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del Franquiciado */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Información del Franquiciado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{franchisee.franchisee_name}</h3>
                  {franchisee.company_name && (
                    <p className="text-gray-600">{franchisee.company_name}</p>
                  )}
                </div>

                {franchisee.tax_id && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">CIF/NIF:</span>
                    <span className="text-sm">{franchisee.tax_id}</span>
                  </div>
                )}

                {franchisee.profiles?.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{franchisee.profiles.email}</span>
                  </div>
                )}

                {franchisee.profiles?.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{franchisee.profiles.phone}</span>
                  </div>
                )}

                {(franchisee.address || franchisee.city) && (
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div className="text-sm">
                      {franchisee.address && <div>{franchisee.address}</div>}
                      {franchisee.city && (
                        <div>{franchisee.city}{franchisee.state && `, ${franchisee.state}`}</div>
                      )}
                      {franchisee.postal_code && <div>{franchisee.postal_code}</div>}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Fecha de registro:</span>
                  <span className="text-sm">
                    {new Date(franchisee.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Restaurantes del Franquiciado */}
          <div className="lg:col-span-2">
            <FranchiseeRestaurantsTable 
              franchiseeId={franchiseeId!}
              restaurants={restaurants}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchiseeDetailPage;
