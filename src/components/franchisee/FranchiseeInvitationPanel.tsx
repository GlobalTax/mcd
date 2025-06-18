
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Mail, Send, Clock, CheckCircle, XCircle, UserPlus, Trash2 } from 'lucide-react';
import { useFranchiseeInvitations } from '@/hooks/useFranchiseeInvitations';
import { useCreateUser } from '@/hooks/useCreateUser';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FranchiseeInvitationPanelProps {
  franchiseeId: string;
  franchiseeEmail?: string;
  hasAccount?: boolean;
  userId?: string;
  fullName?: string;
  onUserDeleted?: () => void;
}

export const FranchiseeInvitationPanel: React.FC<FranchiseeInvitationPanelProps> = ({
  franchiseeId,
  franchiseeEmail,
  hasAccount = false,
  userId,
  fullName,
  onUserDeleted
}) => {
  const { invitations, loading, sendInvitation, deleteInvitation } = useFranchiseeInvitations(franchiseeId);
  const { createUser, creating } = useCreateUser();
  const { deleteUser, deleting } = useDeleteUser();
  
  // Estados para invitación por email
  const [inviteEmail, setInviteEmail] = useState(franchiseeEmail || '');
  const [sending, setSending] = useState(false);

  // Estados para crear usuario
  const [userForm, setUserForm] = useState({
    email: franchiseeEmail || '',
    fullName: '',
    password: ''
  });

  const handleSendInvitation = async () => {
    if (!inviteEmail.trim()) return;

    setSending(true);
    const success = await sendInvitation(inviteEmail.trim());
    if (success) {
      setInviteEmail('');
    }
    setSending(false);
  };

  const handleCreateUser = async () => {
    if (!userForm.email.trim() || !userForm.fullName.trim() || !userForm.password.trim()) {
      return;
    }

    const success = await createUser(
      userForm.email.trim(),
      userForm.password.trim(),
      userForm.fullName.trim(),
      franchiseeId
    );

    if (success) {
      setUserForm({ email: '', fullName: '', password: '' });
      onUserDeleted?.(); // Refrescar datos
    }
  };

  const handleDeleteUser = async () => {
    if (!userId || !fullName) return;

    if (window.confirm(`¿Estás seguro de que quieres eliminar el acceso para ${fullName}? Esta acción no se puede deshacer.`)) {
      const success = await deleteUser(franchiseeId, userId, fullName);
      if (success) {
        onUserDeleted?.(); // Refrescar datos
      }
    }
  };

  const handleDeleteInvitation = async (invitationId: string, email: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la invitación para ${email}?`)) {
      await deleteInvitation(invitationId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Aceptada</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Gestión de Acceso
          </div>
          {hasAccount && userId && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteUser}
              disabled={deleting}
              className="flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Eliminando...' : 'Eliminar Acceso'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasAccount ? (
          <div className="text-center py-4">
            <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-2" />
            <h3 className="text-lg font-semibold text-green-600 mb-1">Usuario ya tiene acceso</h3>
            <p className="text-gray-600 mb-2">
              {fullName && `${fullName} (${franchiseeEmail})`}
            </p>
            <p className="text-sm text-gray-500">
              El franquiciado ya tiene una cuenta activa en el sistema
            </p>
          </div>
        ) : (
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Crear Usuario</TabsTrigger>
              <TabsTrigger value="invite">Enviar Invitación</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="fullName">Nombre Completo</Label>
                  <Input
                    id="fullName"
                    placeholder="Nombre del franquiciado"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="createEmail">Email</Label>
                  <Input
                    id="createEmail"
                    placeholder="Email del franquiciado"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    type="email"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    placeholder="Contraseña temporal (mínimo 6 caracteres)"
                    value={userForm.password}
                    onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                    type="password"
                    minLength={6}
                  />
                </div>
                
                <Button 
                  onClick={handleCreateUser}
                  disabled={!userForm.email.trim() || !userForm.fullName.trim() || !userForm.password.trim() || creating}
                  className="w-full flex items-center justify-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {creating ? 'Creando...' : 'Crear Usuario'}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="invite" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Email del franquiciado"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  type="email"
                />
                <Button 
                  onClick={handleSendInvitation}
                  disabled={!inviteEmail.trim() || sending}
                  className="flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                <Mail className="w-4 h-4 inline mr-1" />
                Se enviará un correo con instrucciones para crear su cuenta
              </p>
            </TabsContent>
          </Tabs>
        )}

        {loading ? (
          <p className="text-sm text-gray-500 mt-4">Cargando historial...</p>
        ) : invitations.length > 0 ? (
          <div className="space-y-3 mt-6">
            <h4 className="font-medium text-sm">Historial de Invitaciones</h4>
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{invitation.email}</p>
                  <p className="text-xs text-gray-500">
                    Enviada el {format(new Date(invitation.invited_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                  {invitation.expires_at && (
                    <p className="text-xs text-gray-500">
                      Expira el {format(new Date(invitation.expires_at), 'dd/MM/yyyy', { locale: es })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(invitation.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteInvitation(invitation.id, invitation.email)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !hasAccount && <p className="text-sm text-gray-500 mt-4">No hay invitaciones enviadas</p>
        )}
      </CardContent>
    </Card>
  );
};
