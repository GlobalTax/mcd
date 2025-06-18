import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, Franchisee, Restaurant, AuthContextType } from '@/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('fetchUserData - Starting fetch for user:', userId);
      
      // Fetch user profile with better error handling
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('fetchUserData - Profile query result:', { profile, profileError });

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // If profile doesn't exist, clear user data but don't show error
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, user needs to complete registration');
          clearUserData();
          return;
        }
        return;
      }

      if (!profile) {
        console.log('No profile found for user');
        clearUserData();
        return;
      }

      console.log('fetchUserData - Profile fetched:', profile);

      // Usar el rol directamente de la base de datos sin mapear
      const userData = {
        ...profile,
        role: profile.role // Mantener el rol original de la base de datos
      } as User;

      console.log('fetchUserData - Setting user with role:', userData.role);
      setUser(userData);

      // Only fetch franchisee data if user is a franchisee
      if (profile.role === 'franchisee') {
        console.log('fetchUserData - User is franchisee, fetching franchisee data');
        
        // Fetch franchisee data
        const { data: franchiseeData, error: franchiseeError } = await supabase
          .from('franchisees')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        console.log('fetchUserData - Franchisee query result:', { franchiseeData, franchiseeError });

        if (franchiseeError) {
          console.error('Error fetching franchisee:', franchiseeError);
          // Si no existe el franquiciado, crear uno
          if (franchiseeError.code === 'PGRST116') {
            console.log('No franchisee found, creating one for user:', profile.full_name);
            
            const { data: newFranchisee, error: createError } = await supabase
              .from('franchisees')
              .insert({
                user_id: userId,
                franchisee_name: profile.full_name || profile.email
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating franchisee:', createError);
              toast.error('Error al crear perfil de franquiciado');
              return;
            }

            console.log('fetchUserData - New franchisee created:', newFranchisee);
            setFranchisee(newFranchisee as Franchisee);
            toast.success('Perfil de franquiciado creado correctamente');
          }
          return;
        }

        if (franchiseeData) {
          console.log('fetchUserData - Setting franchisee:', franchiseeData);
          setFranchisee(franchiseeData as Franchisee);

          // Fetch restaurants (keeping compatibility with old structure)
          const { data: restaurantsData, error: restaurantsError } = await supabase
            .from('restaurants')
            .select('*')
            .eq('franchisee_id', franchiseeData.id);

          if (restaurantsError) {
            console.error('Error fetching restaurants:', restaurantsError);
          } else {
            console.log('fetchUserData - Old restaurants found:', restaurantsData);
            setRestaurants(restaurantsData as Restaurant[]);
          }
        }
      } else {
        console.log('fetchUserData - User is not franchisee, role:', profile.role);
        // Clear franchisee data for non-franchisee users
        setFranchisee(null);
        setRestaurants([]);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      // Clear user data on any unexpected error
      clearUserData();
    }
  };

  const clearUserData = () => {
    console.log('clearUserData - Clearing all user data');
    setUser(null);
    setFranchisee(null);
    setRestaurants([]);
  };

  useEffect(() => {
    console.log('useAuth - Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth - Auth state change:', event, session?.user?.id);
        console.log('useAuth - Full session:', session);
        setSession(session);
        
        if (session?.user) {
          console.log('useAuth - User found in session, fetching user data');
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          console.log('useAuth - No session, clearing user data');
          clearUserData();
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth - Initial session check:', session?.user?.id);
      console.log('useAuth - Initial session full:', session);
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('signIn - Attempting login for:', email);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('signIn - Error:', error);
        toast.error(error.message);
        return { error: error.message };
      } else {
        console.log('signIn - Success');
        toast.success('Sesión iniciada correctamente');
        return {};
      }
    } catch (error) {
      console.error('signIn - Unexpected error:', error);
      toast.error('Error inesperado al iniciar sesión');
      return { error: 'Error inesperado al iniciar sesión' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error: error.message };
      } else {
        toast.success('Cuenta creada correctamente. Revisa tu email para confirmar tu cuenta.');
        return {};
      }
    } catch (error) {
      console.error('signUp - Unexpected error:', error);
      toast.error('Error inesperado al crear cuenta');
      return { error: 'Error inesperado al crear cuenta' };
    }
  };

  const signOut = async () => {
    try {
      console.log('signOut - Starting logout process');
      
      // Clear user data immediately to prevent UI delays
      clearUserData();
      setSession(null);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('signOut - Error:', error);
        // Don't show error toast for session_not_found errors as they're harmless
        if (!error.message.includes('Session not found')) {
          toast.error(error.message);
        }
      } else {
        console.log('signOut - Success');
        toast.success('Sesión cerrada correctamente');
      }
    } catch (error) {
      console.error('signOut - Unexpected error:', error);
      // Still clear the local state even if there's an error
      clearUserData();
      setSession(null);
    }
  };

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
