
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Building, Mail, Phone, MapPin, Search, Loader2 } from 'lucide-react';
import { Franchisee } from '@/types/auth';
import { useFranchisees } from '@/hooks/useFranchisees';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FranchiseeCard } from './FranchiseeCard';
import { RestaurantAssignmentDialog } from './RestaurantAssignmentDialog';

export const FranchiseesManagement: React.FC = () => {
  const { franchisees, loading, error, refetch: onRefresh } = useFranchisees();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedFranchisee, setSelectedFranchisee] = useState<Franchisee | null>(null);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    franchisee_name: '',
    company_name: '',
    tax_id: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    email: '',
    phone: '',
    password: ''
  });

  console.log('FranchiseesManagement render - loading:', loading, 'error:', error, 'franchisees:', franchisees);

  const filteredFranchisees = franchisees.filter(franchisee =>
    franchisee.franchisee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (franchisee.company_name && franchisee.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (franchisee.city && franchisee.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      franchisee_name: '',
      company_name: '',
      tax_id: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      email: '',
      phone: '',
      password: ''
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        user_metadata: {
          full_name: formData.franchisee_name,
          role: 'franchisee'
        }
      });

      if (authError) {
        toast.error('Error al crear usuario: ' + authError.message);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'franchisee',
            full_name: formData.franchisee_name,
            phone: formData.phone
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
        }

        const { error: franchiseeError } = await supabase
          .from('franchisees')
          .insert({
            user_id: authData.user.id,
            franchisee_name: formData.franchisee_name,
            company_name: formData.company_name,
            tax_id: formData.tax_id,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code
          });

        if (franchiseeError) {
          console.error('Error creating franchisee:', franchiseeError);
          toast.error('Error al crear el franquiciado');
          return;
        }

        toast.success('Franquiciado creado exitosamente');
        setIsCreateModalOpen(false);
        resetForm();
        onRefresh();
      }
    } catch (error) {
      console.error('Error in handleCreate:', error);
      toast.error('Error al crear el franquiciado');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFranchisee) return;

    setUpdating(true);

    try {
      const { error } = await supabase
        .from('franchisees')
        .update({
          franchisee_name: formData.franchisee_name,
          company_name: formData.company_name,
          tax_id: formData.tax_id,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code
        })
        .eq('id', selectedFranchisee.id);

      if (error) {
        toast.error('Error al actualizar el franquiciado');
        return;
      }

      toast.success('Franquiciado actualizado exitosamente');
      setIsEditModalOpen(false);
      setSelectedFranchisee(null);
      resetForm();
      onRefresh();
    } catch (error) {
      console.error('Error in handleEdit:', error);
      toast.error('Error al actualizar el franquiciado');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (franchisee: Franchisee) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el franquiciado ${franchisee.franchisee_name}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('franchisees')
        .delete()
        .eq('id', franchisee.id);

      if (error) {
        toast.error('Error al eliminar el franquiciado');
        return;
      }

      toast.success('Franquiciado eliminado exitosamente');
      onRefresh();
    } catch (error) {
      console.error('Error in handleDelete:', error);
      toast.error('Error al eliminar el franquiciado');
    }
  };

  const openEditModal = (franchisee: Franchisee) => {
    setSelectedFranchisee(franchisee);
    setFormData({
      franchisee_name: franchisee.franchisee_name,
      company_name: franchisee.company_name || '',
      tax_id: franchisee.tax_id || '',
      address: franchisee.address || '',
      city: franchisee.city || '',
      state: franchisee.state || '',
      postal_code: franchisee.postal_code || '',
      email: '',
      phone: '',
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const openAssignModal = (franchisee: Franchisee) => {
    setSelectedFranchisee(franchisee);
    setIsAssignModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <span className="ml-2 text-lg">Cargando franquiciados...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-12">
        <div className="text-red-600 text-lg mb-4">Error: {error}</div>
        <Button onClick={onRefresh} variant="outline">
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Franquiciados</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              Crear Franquiciado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Franquiciado</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="franchisee_name">Nombre del Franquiciado</Label>
                  <Input
                    id="franchisee_name"
                    value={formData.franchisee_name}
                    onChange={(e) => setFormData({...formData, franchisee_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company_name">Nombre de la Empresa</Label>
                  <Input
                    id="company_name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tax_id">CIF/NIF</Label>
                  <Input
                    id="tax_id"
                    value={formData.tax_id}
                    onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    minLength={6}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Dirección</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Input
                      placeholder="Dirección"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Ciudad"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Provincia"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Código Postal"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => {setIsCreateModalOpen(false); resetForm();}}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={creating} className="bg-red-600 hover:bg-red-700">
                  {creating ? 'Creando...' : 'Crear Franquiciado'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar franquiciados por nombre, empresa o ciudad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFranchisees.map((franchisee) => (
          <FranchiseeCard
            key={franchisee.id}
            franchisee={franchisee}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onAssignRestaurant={openAssignModal}
          />
        ))}
      </div>

      {filteredFranchisees.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron franquiciados' : 'No hay franquiciados'}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Los franquiciados se cargarán automáticamente desde tu base de datos'}
          </p>
          <Button onClick={onRefresh} variant="outline" className="mt-4">
            Recargar datos
          </Button>
        </div>
      )}

      {/* Modal de Edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Franquiciado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_franchisee_name">Nombre del Franquiciado</Label>
                <Input
                  id="edit_franchisee_name"
                  value={formData.franchisee_name}
                  onChange={(e) => setFormData({...formData, franchisee_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit_company_name">Nombre de la Empresa</Label>
                <Input
                  id="edit_company_name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_tax_id">CIF/NIF</Label>
                <Input
                  id="edit_tax_id"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({...formData, tax_id: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Dirección</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Input
                    placeholder="Dirección"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Ciudad"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Provincia"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Código Postal"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {setIsEditModalOpen(false); setSelectedFranchisee(null); resetForm();}}>
                Cancelar
              </Button>
              <Button type="submit" disabled={updating} className="bg-red-600 hover:bg-red-700">
                {updating ? 'Actualizando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Asignación de Restaurantes */}
      <RestaurantAssignmentDialog
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        selectedFranchisee={selectedFranchisee}
      />
    </div>
  );
};
