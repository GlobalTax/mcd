
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types/auth';

interface NewAdvisor {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'asesor';
}

const AdvisorManagement = () => {
  const { user } = useAuth();
  const [advisors, setAdvisors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState<NewAdvisor>({
    email: '',
    password: '',
    fullName: '',
    role: 'asesor'
  });

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'asesor', 'superadmin'])
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching advisors:', error);
        toast.error('Error al cargar asesores');
        return;
      }

      // Map database roles to TypeScript types
      const typedAdvisors = (data || []).map(advisorData => ({
        ...advisorData,
        role: advisorData.role === 'asesor' ? 'advisor' : advisorData.role as 'admin' | 'advisor' | 'superadmin'
      }));

      setAdvisors(typedAdvisors);
    } catch (error) {
      console.error('Error in fetchAdvisors:', error);
      toast.error('Error al cargar asesores');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdvisor.email || !newAdvisor.password || !newAdvisor.fullName) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    setCreating(true);

    try {
      // Crear el usuario en Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: newAdvisor.email,
        password: newAdvisor.password,
        user_metadata: {
          full_name: newAdvisor.fullName,
          role: newAdvisor.role
        }
      });

      if (error) {
        console.error('Error creating advisor:', error);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        // Actualizar el perfil con el rol
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: newAdvisor.role,
            full_name: newAdvisor.fullName 
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast.error('Usuario creado pero error al asignar rol');
        } else {
          toast.success('Asesor creado exitosamente');
          setNewAdvisor({ email: '', password: '', fullName: '', role: 'asesor' });
          setShowCreateForm(false);
          fetchAdvisors();
        }
      }
    } catch (error) {
      console.error('Error in handleCreateAdvisor:', error);
      toast.error('Error al crear asesor');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdvisor = async (advisorId: string, advisorName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el asesor ${advisorName}?`)) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(advisorId);

      if (error) {
        console.error('Error deleting advisor:', error);
        toast.error('Error al eliminar asesor');
        return;
      }

      toast.success('Asesor eliminado exitosamente');
      fetchAdvisors();
    } catch (error) {
      console.error('Error in handleDeleteAdvisor:', error);
      toast.error('Error al eliminar asesor');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'advisor':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'advisor':
        return 'Asesor';
      default:
        return role;
    }
  };

  const canCreateAdvisors = user?.role === 'superadmin' || user?.role === 'admin';
  const canDeleteAdvisor = (advisorRole: string) => {
    if (user?.role === 'superadmin') return true;
    if (user?.role === 'admin' && advisorRole === 'advisor') return true;
    return false;
  };

  if (!user || (user.role !== 'superadmin' && user.role !== 'admin' && user.role !== 'advisor')) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No tienes permisos para gestionar asesores</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Gestión de Asesores
            </CardTitle>
            {canCreateAdvisors && (
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Asesor
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && canCreateAdvisors && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Crear Nuevo Asesor</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAdvisor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nombre Completo</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={newAdvisor.fullName}
                        onChange={(e) => setNewAdvisor({ ...newAdvisor, fullName: e.target.value })}
                        placeholder="Nombre completo"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdvisor.email}
                        onChange={(e) => setNewAdvisor({ ...newAdvisor, email: e.target.value })}
                        placeholder="asesor@ejemplo.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newAdvisor.password}
                        onChange={(e) => setNewAdvisor({ ...newAdvisor, password: e.target.value })}
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Rol</Label>
                      <Select
                        value={newAdvisor.role}
                        onValueChange={(value: 'admin' | 'asesor') => 
                          setNewAdvisor({ ...newAdvisor, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asesor">Asesor</SelectItem>
                          {user?.role === 'superadmin' && (
                            <SelectItem value="admin">Admin</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={creating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {creating ? 'Creando...' : 'Crear Asesor'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p>Cargando asesores...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {advisors.map((advisor) => (
                  <TableRow key={advisor.id}>
                    <TableCell className="font-medium">
                      {advisor.full_name || 'Sin nombre'}
                    </TableCell>
                    <TableCell>{advisor.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(advisor.role)}>
                        {getRoleLabel(advisor.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(advisor.created_at).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      {advisor.id !== user?.id && canDeleteAdvisor(advisor.role) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAdvisor(advisor.id, advisor.full_name || advisor.email)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisorManagement;
