
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FranchiseeRestaurant } from '@/types/franchiseeRestaurant';
import { toast } from 'sonner';

export const useFranchiseeRestaurants = () => {
  const { user, franchisee } = useAuth();
  const [restaurants, setRestaurants] = useState<FranchiseeRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    console.log('useFranchiseeRestaurants - fetchRestaurants started');
    console.log('useFranchiseeRestaurants - User:', user);
    console.log('useFranchiseeRestaurants - Franchisee:', franchisee);
    
    if (!user) {
      console.log('useFranchiseeRestaurants - No user found');
      setLoading(false);
      return;
    }

    if (user.role !== 'franchisee') {
      console.log('useFranchiseeRestaurants - User is not franchisee, role:', user.role);
      setError('Usuario no es franquiciado');
      setLoading(false);
      return;
    }

    if (!franchisee) {
      console.log('useFranchiseeRestaurants - No franchisee data found for user');
      setError('No se encontró información del franquiciado');
      setLoading(false);
      return;
    }

    // Si es un franchisee temporal (creado por timeout), no hacer consultas
    if (franchisee.id.startsWith('temp-')) {
      console.log('useFranchiseeRestaurants - Temporary franchisee detected, skipping database query');
      setRestaurants([]);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('useFranchiseeRestaurants - Fetching restaurants for franchisee:', franchisee.id);

      const { data, error } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurant_id (
            id,
            site_number,
            restaurant_name,
            address,
            city,
            state,
            postal_code,
            country,
            restaurant_type,
            square_meters,
            seating_capacity,
            franchisee_name,
            franchisee_email,
            company_tax_id,
            opening_date,
            property_type,
            autonomous_community,
            created_at,
            updated_at,
            created_by
          )
        `)
        .eq('franchisee_id', franchisee.id);

      console.log('useFranchiseeRestaurants - Query result:', { data, error });

      if (error) {
        console.error('Error fetching restaurants:', error);
        setError(`Error al cargar restaurantes: ${error.message}`);
        toast.error('Error al cargar restaurantes: ' + error.message);
        return;
      }

      console.log('useFranchiseeRestaurants - Setting restaurants:', data);
      setRestaurants(data || []);
      
      if (!data || data.length === 0) {
        console.log('useFranchiseeRestaurants - No restaurants found for franchisee');
        toast.info('No se encontraron restaurantes asignados');
      } else {
        console.log(`useFranchiseeRestaurants - Found ${data.length} restaurants`);
        toast.success(`Se cargaron ${data.length} restaurantes`);
      }
    } catch (err) {
      console.error('Error in fetchRestaurants:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los restaurantes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useFranchiseeRestaurants - useEffect triggered');
    fetchRestaurants();
  }, [user?.id, franchisee?.id]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants
  };
};
