
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Mail, Phone, MapPin, User, Clock, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFranchiseeDetail } from '@/hooks/useFranchiseeDetail';
import { FranchiseeRestaurantsTable } from '@/components/FranchiseeRestaurantsTable';
import { FranchiseeInvitationPanel } from '@/components/franchisee/FranchiseeInvitationPanel';
import { FranchiseeAccessHistory } from '@/components/franchisee/FranchiseeAccessHistory';
import { FranchiseeActivityHistory } from '@/components/franchisee/FranchiseeActivityHistory';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function FranchiseeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { franchisee, restaurants, loading, error } = useFranchiseeDetail(id);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/advisor')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !franchisee) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/advisor')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Franquiciado no encontrado'}</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (!franchisee.hasAccount) {
      return <Badge variant="outline" className="text-gray-600 border-gray-300">Sin cuenta</Badge>;
    }
    if (franchisee.isOnline) {
      return <Badge variant="outline" className="text-green-600 border-green-300"><Wifi className="w-3 h-3 mr-1" />En línea</Badge>;
    }
    return <Badge variant="outline" className="text-gray-600 border-gray-300"><WifiOff className="w-3 h-3 mr-1" />Desconectado</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/advisor')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{franchisee.franchisee_name}</h1>
            <p className="text-gray-600">Detalle del franquiciado</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Información básica del franquiciado */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Información del Franquiciado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {franchisee.company_name && (
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Empresa:</span>
                  <span>{franchisee.company_name}</span>
                </div>
              )}
              
              {franchisee.profiles?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{franchisee.profiles.email}</span>
                </div>
              )}

              {franchisee.profiles?.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Teléfono:</span>
                  <span>{franchisee.profiles.phone}</span>
                </div>
              )}

              {franchisee.tax_id && (
                <div className="flex items-center space-x-2">
                  <span className="font-medium">CIF/NIF:</span>
                  <span>{franchisee.tax_id}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {(franchisee.city || franchisee.state) && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Ubicación:</span>
                  <span>{franchisee.city}{franchisee.state ? `, ${franchisee.state}` : ''}</span>
                </div>
              )}

              {franchisee.hasAccount && franchisee.lastAccess && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Último acceso:</span>
                  <span>{format(new Date(franchisee.lastAccess), 'dd/MM/yyyy HH:mm', { locale: es })}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Restaurantes:</span>
                <Badge variant="outline">{restaurants.length}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid con invitaciones y historial */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FranchiseeInvitationPanel 
          franchiseeId={franchisee.id} 
          franchiseeEmail={franchisee.profiles?.email}
        />
        <FranchiseeAccessHistory franchiseeId={franchisee.id} />
      </div>

      {/* Historial de actividad */}
      <FranchiseeActivityHistory franchiseeId={franchisee.id} />

      {/* Tabla de restaurantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Restaurantes Asignados ({restaurants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {restaurants.length > 0 ? (
            <FranchiseeRestaurantsTable restaurants={restaurants} />
          ) : (
            <p className="text-gray-500 text-center py-8">No hay restaurantes asignados</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
