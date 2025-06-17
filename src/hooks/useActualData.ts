
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export interface ActualData {
  id: string;
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
  total: number;
}

export const useActualData = () => {
  const { user } = useAuth();
  const [actualData, setActualData] = useState<ActualData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActualData = useCallback(async (restaurantId: string, year: number) => {
    if (!user || !restaurantId) return;

    try {
      setLoading(true);
      setError(null);

      // Obtener datos reales de profit_loss_data agrupados por categoría/subcategoría
      const { data, error: queryError } = await supabase
        .from('profit_loss_data')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('year', year);

      if (queryError) {
        console.error('Error fetching actual data:', queryError);
        setError('Error al cargar los datos reales');
        return;
      }

      if (!data || data.length === 0) {
        setActualData([]);
        return;
      }

      // Agrupar datos por categorías similares al presupuesto
      const groupedData: { [key: string]: ActualData } = {};

      data.forEach(record => {
        const categories = [
          { key: 'Ingresos por Ventas', subcategory: 'Ventas Netas', value: record.net_sales },
          { key: 'Ingresos por Ventas', subcategory: 'Otros Ingresos', value: record.other_revenue },
          { key: 'Costos de Ventas', subcategory: 'Costo de Alimentos', value: record.food_cost },
          { key: 'Costos de Ventas', subcategory: 'Costo de Papel', value: record.paper_cost },
          { key: 'Gastos de Personal', subcategory: 'Trabajo de Gestión', value: record.management_labor },
          { key: 'Gastos de Personal', subcategory: 'Trabajo de Equipo', value: record.crew_labor },
          { key: 'Gastos de Personal', subcategory: 'Beneficios', value: record.benefits },
          { key: 'Gastos Operativos', subcategory: 'Alquiler', value: record.rent },
          { key: 'Gastos Operativos', subcategory: 'Servicios Públicos', value: record.utilities },
          { key: 'Gastos Operativos', subcategory: 'Mantenimiento', value: record.maintenance },
          { key: 'Gastos Operativos', subcategory: 'Publicidad', value: record.advertising },
          { key: 'Gastos Operativos', subcategory: 'Seguro', value: record.insurance },
          { key: 'Gastos Operativos', subcategory: 'Suministros', value: record.supplies },
          { key: 'Gastos Operativos', subcategory: 'Otros Gastos', value: record.other_expenses },
          { key: 'Tarifas McDonald\'s', subcategory: 'Tarifa de Franquicia', value: record.franchise_fee },
          { key: 'Tarifas McDonald\'s', subcategory: 'Tarifa de Publicidad', value: record.advertising_fee },
          { key: 'Tarifas McDonald\'s', subcategory: 'Porcentaje de Alquiler', value: record.rent_percentage }
        ];

        categories.forEach(cat => {
          const key = `${cat.key}-${cat.subcategory}`;
          if (!groupedData[key]) {
            groupedData[key] = {
              id: key,
              category: cat.key,
              subcategory: cat.subcategory,
              jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
              jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
              total: 0
            };
          }

          const monthKey = getMonthKey(record.month);
          if (monthKey) {
            // Arreglar el error de tipo usando una aserción de tipo más específica
            const currentValue = groupedData[key][monthKey as keyof Omit<ActualData, 'id' | 'category' | 'subcategory' | 'total'>] as number;
            (groupedData[key] as any)[monthKey] = currentValue + (cat.value || 0);
          }
        });
      });

      // Calcular totales
      Object.values(groupedData).forEach(item => {
        item.total = item.jan + item.feb + item.mar + item.apr + item.may + item.jun +
                    item.jul + item.aug + item.sep + item.oct + item.nov + item.dec;
      });

      setActualData(Object.values(groupedData));

    } catch (err) {
      console.error('Error in fetchActualData:', err);
      setError('Error al cargar los datos reales');
      toast.error('Error al cargar los datos reales');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getMonthKey = (month: number): string | null => {
    const monthMap: { [key: number]: string } = {
      1: 'jan', 2: 'feb', 3: 'mar', 4: 'apr', 5: 'may', 6: 'jun',
      7: 'jul', 8: 'aug', 9: 'sep', 10: 'oct', 11: 'nov', 12: 'dec'
    };
    return monthMap[month] || null;
  };

  return {
    actualData,
    loading,
    error,
    fetchActualData
  };
};
