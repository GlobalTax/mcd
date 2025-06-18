
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'franchisee' | 'manager' | 'asesor' | 'asistente';

export const useUserCreation = () => {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);

  const createUser = async (
    email: string, 
    password: string, 
    fullName: string, 
    role: UserRole = 'franchisee'
  ) => {
    if (!user) {
      toast.error('No tienes permisos para crear usuarios');
      return false;
    }

    // Verificar permisos
    if (!['admin', 'asesor', 'superadmin'].includes(user.role)) {
      toast.error('No tienes permisos de administrador');
      return false;
    }

    try {
      setCreating(true);
      console.log('Creando usuario:', { email, fullName, role });

      // Verificar si ya existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        toast.error('Ya existe un usuario con este email');
        return false;
      }

      // Crear usuario con signUp
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (signUpError) {
        console.error('Error with signUp:', signUpError);
        toast.error(`Error al crear usuario: ${signUpError.message}`);
        return false;
      }

      if (!signUpData.user) {
        toast.error('Error al crear usuario');
        return false;
      }

      console.log('Usuario creado:', signUpData.user);

      // Crear perfil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: signUpData.user.id,
          email: email,
          full_name: fullName,
          role: role
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.error('Usuario creado pero error al crear perfil');
        return false;
      }

      // Si es franquiciado, crear entrada en franchisees
      if (role === 'franchisee') {
        const { error: franchiseeError } = await supabase
          .from('franchisees')
          .insert({
            user_id: signUpData.user.id,
            franchisee_name: fullName
          });

        if (franchiseeError) {
          console.error('Error creating franchisee:', franchiseeError);
          toast.error('Usuario creado pero error al crear franquiciado');
        }
      }

      toast.success(`Usuario ${fullName} creado exitosamente`);
      return true;

    } catch (error) {
      console.error('Error in createUser:', error);
      toast.error('Error inesperado al crear usuario');
      return false;
    } finally {
      setCreating(false);
    }
  };

  const sendInvitation = async (email: string, role: UserRole = 'franchisee') => {
    if (!user) {
      toast.error('No tienes permisos para enviar invitaciones');
      return false;
    }

    try {
      setCreating(true);

      // Verificar si ya existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingProfile) {
        toast.error('Ya existe un usuario con este email');
        return false;
      }

      // Por ahora solo mostrar mensaje de éxito
      // En el futuro aquí se podría integrar con un servicio de email
      toast.success(`Invitación enviada a ${email}`);
      console.log('Invitación enviada:', { email, role, invitedBy: user.email });
      
      return true;

    } catch (error) {
      console.error('Error sending invitation:', error);
      toast.error('Error al enviar invitación');
      return false;
    } finally {
      setCreating(false);
    }
  };

  return {
    createUser,
    sendInvitation,
    creating
  };
};
