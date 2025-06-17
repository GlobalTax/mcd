
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

    console.log('fetchFranchisees - User role:', user.role);

    if (user.role !== 'advisor' && user.role !== 'admin' && user.role !== 'superadmin') {
      console.log('fetchFranchisees - User role is not advisor/admin/superadmin:', user.role);
      setError('No tienes permisos para ver los franquiciados');
      toast.error('No tienes permisos para ver los franquiciados');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('fetchFranchisees - Making Supabase query');
      
      // Primero verificamos cuántos franquiciados hay en total
      const { count, error: countError } = await supabase
        .from('franchisees')
        .select('*', { count: 'exact', head: true });

      console.log('fetchFranchisees - Total count:', count, 'Error:', countError);

      if (countError) {
        console.error('fetchFranchisees - Count query failed:', countError);
        setError(`Error contando franquiciados: ${countError.message}`);
        toast.error(`Error contando franquiciados: ${countError.message}`);
        setLoading(false);
        return;
      }

      // Consulta simple primero para ver si hay datos
      console.log('fetchFranchisees - Fetching simple data');
      const { data: simpleData, error: simpleError } = await supabase
        .from('franchisees')
        .select('id, franchisee_name, company_name, city, created_at')
        .order('created_at', { ascending: false });

      console.log('fetchFranchisees - Simple query result:', { 
        count: simpleData?.length, 
        error: simpleError,
        sample: simpleData?.slice(0, 3)
      });

      if (simpleError) {
        console.error('fetchFranchisees - Simple query failed:', simpleError);
        setError(`Error en consulta simple: ${simpleError.message}`);
        toast.error(`Error en consulta simple: ${simpleError.message}`);
        setLoading(false);
        return;
      }

      // Ahora hacemos la consulta completa con joins
      console.log('fetchFranchisees - Fetching complete data with joins');
      const { data, error } = await supabase
        .from('franchisees')
        .select(`
          *,
          profiles:user_id(email, full_name)
        `)
        .order('created_at', { ascending: false });

      console.log('fetchFranchisees - Full query result:', { 
        count: data?.length, 
        error: error,
        totalInDB: count,
        sample: data?.slice(0, 2)
      });

      if (error) {
        console.error('Error fetching franchisees:', error);
        setError(`Error en consulta completa: ${error.message}`);
        toast.error('Error al cargar los franquiciados: ' + error.message);
        
        // Usar datos simples como fallback
        if (simpleData && simpleData.length > 0) {
          console.log('fetchFranchisees - Using simple data as fallback');
          const fallbackData = simpleData.map(item => ({
            ...item,
            user_id: '',
            company_name: item.company_name || '',
            tax_id: '',
            address: '',
            state: '',
            postal_code: '',
            country: 'España',
            updated_at: item.created_at,
            total_restaurants: 0,
            profiles: null
          })) as Franchisee[];
          
          setFranchisees(fallbackData);
          toast.warning(`Usando datos básicos. Total en BD: ${count}, Mostrando: ${fallbackData.length}`);
        }
        setLoading(false);
        return;
      }

      console.log('fetchFranchisees - Setting franchisees data:', data);
      setFranchisees(data || []);
      
      if (!data || data.length === 0) {
        console.log('fetchFranchisees - No franchisees found in database');
        toast.warning(`No se encontraron franquiciados. Total en BD: ${count}`);
      } else {
        console.log(`fetchFranchisees - Found ${data.length} franchisees`);
        toast.success(`Se cargaron ${data.length} de ${count} franquiciados totales`);
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
