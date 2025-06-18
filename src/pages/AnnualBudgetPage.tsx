
import React, { useState } from 'react';
import { AnnualBudgetGrid } from '@/components/budget/AnnualBudgetGrid';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Calendar } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';

export default function AnnualBudgetPage() {
  const { restaurants, loading: restaurantsLoading } = useFranchiseeRestaurants();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (restaurantsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando restaurantes...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">Presupuestos Anuales</h1>
              <p className="text-sm text-gray-500">Gestión de presupuestos mensuales</p>
            </div>
          </header>

          <main className="flex-1 p-6 space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Seleccionar Restaurante y Año
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Restaurante
                    </label>
                    <Select value={selectedRestaurant} onValueChange={setSelectedRestaurant}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar restaurante" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurants.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            {restaurant.base_restaurant?.restaurant_name || 'Sin nombre'} - 
                            {restaurant.base_restaurant?.site_number || 'Sin número'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año
                    </label>
                    <Select 
                      value={selectedYear.toString()} 
                      onValueChange={(value) => setSelectedYear(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de Presupuesto */}
            {selectedRestaurant ? (
              <div className="w-full">
                <AnnualBudgetGrid
                  restaurantId={selectedRestaurant}
                  year={selectedYear}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Selecciona un Restaurante
                  </h3>
                  <p className="text-gray-500">
                    Elige un restaurante de la lista para comenzar a trabajar con su presupuesto anual.
                  </p>
                </CardContent>
              </Card>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
