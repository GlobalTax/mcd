
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

      console.log('fetchFranchiseeDetail - Starting fetch for franchiseeId:', franchiseeId);

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

      console.log('fetchFranchiseeDetail - Franchisee data:', franchiseeData);
      setFranchisee(franchiseeData);

      // Obtener restaurantes del franquiciado - consulta corregida con todos los campos necesarios
      console.log('fetchFranchiseeDetail - Fetching restaurants for franchisee:', franchiseeId);
      
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurant_id(
            id,
            site_number,
            restaurant_name,
            address,
            city,
            state,
            postal_code,
            country,
            restaurant_type,
            property_type,
            autonomous_community,
            franchisee_name,
            franchisee_email,
            company_tax_id,
            square_meters,
            seating_capacity,
            opening_date,
            created_at,
            updated_at,
            created_by
          )
        `)
        .eq('franchisee_id', franchiseeId)
        .order('assigned_at', { ascending: false });

      if (restaurantsError) {
        console.error('Error fetching restaurants:', restaurantsError);
        toast.error('Error al cargar los restaurantes');
        setRestaurants([]);
      } else {
        console.log('fetchFranchiseeDetail - Restaurants data:', restaurantsData);
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
