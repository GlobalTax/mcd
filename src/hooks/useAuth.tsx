
import { createContext, useContext, useEffect, useState } from 'react';
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('fetchUserData - Starting fetch for user:', userId);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      console.log('fetchUserData - Profile fetched:', profile);

      // Map database role "asesor" to TypeScript type "advisor"
      const mappedRole = profile.role === 'asesor' ? 'advisor' : profile.role;
      
      const userData = {
        ...profile,
        role: mappedRole
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

        if (franchiseeError) {
          console.error('Error fetching franchisee:', franchiseeError);
          return;
        }

        if (franchiseeData) {
          setFranchisee(franchiseeData as Franchisee);

          // Fetch restaurants (keeping compatibility with old structure)
          const { data: restaurantsData, error: restaurantsError } = await supabase
            .from('restaurants')
            .select('*')
            .eq('franchisee_id', franchiseeData.id);

          if (restaurantsError) {
            console.error('Error fetching restaurants:', restaurantsError);
          } else {
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
    }
  };

  useEffect(() => {
    console.log('useAuth - Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('useAuth - Auth state change:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          console.log('useAuth - No session, clearing user data');
          setUser(null);
          setFranchisee(null);
          setRestaurants([]);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth - Initial session check:', session?.user?.id);
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
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;

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
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Sesión cerrada correctamente');
    }
  };

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
