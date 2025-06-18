
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Franchisee } from '@/types/auth';
import { FranchiseeRestaurant } from '@/types/franchiseeRestaurant';
import { toast } from 'sonner';

interface FranchiseeWithStatus extends Franchisee {
  hasAccount?: boolean;
  lastAccess?: string;
  isOnline?: boolean;
}

export const useFranchiseeDetail = (franchiseeId?: string) => {
  const { user } = useAuth();
  const [franchisee, setFranchisee] = useState<FranchiseeWithStatus | null>(null);
  const [restaurants, setRestaurants] = useState<FranchiseeRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFranchiseeDetail = async () => {
    if (!user || !franchiseeId) {
      setError('Parámetros faltantes');
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
      
      // Limpiar datos anteriores
      setFranchisee(null);
      setRestaurants([]);

      console.log('fetchFranchiseeDetail - Starting fetch for franchiseeId:', franchiseeId);

      // Obtener información del franquiciado con manejo de errores mejorado
      const { data: franchiseeData, error: franchiseeError } = await supabase
        .from('franchisees')
        .select(`
          *,
          profiles:user_id(email, full_name, phone)
        `)
        .eq('id', franchiseeId)
        .maybeSingle();

      if (franchiseeError) {
        console.error('Error fetching franchisee:', franchiseeError);
        setError(`Error al cargar la información del franquiciado: ${franchiseeError.message}`);
        return;
      }

      if (!franchiseeData) {
        console.error('Franchisee not found with ID:', franchiseeId);
        setError('Franquiciado no encontrado');
        return;
      }

      // Verificar si el franquiciado tiene cuenta (está en profiles)
      const hasAccount = !!franchiseeData.profiles;
      
      // Obtener último acceso
      let lastAccess = null;
      let isOnline = false;
      
      if (hasAccount) {
        const { data: accessData, error: accessError } = await supabase
          .from('franchisee_access_log')
          .select('login_time, logout_time')
          .eq('franchisee_id', franchiseeId)
          .order('login_time', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (accessError) {
          console.error('Error fetching access data:', accessError);
        } else if (accessData) {
          lastAccess = accessData.login_time;
          // Consideramos online si no hay logout_time en la última sesión y fue hace menos de 30 minutos
          if (!accessData.logout_time) {
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
            isOnline = new Date(accessData.login_time) > thirtyMinutesAgo;
          }
        }
      }

      console.log('fetchFranchiseeDetail - Franchisee data:', franchiseeData);
      setFranchisee({
        ...franchiseeData,
        hasAccount,
        lastAccess,
        isOnline
      });

      // Buscar restaurantes - primero intentar con el nombre del franquiciado en base_restaurants
      console.log('fetchFranchiseeDetail - Searching restaurants by franchisee_name:', franchiseeData.franchisee_name);
      
      const { data: baseRestaurantsData, error: baseRestaurantsError } = await supabase
        .from('base_restaurants')
        .select('*')
        .eq('franchisee_name', franchiseeData.franchisee_name);

      if (baseRestaurantsError) {
        console.error('Error fetching base restaurants by name:', baseRestaurantsError);
      } else if (baseRestaurantsData && baseRestaurantsData.length > 0) {
        console.log('fetchFranchiseeDetail - Found base restaurants by name:', baseRestaurantsData);
        
        // Convertir base_restaurants a formato FranchiseeRestaurant
        const convertedRestaurants = baseRestaurantsData.map(restaurant => ({
          id: restaurant.id,
          franchisee_id: franchiseeId,
          base_restaurant_id: restaurant.id,
          franchise_start_date: restaurant.opening_date,
          franchise_end_date: undefined,
          lease_start_date: undefined,
          lease_end_date: undefined,
          monthly_rent: undefined,
          franchise_fee_percentage: undefined,
          advertising_fee_percentage: undefined,
          last_year_revenue: undefined,
          average_monthly_sales: undefined,
          status: 'active' as const,
          notes: undefined,
          assigned_at: restaurant.created_at,
          updated_at: restaurant.updated_at,
          base_restaurant: {
            id: restaurant.id,
            site_number: restaurant.site_number,
            restaurant_name: restaurant.restaurant_name,
            address: restaurant.address,
            city: restaurant.city,
            state: restaurant.state,
            postal_code: restaurant.postal_code,
            country: restaurant.country,
            restaurant_type: restaurant.restaurant_type,
            property_type: restaurant.property_type,
            autonomous_community: restaurant.autonomous_community || restaurant.state,
            franchisee_name: restaurant.franchisee_name,
            franchisee_email: restaurant.franchisee_email,
            company_tax_id: restaurant.company_tax_id,
            square_meters: restaurant.square_meters,
            seating_capacity: restaurant.seating_capacity,
            opening_date: restaurant.opening_date,
            created_at: restaurant.created_at,
            updated_at: restaurant.updated_at,
            created_by: restaurant.created_by
          }
        }));
        
        console.log('fetchFranchiseeDetail - Setting restaurants from base_restaurants:', convertedRestaurants.length);
        setRestaurants(convertedRestaurants);
        return;
      }

      // Si no encontramos por nombre, intentar obtener restaurantes de franchisee_restaurants
      console.log('fetchFranchiseeDetail - Fetching from franchisee_restaurants table for franchisee:', franchiseeId);
      
      const { data: franchiseeRestaurantsData, error: franchiseeRestaurantsError } = await supabase
        .from('franchisee_restaurants')
        .select(`
          id,
          franchisee_id,
          base_restaurant_id,
          franchise_start_date,
          franchise_end_date,
          lease_start_date,
          lease_end_date,
          monthly_rent,
          franchise_fee_percentage,
          advertising_fee_percentage,
          last_year_revenue,
          average_monthly_sales,
          status,
          notes,
          assigned_at,
          updated_at,
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

      if (franchiseeRestaurantsError) {
        console.error('Error fetching franchisee restaurants:', franchiseeRestaurantsError);
        // No mostrar error aquí, solo log
        setRestaurants([]);
      } else {
        console.log('fetchFranchiseeDetail - Franchisee restaurants data:', franchiseeRestaurantsData);
        const processedRestaurants = (franchiseeRestaurantsData || []).map(restaurant => ({
          ...restaurant,
          base_restaurant: restaurant.base_restaurant || null
        }));
        
        console.log('fetchFranchiseeDetail - Setting restaurants from franchisee_restaurants:', processedRestaurants.length);
        setRestaurants(processedRestaurants);
      }

    } catch (err) {
      console.error('Error in fetchFranchiseeDetail:', err);
      setError('Error al cargar los datos del franquiciado');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useFranchiseeDetail - useEffect triggered with:', { userId: user?.id, franchiseeId });
    if (franchiseeId) {
      fetchFranchiseeDetail();
    } else {
      setError('ID del franquiciado no proporcionado');
      setLoading(false);
    }
  }, [user?.id, franchiseeId]);

  console.log('useFranchiseeDetail - Current state:', { 
    franchisee: franchisee?.franchisee_name, 
    restaurantsCount: restaurants.length,
    loading,
    error 
  });

  return {
    franchisee,
    restaurants,
    loading,
    error,
    refetch: fetchFranchiseeDetail
  };
};
