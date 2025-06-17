
import { useState, useMemo } from 'react';
import { BaseRestaurantFilters } from '@/components/BaseRestaurantFilters';

interface BaseRestaurant {
  id: string;
  site_number: string;
  restaurant_name: string;
  address: string;
  city: string;
  state?: string;
  autonomous_community?: string;
  restaurant_type?: string;
  property_type?: string;
  created_at: string;
}

const initialFilters: BaseRestaurantFilters = {
  search: '',
  city: '',
  state: '',
  autonomousCommunity: '',
  restaurantType: '',
  propertyType: '',
  sortBy: 'restaurant_name',
  sortOrder: 'asc'
};

export const useBaseRestaurantFilters = (restaurants: BaseRestaurant[]) => {
  const [filters, setFilters] = useState<BaseRestaurantFilters>(initialFilters);

  const filteredRestaurants = useMemo(() => {
    let filtered = [...restaurants];

    // Filtro de búsqueda general
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(restaurant =>
        restaurant.restaurant_name.toLowerCase().includes(searchLower) ||
        restaurant.site_number.toLowerCase().includes(searchLower) ||
        restaurant.address.toLowerCase().includes(searchLower) ||
        (restaurant.city && restaurant.city.toLowerCase().includes(searchLower)) ||
        (restaurant.state && restaurant.state.toLowerCase().includes(searchLower)) ||
        (restaurant.autonomous_community && restaurant.autonomous_community.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por ciudad
    if (filters.city) {
      filtered = filtered.filter(restaurant => restaurant.city === filters.city);
    }

    // Filtro por provincia
    if (filters.state) {
      filtered = filtered.filter(restaurant => restaurant.state === filters.state);
    }

    // Filtro por comunidad autónoma
    if (filters.autonomousCommunity) {
      filtered = filtered.filter(restaurant => restaurant.autonomous_community === filters.autonomousCommunity);
    }

    // Filtro por tipo de restaurante
    if (filters.restaurantType) {
      filtered = filtered.filter(restaurant => restaurant.restaurant_type === filters.restaurantType);
    }

    // Filtro por tipo de propiedad
    if (filters.propertyType) {
      filtered = filtered.filter(restaurant => restaurant.property_type === filters.propertyType);
    }

    // Ordenación
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (filters.sortBy) {
          case 'restaurant_name':
            valueA = a.restaurant_name || '';
            valueB = b.restaurant_name || '';
            break;
          case 'site_number':
            valueA = a.site_number || '';
            valueB = b.site_number || '';
            break;
          case 'city':
            valueA = a.city || '';
            valueB = b.city || '';
            break;
          case 'autonomous_community':
            valueA = a.autonomous_community || '';
            valueB = b.autonomous_community || '';
            break;
          case 'created_at':
            valueA = new Date(a.created_at);
            valueB = new Date(b.created_at);
            break;
          default:
            return 0;
        }

        if (typeof valueA === 'string') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        }

        if (valueA < valueB) {
          return filters.sortOrder === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return filters.sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [restaurants, filters]);

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    setFilters,
    filteredRestaurants,
    clearFilters
  };
};
