
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useDeleteUser = () => {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const deleteUser = async (franchiseeId: string, userId: string, userName: string) => {
    if (!user) {
      toast.error('No tienes permisos para eliminar usuarios');
      return false;
    }

    try {
      setDeleting(true);
      console.log('Iniciando eliminación de usuario:', { franchiseeId, userId, userName });

      // 1. Primero eliminar el perfil del usuario
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.error('Error eliminando perfil:', profileError);
        // No retornamos false aquí porque el perfil puede no existir
      } else {
        console.log('Perfil eliminado exitosamente');
      }

      // 2. Eliminar el usuario de auth usando admin
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Error eliminando usuario de auth:', authError);
        toast.error('Error al eliminar la cuenta de usuario');
        return false;
      }

      console.log('Usuario eliminado de auth exitosamente');

      // 3. Marcar invitaciones como expiradas
      const { error: invitationError } = await supabase
        .from('franchisee_invitations')
        .update({ status: 'expired' })
        .eq('franchisee_id', franchiseeId);

      if (invitationError) {
        console.error('Error actualizando invitaciones:', invitationError);
        // No es crítico, continuamos
      }

      toast.success(`Acceso eliminado para ${userName}`);
      return true;

    } catch (error) {
      console.error('Error en deleteUser:', error);
      toast.error('Error inesperado al eliminar usuario');
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleteUser,
    deleting
  };
};
