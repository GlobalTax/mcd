
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, Shield, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Invitation {
  id: string;
  email: string;
  role: 'franchisee' | 'manager' | 'viewer';
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  invited_by: string;
}

export const InvitationPanel = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'franchisee' | 'manager' | 'viewer'>('viewer');
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const sendInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    if (!user) {
      toast.error('Debes estar autenticado para enviar invitaciones');
      return;
    }

    setLoading(true);

    try {
      // Verificar si el usuario ya existe
      const { data: existingUser, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast.error('Este usuario ya tiene una cuenta en la plataforma');
        setLoading(false);
        return;
      }

      // Crear invitación temporal
      const invitation: Omit<Invitation, 'id'> = {
        email,
        role,
        status: 'pending',
        created_at: new Date().toISOString(),
        invited_by: user.email
      };

      // Simular almacenamiento local de invitaciones (en un caso real sería en base de datos)
      const newInvitation = {
        ...invitation,
        id: Math.random().toString(36).substr(2, 9)
      };

      setInvitations(prev => [...prev, newInvitation]);

      // Simular envío de email (en un caso real usarías una edge function con Resend)
      toast.success(`Invitación enviada a ${email}`);
      
      // Limpiar formulario
      setEmail('');
      setRole('viewer');
      setShowInviteForm(false);

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Error al enviar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvitation = (invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    toast.success('Invitación eliminada');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'franchisee':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'manager':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="w-4 h-4 text-gray-500" />;
      default:
        return <UserPlus className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'franchisee':
        return 'Acceso Completo';
      case 'manager':
        return 'Gestión';
      case 'viewer':
        return 'Solo Visualización';
      default:
        return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'franchisee':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Solo mostrar para admin o franquiciados
  if (user?.role !== 'admin' && user?.role !== 'franchisee') {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-red-600" />
            Invitar Usuarios
          </CardTitle>
          <Button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="bg-red-600 hover:bg-red-700"
            size="sm"
          >
            <Mail className="w-4 h-4 mr-2" />
            Nueva Invitación
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showInviteForm && (
          <form onSubmit={sendInvitation} className="space-y-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email del Usuario</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Nivel de Acceso</Label>
                <Select value={role} onValueChange={(value: 'franchisee' | 'manager' | 'viewer') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        Solo Visualización
                      </div>
                    </SelectItem>
                    <SelectItem value="manager">
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-blue-500" />
                        Gestión y Modificación
                      </div>
                    </SelectItem>
                    {user?.role === 'admin' && (
                      <SelectItem value="franchisee">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-red-500" />
                          Acceso Completo
                        </div>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Enviando...' : 'Enviar Invitación'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowInviteForm(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {invitations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Invitaciones Enviadas</h4>
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getRoleIcon(invitation.role)}
                    <div>
                      <p className="font-medium text-gray-900">{invitation.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRoleBadgeColor(invitation.role)}>
                          {getRoleLabel(invitation.role)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {invitation.status === 'pending' ? 'Pendiente' : 
                           invitation.status === 'accepted' ? 'Aceptada' : 'Expirada'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(invitation.created_at).toLocaleDateString('es-ES')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteInvitation(invitation.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {invitations.length === 0 && !showInviteForm && (
          <div className="text-center py-8 text-gray-500">
            <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No hay invitaciones enviadas</p>
            <p className="text-sm">Haz clic en "Nueva Invitación" para comenzar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
