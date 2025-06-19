
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Datos estáticos predefinidos para fallback rápido
const STATIC_FRANCHISEE_DATA = {
  id: 'static-franchisee-001',
  franchisee_name: 'Franquiciado Principal',
  company_name: 'Empresa McDonald\'s',
  total_restaurants: 3,
  user_id: 'static-user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const STATIC_RESTAURANTS_DATA = [
  {
    id: 'rest-001',
    base_restaurant: {
      id: 'base-001',
      restaurant_name: 'McDonald\'s Centro',
      site_number: '001',
      address: 'Calle Principal 123',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      restaurant_type: 'traditional' as const,
      opening_date: '2020-01-15',
      square_meters: 250,
      seating_capacity: 80
    },
    status: 'active' as const,
    last_year_revenue: 850000,
    monthly_rent: 12000,
    franchise_start_date: '2020-01-15',
    franchise_end_date: '2030-01-15'
  },
  {
    id: 'rest-002',
    base_restaurant: {
      id: 'base-002',
      restaurant_name: 'McDonald\'s Norte',
      site_number: '002',
      address: 'Avenida Norte 456',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      restaurant_type: 'drive_thru' as const,
      opening_date: '2021-03-10',
      square_meters: 180,
      seating_capacity: 60
    },
    status: 'active' as const,
    last_year_revenue: 720000,
    monthly_rent: 10000,
    franchise_start_date: '2021-03-10',
    franchise_end_date: '2031-03-10'
  },
  {
    id: 'rest-003',
    base_restaurant: {
      id: 'base-003',
      restaurant_name: 'McDonald\'s Express',
      site_number: '003',
      address: 'Plaza Central 789',
      city: 'Madrid',
      state: 'Madrid',
      country: 'España',
      restaurant_type: 'express' as const,
      opening_date: '2022-06-20',
      square_meters: 120,
      seating_capacity: 40
    },
    status: 'active' as const,
    last_year_revenue: 480000,
    monthly_rent: 8000,
    franchise_start_date: '2022-06-20',
    franchise_end_date: '2032-06-20'
  }
];

// Cache con TTL
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class DataCache {
  private cache = new Map<string, CacheItem<any>>();
  
  set<T>(key: string, data: T, ttlMinutes: number = 30) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }
  
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear() {
    this.cache.clear();
  }
}

const dataCache = new DataCache();

export const useStaticData = () => {
  const [isUsingCache, setIsUsingCache] = useState(false);
  
  // Función para obtener datos con fallback inmediato
  const getFranchiseeData = async (userId: string) => {
    console.log('getFranchiseeData - Starting with immediate fallback');
    
    // Verificar cache primero
    const cacheKey = `franchisee-${userId}`;
    const cached = dataCache.get(cacheKey);
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
  
  const getRestaurantsData = async (franchiseeId: string) => {
    console.log('getRestaurantsData - Starting with immediate fallback');
    
    // Si es franchisee estático, retornar datos estáticos
    if (franchiseeId.startsWith('static-') || franchiseeId.startsWith('temp-')) {
      console.log('getRestaurantsData - Using static restaurant data');
      return STATIC_RESTAURANTS_DATA;
    }
    
    // Verificar cache
    const cacheKey = `restaurants-${franchiseeId}`;
    const cached = dataCache.get(cacheKey);
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
