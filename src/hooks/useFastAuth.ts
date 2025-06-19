
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStaticData } from './useStaticData';
import { User, Franchisee } from '@/types/auth';

export const useFastAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { getFranchiseeData, getRestaurantsData, isUsingCache } = useStaticData();
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('useFastAuth - Starting fast initialization');
        
        // Verificar sesión actual (rápido)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('useFastAuth - Session found, creating user immediately');
          
          // Crear usuario inmediatamente con datos de sesión
          const userData: User = {
            id: session.user.id,
            email: session.user.email || 'usuario@ejemplo.com',
            role: 'franchisee',
            full_name: session.user.user_metadata?.full_name || 'Usuario',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setUser(userData);
          
          // Obtener datos del franquiciado (con fallback inmediato)
          const franchiseeData = await getFranchiseeData(session.user.id);
          setFranchisee(franchiseeData);
          
          // Obtener restaurantes (con fallback inmediato)
          const restaurantData = await getRestaurantsData(franchiseeData.id);
          setRestaurants(restaurantData);
          
          console.log('useFastAuth - Fast initialization completed');
        } else {
          console.log('useFastAuth - No session found');
          // Crear datos demo para usuarios sin sesión
          const demoUser: User = {
            id: 'demo-user',
            email: 'demo@ejemplo.com',
            role: 'franchisee',
            full_name: 'Usuario Demo',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setUser(demoUser);
          
          const demoFranchisee = await getFranchiseeData('demo-user');
          setFranchisee(demoFranchisee);
          
          const demoRestaurants = await getRestaurantsData(demoFranchisee.id);
          setRestaurants(demoRestaurants);
        }
        
      } catch (error) {
        console.error('useFastAuth - Error in fast initialization:', error);
        
        // Fallback completo a datos estáticos
        const fallbackUser: User = {
          id: 'fallback-user',
          email: 'fallback@ejemplo.com',
          role: 'franchisee',
          full_name: 'Usuario Fallback',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(fallbackUser);
        
        const fallbackFranchisee = await getFranchiseeData('fallback-user');
        setFranchisee(fallbackFranchisee);
        
        const fallbackRestaurants = await getRestaurantsData(fallbackFranchisee.id);
        setRestaurants(fallbackRestaurants);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
    
    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useFastAuth - Auth state changed:', event);
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setFranchisee(null);
          setRestaurants([]);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return {
    user,
    franchisee,
    restaurants,
    loading,
    isUsingCache
  };
};
