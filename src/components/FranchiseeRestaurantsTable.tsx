
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Building, MapPin, Calendar, Euro, Hash } from 'lucide-react';
import { FranchiseeRestaurant } from '@/types/franchiseeRestaurant';

interface FranchiseeRestaurantsTableProps {
  franchiseeId: string;
  restaurants: FranchiseeRestaurant[];
}

export const FranchiseeRestaurantsTable: React.FC<FranchiseeRestaurantsTableProps> = ({
  restaurants
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  console.log('FranchiseeRestaurantsTable - Rendering with restaurants:', restaurants);

  if (restaurants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Restaurantes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay restaurantes asignados
            </h3>
            <p className="text-gray-600">
              Este franquiciado aún no tiene restaurantes asignados.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-5 h-5" />
          Restaurantes ({restaurants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Restaurante</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Fechas Franquicia</TableHead>
                <TableHead>Renta Mensual</TableHead>
                <TableHead>Facturación</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => {
                const baseRestaurant = restaurant.base_restaurant;
                console.log('FranchiseeRestaurantsTable - Processing restaurant:', restaurant);
                
                return (
                  <TableRow key={restaurant.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {baseRestaurant?.restaurant_name || 'Sin nombre'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {baseRestaurant?.site_number || 'Sin número'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div className="text-sm">
                          <div>{baseRestaurant?.city || 'Sin ciudad'}</div>
                          <div className="text-gray-500">
                            {baseRestaurant?.address || 'Sin dirección'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-green-600" />
                          <span>Inicio: {formatDate(restaurant.franchise_start_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-red-600" />
                          <span>Fin: {formatDate(restaurant.franchise_end_date)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Euro className="w-4 h-4 text-blue-600" />
                        <span>{formatCurrency(restaurant.monthly_rent)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Año pasado: {formatCurrency(restaurant.last_year_revenue)}</div>
                        <div className="text-gray-500">
                          Mensual: {formatCurrency(restaurant.average_monthly_sales)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${
                        restaurant.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {restaurant.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
