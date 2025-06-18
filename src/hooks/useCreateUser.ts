
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

      // Crear el usuario usando signup normal
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      console.log('Resultado del signup:', { authData, authError });

      if (authError) {
        console.error('Error creating user:', authError);
        toast.error(`Error al crear usuario: ${authError.message}`);
        return false;
      }

      if (!authData.user) {
        console.error('No user returned from signUp');
        toast.error('Error al crear usuario');
        return false;
      }

      console.log('Usuario creado en auth:', authData.user);

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

      // Dar tiempo para que el trigger de profiles funcione
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verificar si el perfil se creó automáticamente
      let profileExists = false;
      for (let i = 0; i < 3; i++) {
        const { data: profileCheck } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileCheck) {
          profileExists = true;
          console.log('Perfil encontrado:', profileCheck);
          break;
        }

        // Esperar un poco más si no existe
        if (i < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Si no existe el perfil, crearlo manualmente
      if (!profileExists) {
        console.log('Creando perfil manualmente');
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
      } else {
        // Actualizar el perfil con el rol de franchisee
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
