
import { useState, useMemo } from 'react';
import { Franchisee } from '@/types/auth';
import { FranchiseeFilters } from '@/components/FranchiseeFilters';

const initialFilters: FranchiseeFilters = {
  search: '',
  city: '',
  state: '',
  restaurantCount: '',
  hasEmail: '',
  hasTaxId: '',
  hasCompanyName: '',
  sortBy: 'franchisee_name',
  sortOrder: 'asc'
};

export const useFranchiseeFilters = (franchisees: Franchisee[]) => {
  const [filters, setFilters] = useState<FranchiseeFilters>(initialFilters);

  const filteredFranchisees = useMemo(() => {
    let filtered = [...franchisees];

    // Filtro de búsqueda general
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(franchisee =>
        franchisee.franchisee_name.toLowerCase().includes(searchLower) ||
        (franchisee.company_name && franchisee.company_name.toLowerCase().includes(searchLower)) ||
        (franchisee.city && franchisee.city.toLowerCase().includes(searchLower)) ||
        (franchisee.state && franchisee.state.toLowerCase().includes(searchLower)) ||
        (franchisee.tax_id && franchisee.tax_id.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por ciudad
    if (filters.city) {
      filtered = filtered.filter(franchisee => franchisee.city === filters.city);
    }

    // Filtro por provincia
    if (filters.state) {
      filtered = filtered.filter(franchisee => franchisee.state === filters.state);
    }

    // Filtro por número de restaurantes
    if (filters.restaurantCount) {
      filtered = filtered.filter(franchisee => {
        const count = franchisee.total_restaurants || 0;
        switch (filters.restaurantCount) {
          case '0':
            return count === 0;
          case '1':
            return count === 1;
          case '2-5':
            return count >= 2 && count <= 5;
          case '6-10':
            return count >= 6 && count <= 10;
          case '11+':
            return count > 10;
          default:
            return true;
        }
      });
    }

    // Filtro por email
    if (filters.hasEmail) {
      if (filters.hasEmail === 'yes') {
        filtered = filtered.filter(franchisee => 
          franchisee.profiles && franchisee.profiles.email
        );
      } else if (filters.hasEmail === 'no') {
        filtered = filtered.filter(franchisee => 
          !franchisee.profiles || !franchisee.profiles.email
        );
      }
    }

    // Filtro por CIF/NIF
    if (filters.hasTaxId) {
      if (filters.hasTaxId === 'yes') {
        filtered = filtered.filter(franchisee => franchisee.tax_id && franchisee.tax_id.trim() !== '');
      } else if (filters.hasTaxId === 'no') {
        filtered = filtered.filter(franchisee => !franchisee.tax_id || franchisee.tax_id.trim() === '');
      }
    }

    // Filtro por nombre de empresa
    if (filters.hasCompanyName) {
      if (filters.hasCompanyName === 'yes') {
        filtered = filtered.filter(franchisee => franchisee.company_name && franchisee.company_name.trim() !== '');
      } else if (filters.hasCompanyName === 'no') {
        filtered = filtered.filter(franchisee => !franchisee.company_name || franchisee.company_name.trim() === '');
      }
    }

    // Ordenación
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (filters.sortBy) {
          case 'franchisee_name':
            valueA = a.franchisee_name || '';
            valueB = b.franchisee_name || '';
            break;
          case 'company_name':
            valueA = a.company_name || '';
            valueB = b.company_name || '';
            break;
          case 'city':
            valueA = a.city || '';
            valueB = b.city || '';
            break;
          case 'total_restaurants':
            valueA = a.total_restaurants || 0;
            valueB = b.total_restaurants || 0;
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
  }, [franchisees, filters]);

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    setFilters,
    filteredFranchisees,
    clearFilters
  };
};
