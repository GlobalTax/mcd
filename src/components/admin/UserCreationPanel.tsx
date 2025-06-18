
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Mail, Users } from 'lucide-react';
import { useUserCreation, type UserRole } from '@/hooks/useUserCreation';
import { useAuth } from '@/hooks/useAuth';

export const UserCreationPanel = () => {
  const { user } = useAuth();
  const { createUser, sendInvitation, creating } = useUserCreation();
  
  const [userForm, setUserForm] = useState({
    email: '',
    fullName: '',
    password: '',
    role: 'franchisee' as UserRole
  });

  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'franchisee' as UserRole
  });

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userForm.email.trim() || !userForm.fullName.trim() || !userForm.password.trim()) {
      return;
    }

    if (userForm.password.length < 6) {
      return;
    }

    const success = await createUser(
      userForm.email.trim(),
      userForm.password.trim(),
      userForm.fullName.trim(),
      userForm.role
    );

    if (success) {
      setUserForm({ email: '', fullName: '', password: '', role: 'franchisee' });
    }
  };

  const handleSendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inviteForm.email.trim()) {
      return;
    }

    const success = await sendInvitation(inviteForm.email.trim(), inviteForm.role);

    if (success) {
      setInviteForm({ email: '', role: 'franchisee' });
    }
  };

  // Solo mostrar para admins
  if (!user || !['admin', 'asesor', 'superadmin'].includes(user.role)) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Crear Usuario</TabsTrigger>
            <TabsTrigger value="invite">Enviar Invitación</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre Completo *</Label>
                  <Input
                    id="fullName"
                    placeholder="Nombre del usuario"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="createEmail">Email *</Label>
                  <Input
                    id="createEmail"
                    placeholder="Email del usuario"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <Input
                    id="password"
                    placeholder="Contraseña (mínimo 6 caracteres)"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    type="password"
                    minLength={6}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={userForm.role}
                    onValueChange={(value: UserRole) => setUserForm(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="franchisee">Franquiciado</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="asesor">Asesor</SelectItem>
                      <SelectItem value="asistente">Asistente</SelectItem>
                      {user?.role === 'superadmin' && (
                        <SelectItem value="admin">Administrador</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="submit"
                disabled={creating}
                className="w-full"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {creating ? 'Creando...' : 'Crear Usuario'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="invite" className="space-y-4">
            <form onSubmit={handleSendInvitation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inviteEmail">Email *</Label>
                  <Input
                    id="inviteEmail"
                    placeholder="Email del usuario"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="inviteRole">Rol</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value: UserRole) => setInviteForm(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="franchisee">Franquiciado</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="asesor">Asesor</SelectItem>
                      <SelectItem value="asistente">Asistente</SelectItem>
                      {user?.role === 'superadmin' && (
                        <SelectItem value="admin">Administrador</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="submit"
                disabled={creating}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                {creating ? 'Enviando...' : 'Enviar Invitación'}
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                Se enviará un correo con instrucciones para crear la cuenta
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
