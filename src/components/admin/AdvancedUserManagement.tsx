import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone,
  Key,
  Shield,
  RefreshCw,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Send,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'admin' | 'franchisee' | 'manager' | 'asesor' | 'asistente' | 'superadmin';

type UserStatus = 'active' | 'inactive' | 'pending';

interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  last_sign_in?: string;
  created_at: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  user_metadata?: any;
}

interface UserFilters {
  role: string;
  status: string;
  search: string;
}

const AdvancedUserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<UserFilters>({
    role: 'all',
    status: 'all',
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Formulario para crear usuario
  const [createForm, setCreateForm] = useState({
    email: '',
    phone: '',
    password: '',
    role: 'franchisee',
    sendInvite: true
  });

  // Formulario para editar usuario
  const [editForm, setEditForm] = useState({
    email: '',
    phone: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Obtener usuarios usando la API de admin
      const { data: { users: authUsers }, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;

      // Obtener perfiles de la base de datos
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Combinar datos de auth y perfiles
      const allowedRoles: UserRole[] = ['admin', 'franchisee', 'manager', 'asesor', 'asistente', 'superadmin'];
      const combinedUsers: User[] = authUsers.map(authUser => {
        const profile = (profiles as any[])?.find((p: any) => p.id === authUser.id);
        // Validar y mapear el rol
        let role: UserRole = 'franchisee';
        if (profile && typeof profile.role === 'string' && allowedRoles.includes(profile.role as UserRole)) {
          role = profile.role as UserRole;
        }
        // Validar y mapear el status
        let status: UserStatus = 'pending';
        if (authUser.email_confirmed_at) status = 'active';
        // No hay campo status en profiles, así que solo usamos el de auth
        return {
          id: authUser.id,
          email: authUser.email || '',
          phone: authUser.phone,
          role,
          status,
          last_sign_in: authUser.last_sign_in_at,
          created_at: authUser.created_at,
          email_confirmed_at: authUser.email_confirmed_at,
          phone_confirmed_at: authUser.phone_confirmed_at,
          user_metadata: authUser.user_metadata
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      if (!createForm.email && !createForm.phone) {
        toast.error('Debes proporcionar un email o teléfono');
        return;
      }

      if (createForm.sendInvite) {
        // Enviar invitación por email
        const { error } = await supabase.auth.admin.inviteUserByEmail(createForm.email, {
          data: {
            role: createForm.role,
            password: createForm.password
          }
        });

        if (error) throw error;
        toast.success('Invitación enviada correctamente');
      } else {
        // Crear usuario directamente
        const { error } = await supabase.auth.admin.createUser({
          email: createForm.email,
          phone: createForm.phone,
          password: createForm.password,
          email_confirm: true,
          user_metadata: {
            role: createForm.role
          }
        });

        if (error) throw error;
        toast.success('Usuario creado correctamente');
      }

      setCreateForm({
        email: '',
        phone: '',
        password: '',
        role: 'franchisee',
        sendInvite: true
      });
      setShowCreateModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear el usuario');
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    try {
      const updates: any = {};
      
      if (editForm.email !== selectedUser.email) {
        updates.email = editForm.email;
      }
      
      if (editForm.phone !== selectedUser.phone) {
        updates.phone = editForm.phone;
      }

      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.admin.updateUserById(selectedUser.id, updates);
        if (error) throw error;
      }

      // Actualizar rol en la tabla profiles
      if (editForm.role !== selectedUser.role) {
        const { error } = await supabase
          .from('profiles')
          .update({ role: editForm.role })
          .eq('id', selectedUser.id);

        if (error) throw error;
      }

      toast.success('Usuario actualizado correctamente');
      setShowUserModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario');
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast.success('Usuario eliminado correctamente');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error al eliminar el usuario');
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      toast.success('Email de recuperación enviado');
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast.error('Error al enviar el email de recuperación');
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;

      toast.success('Magic link enviado correctamente');
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast.error('Error al enviar el magic link');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filters.role !== 'all' && user.role !== filters.role) return false;
    if (filters.status !== 'all' && user.status !== filters.status) return false;
    if (filters.search && !user.email.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'asesor': return 'bg-blue-100 text-blue-800';
      case 'franchisee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión Avanzada de Usuarios</h1>
          <p className="text-gray-600 mt-2">
            Administra usuarios, roles y permisos del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadUsers}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Buscar</Label>
              <Input
                placeholder="Buscar por email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <div>
              <Label>Rol</Label>
              <Select value={filters.role} onValueChange={(value) => setFilters(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="asesor">Asesor</SelectItem>
                  <SelectItem value="franchisee">Franquiciado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuarios */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
              <span className="ml-2">Cargando usuarios...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{user.email}</h3>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status === 'active' ? 'Activo' : user.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                        </Badge>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === 'admin' ? 'Administrador' : user.role === 'asesor' ? 'Asesor' : 'Franquiciado'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600">
                        Creado: {new Date(user.created_at).toLocaleDateString('es-ES')}
                        {user.last_sign_in && ` | Último acceso: ${new Date(user.last_sign_in).toLocaleDateString('es-ES')}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditForm({
                          email: user.email,
                          phone: user.phone || '',
                          role: user.role,
                          status: user.status
                        });
                        setShowUserModal(true);
                      }}
                      title="Editar usuario"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => sendPasswordReset(user.email)}
                      title="Enviar recuperación de contraseña"
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => sendMagicLink(user.email)}
                      title="Enviar magic link"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para crear usuario */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Crear Nuevo Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Teléfono (opcional)</Label>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Contraseña</Label>
                  <Input
                    type="password"
                    placeholder="Contraseña segura"
                    value={createForm.password}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Rol</Label>
                  <Select value={createForm.role} onValueChange={(value) => setCreateForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="franchisee">Franquiciado</SelectItem>
                      <SelectItem value="asesor">Asesor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendInvite"
                    checked={createForm.sendInvite}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, sendInvite: e.target.checked }))}
                  />
                  <Label htmlFor="sendInvite">Enviar invitación por email</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={createUser}>
                  Crear Usuario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal para editar usuario */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Rol</Label>
                  <Select value={editForm.role} onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="franchisee">Franquiciado</SelectItem>
                      <SelectItem value="asesor">Asesor</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowUserModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={updateUser}>
                  Actualizar Usuario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedUserManagement; 