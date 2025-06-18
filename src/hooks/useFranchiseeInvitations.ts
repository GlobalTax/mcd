
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FranchiseeInvitation } from '@/types/franchiseeInvitation';
import { toast } from 'sonner';

export const useFranchiseeInvitations = (franchiseeId?: string) => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<FranchiseeInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    if (!user || !franchiseeId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('franchisee_invitations')
        .select('*')
        .eq('franchisee_id', franchiseeId)
        .order('invited_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion para asegurar que el status es del tipo correcto
      const typedData = (data || []).map(invitation => ({
        ...invitation,
        status: invitation.status as 'pending' | 'accepted' | 'expired'
      }));
      
      setInvitations(typedData);
    } catch (err) {
      console.error('Error fetching invitations:', err);
      toast.error('Error al cargar las invitaciones');
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (email: string) => {
    if (!user || !franchiseeId) return false;

    try {
      const { error } = await supabase
        .from('franchisee_invitations')
        .insert({
          franchisee_id: franchiseeId,
          email,
          invited_by: user.id
        });

      if (error) throw error;
      
      toast.success('Invitación enviada correctamente');
      await fetchInvitations();
      return true;
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error('Error al enviar la invitación');
      return false;
    }
  };

  const deleteInvitation = async (invitationId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('franchisee_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;
      
      toast.success('Invitación eliminada correctamente');
      await fetchInvitations();
      return true;
    } catch (err) {
      console.error('Error deleting invitation:', err);
      toast.error('Error al eliminar la invitación');
      return false;
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [franchiseeId, user?.id]);

  return {
    invitations,
    loading,
    sendInvitation,
    deleteInvitation,
    refetch: fetchInvitations
  };
};
