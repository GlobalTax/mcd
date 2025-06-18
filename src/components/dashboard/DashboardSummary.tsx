
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calculator, Calendar, BarChart3, TrendingUp, Building, Euro } from 'lucide-react';

interface DashboardSummaryProps {
  totalRestaurants: number;
  displayRestaurants: any[];
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalRestaurants,
  displayRestaurants
}) => {
  const navigate = useNavigate();

  const totalRevenue = displayRestaurants.reduce((sum, restaurant) => 
    sum + (restaurant.lastYearRevenue || 0), 0
  );

  const averageRevenue = totalRestaurants > 0 ? totalRevenue / totalRestaurants : 0;

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Restaurantes
              </CardTitle>
              <Building className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalRestaurants}</div>
            <p className="text-xs text-gray-500 mt-1">Bajo tu gestión</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Facturación Total
              </CardTitle>
              <Euro className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              €{totalRevenue.toLocaleString('es-ES')}
            </div>
            <p className="text-xs text-gray-500 mt-1">Año anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Promedio por Local
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              €{Math.round(averageRevenue).toLocaleString('es-ES')}
            </div>
            <p className="text-xs text-gray-500 mt-1">Facturación media</p>
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos a servicios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Servicios Principales</CardTitle>
          <p className="text-sm text-gray-600">Accede rápidamente a las herramientas de gestión</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-200"
              onClick={() => navigate('/valuation')}
            >
              <Calculator className="w-6 h-6 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Valoración</div>
                <div className="text-xs text-gray-500">DCF y análisis</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-200"
              onClick={() => navigate('/annual-budget')}
            >
              <Calendar className="w-6 h-6 text-green-600" />
              <div className="text-center">
                <div className="font-medium">Presupuestos</div>
                <div className="text-xs text-gray-500">Planificación anual</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-200"
              onClick={() => navigate('/profit-loss')}
            >
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <div className="text-center">
                <div className="font-medium">Análisis</div>
                <div className="text-xs text-gray-500">P&L y reportes</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista resumida de restaurantes */}
      {displayRestaurants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Mis Restaurantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayRestaurants.slice(0, 5).map((restaurant) => (
                <div key={restaurant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {restaurant.name || restaurant.restaurant_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {restaurant.location || restaurant.city} • Sitio #{restaurant.siteNumber || restaurant.site_number}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      €{(restaurant.lastYearRevenue || 0).toLocaleString('es-ES')}
                    </div>
                    <div className="text-sm text-gray-500">Año anterior</div>
                  </div>
                </div>
              ))}
              {displayRestaurants.length > 5 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm">
                    Ver todos ({displayRestaurants.length})
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
