
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

interface ProfileFetcherProps {
  setUser: (user: User | null) => void;
  clearUserData: () => void;
}

export const useProfileFetcher = ({ setUser, clearUserData }: ProfileFetcherProps) => {
  
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('fetchUserProfile - About to query profiles table');
      
      // Crear un timeout más corto para mejorar la experiencia
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 5 seconds')), 5000);
      });
      
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const { data: profile, error: profileError } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      console.log('fetchUserProfile - Profile query completed');

      if (profileError && !profileError.message?.includes('timeout')) {
        console.error('fetchUserProfile - Profile error details:', profileError);
        
        // Si no existe el perfil, crear uno básico
        if (profileError.code === 'PGRST116') {
          console.log('fetchUserProfile - Profile not found, creating basic user');
          const basicUser = {
            id: userId,
            email: 'usuario@ejemplo.com',
            role: 'franchisee',
            full_name: 'Usuario'
          } as User;
          
          setUser(basicUser);
          return basicUser;
        }
        
        clearUserData();
        return null;
      }

      if (profile) {
        console.log('fetchUserProfile - Profile fetched successfully:', profile);
        
        const userData = {
          ...profile,
          role: profile.role
        } as User;

        setUser(userData);
        return userData;
      }

      // Si no hay perfil, crear uno básico
      console.log('fetchUserProfile - No profile found, creating basic user');
      const basicUser = {
        id: userId,
        email: 'usuario@ejemplo.com',
        role: 'franchisee',
        full_name: 'Usuario'
      } as User;
      
      setUser(basicUser);
      return basicUser;
      
    } catch (error) {
      console.error('fetchUserProfile - Query timeout or error:', error);
      
      // Crear un usuario básico en caso de timeout
      const basicUser = {
        id: userId,
        email: 'usuario@ejemplo.com',
        role: 'franchisee',
        full_name: 'Usuario'
      } as User;
      
      console.log('fetchUserProfile - Setting basic user due to timeout');
      setUser(basicUser);
      return basicUser;
    }
  };

  return { fetchUserProfile };
};
