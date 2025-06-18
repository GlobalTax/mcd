
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

  const allLocalRestaurants = localFranchisees.flatMap(f => 
    f.restaurants.map(r => ({ ...r, franchiseeName: f.name }))
  );

  // Verificar si el franchisee es temporal
  const isTemporaryFranchisee = franchisee?.id?.startsWith('temp-');
  const hasSupabaseRestaurants = !isTemporaryFranchisee && franchiseeRestaurants.length > 0;
  
  const displayRestaurants: DisplayRestaurant[] = hasSupabaseRestaurants ? 
    franchiseeRestaurants.map(fr => ({
      id: fr.id,
      name: fr.base_restaurant?.restaurant_name,
      restaurant_name: fr.base_restaurant?.restaurant_name,
      location: `${fr.base_restaurant?.city}, ${fr.base_restaurant?.address}`,
      city: fr.base_restaurant?.city,
      address: fr.base_restaurant?.address,
      siteNumber: fr.base_restaurant?.site_number,
      site_number: fr.base_restaurant?.site_number,
      franchiseeName: franchisee?.franchisee_name,
      franchise_start_date: fr.franchise_start_date,
      franchise_end_date: fr.franchise_end_date,
      restaurant_type: fr.base_restaurant?.restaurant_type,
      status: fr.status,
      lastYearRevenue: fr.last_year_revenue,
      baseRent: fr.monthly_rent,
      isOwnedByMcD: false,
    })) : 
    allLocalRestaurants;
  
  const totalRestaurants = displayRestaurants?.length || 0;

  if (restaurantsLoading && !isTemporaryFranchisee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
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
            {/* Si hay datos reales de Supabase o datos temporales, mostrar dashboard */}
            {(hasSupabaseRestaurants || isTemporaryFranchisee || (!restaurantsLoading && franchiseeRestaurants.length === 0)) ? (
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
