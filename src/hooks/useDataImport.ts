
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RestaurantData {
  site: string;
  nombre: string;
  estado: string;
  tipoInmueble: string;
  direccion: string;
  telRestaurante: string;
  municipio: string;
  provincia: string;
  comAutonoma: string;
  franquiciado: string;
  telfFranquiciado: string;
  fechaApertura: string;
  mailFranquiciado: string;
  nifSociedad: string;
}

export const useDataImport = () => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const importRestaurantsData = async (data: RestaurantData[]) => {
    setImporting(true);
    setProgress(0);

    try {
      const total = data.length;
      let processed = 0;

      for (const restaurant of data) {
        // Crear/obtener franquiciado
        let franchiseeId = await createOrGetFranchisee(restaurant);
        
        // Crear restaurante base
        if (franchiseeId) {
          await createBaseRestaurant(restaurant, franchiseeId);
        }

        processed++;
        setProgress((processed / total) * 100);
      }

      toast.success(`Se importaron ${total} restaurantes correctamente`);
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Error al importar los datos');
    } finally {
      setImporting(false);
      setProgress(0);
    }
  };

  const createOrGetFranchisee = async (restaurant: RestaurantData) => {
    try {
      // Verificar si el franquiciado ya existe
      const { data: existingFranchisee } = await supabase
        .from('franchisees')
        .select('id')
        .eq('franchisee_name', restaurant.franquiciado)
        .maybeSingle();

      if (existingFranchisee) {
        return existingFranchisee.id;
      }

      // Crear nuevo franquiciado
      const { data: newFranchisee, error } = await supabase
        .from('franchisees')
        .insert({
          franchisee_name: restaurant.franquiciado,
          company_name: restaurant.franquiciado,
          address: restaurant.direccion,
          city: restaurant.municipio,
          state: restaurant.provincia,
          country: 'España',
          tax_id: restaurant.nifSociedad || null,
          user_id: '00000000-0000-0000-0000-000000000000' // Placeholder UUID
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating franchisee:', error);
        return null;
      }

      return newFranchisee.id;
    } catch (error) {
      console.error('Error in createOrGetFranchisee:', error);
      return null;
    }
  };

  const createBaseRestaurant = async (restaurant: RestaurantData, franchiseeId: string) => {
    try {
      // Verificar si el restaurante ya existe
      const { data: existingRestaurant } = await supabase
        .from('base_restaurants')
        .select('id')
        .eq('site_number', restaurant.site)
        .maybeSingle();

      if (existingRestaurant) {
        return;
      }

      // Mapear tipo de restaurante
      const restaurantTypeMap: { [key: string]: string } = {
        'Instore': 'traditional',
        'Mall': 'mall',
        'Free-Standing': 'drive_thru'
      };

      // Crear restaurante base
      const { error: restaurantError } = await supabase
        .from('base_restaurants')
        .insert({
          site_number: restaurant.site,
          restaurant_name: restaurant.nombre,
          address: restaurant.direccion,
          city: restaurant.municipio,
          state: restaurant.provincia,
          country: 'España',
          restaurant_type: restaurantTypeMap[restaurant.tipoInmueble] || 'traditional'
        });

      if (restaurantError) {
        console.error('Error creating base restaurant:', restaurantError);
        return;
      }

      // Obtener el ID del restaurante recién creado
      const { data: createdRestaurant } = await supabase
        .from('base_restaurants')
        .select('id')
        .eq('site_number', restaurant.site)
        .single();

      if (createdRestaurant) {
        // Crear asignación de restaurante a franquiciado
        await supabase
          .from('franchisee_restaurants')
          .insert({
            franchisee_id: franchiseeId,
            base_restaurant_id: createdRestaurant.id,
            franchise_start_date: parseDate(restaurant.fechaApertura),
            status: restaurant.estado.toLowerCase() === 'abierto' ? 'active' : 'inactive'
          });
      }
    } catch (error) {
      console.error('Error creating base restaurant:', error);
    }
  };

  const parseDate = (dateString: string): string | null => {
    if (!dateString || dateString === '#N/D') return null;
    
    // Asumiendo formato DD/MM/YYYY
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return null;
  };

  return {
    importing,
    progress,
    importRestaurantsData
  };
};
