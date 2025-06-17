
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Franchisee } from '@/types/auth';

interface DuplicateGroup {
  field: 'name' | 'tax_id' | 'email';
  value: string;
  franchisees: Franchisee[];
  similarity?: number;
}

export const useDuplicateFranchisees = () => {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const findDuplicates = async () => {
    setLoading(true);
    
    try {
      const { data: franchisees, error } = await supabase
        .from('franchisees')
        .select(`
          *,
          profiles:user_id(email, full_name)
        `);

      if (error) {
        console.error('Error fetching franchisees:', error);
        return;
      }

      console.log('Total franchisees found:', franchisees?.length || 0);

      const duplicateGroups: DuplicateGroup[] = [];

      // Agrupar por nombre exacto
      const nameGroups = groupBy(franchisees || [], 'franchisee_name');
      Object.entries(nameGroups).forEach(([name, group]) => {
        if (group.length > 1) {
          duplicateGroups.push({
            field: 'name',
            value: name,
            franchisees: group
          });
        }
      });

      // Agrupar por tax_id exacto
      const taxGroups = groupBy(
        (franchisees || []).filter(f => f.tax_id), 
        'tax_id'
      );
      Object.entries(taxGroups).forEach(([taxId, group]) => {
        if (group.length > 1) {
          duplicateGroups.push({
            field: 'tax_id',
            value: taxId,
            franchisees: group
          });
        }
      });

      // Agrupar por email exacto
      const emailGroups = groupBy(
        (franchisees || []).filter(f => f.profiles?.email), 
        f => f.profiles?.email || ''
      );
      Object.entries(emailGroups).forEach(([email, group]) => {
        if (group.length > 1 && email) {
          duplicateGroups.push({
            field: 'email',
            value: email,
            franchisees: group
          });
        }
      });

      // Buscar nombres similares (normalización básica)
      const normalizedNames = new Map<string, Franchisee[]>();
      (franchisees || []).forEach(franchisee => {
        const normalized = normalizeName(franchisee.franchisee_name);
        if (!normalizedNames.has(normalized)) {
          normalizedNames.set(normalized, []);
        }
        normalizedNames.get(normalized)!.push(franchisee);
      });

      normalizedNames.forEach((group, normalizedName) => {
        if (group.length > 1) {
          // Verificar si ya está en duplicados exactos
          const alreadyFound = duplicateGroups.some(d => 
            d.field === 'name' && 
            group.some(f => d.franchisees.some(df => df.id === f.id))
          );
          
          if (!alreadyFound) {
            duplicateGroups.push({
              field: 'name',
              value: `${normalizedName} (similar)`,
              franchisees: group,
              similarity: 0.8
            });
          }
        }
      });

      console.log('Duplicate groups found:', duplicateGroups.length);
      setDuplicates(duplicateGroups);
    } catch (error) {
      console.error('Error finding duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const mergeFranchisees = async (keepId: string, removeIds: string[]) => {
    try {
      console.log('Starting merge process...', { keepId, removeIds });

      // Validación de seguridad
      if (!keepId || !removeIds || removeIds.length === 0) {
        console.error('Invalid parameters for merge');
        return false;
      }
      
      if (removeIds.includes(keepId)) {
        console.error('Cannot remove the franchisee that we want to keep');
        return false;
      }

      // Verificar que los franquiciados existen antes de hacer nada
      const { data: franchiseesToCheck, error: checkError } = await supabase
        .from('franchisees')
        .select('id, franchisee_name')
        .in('id', [keepId, ...removeIds]);

      if (checkError) {
        console.error('Error checking franchisees:', checkError);
        return false;
      }

      console.log('Franchisees to process:', franchiseesToCheck);

      const keepFranchisee = franchiseesToCheck?.find(f => f.id === keepId);
      const removeFranchisees = franchiseesToCheck?.filter(f => removeIds.includes(f.id));

      if (!keepFranchisee) {
        console.error('Franchisee to keep not found');
        return false;
      }

      if (!removeFranchisees || removeFranchisees.length === 0) {
        console.error('No franchisees to remove found');
        return false;
      }

      console.log(`Keeping: ${keepFranchisee.franchisee_name}, Removing: ${removeFranchisees.map(f => f.franchisee_name).join(', ')}`);

      // Paso 1: Obtener todos los restaurantes que están asignados a los franquiciados que se van a eliminar
      const { data: restaurantsToMove, error: fetchError } = await supabase
        .from('franchisee_restaurants')
        .select('base_restaurant_id, franchisee_id')
        .in('franchisee_id', removeIds);

      if (fetchError) {
        console.error('Error fetching restaurants to move:', fetchError);
        return false;
      }

      console.log('Restaurants to move:', restaurantsToMove);

      // Paso 2: Obtener los restaurantes que ya tiene el franquiciado que se mantiene
      const { data: existingRestaurants, error: existingError } = await supabase
        .from('franchisee_restaurants')
        .select('base_restaurant_id')
        .eq('franchisee_id', keepId);

      if (existingError) {
        console.error('Error fetching existing restaurants:', existingError);
        return false;
      }

      console.log('Existing restaurants:', existingRestaurants);

      const existingRestaurantIds = new Set(
        existingRestaurants?.map(r => r.base_restaurant_id) || []
      );

      // Paso 3: Filtrar solo los restaurantes que NO están ya asignados al franquiciado que se mantiene
      const restaurantsToUpdate = restaurantsToMove?.filter(
        r => !existingRestaurantIds.has(r.base_restaurant_id)
      ) || [];

      console.log('Restaurants that will be updated:', restaurantsToUpdate);

      // Paso 4: Actualizar solo los restaurantes que no causan duplicados
      if (restaurantsToUpdate.length > 0) {
        for (const restaurant of restaurantsToUpdate) {
          const { error: updateError } = await supabase
            .from('franchisee_restaurants')
            .update({ franchisee_id: keepId })
            .eq('base_restaurant_id', restaurant.base_restaurant_id)
            .eq('franchisee_id', restaurant.franchisee_id); // Más específico

          if (updateError) {
            console.error('Error updating franchisee_restaurants:', updateError);
            return false;
          }
        }
      }

      // Paso 5: Eliminar las relaciones restantes (duplicadas) antes de eliminar los franquiciados
      const { error: deleteRelationsError } = await supabase
        .from('franchisee_restaurants')
        .delete()
        .in('franchisee_id', removeIds);

      if (deleteRelationsError) {
        console.error('Error deleting remaining relations:', deleteRelationsError);
        return false;
      }

      // Paso 6: Eliminar SOLO los franquiciados especificados
      const { error: deleteError } = await supabase
        .from('franchisees')
        .delete()
        .in('id', removeIds);

      if (deleteError) {
        console.error('Error deleting duplicate franchisees:', deleteError);
        return false;
      }

      console.log('Merge completed successfully');
      console.log(`Kept franchisee: ${keepFranchisee.franchisee_name}`);
      console.log(`Removed franchisees: ${removeFranchisees.map(f => f.franchisee_name).join(', ')}`);

      // Refrescar la lista de duplicados
      await findDuplicates();
      return true;
    } catch (error) {
      console.error('Error merging franchisees:', error);
      return false;
    }
  };

  return {
    duplicates,
    loading,
    findDuplicates,
    mergeFranchisees
  };
};

// Función auxiliar para agrupar por campo
function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Función para normalizar nombres (eliminar espacios extra, mayúsculas, etc.)
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}
