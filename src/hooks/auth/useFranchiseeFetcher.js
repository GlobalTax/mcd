import { supabase } from '@/integrations/supabase/client';
export const useFranchiseeFetcher = ({ setFranchisee }) => {
    const fetchFranchiseeData = async (userId, profile) => {
        try {
            console.log('fetchFranchiseeData - Starting for user:', userId);
            // Reducir timeout a 6 segundos para fallar más rápido
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Franchisee query timeout')), 6000);
            });
            const franchiseePromise = supabase
                .from('franchisees')
                .select('*')
                .eq('user_id', userId)
                .maybeSingle();
            const { data: franchiseeData, error: franchiseeError } = await Promise.race([
                franchiseePromise,
                timeoutPromise
            ]);
            console.log('fetchFranchiseeData - Franchisee query completed');
            if (franchiseeError && !franchiseeError.message?.includes('timeout')) {
                console.error('fetchFranchiseeData - Franchisee error details:', franchiseeError);
                // Si no existe el franquiciado, crear uno básico inmediatamente
                if (franchiseeError.code === 'PGRST116') {
                    console.log('fetchFranchiseeData - No franchisee found, creating basic one');
                    const basicFranchisee = {
                        id: 'temp-' + userId,
                        user_id: userId,
                        franchisee_name: profile.full_name || profile.email || 'Usuario',
                        company_name: 'Empresa',
                        total_restaurants: 0,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    };
                    setFranchisee(basicFranchisee);
                    return basicFranchisee;
                }
                return null;
            }
            if (franchiseeData) {
                console.log('fetchFranchiseeData - Setting franchisee:', franchiseeData);
                setFranchisee(franchiseeData);
                return franchiseeData;
            }
            // Si no hay franquiciado, crear uno básico inmediatamente
            console.log('fetchFranchiseeData - No franchisee data, creating basic one');
            const basicFranchisee = {
                id: 'temp-' + userId,
                user_id: userId,
                franchisee_name: profile.full_name || profile.email || 'Usuario',
                company_name: 'Empresa',
                total_restaurants: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setFranchisee(basicFranchisee);
            return basicFranchisee;
        }
        catch (error) {
            console.error('fetchFranchiseeData - Timeout or error:', error);
            // Crear franquiciado básico inmediatamente en caso de timeout
            const basicFranchisee = {
                id: 'temp-' + userId,
                user_id: userId,
                franchisee_name: profile.full_name || profile.email || 'Usuario',
                company_name: 'Empresa',
                total_restaurants: 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            console.log('fetchFranchiseeData - Setting basic franchisee due to timeout');
            setFranchisee(basicFranchisee);
            return basicFranchisee;
        }
    };
    return { fetchFranchiseeData };
};
