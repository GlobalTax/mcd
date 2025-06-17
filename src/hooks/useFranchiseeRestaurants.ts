
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FranchiseeRestaurant } from '@/types/franchiseeRestaurant';
import { toast } from 'sonner';

export const useFranchiseeRestaurants = () => {
  const { franchisee } = useAuth();
  const [restaurants, setRestaurants] = useState<FranchiseeRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRestaurants = async () => {
    if (!franchisee?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
        .eq('franchisee_id', franchisee.id)
        .order('assigned_at', { ascending: false });

      if (error) {
        console.error('Error fetching franchisee restaurants:', error);
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

  const updateRestaurant = async (restaurantId: string, updates: Partial<FranchiseeRestaurant>) => {
    try {
      const { error } = await supabase
        .from('franchisee_restaurants')
        .update(updates)
        .eq('id', restaurantId);

      if (error) {
        toast.error('Error al actualizar el restaurante');
        return false;
      }

      toast.success('Restaurante actualizado correctamente');
      await fetchRestaurants(); // Recargar la lista
      return true;
    } catch (err) {
      console.error('Error updating restaurant:', err);
      toast.error('Error al actualizar el restaurante');
      return false;
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [franchisee?.id]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchRestaurants,
    updateRestaurant
  };
};
