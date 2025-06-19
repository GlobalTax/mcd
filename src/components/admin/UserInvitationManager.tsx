import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  UserPlus, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Trash2,
  RefreshCw,
  Users,
  Send,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  email: string;
  role: string;
  restaurant_id?: string;
  restaurant_name?: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
  invited_by: string;
  message?: string;
}

interface InvitationForm {
  email: string;
  role: 'franchisee' | 'asesor' | 'admin';
  restaurant_id?: string;
  message: string;
}

const UserInvitationManager: React.FC = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<InvitationForm>({
    email: '',
    role: 'franchisee',
    restaurant_id: '',
    message: ''
  });

  // Invitaciones de ejemplo
  const exampleInvitations: Invitation[] = [
    {
      id: '1',
      email: 'franquiciado1@example.com',
      role: 'franchisee',
      restaurant_id: 'rest-1',
      restaurant_name: 'McDonald\'s Plaza Mayor',
      status: 'pending',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: user?.email || 'admin@example.com',
      message: 'Bienvenido al sistema de gestión de franquicias McDonald\'s'
    },
    {
      id: '2',
      email: 'asesor1@example.com',
      role: 'asesor',
      status: 'accepted',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: user?.email || 'admin@example.com',
      message: 'Invitación para asesor de franquicias'
    },
    {
      id: '3',
      email: 'franquiciado2@example.com',
      role: 'franchisee',
      restaurant_id: 'rest-2',
      restaurant_name: 'McDonald\'s Centro Comercial',
      status: 'expired',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: user?.email || 'admin@example.com',
      message: 'Invitación para nuevo franquiciado'
    }
  ];

  useEffect(() => {
    loadInvitations();
    loadRestaurants();
  }, []);

  const loadInvitations = async () => {
    setLoading(true);
    try {
      // Por ahora usamos datos de ejemplo
      // En el futuro esto vendría de la base de datos
      setInvitations(exampleInvitations);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error('Error al cargar las invitaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('base_restaurants')
        .select('*')
        .order('restaurant_name');

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Error al cargar los restaurantes');
    }
  };

  const sendInvitation = async () => {
    if (!formData.email || !formData.role) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    setSending(true);
    try {
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Por favor ingresa un email válido');
        return;
      }

      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      const userExists = (existingUser as any).users?.some((u: any) => u.email === formData.email);
      
      if (userExists) {
        toast.error('Este usuario ya existe en el sistema');
        return;
      }

      // Enviar invitación usando la API de Supabase
      const { data: existingInvitation, error: checkError } = await supabase
        .from('user_invitations' as any)
        .select('*')
        .eq('email', formData.email)
        .single();

      if (existingInvitation) {
        toast.error('Este usuario ya tiene una invitación pendiente');
        return;
      }

      const invitationData = {
        email: formData.email,
        role: formData.role,
        restaurant_id: formData.restaurant_id,
        message: formData.message,
        invited_by: user?.id,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      const { data: invitation, error } = await supabase
        .from('user_invitations' as any)
        .insert([invitationData])
        .select()
        .single();

      if (error) throw error;

      toast.success('Invitación enviada correctamente');
      
      // Limpiar formulario
      setFormData({
        email: '',
        role: 'franchisee',
        restaurant_id: '',
        message: ''
      });
      setShowForm(false);
      
      // Recargar invitaciones
      loadInvitations();
    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Error al enviar la invitación');
    } finally {
      setSending(false);
    }
  };

  const resendInvitation = async (invitationId: string) => {
    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) return;

      const { error } = await supabase.auth.admin.inviteUserByEmail(invitation.email);
      if (error) throw error;

      toast.success('Invitación reenviada correctamente');
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast.error('Error al reenviar la invitación');
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('user_invitations' as any)
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      toast.success('Invitación eliminada correctamente');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast.error('Error al eliminar la invitación');
    }
  };

  const copyInvitationLink = (invitation: Invitation) => {
    // En un caso real, esto sería el link de invitación de Supabase
    const link = `${window.location.origin}/auth/invite?token=${invitation.id}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado al portapapeles');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'expired': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Invitaciones</h1>
          <p className="text-gray-600 mt-2">
            Invita usuarios al sistema de gestión de franquicias
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadInvitations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={() => setShowForm(!showForm)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nueva Invitación
          </Button>
        </div>
      </div>

      {/* Formulario de Invitación */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Invitación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="role">Rol *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}
                >
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

              {formData.role === 'franchisee' && (
                <div>
                  <Label htmlFor="restaurant">Restaurante</Label>
                  <Select 
                    value={formData.restaurant_id || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, restaurant_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar restaurante" />
                    </SelectTrigger>
                    <SelectContent>
                      {restaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          {restaurant.restaurant_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="md:col-span-2">
                <Label htmlFor="message">Mensaje Personalizado</Label>
                <Textarea
                  id="message"
                  placeholder="Mensaje opcional para el usuario invitado..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button onClick={sendInvitation} disabled={sending}>
                {sending ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                Enviar Invitación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Invitaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Invitaciones Enviadas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
              <span className="ml-2">Cargando invitaciones...</span>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay invitaciones enviadas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(invitation.status)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{invitation.email}</h3>
                        <Badge className={getStatusColor(invitation.status)}>
                          {invitation.status === 'pending' ? 'Pendiente' : 
                           invitation.status === 'accepted' ? 'Aceptada' : 'Expirada'}
                        </Badge>
                        <Badge variant="outline">
                          {invitation.role === 'franchisee' ? 'Franquiciado' : 
                           invitation.role === 'asesor' ? 'Asesor' : 'Administrador'}
                        </Badge>
                      </div>
                      
                      {invitation.restaurant_name && (
                        <p className="text-sm text-gray-600">
                          Restaurante: {invitation.restaurant_name}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Enviada: {formatDate(invitation.created_at)} | 
                        Expira: {formatDate(invitation.expires_at)}
                      </p>
                      
                      {invitation.message && (
                        <p className="text-sm text-gray-600 mt-1">
                          "{invitation.message}"
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyInvitationLink(invitation)}
                      title="Copiar link de invitación"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    {invitation.status === 'pending' && !isExpired(invitation.expires_at) && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => resendInvitation(invitation.id)}
                        title="Reenviar invitación"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteInvitation(invitation.id)}
                      title="Eliminar invitación"
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
    </div>
  );
};

export default UserInvitationManager; 