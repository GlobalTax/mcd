
import React from 'react';
import { useFastAuth } from '@/hooks/useFastAuth';
import { useNavigate } from 'react-router-dom';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';

type DisplayRestaurant = {
  id: string;
  name?: string;
  restaurant_name?: string;
  location?: string;
  city?: string;
  address?: string;
  siteNumber?: string;
  site_number?: string;
  franchiseeName?: string;
  opening_date?: string;
  contractEndDate?: string;
  restaurant_type?: string;
  status?: string;
  lastYearRevenue?: number;
  baseRent?: number;
  isOwnedByMcD?: boolean;
  currentValuation?: any;
};

const DashboardPage = () => {
  const { user, franchisee, restaurants, loading, isUsingCache } = useFastAuth();
  const navigate = useNavigate();

  console.log('DashboardPage - Fast loading state:', {
    user: user ? { id: user.id, role: user.role } : null,
    franchisee: franchisee ? { id: franchisee.id, name: franchisee.franchisee_name } : null,
    restaurantsCount: restaurants?.length || 0,
    loading,
    isUsingCache
  });

  // Transformar datos para el componente
  const displayRestaurants: DisplayRestaurant[] = restaurants.map(r => ({
    id: r.id || `restaurant-${Math.random()}`,
    name: r.base_restaurant?.restaurant_name || 'Restaurante',
    restaurant_name: r.base_restaurant?.restaurant_name || 'Restaurante',
    location: r.base_restaurant ? 
      `${r.base_restaurant.city || 'Ciudad'}, ${r.base_restaurant.address || 'Dirección'}` : 
      'Ubicación',
    city: r.base_restaurant?.city || 'Ciudad',
    address: r.base_restaurant?.address || 'Dirección',
    siteNumber: r.base_restaurant?.site_number || 'N/A',
    site_number: r.base_restaurant?.site_number || 'N/A',
    franchiseeName: franchisee?.franchisee_name || 'Franquiciado',
    franchise_start_date: r.franchise_start_date,
    franchise_end_date: r.franchise_end_date,
    restaurant_type: r.base_restaurant?.restaurant_type || 'traditional',
    status: r.status || 'active',
    lastYearRevenue: typeof r.last_year_revenue === 'number' ? r.last_year_revenue : 0,
    baseRent: typeof r.monthly_rent === 'number' ? r.monthly_rent : 0,
    isOwnedByMcD: false,
  }));

  const totalRestaurants = displayRestaurants?.length || 0;

  // Loading rápido - máximo 1 segundo
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard rápido...</p>
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
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                {isUsingCache ? (
                  <div className="flex items-center gap-2 px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-xs">
                    <WifiOff className="w-3 h-3" />
                    <span>Modo offline</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                    <Wifi className="w-3 h-3" />
                    <span>En línea</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {isUsingCache ? 'Datos predefinidos - Carga rápida' : 'Datos actualizados'}
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </header>

          <main className="flex-1 p-6">
            <DashboardSummary 
              totalRestaurants={totalRestaurants} 
              displayRestaurants={displayRestaurants}
              isTemporaryData={isUsingCache}
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
