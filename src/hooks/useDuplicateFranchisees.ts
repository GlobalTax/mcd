
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

      // Si no hay franquiciados, detener el proceso
      if (!franchisees || franchisees.length === 0) {
        console.log('No franchisees found in database');
        setDuplicates([]);
        return;
      }

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
      console.log('=== STARTING MERGE PROCESS ===');
      console.log('Keep ID:', keepId);
      console.log('Remove IDs:', removeIds);

      // Validaciones de seguridad CRÍTICAS
      if (!keepId) {
        console.error('ERROR: No keepId provided');
        return false;
      }

      if (!removeIds || removeIds.length === 0) {
        console.error('ERROR: No removeIds provided');
        return false;
      }
      
      if (removeIds.includes(keepId)) {
        console.error('ERROR: Cannot remove the franchisee that we want to keep');
        return false;
      }

      // PASO 1: Verificar que los franquiciados existen ANTES de hacer cualquier cambio
      console.log('=== VERIFICATION STEP ===');
      const { data: allFranchisees, error: allError } = await supabase
        .from('franchisees')
        .select('id, franchisee_name')
        .in('id', [keepId, ...removeIds]);

      if (allError) {
        console.error('Error checking franchisees:', allError);
        return false;
      }

      console.log('Found franchisees:', allFranchisees);

      const keepFranchisee = allFranchisees?.find(f => f.id === keepId);
      const removeFranchisees = allFranchisees?.filter(f => removeIds.includes(f.id));

      if (!keepFranchisee) {
        console.error('ERROR: Franchisee to keep not found in database');
        return false;
      }

      if (!removeFranchisees || removeFranchisees.length === 0) {
        console.error('ERROR: No franchisees to remove found in database');
        return false;
      }

      if (removeFranchisees.length !== removeIds.length) {
        console.error('ERROR: Some franchisees to remove were not found');
        return false;
      }

      console.log(`CONFIRMED: Keeping "${keepFranchisee.franchisee_name}"`);
      console.log(`CONFIRMED: Removing ${removeFranchisees.length} franchisees:`, removeFranchisees.map(f => f.franchisee_name));

      // PASO 2: Obtener restaurantes a mover
      console.log('=== RESTAURANT TRANSFER STEP ===');
      const { data: restaurantsToMove, error: fetchError } = await supabase
        .from('franchisee_restaurants')
        .select('base_restaurant_id, franchisee_id')
        .in('franchisee_id', removeIds);

      if (fetchError) {
        console.error('Error fetching restaurants to move:', fetchError);
        return false;
      }

      console.log('Restaurants to potentially move:', restaurantsToMove?.length || 0);

      // PASO 3: Obtener restaurantes existentes del franquiciado que se mantiene
      const { data: existingRestaurants, error: existingError } = await supabase
        .from('franchisee_restaurants')
        .select('base_restaurant_id')
        .eq('franchisee_id', keepId);

      if (existingError) {
        console.error('Error fetching existing restaurants:', existingError);
        return false;
      }

      const existingRestaurantIds = new Set(
        existingRestaurants?.map(r => r.base_restaurant_id) || []
      );

      // PASO 4: Filtrar solo los restaurantes que NO están duplicados
      const restaurantsToUpdate = restaurantsToMove?.filter(
        r => !existingRestaurantIds.has(r.base_restaurant_id)
      ) || [];

      console.log('Restaurants that will be transferred:', restaurantsToUpdate.length);

      // PASO 5: Transferir restaurantes únicos UNO POR UNO
      if (restaurantsToUpdate.length > 0) {
        console.log('=== TRANSFERRING RESTAURANTS ===');
        for (const restaurant of restaurantsToUpdate) {
          console.log(`Transferring restaurant ${restaurant.base_restaurant_id} from ${restaurant.franchisee_id} to ${keepId}`);
          
          const { error: updateError } = await supabase
            .from('franchisee_restaurants')
            .update({ franchisee_id: keepId })
            .eq('base_restaurant_id', restaurant.base_restaurant_id)
            .eq('franchisee_id', restaurant.franchisee_id);

          if (updateError) {
            console.error('Error updating restaurant:', restaurant.base_restaurant_id, updateError);
            return false;
          }
        }
      }

      // PASO 6: Eliminar relaciones restantes (duplicadas)
      console.log('=== CLEANING UP DUPLICATE RELATIONS ===');
      const { error: deleteRelationsError } = await supabase
        .from('franchisee_restaurants')
        .delete()
        .in('franchisee_id', removeIds);

      if (deleteRelationsError) {
        console.error('Error deleting remaining relations:', deleteRelationsError);
        return false;
      }

      // PASO 7: ELIMINAR SOLO LOS FRANQUICIADOS ESPECIFICADOS (UNO POR UNO para mayor seguridad)
      console.log('=== DELETING FRANCHISEES ===');
      for (const removeId of removeIds) {
        console.log(`Deleting franchisee ${removeId}`);
        
        const { error: deleteError } = await supabase
          .from('franchisees')
          .delete()
          .eq('id', removeId); // MUY IMPORTANTE: Solo eliminar por ID específico

        if (deleteError) {
          console.error(`Error deleting franchisee ${removeId}:`, deleteError);
          return false;
        }
      }

      console.log('=== MERGE COMPLETED SUCCESSFULLY ===');
      console.log(`Kept: ${keepFranchisee.franchisee_name}`);
      console.log(`Removed: ${removeFranchisees.map(f => f.franchisee_name).join(', ')}`);

      // Refrescar la lista de duplicados
      await findDuplicates();
      return true;
    } catch (error) {
      console.error('CRITICAL ERROR in merge process:', error);
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

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '');
}
