
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { FranchiseeRestaurant } from '@/types/franchiseeRestaurant';
import { Building, Edit, MapPin, Calendar, Euro, Hash } from 'lucide-react';

const FranchiseeRestaurantsTable = () => {
  const { restaurants, loading, updateRestaurant } = useFranchiseeRestaurants();
  const [editingRestaurant, setEditingRestaurant] = useState<FranchiseeRestaurant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (restaurant: FranchiseeRestaurant) => {
    setEditingRestaurant(restaurant);
    setIsDialogOpen(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingRestaurant) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const updates = {
      franchise_start_date: formData.get('franchise_start_date') as string || null,
      franchise_end_date: formData.get('franchise_end_date') as string || null,
      lease_start_date: formData.get('lease_start_date') as string || null,
      lease_end_date: formData.get('lease_end_date') as string || null,
      monthly_rent: formData.get('monthly_rent') ? Number(formData.get('monthly_rent')) : null,
      franchise_fee_percentage: Number(formData.get('franchise_fee_percentage')) || 4.0,
      advertising_fee_percentage: Number(formData.get('advertising_fee_percentage')) || 4.0,
      last_year_revenue: formData.get('last_year_revenue') ? Number(formData.get('last_year_revenue')) : null,
      average_monthly_sales: formData.get('average_monthly_sales') ? Number(formData.get('average_monthly_sales')) : null,
      notes: formData.get('notes') as string || null,
    };

    const success = await updateRestaurant(editingRestaurant.id, updates);
    if (success) {
      setIsDialogOpen(false);
      setEditingRestaurant(null);
    }
  };

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Cargando restaurantes...</div>
        </CardContent>
      </Card>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay restaurantes asignados
            </h3>
            <p className="text-gray-600">
              Contacta con tu asesor para que te asigne restaurantes.
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
          Mis Restaurantes ({restaurants.length})
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
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restaurants.map((restaurant) => (
                <TableRow key={restaurant.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {restaurant.base_restaurant?.restaurant_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {restaurant.base_restaurant?.site_number}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="text-sm">
                        <div>{restaurant.base_restaurant?.city}</div>
                        <div className="text-gray-500">{restaurant.base_restaurant?.address}</div>
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      restaurant.status === 'active' ? 'bg-green-100 text-green-800' :
                      restaurant.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {restaurant.status === 'active' ? 'Activo' :
                       restaurant.status === 'inactive' ? 'Inactivo' : restaurant.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(restaurant)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Dialog para editar restaurante */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Editar Restaurante - {editingRestaurant?.base_restaurant?.restaurant_name}
              </DialogTitle>
            </DialogHeader>
            
            {editingRestaurant && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="franchise_start_date">Fecha Inicio Franquicia</Label>
                    <Input
                      id="franchise_start_date"
                      name="franchise_start_date"
                      type="date"
                      defaultValue={editingRestaurant.franchise_start_date || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="franchise_end_date">Fecha Fin Franquicia</Label>
                    <Input
                      id="franchise_end_date"
                      name="franchise_end_date"
                      type="date"
                      defaultValue={editingRestaurant.franchise_end_date || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lease_start_date">Fecha Inicio Arrendamiento</Label>
                    <Input
                      id="lease_start_date"
                      name="lease_start_date"
                      type="date"
                      defaultValue={editingRestaurant.lease_start_date || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lease_end_date">Fecha Fin Arrendamiento</Label>
                    <Input
                      id="lease_end_date"
                      name="lease_end_date"
                      type="date"
                      defaultValue={editingRestaurant.lease_end_date || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthly_rent">Renta Mensual (€)</Label>
                    <Input
                      id="monthly_rent"
                      name="monthly_rent"
                      type="number"
                      step="0.01"
                      defaultValue={editingRestaurant.monthly_rent || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_year_revenue">Facturación Año Pasado (€)</Label>
                    <Input
                      id="last_year_revenue"
                      name="last_year_revenue"
                      type="number"
                      step="0.01"
                      defaultValue={editingRestaurant.last_year_revenue || ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="franchise_fee_percentage">Fee Franquicia (%)</Label>
                    <Input
                      id="franchise_fee_percentage"
                      name="franchise_fee_percentage"
                      type="number"
                      step="0.1"
                      defaultValue={editingRestaurant.franchise_fee_percentage}
                    />
                  </div>
                  <div>
                    <Label htmlFor="advertising_fee_percentage">Fee Publicidad (%)</Label>
                    <Input
                      id="advertising_fee_percentage"
                      name="advertising_fee_percentage"
                      type="number"
                      step="0.1"
                      defaultValue={editingRestaurant.advertising_fee_percentage}
                    />
                  </div>
                  <div>
                    <Label htmlFor="average_monthly_sales">Ventas Mensuales Promedio (€)</Label>
                    <Input
                      id="average_monthly_sales"
                      name="average_monthly_sales"
                      type="number"
                      step="0.01"
                      defaultValue={editingRestaurant.average_monthly_sales || ''}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    defaultValue={editingRestaurant.notes || ''}
                    placeholder="Notas adicionales sobre este restaurante..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default FranchiseeRestaurantsTable;
