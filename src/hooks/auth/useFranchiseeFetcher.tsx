
import { supabase } from '@/integrations/supabase/client';
import { Franchisee } from '@/types/auth';
import { toast } from 'sonner';

interface FranchiseeFetcherProps {
  setFranchisee: (franchisee: Franchisee | null) => void;
}

export const useFranchiseeFetcher = ({ setFranchisee }: FranchiseeFetcherProps) => {
  
  const fetchFranchiseeData = async (userId: string, profile: any) => {
    try {
      console.log('fetchFranchiseeData - Starting for user:', userId);
      
      const { data: franchiseeData, error: franchiseeError } = await supabase
        .from('franchisees')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('fetchFranchiseeData - Franchisee query completed');
      console.log('fetchFranchiseeData - Franchisee query result:', { franchiseeData, franchiseeError });

      if (franchiseeError) {
        console.error('fetchFranchiseeData - Franchisee error details:', franchiseeError);
        // If franchisee doesn't exist, create one
        if (franchiseeError.code === 'PGRST116') {
          console.log('fetchFranchiseeData - No franchisee found, creating one for user:', profile.full_name);
          
          const { data: newFranchisee, error: createError } = await supabase
            .from('franchisees')
            .insert({
              user_id: userId,
              franchisee_name: profile.full_name || profile.email
            })
            .select()
            .single();

          console.log('fetchFranchiseeData - Create franchisee completed');

          if (createError) {
            console.error('fetchFranchiseeData - Error creating franchisee:', createError);
            toast.error('Error al crear perfil de franquiciado');
            return null;
          }

          console.log('fetchFranchiseeData - New franchisee created:', newFranchisee);
          setFranchisee(newFranchisee as Franchisee);
          toast.success('Perfil de franquiciado creado correctamente');
          return newFranchisee;
        }
        return null;
      }

      if (franchiseeData) {
        console.log('fetchFranchiseeData - Setting franchisee:', franchiseeData);
        setFranchisee(franchiseeData as Franchisee);
        console.log('fetchFranchiseeData - Franchisee data fetch completed');
        return franchiseeData;
      }
      
      return null;
    } catch (error) {
      console.error('fetchFranchiseeData - Unexpected error in fetchFranchiseeData:', error);
      return null;
    }
  };

  return { fetchFranchiseeData };
};
