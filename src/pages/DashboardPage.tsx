
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { InvitationPanel } from '@/components/InvitationPanel';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { WelcomeSection } from '@/components/dashboard/WelcomeSection';
import { RestaurantsSection } from '@/components/dashboard/RestaurantsSection';
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
  const { user, franchisee, signOut } = useAuth();
  const navigate = useNavigate();
  const [localFranchisees] = useLocalStorage<Franchisee[]>('franchisees', []);
  const { restaurants: franchiseeRestaurants, loading: restaurantsLoading } = useFranchiseeRestaurants();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const allLocalRestaurants = localFranchisees.flatMap(f => 
    f.restaurants.map(r => ({ ...r, franchiseeName: f.name }))
  );

  const hasSupabaseRestaurants = franchiseeRestaurants.length > 0;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        userName={user?.full_name || user?.email}
        onNavigateToSettings={() => navigate('/settings')}
        onSignOut={handleSignOut}
      />

      <div className="max-w-7xl mx-auto px-8 py-8">
        <InvitationPanel />

        {hasSupabaseRestaurants || (!restaurantsLoading && franchiseeRestaurants.length === 0) ? (
          <div className="space-y-8">
            <DashboardMetrics totalRestaurants={totalRestaurants} />

            <QuickActions 
              displayRestaurants={displayRestaurants}
              onNavigateToValuation={() => navigate('/valuation')}
              onNavigateToAnnualBudget={() => navigate('/annual-budget')}
              onNavigateToProfitLoss={(siteNumber) => navigate(`/restaurant/${siteNumber}/profitloss`)}
            />

            <RestaurantsSection 
              franchiseeId={franchisee?.id || ''}
              franchiseeRestaurants={franchiseeRestaurants}
              hasSupabaseRestaurants={hasSupabaseRestaurants}
              allLocalRestaurants={allLocalRestaurants}
            />
          </div>
        ) : (
          <WelcomeSection onNavigateToValuation={() => navigate('/valuation')} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
