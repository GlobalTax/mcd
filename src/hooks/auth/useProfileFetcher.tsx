
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
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000);
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
      console.log('fetchUserProfile - Profile query result:', { profile, profileError });

      if (profileError) {
        console.error('fetchUserProfile - Profile error details:', profileError);
        // If profile doesn't exist, clear user data but don't show error
        if (profileError.code === 'PGRST116') {
          console.log('fetchUserProfile - Profile not found, user needs to complete registration');
          clearUserData();
          return null;
        }
        console.log('fetchUserProfile - Profile error, clearing user data');
        clearUserData();
        return null;
      }

      if (!profile) {
        console.log('fetchUserProfile - No profile found for user');
        clearUserData();
        return null;
      }

      console.log('fetchUserProfile - Profile fetched successfully:', profile);
      
      const userData = {
        ...profile,
        role: profile.role
      } as User;

      console.log('fetchUserProfile - About to set user with role:', userData.role);
      setUser(userData);
      console.log('fetchUserProfile - User set successfully');
      
      return userData;
    } catch (timeoutError) {
      console.error('fetchUserProfile - Query timeout or error:', timeoutError);
      // If query times out, create a basic user profile and continue
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
