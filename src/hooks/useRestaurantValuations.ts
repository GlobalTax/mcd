
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RestaurantValuation, ValuationScenario } from '@/types/restaurantValuation';
import { toast } from 'sonner';

export const useRestaurantValuations = () => {
  const { user } = useAuth();
  const [valuations, setValuations] = useState<RestaurantValuation[]>([]);
  const [scenarios, setScenarios] = useState<ValuationScenario[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchValuations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('restaurant_valuations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setValuations(data || []);
    } catch (error) {
      console.error('Error fetching valuations:', error);
      toast.error('Error al cargar las valoraciones');
    } finally {
      setLoading(false);
    }
  };

  const fetchScenarios = async (valuationId: string) => {
    try {
      const { data, error } = await supabase
        .from('valuation_scenarios')
        .select('*')
        .eq('valuation_id', valuationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setScenarios(data || []);
      return data || [];
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      toast.error('Error al cargar los escenarios');
      return [];
    }
  };

  const saveValuation = async (valuation: Omit<RestaurantValuation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('restaurant_valuations')
        .insert({
          ...valuation,
          created_by: user?.id
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Valoración guardada correctamente');
      await fetchValuations();
      return data;
    } catch (error) {
      console.error('Error saving valuation:', error);
      toast.error('Error al guardar la valoración');
      throw error;
    }
  };

  const updateValuation = async (id: string, updates: Partial<RestaurantValuation>) => {
    try {
      const { error } = await supabase
        .from('restaurant_valuations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Valoración actualizada correctamente');
      await fetchValuations();
    } catch (error) {
      console.error('Error updating valuation:', error);
      toast.error('Error al actualizar la valoración');
      throw error;
    }
  };

  const deleteValuation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('restaurant_valuations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Valoración eliminada correctamente');
      await fetchValuations();
    } catch (error) {
      console.error('Error deleting valuation:', error);
      toast.error('Error al eliminar la valoración');
      throw error;
    }
  };

  const saveScenario = async (scenario: Omit<ValuationScenario, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('valuation_scenarios')
        .insert(scenario)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Escenario guardado correctamente');
      await fetchScenarios(scenario.valuation_id);
      return data;
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast.error('Error al guardar el escenario');
      throw error;
    }
  };

  const deleteScenario = async (id: string, valuationId: string) => {
    try {
      const { error } = await supabase
        .from('valuation_scenarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Escenario eliminado correctamente');
      await fetchScenarios(valuationId);
    } catch (error) {
      console.error('Error deleting scenario:', error);
      toast.error('Error al eliminar el escenario');
      throw error;
    }
  };

  useEffect(() => {
    fetchValuations();
  }, []);

  return {
    valuations,
    scenarios,
    loading,
    fetchValuations,
    fetchScenarios,
    saveValuation,
    updateValuation,
    deleteValuation,
    saveScenario,
    deleteScenario
  };
};
