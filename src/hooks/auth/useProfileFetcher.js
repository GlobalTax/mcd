import { supabase } from '@/integrations/supabase/client';
export const useProfileFetcher = ({ setUser, clearUserData }) => {
    const fetchUserProfile = async (userId) => {
        try {
            console.log('fetchUserProfile - About to query profiles table');
            // Reducir timeout a 8 segundos para fallar más rápido
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Query timeout after 8 seconds')), 8000);
            });
            const profilePromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();
            const { data: profile, error: profileError } = await Promise.race([
                profilePromise,
                timeoutPromise
            ]);
            console.log('fetchUserProfile - Profile query completed');
            if (profileError && !profileError.message?.includes('timeout')) {
                console.error('fetchUserProfile - Profile error details:', profileError);
                // Si no existe el perfil, crear uno básico inmediatamente
                if (profileError.code === 'PGRST116') {
                    console.log('fetchUserProfile - Profile not found, creating basic user');
                    const basicUser = {
                        id: userId,
                        email: 'usuario@ejemplo.com',
                        role: 'franchisee',
                        full_name: 'Usuario'
                    };
                    setUser(basicUser);
                    return basicUser;
                }
                clearUserData();
                return null;
            }
            if (profile) {
                console.log('fetchUserProfile - Profile fetched successfully:', profile);
                const userData = {
                    ...profile,
                    role: profile.role
                };
                setUser(userData);
                return userData;
            }
            // Si no hay perfil, crear uno básico inmediatamente
            console.log('fetchUserProfile - No profile found, creating basic user');
            const basicUser = {
                id: userId,
                email: 'usuario@ejemplo.com',
                role: 'franchisee',
                full_name: 'Usuario'
            };
            setUser(basicUser);
            return basicUser;
        }
        catch (error) {
            console.error('fetchUserProfile - Query timeout or error:', error);
            // Crear un usuario básico inmediatamente en caso de timeout
            const basicUser = {
                id: userId,
                email: 'usuario@ejemplo.com',
                role: 'franchisee',
                full_name: 'Usuario'
            };
            console.log('fetchUserProfile - Setting basic user due to timeout');
            setUser(basicUser);
            return basicUser;
        }
    };
    return { fetchUserProfile };
};
