import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { BaseRestaurant } from '@/types/franchiseeRestaurant';
import { Franchisee } from '@/types/auth';
import { useBaseRestaurants } from '@/hooks/useBaseRestaurants';
import { useFranchisees } from '@/hooks/useFranchisees';
import { DataImportDialog } from './DataImportDialog';

interface BaseRestaurantsTableProps {
  restaurants: BaseRestaurant[];
  onRefresh: () => void;
}

export const BaseRestaurantsTable: React.FC<BaseRestaurantsTableProps> = ({ restaurants, onRefresh }) => {
  const { createRestaurant, updateRestaurant, deleteRestaurant } = useBaseRestaurants();
  const { franchisees, assignRestaurant } = useFranchisees();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<BaseRestaurant | null>(null);
  const [selectedFranchiseeId, setSelectedFranchiseeId] = useState<string>('');

  const [formData, setFormData] = useState({
    site_number: '',
    restaurant_name: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'España',
    restaurant_type: 'traditional',
    square_meters: '',
    seating_capacity: ''
  });

  const resetForm = () => {
    setFormData({
      site_number: '',
      restaurant_name: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'España',
      restaurant_type: 'traditional',
      square_meters: '',
      seating_capacity: ''
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createRestaurant({
      ...formData,
      square_meters: formData.square_meters ? parseInt(formData.square_meters) : undefined,
      seating_capacity: formData.seating_capacity ? parseInt(formData.seating_capacity) : undefined
    });
    
    if (success) {
      setIsCreateModalOpen(false);
      resetForm();
      onRefresh();
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant) return;

    const success = await updateRestaurant(selectedRestaurant.id, {
      ...formData,
      square_meters: formData.square_meters ? parseInt(formData.square_meters) : undefined,
      seating_capacity: formData.seating_capacity ? parseInt(formData.seating_capacity) : undefined
    });
    
    if (success) {
      setIsEditModalOpen(false);
      setSelectedRestaurant(null);
      resetForm();
      onRefresh();
    }
  };

  const handleDelete = async (restaurant: BaseRestaurant) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el restaurante ${restaurant.restaurant_name}?`)) {
      const success = await deleteRestaurant(restaurant.id);
      if (success) {
        onRefresh();
      }
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestaurant || !selectedFranchiseeId) return;

    const success = await assignRestaurant(selectedFranchiseeId, selectedRestaurant.id);
    if (success) {
      setIsAssignModalOpen(false);
      setSelectedRestaurant(null);
      setSelectedFranchiseeId('');
    }
  };

  const openEditModal = (restaurant: BaseRestaurant) => {
    setSelectedRestaurant(restaurant);
    setFormData({
      site_number: restaurant.site_number,
      restaurant_name: restaurant.restaurant_name,
      address: restaurant.address,
      city: restaurant.city,
      state: restaurant.state || '',
      postal_code: restaurant.postal_code || '',
      country: restaurant.country,
      restaurant_type: restaurant.restaurant_type,
      square_meters: restaurant.square_meters?.toString() || '',
      seating_capacity: restaurant.seating_capacity?.toString() || ''
    });
    setIsEditModalOpen(true);
  };

  const openAssignModal = (restaurant: BaseRestaurant) => {
    setSelectedRestaurant(restaurant);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Restaurantes Base</h2>
        <div className="flex space-x-2">
          <DataImportDialog onImportComplete={onRefresh} />
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Añadir Restaurante
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Restaurante</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="site_number">Número de Local</Label>
                    <Input
                      id="site_number"
                      value={formData.site_number}
                      onChange={(e) => setFormData({...formData, site_number: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="restaurant_name">Nombre del Restaurante</Label>
                    <Input
                      id="restaurant_name"
                      value={formData.restaurant_name}
                      onChange={(e) => setFormData({...formData, restaurant_name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Provincia</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code">Código Postal</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="restaurant_type">Tipo de Restaurante</Label>
                    <Select value={formData.restaurant_type} onValueChange={(value) => setFormData({...formData, restaurant_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="traditional">Tradicional</SelectItem>
                        <SelectItem value="mall">Mall</SelectItem>
                        <SelectItem value="drive_thru">Drive Thru</SelectItem>
                        <SelectItem value="express">Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="square_meters">Metros Cuadrados</Label>
                    <Input
                      id="square_meters"
                      type="number"
                      value={formData.square_meters}
                      onChange={(e) => setFormData({...formData, square_meters: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seating_capacity">Capacidad de Asientos</Label>
                    <Input
                      id="seating_capacity"
                      type="number"
                      value={formData.seating_capacity}
                      onChange={(e) => setFormData({...formData, seating_capacity: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => {setIsCreateModalOpen(false); resetForm();}}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Restaurante</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Ciudad</TableHead>
              <TableHead>Provincia</TableHead>
              <TableHead>C.P.</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>m²</TableHead>
              <TableHead>Asientos</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {restaurants.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell className="font-medium">{restaurant.site_number}</TableCell>
                <TableCell>{restaurant.restaurant_name}</TableCell>
                <TableCell className="max-w-xs truncate" title={restaurant.address}>
                  {restaurant.address}
                </TableCell>
                <TableCell>{restaurant.city}</TableCell>
                <TableCell>{restaurant.state || '-'}</TableCell>
                <TableCell>{restaurant.postal_code || '-'}</TableCell>
                <TableCell>{restaurant.country}</TableCell>
                <TableCell>
                  <span className="capitalize">
                    {restaurant.restaurant_type.replace('_', ' ')}
                  </span>
                </TableCell>
                <TableCell>{restaurant.square_meters || '-'}</TableCell>
                <TableCell>{restaurant.seating_capacity || '-'}</TableCell>
                <TableCell>
                  {new Date(restaurant.created_at).toLocaleDateString('es-ES')}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(restaurant)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openAssignModal(restaurant)}>
                      <Users className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(restaurant)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Restaurante</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_site_number">Número de Local</Label>
                <Input
                  id="edit_site_number"
                  value={formData.site_number}
                  onChange={(e) => setFormData({...formData, site_number: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_restaurant_name">Nombre del Restaurante</Label>
                <Input
                  id="edit_restaurant_name"
                  value={formData.restaurant_name}
                  onChange={(e) => setFormData({...formData, restaurant_name: e.target.value})}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit_address">Dirección</Label>
                <Input
                  id="edit_address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_city">Ciudad</Label>
                <Input
                  id="edit_city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_state">Provincia</Label>
                <Input
                  id="edit_state"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_postal_code">Código Postal</Label>
                <Input
                  id="edit_postal_code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_restaurant_type">Tipo de Restaurante</Label>
                <Select value={formData.restaurant_type} onValueChange={(value) => setFormData({...formData, restaurant_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traditional">Tradicional</SelectItem>
                    <SelectItem value="mall">Mall</SelectItem>
                    <SelectItem value="drive_thru">Drive Thru</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit_square_meters">Metros Cuadrados</Label>
                <Input
                  id="edit_square_meters"
                  type="number"
                  value={formData.square_meters}
                  onChange={(e) => setFormData({...formData, square_meters: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_seating_capacity">Capacidad de Asientos</Label>
                <Input
                  id="edit_seating_capacity"
                  type="number"
                  value={formData.seating_capacity}
                  onChange={(e) => setFormData({...formData, seating_capacity: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {setIsEditModalOpen(false); setSelectedRestaurant(null); resetForm();}}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Asignación */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Restaurante a Franquiciado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <Label>Restaurante: {selectedRestaurant?.restaurant_name}</Label>
            </div>
            <div>
              <Label htmlFor="franchisee">Seleccionar Franquiciado</Label>
              <Select value={selectedFranchiseeId} onValueChange={setSelectedFranchiseeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un franquiciado" />
                </SelectTrigger>
                <SelectContent>
                  {franchisees.map((franchisee) => (
                    <SelectItem key={franchisee.id} value={franchisee.id}>
                      {franchisee.franchisee_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {setIsAssignModalOpen(false); setSelectedRestaurant(null); setSelectedFranchiseeId('');}}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!selectedFranchiseeId}>
                Asignar Restaurante
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
