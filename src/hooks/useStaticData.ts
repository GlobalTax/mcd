
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Franchisee } from '@/types/auth';
import { RestaurantData } from '@/types/staticData';
import { STATIC_FRANCHISEE_DATA, STATIC_RESTAURANTS_DATA } from '@/data/staticData';
import { DataCache } from '@/utils/dataCache';

const dataCache = new DataCache();

export const useStaticData = () => {
  const [isUsingCache, setIsUsingCache] = useState(false);
  
  const getFranchiseeData = async (userId: string): Promise<Franchisee> => {
    console.log('getFranchiseeData - Starting with immediate fallback');
    
    // Verificar cache primero
    const cacheKey = `franchisee-${userId}`;
    const cached = dataCache.get<Franchisee>(cacheKey);
    if (cached) {
      console.log('getFranchiseeData - Using cached data');
      return cached;
    }
    
    // Retornar datos estáticos inmediatamente
    console.log('getFranchiseeData - Using static fallback data');
    setIsUsingCache(true);
    
    // Intentar cargar datos reales en background (sin bloquear)
    setTimeout(async () => {
      try {
        console.log('getFranchiseeData - Attempting background load');
        const { data, error } = await Promise.race([
          supabase
            .from('franchisees')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Background timeout')), 3000)
          )
        ]) as any;
        
        if (data && !error) {
          console.log('getFranchiseeData - Background load successful');
          dataCache.set(cacheKey, data, 60); // Cache por 1 hora
          setIsUsingCache(false);
        }
      } catch (error) {
        console.log('getFranchiseeData - Background load failed, keeping static data');
      }
    }, 100);
    
    return STATIC_FRANCHISEE_DATA;
  };
  
  const getRestaurantsData = async (franchiseeId: string): Promise<RestaurantData[]> => {
    console.log('getRestaurantsData - Starting with immediate fallback');
    
    // Si es franchisee estático, retornar datos estáticos
    if (franchiseeId.startsWith('static-') || franchiseeId.startsWith('temp-')) {
      console.log('getRestaurantsData - Using static restaurant data');
      return STATIC_RESTAURANTS_DATA;
    }
    
    // Verificar cache
    const cacheKey = `restaurants-${franchiseeId}`;
    const cached = dataCache.get<RestaurantData[]>(cacheKey);
    if (cached) {
      console.log('getRestaurantsData - Using cached restaurant data');
      return cached;
    }
    
    // Retornar datos estáticos inmediatamente
    console.log('getRestaurantsData - Using static restaurant fallback');
    setIsUsingCache(true);
    
    // Cargar datos reales en background
    setTimeout(async () => {
      try {
        console.log('getRestaurantsData - Attempting background load');
        const { data, error } = await Promise.race([
          supabase
            .from('franchisee_restaurants')
            .select(`
              *,
              base_restaurant:base_restaurants(*)
            `)
            .eq('franchisee_id', franchiseeId)
            .eq('status', 'active'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Background timeout')), 3000)
          )
        ]) as any;
        
        if (data && !error && data.length > 0) {
          console.log('getRestaurantsData - Background load successful');
          dataCache.set(cacheKey, data, 60);
          setIsUsingCache(false);
        }
      } catch (error) {
        console.log('getRestaurantsData - Background load failed, keeping static data');
      }
    }, 100);
    
    return STATIC_RESTAURANTS_DATA;
  };
  
  const clearCache = () => {
    dataCache.clear();
    setIsUsingCache(false);
  };
  
  return {
    getFranchiseeData,
    getRestaurantsData,
    clearCache,
    isUsingCache,
    staticData: {
      franchisee: STATIC_FRANCHISEE_DATA,
      restaurants: STATIC_RESTAURANTS_DATA
    }
  };
};
