
import { supabase } from '@/integrations/supabase/client';
import { Restaurant } from '@/types/auth';

interface RestaurantsFetcherProps {
  setRestaurants: (restaurants: Restaurant[]) => void;
}

export const useRestaurantsFetcher = ({ setRestaurants }: RestaurantsFetcherProps) => {
  
  const fetchRestaurantsData = async (franchiseeId: string) => {
    try {
      console.log('fetchRestaurantsData - Starting for franchisee:', franchiseeId);
      
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
        return [];
      }

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
      
      return transformedRestaurants;
    } catch (error) {
      console.error('fetchRestaurantsData - Unexpected error in fetchRestaurantsData:', error);
      return [];
    }
  };

  return { fetchRestaurantsData };
};
