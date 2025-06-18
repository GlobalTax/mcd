
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { FranchiseeRestaurant } from '@/types/franchiseeRestaurant';
import { toast } from 'sonner';

export const useFranchiseeRestaurants = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<FranchiseeRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    if (!user?.id) {
      console.log('No user found, skipping restaurant fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching restaurants for user:', user.id);

      // Primero, obtener el franquiciado asociado al usuario actual
      const { data: franchiseeData, error: franchiseeError } = await supabase
        .from('franchisees')
        .select('id, franchisee_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (franchiseeError) {
        console.error('Error fetching franchisee:', franchiseeError);
        setError('Error al cargar información del franquiciado');
        return;
      }

      if (!franchiseeData) {
        console.log('No franchisee found for user:', user.id);
        setRestaurants([]);
        return;
      }

      console.log('Found franchisee:', franchiseeData);

      // Obtener los restaurantes asignados a este franquiciado con su información base
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
        .eq('franchisee_id', franchiseeData.id)
        .eq('status', 'active');

      if (restaurantsError) {
        console.error('Error fetching restaurants:', restaurantsError);
        setError('Error al cargar restaurantes');
        return;
      }

      console.log('Found restaurants data:', restaurantsData);

      // Si no hay restaurantes asignados directamente, buscar por nombre del franquiciado
      if (!restaurantsData || restaurantsData.length === 0) {
        console.log('No assigned restaurants found, searching by franchisee name');
        
        // Buscar restaurantes base que coincidan con el nombre del franquiciado
        const { data: baseRestaurants, error: baseError } = await supabase
          .from('base_restaurants')
          .select('*')
          .ilike('franchisee_name', `%${franchiseeData.franchisee_name}%`);

        if (baseError) {
          console.error('Error fetching base restaurants:', baseError);
          setError('Error al buscar restaurantes base');
          return;
        }

        console.log('Found base restaurants by name:', baseRestaurants);

        // Crear asignaciones automáticas si encontramos restaurantes
        if (baseRestaurants && baseRestaurants.length > 0) {
          for (const baseRestaurant of baseRestaurants) {
            try {
              await supabase
                .from('franchisee_restaurants')
                .insert({
                  franchisee_id: franchiseeData.id,
                  base_restaurant_id: baseRestaurant.id,
                  status: 'active'
                });
            } catch (insertError) {
              console.log('Restaurant already assigned or insert failed:', insertError);
            }
          }

          // Volver a cargar después de las asignaciones automáticas
          const { data: updatedRestaurants, error: updatedError } = await supabase
            .from('franchisee_restaurants')
            .select(`
              *,
              base_restaurant:base_restaurants(*)
            `)
            .eq('franchisee_id', franchiseeData.id)
            .eq('status', 'active');

          if (!updatedError && updatedRestaurants) {
            const typedRestaurants = updatedRestaurants as FranchiseeRestaurant[];
            console.log('Updated restaurants after auto-assignment:', typedRestaurants);
            setRestaurants(typedRestaurants);
          }
        } else {
          console.log('No restaurants found for franchisee');
          setRestaurants([]);
        }
      } else {
        const typedRestaurants = restaurantsData as FranchiseeRestaurant[];
        console.log('Setting restaurants:', typedRestaurants);
        setRestaurants(typedRestaurants);
      }

    } catch (error) {
      console.error('Error in fetchRestaurants:', error);
      setError('Error inesperado al cargar restaurantes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [user?.id]);

  const refetch = () => {
    fetchRestaurants();
  };

  return {
    restaurants,
    loading,
    error,
    refetch
  };
};
