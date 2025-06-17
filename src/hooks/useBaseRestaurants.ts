
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { BaseRestaurant } from '@/types/franchiseeRestaurant';
import { toast } from 'sonner';

export const useBaseRestaurants = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<BaseRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    if (!user || !['advisor', 'admin', 'superadmin'].includes(user.role)) {
      console.log('User role not authorized for base restaurants:', user?.role);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('=== DEBUGGING RESTAURANTS FETCH ===');
      console.log('Fetching base restaurants for user:', user.id, 'with role:', user.role);

      // Verificar la sesión actual
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Current session user:', sessionData.session?.user?.id);
      console.log('Session user email:', sessionData.session?.user?.email);
      console.log('User role in hook:', user.role);

      // Verificar el perfil del usuario directamente
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Profile data:', profileData);
      console.log('Profile error:', profileError);

      // Intentar obtener todos los restaurantes sin filtros primero
      console.log('Attempting to fetch restaurants...');
      const { data, error, count } = await supabase
        .from('base_restaurants')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      console.log('Raw query result:');
      console.log('- Data:', data);
      console.log('- Count:', count);
      console.log('- Error:', error);

      if (error) {
        console.error('Error fetching base restaurants:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        setError(error.message);
        return;
      }

      console.log('Successfully fetched restaurants:', data?.length || 0, 'restaurants');
      if (data && data.length > 0) {
        console.log('Sample restaurant data:', data.slice(0, 2));
      } else {
        console.log('No restaurants found in database');
        
        // Verificar si hay datos en la tabla sin RLS
        const { count: totalCount } = await supabase
          .from('base_restaurants')
          .select('*', { count: 'exact', head: true });
        console.log('Total restaurants in table (ignoring RLS):', totalCount);
      }
      
      setRestaurants(data || []);
    } catch (err) {
      console.error('Error in fetchRestaurants:', err);
      setError('Error al cargar los restaurantes');
    } finally {
      setLoading(false);
    }
  };

  const createRestaurant = async (restaurantData: Omit<BaseRestaurant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('base_restaurants')
        .insert({
          ...restaurantData,
          created_by: user?.id
        });

      if (error) {
        toast.error('Error al crear el restaurante');
        return false;
      }

      toast.success('Restaurante creado correctamente');
      await fetchRestaurants();
      return true;
    } catch (err) {
      console.error('Error creating restaurant:', err);
      toast.error('Error al crear el restaurante');
      return false;
    }
  };

  const updateRestaurant = async (restaurantId: string, updates: Partial<BaseRestaurant>) => {
    try {
      const { error } = await supabase
        .from('base_restaurants')
        .update(updates)
        .eq('id', restaurantId);

      if (error) {
        toast.error('Error al actualizar el restaurante');
        return false;
      }

      toast.success('Restaurante actualizado correctamente');
      await fetchRestaurants();
      return true;
    } catch (err) {
      console.error('Error updating restaurant:', err);
      toast.error('Error al actualizar el restaurante');
      return false;
    }
  };

  const deleteRestaurant = async (restaurantId: string) => {
    try {
      const { error } = await supabase
        .from('base_restaurants')
        .delete()
        .eq('id', restaurantId);

      if (error) {
        toast.error('Error al eliminar el restaurante');
        return false;
      }

      toast.success('Restaurante eliminado correctamente');
      await fetchRestaurants();
      return true;
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      toast.error('Error al eliminar el restaurante');
      return false;
    }
  };

  useEffect(() => {
    console.log('useBaseRestaurants useEffect triggered, user:', user?.id, 'role:', user?.role);
    fetchRestaurants();
  }, [user?.id, user?.role]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant
  };
};
