import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Calendar, 
  Filter, 
  Download, 
  Eye, 
  Clock,
  User,
  Store,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ActivityItem {
  id: string;
  activity_type: string;
  activity_description: string;
  created_at: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  user_id: string;
}

interface ActivityFilters {
  activity_type: string;
  entity_type: string;
  date_from: string;
  date_to: string;
  search: string;
}

const FranchiseeActivityHistory: React.FC = () => {
  const { franchisee } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ActivityFilters>({
    activity_type: '',
    entity_type: '',
    date_from: '',
    date_to: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (franchisee) {
      loadActivities();
    }
  }, [franchisee, filters, currentPage]);

  const loadActivities = async () => {
    if (!franchisee) return;

    setLoading(true);
    try {
      let query = supabase
        .from('franchisee_activity_log')
        .select('*', { count: 'exact' })
        .eq('franchisee_id', franchisee.id)
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.activity_type) {
        query = query.eq('activity_type', filters.activity_type);
      }
      if (filters.entity_type) {
        query = query.eq('entity_type', filters.entity_type);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.search) {
        query = query.ilike('activity_description', `%${filters.search}%`);
      }

      // Paginación
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setActivities(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));

    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Error al cargar el historial de actividad');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'login':
        return <User className="h-4 w-4 text-blue-600" />;
      case 'restaurant_update':
        return <Store className="h-4 w-4 text-green-600" />;
      case 'financial_update':
        return <DollarSign className="h-4 w-4 text-yellow-600" />;
      case 'performance_improvement':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'login': return 'bg-blue-100 text-blue-800';
      case 'restaurant_update': return 'bg-green-100 text-green-800';
      case 'financial_update': return 'bg-yellow-100 text-yellow-800';
      case 'performance_improvement': return 'bg-purple-100 text-purple-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  };

  const exportActivities = async () => {
    try {
      const csvContent = [
        ['Fecha', 'Tipo', 'Descripción', 'Entidad', 'Metadatos'].join(','),
        ...activities.map(activity => [
          formatDate(activity.created_at),
          activity.activity_type,
          activity.activity_description,
          activity.entity_type,
          JSON.stringify(activity.metadata)
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `actividad_franquiciado_${franchisee?.franchisee_name}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Historial exportado correctamente');
    } catch (error) {
      console.error('Error exporting activities:', error);
      toast.error('Error al exportar el historial');
    }
  };

  const clearFilters = () => {
    setFilters({
      activity_type: '',
      entity_type: '',
      date_from: '',
      date_to: '',
      search: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Historial de Actividad</h1>
          <p className="text-gray-600 mt-2">
            Registro detallado de todas las actividades de {franchisee?.franchisee_name}
          </p>
        </div>
        <Button onClick={exportActivities} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar en descripciones..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_type">Tipo de Actividad</Label>
              <Select value={filters.activity_type} onValueChange={(value) => setFilters({...filters, activity_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="login">Inicio de sesión</SelectItem>
                  <SelectItem value="restaurant_update">Actualización de restaurante</SelectItem>
                  <SelectItem value="financial_update">Actualización financiera</SelectItem>
                  <SelectItem value="performance_improvement">Mejora de rendimiento</SelectItem>
                  <SelectItem value="alert">Alerta</SelectItem>
                  <SelectItem value="success">Éxito</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entity_type">Tipo de Entidad</Label>
              <Select value={filters.entity_type} onValueChange={(value) => setFilters({...filters, entity_type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las entidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las entidades</SelectItem>
                  <SelectItem value="restaurant">Restaurante</SelectItem>
                  <SelectItem value="financial">Financiero</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_from">Desde</Label>
              <Input
                id="date_from"
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_to">Hasta</Label>
              <Input
                id="date_to"
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Actividades */}
      <Card>
        <CardHeader>
          <CardTitle>Actividades ({activities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
              <span className="ml-2">Cargando actividades...</span>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron actividades</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.activity_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getActivityColor(activity.activity_type)}>
                          {activity.activity_type}
                        </Badge>
                        {activity.entity_type && (
                          <Badge variant="outline">
                            {activity.entity_type}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {getTimeAgo(activity.created_at)}
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-900">
                      {activity.activity_description}
                    </p>
                    
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalles de la Actividad</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedActivity(null)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Tipo de Actividad</Label>
                <div className="flex items-center mt-1">
                  {getActivityIcon(selectedActivity.activity_type)}
                  <Badge className={`ml-2 ${getActivityColor(selectedActivity.activity_type)}`}>
                    {selectedActivity.activity_type}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Descripción</Label>
                <p className="mt-1 text-sm">{selectedActivity.activity_description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Fecha y Hora</Label>
                <p className="mt-1 text-sm">{formatDate(selectedActivity.created_at)}</p>
              </div>
              
              {selectedActivity.entity_type && (
                <div>
                  <Label className="text-sm font-medium">Tipo de Entidad</Label>
                  <p className="mt-1 text-sm">{selectedActivity.entity_type}</p>
                </div>
              )}
              
              {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Metadatos</Label>
                  <pre className="mt-1 text-sm bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(selectedActivity.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FranchiseeActivityHistory;
