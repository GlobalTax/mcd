
import { supabase } from '@/integrations/supabase/client';
import { Franchisee } from '@/types/auth';
import { MergeResult } from '@/types/duplicates';
import { toast } from 'sonner';

export const mergeFranchisees = async (
  primaryFranchisee: Franchisee,
  duplicatesToMerge: Franchisee[]
): Promise<MergeResult> => {
  console.log('mergeFranchisees - Starting merge process');
  console.log('Primary franchisee:', primaryFranchisee.id, primaryFranchisee.franchisee_name);
  console.log('Duplicates to merge:', duplicatesToMerge.map(f => ({ id: f.id, name: f.franchisee_name })));

  if (!primaryFranchisee || !primaryFranchisee.id) {
    console.error('mergeFranchisees - Invalid primary franchisee');
    return { success: false, error: 'Franquiciado principal inválido' };
  }

  if (!duplicatesToMerge || duplicatesToMerge.length === 0) {
    console.error('mergeFranchisees - No duplicates to merge');
    return { success: false, error: 'No hay duplicados para fusionar' };
  }

  try {
    // Verificar que el franquiciado principal existe
    const { data: primaryExists, error: primaryCheckError } = await supabase
      .from('franchisees')
      .select('id, franchisee_name')
      .eq('id', primaryFranchisee.id)
      .single();

    if (primaryCheckError || !primaryExists) {
      console.error('mergeFranchisees - Primary franchisee not found:', primaryCheckError);
      return { success: false, error: 'El franquiciado principal no existe en la base de datos' };
    }

    console.log('mergeFranchisees - Primary franchisee verified:', primaryExists);

    // Verificar que todos los duplicados existen antes de proceder
    for (const duplicate of duplicatesToMerge) {
      if (!duplicate.id) {
        console.error('mergeFranchisees - Duplicate without ID found:', duplicate);
        return { success: false, error: 'Uno de los duplicados no tiene ID válido' };
      }

      const { data: duplicateExists, error: duplicateCheckError } = await supabase
        .from('franchisees')
        .select('id, franchisee_name')
        .eq('id', duplicate.id)
        .single();

      if (duplicateCheckError || !duplicateExists) {
        console.error('mergeFranchisees - Duplicate not found:', duplicate.id, duplicateCheckError);
        return { success: false, error: `El duplicado ${duplicate.franchisee_name} no existe en la base de datos` };
      }

      console.log('mergeFranchisees - Duplicate verified:', duplicateExists);
    }

    // Transferir restaurantes asignados
    for (const duplicate of duplicatesToMerge) {
      console.log(`mergeFranchisees - Transferring restaurants from ${duplicate.id} to ${primaryFranchisee.id}`);
      
      const { error: updateRestaurantsError } = await supabase
        .from('franchisee_restaurants')
        .update({ franchisee_id: primaryFranchisee.id })
        .eq('franchisee_id', duplicate.id);

      if (updateRestaurantsError) {
        console.error('mergeFranchisees - Error transferring restaurants:', updateRestaurantsError);
        toast.error(`Error al transferir restaurantes de ${duplicate.franchisee_name}`);
        // Continuamos con el proceso pero registramos el error
      } else {
        console.log(`mergeFranchisees - Successfully transferred restaurants from ${duplicate.franchisee_name}`);
      }
    }

    // Eliminar duplicados específicos por ID
    for (const duplicate of duplicatesToMerge) {
      console.log(`mergeFranchisees - Deleting duplicate: ${duplicate.id} (${duplicate.franchisee_name})`);
      
      const { error: deleteError } = await supabase
        .from('franchisees')
        .delete()
        .eq('id', duplicate.id)
        .eq('franchisee_name', duplicate.franchisee_name); // Doble verificación por seguridad

      if (deleteError) {
        console.error('mergeFranchisees - Error deleting duplicate:', duplicate.id, deleteError);
        return { success: false, error: `Error al eliminar el duplicado ${duplicate.franchisee_name}: ${deleteError.message}` };
      } else {
        console.log(`mergeFranchisees - Successfully deleted duplicate: ${duplicate.franchisee_name}`);
      }
    }

    // Actualizar información del franquiciado principal con datos más completos
    const mergedData = {
      franchisee_name: primaryFranchisee.franchisee_name,
      company_name: primaryFranchisee.company_name || duplicatesToMerge.find(d => d.company_name)?.company_name || null,
      tax_id: primaryFranchisee.tax_id || duplicatesToMerge.find(d => d.tax_id)?.tax_id || null,
      address: primaryFranchisee.address || duplicatesToMerge.find(d => d.address)?.address || null,
      city: primaryFranchisee.city || duplicatesToMerge.find(d => d.city)?.city || null,
      state: primaryFranchisee.state || duplicatesToMerge.find(d => d.state)?.state || null,
      postal_code: primaryFranchisee.postal_code || duplicatesToMerge.find(d => d.postal_code)?.postal_code || null,
    };

    console.log('mergeFranchisees - Updating primary franchisee with merged data:', mergedData);

    const { data: updatedFranchisee, error: updateError } = await supabase
      .from('franchisees')
      .update(mergedData)
      .eq('id', primaryFranchisee.id)
      .select()
      .single();

    if (updateError) {
      console.error('mergeFranchisees - Error updating primary franchisee:', updateError);
      return { success: false, error: `Error al actualizar el franquiciado principal: ${updateError.message}` };
    }

    console.log('mergeFranchisees - Merge completed successfully');
    toast.success(`Se fusionaron ${duplicatesToMerge.length} duplicados con ${primaryFranchisee.franchisee_name}`);
    
    return { 
      success: true, 
      mergedFranchisee: updatedFranchisee 
    };

  } catch (error) {
    console.error('mergeFranchisees - Unexpected error:', error);
    return { 
      success: false, 
      error: `Error inesperado durante la fusión: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};
