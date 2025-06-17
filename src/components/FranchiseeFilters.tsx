
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Franchisee } from '@/types/auth';

export interface FranchiseeFilters {
  search: string;
  city: string;
  state: string;
  restaurantCount: string;
  hasEmail: string;
  hasTaxId: string;
  hasCompanyName: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface FranchiseeFiltersProps {
  franchisees: Franchisee[];
  filters: FranchiseeFilters;
  onFiltersChange: (filters: FranchiseeFilters) => void;
  onClearFilters: () => void;
}

export const FranchiseeFiltersComponent: React.FC<FranchiseeFiltersProps> = ({
  franchisees,
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Obtener valores únicos para los filtros
  const uniqueCities = [...new Set(franchisees.map(f => f.city).filter(Boolean))].sort();
  const uniqueStates = [...new Set(franchisees.map(f => f.state).filter(Boolean))].sort();

  const handleFilterChange = useCallback((key: keyof FranchiseeFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  }, [filters, onFiltersChange]);

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.restaurantCount) count++;
    if (filters.hasEmail) count++;
    if (filters.hasTaxId) count++;
    if (filters.hasCompanyName) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros Avanzados
                </CardTitle>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {activeFiltersCount} activo{activeFiltersCount !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearFilters();
                    }}
                    className="h-8 px-2"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Búsqueda general */}
              <div className="space-y-2">
                <Label htmlFor="search">Búsqueda General</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Nombre, empresa, email..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                  {filters.search && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFilterChange('search', '')}
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Filtro por ciudad */}
              <div className="space-y-2">
                <Label>Ciudad</Label>
                <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value === 'all-cities' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las ciudades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-cities">Todas las ciudades</SelectItem>
                    {uniqueCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por provincia */}
              <div className="space-y-2">
                <Label>Provincia</Label>
                <Select value={filters.state} onValueChange={(value) => handleFilterChange('state', value === 'all-states' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las provincias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-states">Todas las provincias</SelectItem>
                    {uniqueStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por número de restaurantes */}
              <div className="space-y-2">
                <Label>Número de Restaurantes</Label>
                <Select value={filters.restaurantCount} onValueChange={(value) => handleFilterChange('restaurantCount', value === 'any-count' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier cantidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any-count">Cualquier cantidad</SelectItem>
                    <SelectItem value="0">Sin restaurantes (0)</SelectItem>
                    <SelectItem value="1">1 restaurante</SelectItem>
                    <SelectItem value="2-5">2-5 restaurantes</SelectItem>
                    <SelectItem value="6-10">6-10 restaurantes</SelectItem>
                    <SelectItem value="11+">Más de 10 restaurantes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por email */}
              <div className="space-y-2">
                <Label>Tiene Email</Label>
                <Select value={filters.hasEmail} onValueChange={(value) => handleFilterChange('hasEmail', value === 'any-email' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any-email">Cualquiera</SelectItem>
                    <SelectItem value="yes">Con email</SelectItem>
                    <SelectItem value="no">Sin email</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por CIF/NIF */}
              <div className="space-y-2">
                <Label>Tiene CIF/NIF</Label>
                <Select value={filters.hasTaxId} onValueChange={(value) => handleFilterChange('hasTaxId', value === 'any-tax' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any-tax">Cualquiera</SelectItem>
                    <SelectItem value="yes">Con CIF/NIF</SelectItem>
                    <SelectItem value="no">Sin CIF/NIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por nombre de empresa */}
              <div className="space-y-2">
                <Label>Tiene Empresa</Label>
                <Select value={filters.hasCompanyName} onValueChange={(value) => handleFilterChange('hasCompanyName', value === 'any-company' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquiera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any-company">Cualquiera</SelectItem>
                    <SelectItem value="yes">Con empresa</SelectItem>
                    <SelectItem value="no">Sin empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenar por */}
              <div className="space-y-2">
                <Label>Ordenar por</Label>
                <div className="flex gap-2">
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="franchisee_name">Nombre</SelectItem>
                      <SelectItem value="company_name">Empresa</SelectItem>
                      <SelectItem value="city">Ciudad</SelectItem>
                      <SelectItem value="total_restaurants">Restaurantes</SelectItem>
                      <SelectItem value="created_at">Fecha de creación</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.sortOrder} onValueChange={(value: 'asc' | 'desc') => handleFilterChange('sortOrder', value)}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">↑</SelectItem>
                      <SelectItem value="desc">↓</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Filtros activos */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
                  {filters.search && (
                    <Badge variant="outline" className="gap-1">
                      Búsqueda: "{filters.search}"
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('search', '')}
                      />
                    </Badge>
                  )}
                  {filters.city && (
                    <Badge variant="outline" className="gap-1">
                      Ciudad: {filters.city}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('city', '')}
                      />
                    </Badge>
                  )}
                  {filters.state && (
                    <Badge variant="outline" className="gap-1">
                      Provincia: {filters.state}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('state', '')}
                      />
                    </Badge>
                  )}
                  {filters.restaurantCount && (
                    <Badge variant="outline" className="gap-1">
                      Restaurantes: {filters.restaurantCount}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('restaurantCount', '')}
                      />
                    </Badge>
                  )}
                  {filters.hasEmail && (
                    <Badge variant="outline" className="gap-1">
                      Email: {filters.hasEmail === 'yes' ? 'Con email' : 'Sin email'}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('hasEmail', '')}
                      />
                    </Badge>
                  )}
                  {filters.hasTaxId && (
                    <Badge variant="outline" className="gap-1">
                      CIF/NIF: {filters.hasTaxId === 'yes' ? 'Con CIF/NIF' : 'Sin CIF/NIF'}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('hasTaxId', '')}
                      />
                    </Badge>
                  )}
                  {filters.hasCompanyName && (
                    <Badge variant="outline" className="gap-1">
                      Empresa: {filters.hasCompanyName === 'yes' ? 'Con empresa' : 'Sin empresa'}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('hasCompanyName', '')}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
