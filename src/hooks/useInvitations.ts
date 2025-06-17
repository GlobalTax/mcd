
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  email: string;
  role: 'franchisee' | 'manager' | 'viewer';
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  invited_by: string;
}

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);

  const sendInvitation = useCallback(async (email: string, role: 'franchisee' | 'manager' | 'viewer', invitedBy: string) => {
    setLoading(true);
    
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast.error('Este usuario ya tiene una cuenta en la plataforma');
        return false;
      }

      // En un caso real, aquí guardarías la invitación en la base de datos
      // y enviarías un email con un enlace de registro
      const newInvitation: Invitation = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        role,
        status: 'pending',
        created_at: new Date().toISOString(),
        invited_by: invitedBy
      };

      setInvitations(prev => [...prev, newInvitation]);
      toast.success(`Invitación enviada a ${email}`);
      return true;

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Error al enviar la invitación');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteInvitation = useCallback((invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    toast.success('Invitación eliminada');
  }, []);

  const getInvitationsByEmail = useCallback((email: string) => {
    return invitations.filter(inv => inv.invited_by === email);
  }, [invitations]);

  return {
    invitations,
    loading,
    sendInvitation,
    deleteInvitation,
    getInvitationsByEmail
  };
};
