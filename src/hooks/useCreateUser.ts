
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

// Definir el tipo de rol permitido que coincida exactamente con la base de datos
export type UserRole = 'admin' | 'franchisee' | 'manager' | 'asesor' | 'asistente';

export const useCreateUser = () => {
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

    console.log('Usuario actual:', user);
    console.log('Rol del usuario:', user.role);

    // Verificar que el usuario tenga permisos de administrador
    if (!['admin', 'advisor', 'asesor', 'superadmin'].includes(user.role)) {
      toast.error('No tienes permisos de administrador para crear usuarios');
      return false;
    }

    try {
      setCreating(true);
      console.log('Iniciando creación de usuario:', { email, fullName, role });

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

      console.log('Intentando crear usuario con admin.createUser...');

      // Intentar crear el usuario usando admin.createUser
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
        
        // Si es un error de permisos, intentar con signUp
        if (authError.message.includes('not allowed') || authError.message.includes('permission')) {
          console.log('Intentando crear usuario con signUp como alternativa...');
          
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
            console.error('No user returned from signUp');
            toast.error('Error al crear usuario');
            return false;
          }

          console.log('Usuario creado con signUp:', signUpData.user);

          // Crear el perfil directamente en la tabla profiles
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

          console.log('Perfil creado exitosamente con signUp');
          toast.success(`Usuario ${fullName} creado exitosamente.`);
          return true;
        } else {
          toast.error(`Error al crear usuario: ${authError.message}`);
          return false;
        }
      }

      if (!authData.user) {
        console.error('No user returned from admin.createUser');
        toast.error('Error al crear usuario');
        return false;
      }

      console.log('Usuario creado en auth:', authData.user);

      // Crear el perfil directamente en la tabla profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          full_name: fullName,
          role: role
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast.error('Usuario creado pero error al crear perfil');
        return false;
      }

      console.log('Perfil creado exitosamente');

      toast.success(`Usuario ${fullName} creado exitosamente.`);
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
