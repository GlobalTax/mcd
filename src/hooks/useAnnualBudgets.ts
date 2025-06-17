
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface AnnualBudgetData {
  id: string;
  restaurant_id: string;
  year: number;
  category: string;
  subcategory?: string;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export const useAnnualBudgets = () => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<AnnualBudgetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = async (restaurantId: string, year: number) => {
    if (!user || !restaurantId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: budgetError } = await supabase
        .from('annual_budgets')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('year', year)
        .order('category', { ascending: true })
        .order('subcategory', { ascending: true });

      if (budgetError) {
        console.error('Error fetching annual budgets:', budgetError);
        setError(`Error al cargar los presupuestos: ${budgetError.message}`);
        toast.error('Error al cargar los presupuestos: ' + budgetError.message);
        return;
      }

      setBudgets(data || []);
      console.log(`Loaded ${data?.length || 0} budget entries for restaurant ${restaurantId}, year ${year}`);
      
    } catch (err) {
      console.error('Error in fetchBudgets:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los presupuestos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const saveBudgets = async (restaurantId: string, year: number, budgetData: any[]): Promise<boolean> => {
    if (!user) return false;

    try {
      setLoading(true);

      // Convertir los datos del grid al formato de la base de datos
      const budgetEntries = budgetData
        .filter(item => !item.isCategory) // Solo guardar elementos, no categorías
        .map(item => ({
          restaurant_id: restaurantId,
          year: year,
          category: item.category,
          subcategory: item.subcategory,
          jan: item.jan || 0,
          feb: item.feb || 0,
          mar: item.mar || 0,
          apr: item.apr || 0,
          may: item.may || 0,
          jun: item.jun || 0,
          jul: item.jul || 0,
          aug: item.aug || 0,
          sep: item.sep || 0,
          oct: item.oct || 0,
          nov: item.nov || 0,
          dec: item.dec || 0,
          created_by: user.id
        }));

      // Primero eliminar los registros existentes para este restaurante y año
      const { error: deleteError } = await supabase
        .from('annual_budgets')
        .delete()
        .eq('restaurant_id', restaurantId)
        .eq('year', year);

      if (deleteError) {
        console.error('Error deleting existing budgets:', deleteError);
        toast.error('Error al actualizar el presupuesto: ' + deleteError.message);
        return false;
      }

      // Insertar los nuevos registros
      const { error: insertError } = await supabase
        .from('annual_budgets')
        .insert(budgetEntries);

      if (insertError) {
        console.error('Error inserting budgets:', insertError);
        toast.error('Error al guardar el presupuesto: ' + insertError.message);
        return false;
      }

      toast.success('Presupuesto guardado correctamente');
      await fetchBudgets(restaurantId, year); // Recargar datos
      return true;

    } catch (err) {
      console.error('Error saving budgets:', err);
      toast.error('Error al guardar el presupuesto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    saveBudgets
  };
};
