
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { DashboardSummary } from '@/components/dashboard/DashboardSummary';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { Franchisee } from '@/types/restaurant';

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
  const { user, franchisee } = useAuth();
  const navigate = useNavigate();
  const [localFranchisees] = useLocalStorage<Franchisee[]>('franchisees', []);
  const { restaurants: franchiseeRestaurants, loading: restaurantsLoading } = useFranchiseeRestaurants();

  console.log('DashboardPage - Current state:', {
    user: user ? { id: user.id, role: user.role } : null,
    franchisee: franchisee ? { id: franchisee.id, name: franchisee.franchisee_name } : null,
    restaurantsCount: franchiseeRestaurants?.length || 0,
    loading: restaurantsLoading
  });

  // Verificar que tenemos los datos mínimos necesarios
  if (!user) {
    console.log('DashboardPage - No user, redirecting to auth');
    navigate('/auth');
    return null;
  }

  const allLocalRestaurants = Array.isArray(localFranchisees) ? 
    localFranchisees.flatMap(f => 
      (f.restaurants || []).map(r => ({ ...r, franchiseeName: f.name }))
    ) : [];

  // Verificar si el franchisee es temporal de forma segura
  const isTemporaryFranchisee = franchisee?.id?.startsWith('temp-') || false;
  const hasSupabaseRestaurants = !isTemporaryFranchisee && Array.isArray(franchiseeRestaurants) && franchiseeRestaurants.length > 0;
  
  // Construir displayRestaurants de forma segura
  const displayRestaurants: DisplayRestaurant[] = hasSupabaseRestaurants ? 
    franchiseeRestaurants.map(fr => ({
      id: fr.id || 'unknown',
      name: fr.base_restaurant?.restaurant_name || 'Restaurante sin nombre',
      restaurant_name: fr.base_restaurant?.restaurant_name || 'Restaurante sin nombre',
      location: fr.base_restaurant ? `${fr.base_restaurant.city || 'Ciudad'}, ${fr.base_restaurant.address || 'Dirección'}` : 'Ubicación no disponible',
      city: fr.base_restaurant?.city || 'Ciudad',
      address: fr.base_restaurant?.address || 'Dirección',
      siteNumber: fr.base_restaurant?.site_number || 'N/A',
      site_number: fr.base_restaurant?.site_number || 'N/A',
      franchiseeName: franchisee?.franchisee_name || 'Franquiciado',
      franchise_start_date: fr.franchise_start_date,
      franchise_end_date: fr.franchise_end_date,
      restaurant_type: fr.base_restaurant?.restaurant_type || 'traditional',
      status: fr.status || 'active',
      lastYearRevenue: fr.last_year_revenue || 0,
      baseRent: fr.monthly_rent || 0,
      isOwnedByMcD: false,
    })) : 
    allLocalRestaurants;
  
  const totalRestaurants = displayRestaurants?.length || 0;

  // Loading state mejorado
  if (restaurantsLoading && !isTemporaryFranchisee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando datos del dashboard...</p>
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
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Resumen de tu actividad</p>
            </div>
          </header>

          <main className="flex-1 p-6">
            {/* Mostrar dashboard con datos verificados */}
            {(hasSupabaseRestaurants || isTemporaryFranchisee || (!restaurantsLoading && Array.isArray(franchiseeRestaurants))) ? (
              <DashboardSummary 
                totalRestaurants={totalRestaurants} 
                displayRestaurants={displayRestaurants}
                isTemporaryData={isTemporaryFranchisee}
              />
            ) : (
              <WelcomeSection onNavigateToValuation={() => navigate('/valuation')} />
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardPage;
