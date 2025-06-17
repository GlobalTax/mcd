
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

      setDuplicates(duplicateGroups);
    } catch (error) {
      console.error('Error finding duplicates:', error);
    } finally {
      setLoading(false);
    }
  };

  const mergeFranchisees = async (keepId: string, removeIds: string[]) => {
    try {
      // Primero actualizar las referencias en franchisee_restaurants
      for (const removeId of removeIds) {
        const { error: updateError } = await supabase
          .from('franchisee_restaurants')
          .update({ franchisee_id: keepId })
          .eq('franchisee_id', removeId);

        if (updateError) {
          console.error('Error updating franchisee_restaurants:', updateError);
          return false;
        }
      }

      // Luego eliminar los franquiciados duplicados
      const { error: deleteError } = await supabase
        .from('franchisees')
        .delete()
        .in('id', removeIds);

      if (deleteError) {
        console.error('Error deleting duplicate franchisees:', deleteError);
        return false;
      }

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
