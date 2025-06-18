
import { supabase } from '@/integrations/supabase/client';
import { User, Franchisee, Restaurant } from '@/types/auth';
import { toast } from 'sonner';

interface UserDataFetcherProps {
  setUser: (user: User | null) => void;
  setFranchisee: (franchisee: Franchisee | null) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
  clearUserData: () => void;
}

export const useUserDataFetcher = ({
  setUser,
  setFranchisee,
  setRestaurants,
  clearUserData
}: UserDataFetcherProps) => {
  
  const fetchUserData = async (userId: string) => {
    try {
      console.log('fetchUserData - Starting fetch for user:', userId);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000);
      });
      
      // Fetch user profile with timeout
      console.log('fetchUserData - About to query profiles table');
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      try {
        const { data: profile, error: profileError } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        console.log('fetchUserData - Profile query completed');
        console.log('fetchUserData - Profile query result:', { profile, profileError });

        if (profileError) {
          console.error('fetchUserData - Profile error details:', profileError);
          // If profile doesn't exist, clear user data but don't show error
          if (profileError.code === 'PGRST116') {
            console.log('fetchUserData - Profile not found, user needs to complete registration');
            clearUserData();
            return;
          }
          console.log('fetchUserData - Profile error, clearing user data');
          clearUserData();
          return;
        }

        if (!profile) {
          console.log('fetchUserData - No profile found for user');
          clearUserData();
          return;
        }

        console.log('fetchUserData - Profile fetched successfully:', profile);
        console.log('fetchUserData - Profile role:', profile.role);

        // Use the role directly from the database
        const userData = {
          ...profile,
          role: profile.role
        } as User;

        console.log('fetchUserData - About to set user with role:', userData.role);
        setUser(userData);
        console.log('fetchUserData - User set successfully');

        // Only fetch franchisee data if user is a franchisee
        if (profile.role === 'franchisee') {
          console.log('fetchUserData - User is franchisee, fetching franchisee data');
          await fetchFranchiseeData(userId, profile);
        } else {
          console.log('fetchUserData - User is not franchisee, role:', profile.role);
          // Clear franchisee data for non-franchisee users
          setFranchisee(null);
          setRestaurants([]);
        }
        
        console.log('fetchUserData - User data fetch completed successfully');
      } catch (timeoutError) {
        console.error('fetchUserData - Query timeout or error:', timeoutError);
        // If query times out, create a basic user profile and continue
        const basicUser = {
          id: userId,
          email: 'usuario@ejemplo.com',
          role: 'franchisee',
          full_name: 'Usuario'
        } as User;
        
        console.log('fetchUserData - Setting basic user due to timeout');
        setUser(basicUser);
        toast.error('Error al cargar perfil, usando datos básicos');
      }
      
    } catch (error) {
      console.error('fetchUserData - Unexpected error in fetchUserData:', error);
      // Clear user data on any unexpected error
      clearUserData();
    }
  };

  const fetchFranchiseeData = async (userId: string, profile: any) => {
    try {
      console.log('fetchFranchiseeData - Starting for user:', userId);
      
      // Fetch franchisee data
      console.log('fetchFranchiseeData - About to query franchisees table');
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
          
          console.log('fetchFranchiseeData - About to create new franchisee');
          const { data: newFranchisee, error: createError } = await supabase
            .from('franchisees')
            .insert({
              user_id: userId,
              franchisee_name: profile.full_name || profile.email
            })
            .select()
            .single();

          console.log('fetchFranchiseeData - Create franchisee completed');
          console.log('fetchFranchiseeData - Insert result:', { newFranchisee, createError });

          if (createError) {
            console.error('fetchFranchiseeData - Error creating franchisee:', createError);
            toast.error('Error al crear perfil de franquiciado');
            return;
          }

          console.log('fetchFranchiseeData - New franchisee created:', newFranchisee);
          setFranchisee(newFranchisee as Franchisee);
          toast.success('Perfil de franquiciado creado correctamente');
        }
        return;
      }

      if (franchiseeData) {
        console.log('fetchFranchiseeData - Setting franchisee:', franchiseeData);
        setFranchisee(franchiseeData as Franchisee);
        console.log('fetchFranchiseeData - About to fetch restaurants for franchisee:', franchiseeData.id);
        await fetchRestaurantsData(franchiseeData.id);
      }
      
      console.log('fetchFranchiseeData - Franchisee data fetch completed');
    } catch (error) {
      console.error('fetchFranchiseeData - Unexpected error in fetchFranchiseeData:', error);
    }
  };

  const fetchRestaurantsData = async (franchiseeId: string) => {
    try {
      console.log('fetchRestaurantsData - Starting for franchisee:', franchiseeId);
      
      // Search for restaurants linked through franchisee_restaurants
      console.log('fetchRestaurantsData - About to query franchisee_restaurants table');
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('franchisee_restaurants')
        .select(`
          *,
          base_restaurant:base_restaurants(*)
        `)
        .eq('franchisee_id', franchiseeId)
        .eq('status', 'active');

      console.log('fetchRestaurantsData - Restaurants query completed');
      console.log('fetchRestaurantsData - Restaurants query result:', { restaurantsData, restaurantsError });

      if (restaurantsError) {
        console.error('fetchRestaurantsData - Error fetching restaurants:', restaurantsError);
      } else {
        console.log('fetchRestaurantsData - Restaurants found:', restaurantsData);
        
        // Transform the data to match Restaurant type
        const transformedRestaurants: Restaurant[] = restaurantsData
          ?.filter(item => item.base_restaurant)
          .map(item => ({
            id: item.base_restaurant.id,
            franchisee_id: item.franchisee_id,
            site_number: item.base_restaurant.site_number,
            restaurant_name: item.base_restaurant.restaurant_name,
            address: item.base_restaurant.address,
            city: item.base_restaurant.city,
            state: item.base_restaurant.state,
            postal_code: item.base_restaurant.postal_code,
            country: item.base_restaurant.country,
            opening_date: item.base_restaurant.opening_date,
            restaurant_type: item.base_restaurant.restaurant_type as 'traditional' | 'mccafe' | 'drive_thru' | 'express',
            status: item.status as 'active' | 'inactive' | 'pending' | 'closed',
            square_meters: item.base_restaurant.square_meters,
            seating_capacity: item.base_restaurant.seating_capacity,
            created_at: item.base_restaurant.created_at,
            updated_at: item.base_restaurant.updated_at
          })) || [];
        
        console.log('fetchRestaurantsData - About to set restaurants:', transformedRestaurants.length);
        setRestaurants(transformedRestaurants);
        console.log('fetchRestaurantsData - Restaurants set:', transformedRestaurants.length);
      }
      
      console.log('fetchRestaurantsData - Restaurant data fetch completed');
    } catch (error) {
      console.error('fetchRestaurantsData - Unexpected error in fetchRestaurantsData:', error);
    }
  };

  return { fetchUserData };
};
