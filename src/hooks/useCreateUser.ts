
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

      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast.error('Ya existe un usuario con este email');
        return false;
      }

      // Crear el usuario usando Supabase Auth Admin
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: {
          full_name: fullName
        },
        email_confirm: true // Confirmar email automáticamente
      });

      if (authError) {
        console.error('Error creating user:', authError);
        toast.error(`Error al crear usuario: ${authError.message}`);
        return false;
      }

      if (!authData.user) {
        toast.error('Error al crear usuario');
        return false;
      }

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

      toast.success(`Usuario creado exitosamente para ${fullName}`);
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
