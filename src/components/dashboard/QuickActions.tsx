
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, Calendar, TrendingUp, Building2, ArrowRight } from 'lucide-react';

interface DisplayRestaurant {
  id: string;
  name?: string;
  restaurant_name?: string;
  siteNumber?: string;
  site_number?: string;
}

interface QuickActionsProps {
  displayRestaurants: DisplayRestaurant[];
  onNavigateToValuation: () => void;
  onNavigateToAnnualBudget: () => void;
  onNavigateToProfitLoss: (siteNumber: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  displayRestaurants,
  onNavigateToValuation,
  onNavigateToAnnualBudget,
  onNavigateToProfitLoss
}) => {
  const getSiteNumber = (restaurant: DisplayRestaurant): string | undefined => {
    return restaurant.siteNumber || restaurant.site_number;
  };

  const actions = [
    {
      title: 'Valoración',
      description: 'Herramienta profesional',
      icon: Calculator,
      onClick: onNavigateToValuation,
      color: 'text-red-600'
    },
    {
      title: 'Presupuestos',
      description: 'Gestión anual',
      icon: Calendar,
      onClick: onNavigateToAnnualBudget,
      color: 'text-blue-600'
    },
    {
      title: 'Análisis P&L',
      description: 'Rendimiento financiero',
      icon: TrendingUp,
      onClick: () => {
        const firstRestaurant = displayRestaurants[0];
        const siteNumber = getSiteNumber(firstRestaurant);
        if (siteNumber) {
          onNavigateToProfitLoss(siteNumber);
        }
      },
      color: 'text-green-600',
      disabled: displayRestaurants.length === 0
    },
    {
      title: 'Restaurantes',
      description: `${displayRestaurants.length} asignados`,
      icon: Building2,
      onClick: () => {},
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="mb-12">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Acciones rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className="bg-white border border-gray-100 rounded-lg p-6 text-left hover:border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div className="flex items-center justify-between mb-4">
              <action.icon className={`w-5 h-5 ${action.color}`} />
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
