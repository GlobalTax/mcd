
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const useCreateUser = () => {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  const createUser = async (
    email: string, 
    password: string, 
    fullName: string, 
    franchiseeId: string
  ) => {
    if (!user) {
      toast.error('No tienes permisos para crear usuarios');
      return false;
    }

    try {
      setCreating(true);
      console.log('Iniciando creación de usuario:', { email, fullName, franchiseeId });

      // Verificar si ya existe un usuario con este email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        console.log('Usuario ya existe:', existingProfile);
        toast.error('Ya existe un usuario con este email');
        return false;
      }

      // Crear el usuario usando admin.createUser
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: fullName
        },
        email_confirm: true
      });

      console.log('Resultado del admin.createUser:', { authData, authError });

      if (authError) {
        console.error('Error creating user:', authError);
        toast.error(`Error al crear usuario: ${authError.message}`);
        return false;
      }

      if (!authData.user) {
        console.error('No user returned from admin.createUser');
        toast.error('Error al crear usuario');
        return false;
      }

      console.log('Usuario creado en auth:', authData.user);

      // Crear el perfil usando la función RPC mejorada
      console.log('Creando perfil usando función RPC');
      const { error: profileCreateError } = await supabase.rpc('create_franchisee_profile', {
        user_id: authData.user.id,
        user_email: email,
        user_full_name: fullName
      });

      if (profileCreateError) {
        console.error('Error creating profile with RPC:', profileCreateError);
        toast.error('Usuario creado pero error al crear perfil');
        return false;
      }

      console.log('Perfil creado exitosamente');

      // Crear una invitación marcada como aceptada
      const { error: inviteError } = await supabase
        .from('franchisee_invitations')
        .insert({
          franchisee_id: franchiseeId,
          email,
          invited_by: user.id,
          status: 'accepted',
          accepted_at: new Date().toISOString()
        });

      if (inviteError) {
        console.error('Error creating invitation:', inviteError);
        // No es crítico, continuamos
      } else {
        console.log('Invitación creada y marcada como aceptada');
      }

      // Actualizar el franquiciado con el nuevo user_id
      const { error: franchiseeError } = await supabase
        .from('franchisees')
        .update({ user_id: authData.user.id })
        .eq('id', franchiseeId);

      if (franchiseeError) {
        console.error('Error linking franchisee:', franchiseeError);
        toast.error('Usuario creado pero error al vincular con franquiciado');
        return false;
      }

      console.log('Franquiciado vinculado con usuario');

      toast.success(`Usuario creado exitosamente para ${fullName}. El usuario puede iniciar sesión inmediatamente.`);
      return true;

    } catch (error) {
      console.error('Error in createUser:', error);
      toast.error('Error inesperado al crear usuario');
      return false;
    } finally {
      setCreating(false);
    }
  };

  return {
    createUser,
    creating
  };
};
