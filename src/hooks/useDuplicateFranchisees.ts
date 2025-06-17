
import { useState, useEffect, useMemo } from 'react';
import { Franchisee } from '@/types/auth';
import { DuplicateGroup, MergeResult } from '@/types/duplicates';
import { useFranchisees } from '@/hooks/useFranchisees';
import { detectDuplicates } from '@/utils/duplicateDetection';
import { mergeFranchisees } from '@/services/franchiseeMergeService';
import { toast } from 'sonner';

export const useDuplicateFranchisees = () => {
  const { franchisees, loading, error, refetch } = useFranchisees();
  const [merging, setMerging] = useState(false);

  // Detectar duplicados automáticamente cuando cambian los franquiciados
  const duplicateGroups = useMemo(() => {
    if (!franchisees || franchisees.length === 0) {
      console.log('useDuplicateFranchisees - No franchisees to process');
      return [];
    }
    
    console.log('useDuplicateFranchisees - Processing', franchisees.length, 'franchisees for duplicates');
    return detectDuplicates(franchisees);
  }, [franchisees]);

  const handleMergeDuplicates = async (
    primaryFranchisee: Franchisee,
    duplicatesToMerge: Franchisee[]
  ): Promise<boolean> => {
    console.log('useDuplicateFranchisees - handleMergeDuplicates called');
    
    if (!primaryFranchisee || !duplicatesToMerge || duplicatesToMerge.length === 0) {
      toast.error('Datos inválidos para la fusión');
      return false;
    }

    setMerging(true);

    try {
      const result: MergeResult = await mergeFranchisees(primaryFranchisee, duplicatesToMerge);
      
      if (result.success) {
        toast.success('Duplicados fusionados correctamente');
        // Recargar datos después de la fusión exitosa
        await refetch();
        return true;
      } else {
        toast.error(result.error || 'Error al fusionar duplicados');
        return false;
      }
    } catch (error) {
      console.error('useDuplicateFranchisees - Error in handleMergeDuplicates:', error);
      toast.error('Error inesperado al fusionar duplicados');
      return false;
    } finally {
      setMerging(false);
    }
  };

  // Log para debugging
  useEffect(() => {
    console.log('useDuplicateFranchisees - State update:');
    console.log('- Total franchisees:', franchisees?.length || 0);
    console.log('- Duplicate groups found:', duplicateGroups.length);
    console.log('- Loading:', loading);
    console.log('- Error:', error);
    console.log('- Merging:', merging);
  }, [franchisees, duplicateGroups, loading, error, merging]);

  return {
    duplicateGroups,
    loading,
    error,
    merging,
    mergeDuplicates: handleMergeDuplicates,
    refreshData: refetch
  };
};
