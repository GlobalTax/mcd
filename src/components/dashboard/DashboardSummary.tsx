
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface DashboardSummaryProps {
  totalRestaurants: number;
  displayRestaurants: any[];
}

export const DashboardSummary = ({ totalRestaurants, displayRestaurants }: DashboardSummaryProps) => {
  // Calcular métricas básicas
  const activeRestaurants = displayRestaurants.filter(r => r.status === 'active' || !r.status).length;
  const totalRevenue = displayRestaurants.reduce((sum, r) => sum + (r.lastYearRevenue || 0), 0);
  const avgRevenue = totalRestaurants > 0 ? totalRevenue / totalRestaurants : 0;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Restaurantes Totales</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRestaurants}</div>
            <p className="text-xs text-muted-foreground">
              {activeRestaurants} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Año anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Restaurante</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{Math.round(avgRevenue).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresos promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Activo</div>
            <p className="text-xs text-muted-foreground">
              Todos los sistemas operativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de restaurantes */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Restaurantes</CardTitle>
        </CardHeader>
        <CardContent>
          {totalRestaurants === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay restaurantes asignados</p>
              <p className="text-sm">Contacta con tu asesor para más información</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayRestaurants.map((restaurant, index) => (
                <div key={restaurant.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {restaurant.name || restaurant.restaurant_name || `Restaurante ${restaurant.siteNumber || restaurant.site_number || index + 1}`}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {restaurant.location || `${restaurant.city || 'Ciudad'}, ${restaurant.address || 'Dirección'}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Site: {restaurant.siteNumber || restaurant.site_number || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      €{(restaurant.lastYearRevenue || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Año anterior</div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      restaurant.status === 'active' || !restaurant.status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {restaurant.status === 'active' || !restaurant.status ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
