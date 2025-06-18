
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from './auth/AuthContext';
import { useAuthState } from './auth/useAuthState';
import { useUserDataFetcher } from './auth/useUserDataFetcher';
import { useAuthActions } from './auth/useAuthActions';

export { useAuth } from './auth/AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    user,
    setUser,
    session,
    setSession,
    franchisee,
    setFranchisee,
    restaurants,
    setRestaurants,
    loading,
    setLoading,
    clearUserData
  } = useAuthState();

  const { fetchUserData } = useUserDataFetcher({
    setUser,
    setFranchisee,
    setRestaurants,
    clearUserData
  });

  const { signIn, signUp, signOut } = useAuthActions({
    clearUserData,
    setSession
  });

  useEffect(() => {
    console.log('useAuth - Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth - Auth state change:', event, session?.user?.id);
        console.log('useAuth - Full session:', session);
        setSession(session);
        
        if (session?.user) {
          console.log('useAuth - User found in session, fetching user data');
          await fetchUserData(session.user.id);
        } else {
          console.log('useAuth - No session, clearing user data');
          clearUserData();
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('useAuth - Initial session check:', session?.user?.id);
      console.log('useAuth - Initial session full:', session);
      setSession(session);
      if (session?.user) {
        await fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log('useAuth - Current state:', { user, session: !!session, loading });

  const value = {
    user,
    session,
    franchisee,
    restaurants,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
