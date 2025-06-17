
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Calendar, TrendingUp, Building2, ArrowUpRight } from 'lucide-react';

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

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200/60 cursor-pointer bg-white" 
              onClick={onNavigateToValuation}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                <Calculator className="w-5 h-5 text-red-600" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Herramienta de Valoración</h3>
            <p className="text-xs text-gray-500">
              Accede a la herramienta profesional
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200/60 cursor-pointer bg-white" 
              onClick={onNavigateToAnnualBudget}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Presupuestos Anuales</h3>
            <p className="text-xs text-gray-500">
              Gestiona presupuestos mensuales
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200/60 bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Análisis P&L</h3>
            <p className="text-xs text-gray-500 mb-3">
              Analiza el rendimiento financiero
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs border-gray-200 hover:bg-gray-50"
              onClick={() => {
                const firstRestaurant = displayRestaurants[0];
                const siteNumber = getSiteNumber(firstRestaurant);
                if (siteNumber) {
                  onNavigateToProfitLoss(siteNumber);
                }
              }}
              disabled={displayRestaurants.length === 0}
            >
              Ir a P&L
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200/60 bg-white">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 text-sm">Gestión de Restaurantes</h3>
            <p className="text-xs text-gray-500 mb-1">
              Administra información de restaurantes
            </p>
            <div className="text-xs text-gray-400">
              {displayRestaurants.length} restaurantes asignados
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
