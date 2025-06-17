
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
      console.log('fetchFranchisees - User role is not advisor/admin/superadmin:', user.role);
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

      console.log('fetchFranchisees - Supabase response:', { data, error });

      if (error) {
        console.error('Error fetching franchisees:', error);
        setError(error.message);
        toast.error('Error al cargar los franquiciados: ' + error.message);
        return;
      }

      console.log('fetchFranchisees - Setting franchisees data:', data);
      setFranchisees(data || []);
      
      if (!data || data.length === 0) {
        console.log('fetchFranchisees - No franchisees found');
        toast.info('No se encontraron franquiciados en el sistema');
      } else {
        console.log(`fetchFranchisees - Found ${data.length} franchisees`);
      }
    } catch (err) {
      console.error('Error in fetchFranchisees:', err);
      setError('Error al cargar los franquiciados');
      toast.error('Error al cargar los franquiciados');
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
