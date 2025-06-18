
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
        .single();

      if (existingProfile) {
        console.log('Usuario ya existe:', existingProfile);
        toast.error('Ya existe un usuario con este email');
        return false;
      }

      // Crear una invitación especial que se auto-acepta
      const { data: invitation, error: inviteError } = await supabase
        .from('franchisee_invitations')
        .insert({
          franchisee_id: franchiseeId,
          email,
          invited_by: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (inviteError) {
        console.error('Error creating invitation:', inviteError);
        toast.error('Error al crear la invitación');
        return false;
      }

      console.log('Invitación creada:', invitation);

      // Crear el usuario usando signup normal
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      console.log('Resultado del signup:', { authData, authError });

      if (authError) {
        console.error('Error creating user:', authError);
        toast.error(`Error al crear usuario: ${authError.message}`);
        
        // Limpiar la invitación si falló la creación
        await supabase
          .from('franchisee_invitations')
          .delete()
          .eq('id', invitation.id);
        
        return false;
      }

      if (!authData.user) {
        console.error('No user returned from signUp');
        toast.error('Error al crear usuario');
        return false;
      }

      console.log('Usuario creado en auth:', authData.user);

      // Marcar la invitación como aceptada
      const { error: inviteUpdateError } = await supabase
        .from('franchisee_invitations')
        .update({ 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', invitation.id);

      if (inviteUpdateError) {
        console.error('Error updating invitation:', inviteUpdateError);
      } else {
        console.log('Invitación marcada como aceptada');
      }

      // Dar tiempo para que el trigger de profiles funcione
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verificar si el perfil se creó automáticamente
      const { data: profileCheck } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      console.log('Perfil después del signup:', profileCheck);

      // Actualizar el perfil con el rol de franchisee si existe
      if (profileCheck) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'franchisee',
            full_name: fullName 
          })
          .eq('id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          toast.error('Usuario creado pero error al asignar rol');
          return false;
        }
        console.log('Perfil actualizado con rol franchisee');
      } else {
        // Si no existe el perfil, crearlo manualmente
        const { error: profileCreateError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: email,
            full_name: fullName,
            role: 'franchisee'
          });

        if (profileCreateError) {
          console.error('Error creating profile manually:', profileCreateError);
          toast.error('Usuario creado pero error al crear perfil');
          return false;
        }
        console.log('Perfil creado manualmente');
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

      toast.success(`Usuario creado exitosamente para ${fullName}. Se ha enviado un email de confirmación.`);
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
