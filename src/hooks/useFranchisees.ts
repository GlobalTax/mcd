
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Franchisee } from '@/types/auth';
import { toast } from 'sonner';

export const useFranchisees = () => {
  const { user } = useAuth();
  const [franchisees, setFranchisees] = useState<Franchisee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFranchisees = async () => {
    console.log('fetchFranchisees - Starting fetch, user:', user);
    
    if (!user) {
      console.log('fetchFranchisees - No user found');
      setLoading(false);
      return;
    }

    if (user.role !== 'advisor' && user.role !== 'admin' && user.role !== 'superadmin') {
      console.log('fetchFranchisees - User role is not authorized:', user.role);
      setError('No tienes permisos para ver los franquiciados');
      toast.error('No tienes permisos para ver los franquiciados');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('fetchFranchisees - Making Supabase query');
      
      const { data, error } = await supabase
        .from('franchisees')
        .select(`
          *,
          profiles:user_id(email, full_name)
        `)
        .order('created_at', { ascending: false });

      console.log('fetchFranchisees - Query result:', { 
        count: data?.length, 
        error: error,
        sample: data?.slice(0, 2)
      });

      if (error) {
        console.error('Error fetching franchisees:', error);
        setError(`Error al cargar los franquiciados: ${error.message}`);
        toast.error('Error al cargar los franquiciados: ' + error.message);
        setLoading(false);
        return;
      }

      console.log('fetchFranchisees - Setting franchisees data:', data);
      setFranchisees(data || []);
      
      if (!data || data.length === 0) {
        console.log('fetchFranchisees - No franchisees found in database');
        toast.info('No se encontraron franquiciados');
      } else {
        console.log(`fetchFranchisees - Found ${data.length} franchisees`);
        toast.success(`Se cargaron ${data.length} franquiciados`);
      }
    } catch (err) {
      console.error('Error in fetchFranchisees:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los franquiciados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const assignRestaurant = async (franchiseeId: string, baseRestaurantId: string) => {
    try {
      const { error } = await supabase
        .from('franchisee_restaurants')
        .insert({
          franchisee_id: franchiseeId,
          base_restaurant_id: baseRestaurantId,
          status: 'active'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Este restaurante ya está asignado a este franquiciado');
        } else {
          toast.error('Error al asignar el restaurante');
        }
        return false;
      }

      toast.success('Restaurante asignado correctamente');
      return true;
    } catch (err) {
      console.error('Error assigning restaurant:', err);
      toast.error('Error al asignar el restaurante');
      return false;
    }
  };

  useEffect(() => {
    console.log('useFranchisees useEffect triggered, user:', user);
    fetchFranchisees();
  }, [user?.id, user?.role]);

  return {
    franchisees,
    loading,
    error,
    refetch: fetchFranchisees,
    assignRestaurant
  };
};
