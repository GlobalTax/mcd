
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Mail } from 'lucide-react';
import { useUserCreation, UserRole } from '@/hooks/useUserCreation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Franchisee {
  id: string;
  franchisee_name: string;
  user_id: string | null;
}

export const UserCreationPanel = () => {
  const { createUser, sendInvitation, creating } = useUserCreation();
  const [availableFranchisees, setAvailableFranchisees] = useState<Franchisee[]>([]);
  
  // Estados para creación directa
  const [createForm, setCreateForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'franchisee' as UserRole,
    existingFranchiseeId: ''
  });

  // Estados para invitación
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'franchisee' as UserRole
  });

  useEffect(() => {
    fetchAvailableFranchisees();
  }, []);

  const fetchAvailableFranchisees = async () => {
    try {
      const { data, error } = await supabase
        .from('franchisees')
        .select('id, franchisee_name, user_id')
        .is('user_id', null)
        .order('franchisee_name');

      if (error) {
        console.error('Error fetching franchisees:', error);
        return;
      }

      setAvailableFranchisees(data || []);
    } catch (error) {
      console.error('Error in fetchAvailableFranchisees:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.email || !createForm.password || !createForm.fullName) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    const success = await createUser(
      createForm.email,
      createForm.password,
      createForm.fullName,
      createForm.role,
      createForm.existingFranchiseeId || undefined
    );

    if (success) {
      setCreateForm({
        email: '',
        password: '',
        fullName: '',
        role: 'franchisee',
        existingFranchiseeId: ''
      });
      // Actualizar lista de franquiciados disponibles
      fetchAvailableFranchisees();
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteForm.email) {
      toast.error('Por favor ingresa un email');
      return;
    }

    const success = await sendInvitation(inviteForm.email, inviteForm.role);

    if (success) {
      setInviteForm({
        email: '',
        role: 'franchisee'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Crear Usuario</TabsTrigger>
            <TabsTrigger value="invite">Enviar Invitación</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="create-email">Email *</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="create-password">Contraseña *</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Contraseña segura"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="create-name">Nombre Completo *</Label>
                <Input
                  id="create-name"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Nombre y apellidos"
                  required
                />
              </div>

              <div>
                <Label htmlFor="create-role">Rol</Label>
                <Select 
                  value={createForm.role} 
                  onValueChange={(value) => setCreateForm(prev => ({ ...prev, role: value as UserRole }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="franchisee">Franquiciado</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="asesor">Asesor</SelectItem>
                    <SelectItem value="asistente">Asistente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {createForm.role === 'franchisee' && availableFranchisees.length > 0 && (
                <div>
                  <Label htmlFor="existing-franchisee">Franquiciado Existente (Opcional)</Label>
                  <Select 
                    value={createForm.existingFranchiseeId} 
                    onValueChange={(value) => setCreateForm(prev => ({ ...prev, existingFranchiseeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un franquiciado existente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Crear nuevo franquiciado</SelectItem>
                      {availableFranchisees.map((franchisee) => (
                        <SelectItem key={franchisee.id} value={franchisee.id}>
                          {franchisee.franchisee_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-1">
                    Si seleccionas un franquiciado existente, el usuario podrá ver sus restaurantes.
                  </p>
                </div>
              )}

              <Button type="submit" disabled={creating} className="w-full">
                {creating ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="invite">
            <form onSubmit={handleSendInvitation} className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email *</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="invite-role">Rol</Label>
                <Select 
                  value={inviteForm.role} 
                  onValueChange={(value) => setInviteForm(prev => ({ ...prev, role: value as UserRole }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="franchisee">Franquiciado</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="asesor">Asesor</SelectItem>
                    <SelectItem value="asistente">Asistente</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={creating} className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                {creating ? 'Enviando...' : 'Enviar Invitación'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
