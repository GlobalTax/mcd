
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/60 backdrop-blur-sm cursor-pointer" 
            onClick={onNavigateToValuation}>
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
            <Calculator className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Herramienta de Valoración</h3>
          <p className="text-sm text-gray-600 mb-4">
            Accede a la herramienta profesional de valoración
          </p>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/60 backdrop-blur-sm cursor-pointer" 
            onClick={onNavigateToAnnualBudget}>
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Presupuestos Anuales</h3>
          <p className="text-sm text-gray-600 mb-4">
            Gestiona presupuestos anuales mensuales
          </p>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
        </CardContent>
      </Card>

      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Análisis P&L</h3>
          <p className="text-sm text-gray-600 mb-4">
            Analiza el rendimiento financiero
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-gray-200"
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

      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-100 transition-colors">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Gestión de Restaurantes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Administra información de restaurantes
          </p>
          <div className="text-sm text-gray-500">
            {displayRestaurants.length} restaurantes asignados
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
