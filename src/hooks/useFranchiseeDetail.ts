
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Franchisee } from '@/types/auth';
import { FranchiseeRestaurant } from '@/types/franchiseeRestaurant';
import { toast } from 'sonner';

export const useFranchiseeDetail = (franchiseeId?: string) => {
  const { user } = useAuth();
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [restaurants, setRestaurants] = useState<FranchiseeRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFranchiseeDetail = async () => {
    if (!user || !franchiseeId) {
      setLoading(false);
      return;
    }

    if (user.role !== 'advisor' && user.role !== 'admin' && user.role !== 'superadmin') {
      setError('No tienes permisos para ver esta información');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Obtener información del franquiciado
      const { data: franchiseeData, error: franchiseeError } = await supabase
        .from('franchisees')
        .select(`
          *,
          profiles:user_id(email, full_name, phone)
        `)
        .eq('id', franchiseeId)
        .single();

      if (franchiseeError) {
        console.error('Error fetching franchisee:', franchiseeError);
        setError('Error al cargar la información del franquiciado');
        return;
      }

      if (!franchiseeData) {
        setError('Franquiciado no encontrado');
        return;
      }

      setFranchisee(franchiseeData);

      // Obtener restaurantes del franquiciado
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
        .eq('franchisee_id', franchiseeId)
        .order('assigned_at', { ascending: false });

      if (restaurantsError) {
        console.error('Error fetching restaurants:', restaurantsError);
        toast.error('Error al cargar los restaurantes');
      } else {
        setRestaurants(restaurantsData || []);
      }

    } catch (err) {
      console.error('Error in fetchFranchiseeDetail:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchiseeDetail();
  }, [user?.id, franchiseeId]);

  return {
    franchisee,
    restaurants,
    loading,
    error,
    refetch: fetchFranchiseeDetail
  };
};
