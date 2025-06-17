
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
    if (!user || user.role !== 'advisor') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('base_restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching base restaurants:', error);
        setError(error.message);
        return;
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
    fetchRestaurants();
  }, [user?.id]);

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
