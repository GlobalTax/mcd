
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
      
      // Convert Supabase data to our types
      const typedValuations: RestaurantValuation[] = (data || []).map(item => ({
        ...item,
        yearly_data: Array.isArray(item.yearly_data) ? item.yearly_data : [],
        projections: item.projections || null
      }));
      
      setValuations(typedValuations);
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
      
      // Convert Supabase data to our types
      const typedScenarios: ValuationScenario[] = (data || []).map(item => ({
        ...item,
        yearly_modifications: typeof item.yearly_modifications === 'object' ? item.yearly_modifications : {},
        projections: item.projections || null
      }));
      
      setScenarios(typedScenarios);
      return typedScenarios;
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      toast.error('Error al cargar los escenarios');
      return [];
    }
  };

  const saveValuation = async (valuation: Omit<RestaurantValuation, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Convert our types to Supabase format
      const supabaseData = {
        restaurant_id: valuation.restaurant_id,
        restaurant_name: valuation.restaurant_name,
        valuation_name: valuation.valuation_name,
        valuation_date: valuation.valuation_date,
        change_date: valuation.change_date,
        franchise_end_date: valuation.franchise_end_date,
        remaining_years: valuation.remaining_years,
        inflation_rate: valuation.inflation_rate,
        discount_rate: valuation.discount_rate,
        growth_rate: valuation.growth_rate,
        yearly_data: valuation.yearly_data,
        total_present_value: valuation.total_present_value,
        projections: valuation.projections,
        created_by: user?.id
      };

      const { data, error } = await supabase
        .from('restaurant_valuations')
        .insert(supabaseData)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Valoración guardada correctamente');
      await fetchValuations();
      
      // Convert back to our type
      const typedData: RestaurantValuation = {
        ...data,
        yearly_data: Array.isArray(data.yearly_data) ? data.yearly_data : [],
        projections: data.projections || null
      };
      
      return typedData;
    } catch (error) {
      console.error('Error saving valuation:', error);
      toast.error('Error al guardar la valoración');
      throw error;
    }
  };

  const updateValuation = async (id: string, updates: Partial<RestaurantValuation>) => {
    try {
      // Convert updates to Supabase format
      const supabaseUpdates: any = { ...updates };
      if (updates.yearly_data) {
        supabaseUpdates.yearly_data = updates.yearly_data;
      }
      if (updates.projections) {
        supabaseUpdates.projections = updates.projections;
      }

      const { error } = await supabase
        .from('restaurant_valuations')
        .update(supabaseUpdates)
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
        .insert({
          ...scenario,
          yearly_modifications: scenario.yearly_modifications || {}
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Escenario guardado correctamente');
      await fetchScenarios(scenario.valuation_id);
      
      // Convert back to our type
      const typedData: ValuationScenario = {
        ...data,
        yearly_modifications: typeof data.yearly_modifications === 'object' ? data.yearly_modifications : {},
        projections: data.projections || null
      };
      
      return typedData;
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
