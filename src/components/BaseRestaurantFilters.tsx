
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Search, Filter, X, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export interface BaseRestaurantFilters {
  search: string;
  city: string;
  state: string;
  autonomousCommunity: string;
  restaurantType: string;
  propertyType: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

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

interface BaseRestaurantFiltersProps {
  restaurants: BaseRestaurant[];
  filters: BaseRestaurantFilters;
  onFiltersChange: (filters: BaseRestaurantFilters) => void;
  onClearFilters: () => void;
}

export const BaseRestaurantFiltersComponent: React.FC<BaseRestaurantFiltersProps> = ({
  restaurants,
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Obtener valores únicos para los filtros
  const uniqueCities = [...new Set(restaurants.map(r => r.city).filter(Boolean))].sort();
  const uniqueStates = [...new Set(restaurants.map(r => r.state).filter(Boolean))].sort();
  const uniqueAutonomousCommunities = [...new Set(restaurants.map(r => r.autonomous_community).filter(Boolean))].sort();
  const uniqueRestaurantTypes = [...new Set(restaurants.map(r => r.restaurant_type).filter(Boolean))].sort();
  const uniquePropertyTypes = [...new Set(restaurants.map(r => r.property_type).filter(Boolean))].sort();

  const handleFilterChange = useCallback((key: keyof BaseRestaurantFilters, value: string) => {
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
    if (filters.autonomousCommunity) count++;
    if (filters.restaurantType) count++;
    if (filters.propertyType) count++;
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
                  Filtros de Restaurantes
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
                    placeholder="Nombre, número, dirección..."
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

              {/* Filtro por comunidad autónoma */}
              <div className="space-y-2">
                <Label>Comunidad Autónoma</Label>
                <Select value={filters.autonomousCommunity} onValueChange={(value) => handleFilterChange('autonomousCommunity', value === 'all-communities' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las comunidades" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-communities">Todas las comunidades</SelectItem>
                    {uniqueAutonomousCommunities.map((community) => (
                      <SelectItem key={community} value={community}>
                        {community}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por tipo de restaurante */}
              <div className="space-y-2">
                <Label>Tipo de Restaurante</Label>
                <Select value={filters.restaurantType} onValueChange={(value) => handleFilterChange('restaurantType', value === 'all-types' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">Todos los tipos</SelectItem>
                    {uniqueRestaurantTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por tipo de propiedad */}
              <div className="space-y-2">
                <Label>Tipo de Propiedad</Label>
                <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange('propertyType', value === 'all-properties' ? '' : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-properties">Todos los tipos</SelectItem>
                    {uniquePropertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
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
                      <SelectItem value="restaurant_name">Nombre</SelectItem>
                      <SelectItem value="site_number">Número</SelectItem>
                      <SelectItem value="city">Ciudad</SelectItem>
                      <SelectItem value="autonomous_community">Comunidad</SelectItem>
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
                  {filters.autonomousCommunity && (
                    <Badge variant="outline" className="gap-1">
                      Comunidad: {filters.autonomousCommunity}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('autonomousCommunity', '')}
                      />
                    </Badge>
                  )}
                  {filters.restaurantType && (
                    <Badge variant="outline" className="gap-1">
                      Tipo: {filters.restaurantType}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('restaurantType', '')}
                      />
                    </Badge>
                  )}
                  {filters.propertyType && (
                    <Badge variant="outline" className="gap-1">
                      Propiedad: {filters.propertyType}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => handleFilterChange('propertyType', '')}
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
