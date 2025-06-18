
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
      console.log('🔍 DEBUG: No user found, skipping restaurant fetch');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 DEBUG: Starting restaurant fetch for user:', user.id);
      console.log('🔍 DEBUG: User email:', user.email);

      // PASO 1: Verificar si existe perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      console.log('🔍 DEBUG: Profile query result:', { profileData, profileError });

      if (profileError) {
        console.error('❌ DEBUG: Error fetching profile:', profileError);
        setError('Error al cargar el perfil del usuario');
        return;
      }

      if (!profileData) {
        console.log('❌ DEBUG: No profile found for user:', user.id);
        setError('No se encontró el perfil del usuario');
        return;
      }

      console.log('✅ DEBUG: Profile found:', profileData);

      // PASO 2: Buscar franquiciado asociado al usuario
      const { data: franchiseeData, error: franchiseeError } = await supabase
        .from('franchisees')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('🔍 DEBUG: Franchisee query result:', { franchiseeData, franchiseeError });

      if (franchiseeError) {
        console.error('❌ DEBUG: Error fetching franchisee:', franchiseeError);
        setError('Error al cargar información del franquiciado');
        return;
      }

      if (!franchiseeData) {
        console.log('❌ DEBUG: No franchisee found for user:', user.id);
        console.log('🔍 DEBUG: Will try to find by email in base_restaurants...');
        
        // PASO 3: Buscar por email en base_restaurants
        const { data: baseRestaurantsByEmail, error: baseEmailError } = await supabase
          .from('base_restaurants')
          .select('*')
          .eq('franchisee_email', user.email);

        console.log('🔍 DEBUG: Base restaurants by email:', { baseRestaurantsByEmail, baseEmailError });

        if (baseEmailError) {
          console.error('❌ DEBUG: Error searching base restaurants by email:', baseEmailError);
        }

        if (!baseRestaurantsByEmail || baseRestaurantsByEmail.length === 0) {
          console.log('❌ DEBUG: No restaurants found by email either');
          setError('No se encontraron restaurantes para este usuario');
          setRestaurants([]);
          return;
        }

        // Crear franquiciado automáticamente basado en los datos de base_restaurants
        const firstRestaurant = baseRestaurantsByEmail[0];
        console.log('🔍 DEBUG: Creating franchisee from restaurant data:', firstRestaurant);

        const { data: newFranchisee, error: createError } = await supabase
          .from('franchisees')
          .insert({
            user_id: user.id,
            franchisee_name: firstRestaurant.franchisee_name || user.email,
            company_name: firstRestaurant.franchisee_name || user.email,
            tax_id: firstRestaurant.company_tax_id
          })
          .select()
          .single();

        console.log('🔍 DEBUG: Created franchisee:', { newFranchisee, createError });

        if (createError) {
          console.error('❌ DEBUG: Error creating franchisee:', createError);
          setError('Error al crear el franquiciado');
          return;
        }

        // Usar el nuevo franquiciado
        const franchiseeToUse = newFranchisee;
        console.log('✅ DEBUG: Using newly created franchisee:', franchiseeToUse);

        // PASO 4: Asignar restaurantes al nuevo franquiciado
        for (const restaurant of baseRestaurantsByEmail) {
          try {
            const { error: assignError } = await supabase
              .from('franchisee_restaurants')
              .insert({
                franchisee_id: franchiseeToUse.id,
                base_restaurant_id: restaurant.id,
                status: 'active'
              });

            if (assignError) {
              console.log('⚠️ DEBUG: Restaurant already assigned or insert failed:', assignError);
            } else {
              console.log('✅ DEBUG: Assigned restaurant:', restaurant.restaurant_name);
            }
          } catch (insertError) {
            console.log('⚠️ DEBUG: Restaurant assignment error:', insertError);
          }
        }

        // Obtener restaurantes asignados
        const { data: assignedRestaurants, error: assignedError } = await supabase
          .from('franchisee_restaurants')
          .select(`
            *,
            base_restaurant:base_restaurants(*)
          `)
          .eq('franchisee_id', franchiseeToUse.id)
          .eq('status', 'active');

        console.log('🔍 DEBUG: Final assigned restaurants:', { assignedRestaurants, assignedError });

        if (assignedError) {
          console.error('❌ DEBUG: Error fetching assigned restaurants:', assignedError);
          setError('Error al cargar restaurantes asignados');
          return;
        }

        const typedRestaurants = assignedRestaurants as FranchiseeRestaurant[];
        console.log('✅ DEBUG: Final restaurants to display:', typedRestaurants);
        setRestaurants(typedRestaurants || []);
        return;
      }

      console.log('✅ DEBUG: Franchisee found:', franchiseeData);

      // PASO 5: Obtener restaurantes ya asignados
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
        .eq('franchisee_id', franchiseeData.id)
        .eq('status', 'active');

      console.log('🔍 DEBUG: Existing restaurants query:', { restaurantsData, restaurantsError });

      if (restaurantsError) {
        console.error('❌ DEBUG: Error fetching restaurants:', restaurantsError);
        setError('Error al cargar restaurantes');
        return;
      }

      if (!restaurantsData || restaurantsData.length === 0) {
        console.log('⚠️ DEBUG: No assigned restaurants found, searching by franchisee name');
        
        // PASO 6: Buscar restaurantes por nombre del franquiciado
        const { data: baseRestaurants, error: baseError } = await supabase
          .from('base_restaurants')
          .select('*')
          .ilike('franchisee_name', `%${franchiseeData.franchisee_name}%`);

        console.log('🔍 DEBUG: Base restaurants by name:', { baseRestaurants, baseError });

        if (baseError) {
          console.error('❌ DEBUG: Error fetching base restaurants:', baseError);
          setError('Error al buscar restaurantes base');
          return;
        }

        if (baseRestaurants && baseRestaurants.length > 0) {
          console.log(`✅ DEBUG: Found ${baseRestaurants.length} restaurants to assign`);
          
          // Asignar restaurantes automáticamente
          for (const baseRestaurant of baseRestaurants) {
            try {
              const { error: assignError } = await supabase
                .from('franchisee_restaurants')
                .insert({
                  franchisee_id: franchiseeData.id,
                  base_restaurant_id: baseRestaurant.id,
                  status: 'active'
                });

              if (assignError) {
                console.log('⚠️ DEBUG: Restaurant already assigned:', assignError);
              } else {
                console.log('✅ DEBUG: Auto-assigned restaurant:', baseRestaurant.restaurant_name);
              }
            } catch (insertError) {
              console.log('⚠️ DEBUG: Auto-assignment error:', insertError);
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

          console.log('🔍 DEBUG: Updated restaurants after auto-assignment:', { updatedRestaurants, updatedError });

          if (!updatedError && updatedRestaurants) {
            const typedRestaurants = updatedRestaurants as FranchiseeRestaurant[];
            console.log('✅ DEBUG: Final updated restaurants:', typedRestaurants);
            setRestaurants(typedRestaurants);
          }
        } else {
          console.log('❌ DEBUG: No restaurants found for franchisee');
          setRestaurants([]);
        }
      } else {
        const typedRestaurants = restaurantsData as FranchiseeRestaurant[];
        console.log('✅ DEBUG: Using existing restaurants:', typedRestaurants);
        setRestaurants(typedRestaurants);
      }

    } catch (error) {
      console.error('❌ DEBUG: Unexpected error in fetchRestaurants:', error);
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
