
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, TrendingUp, Calculator, BarChart3 } from 'lucide-react';

interface DashboardMetricsProps {
  totalRestaurants: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  totalRestaurants
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Restaurantes</p>
              <p className="text-2xl font-bold text-gray-900">{totalRestaurants}</p>
              <p className="text-xs text-green-600 font-medium mt-1">+2 este mes</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">€2.4M</p>
              <p className="text-xs text-green-600 font-medium mt-1">+8.2% vs mes anterior</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Valoración Media</p>
              <p className="text-2xl font-bold text-gray-900">€1.8M</p>
              <p className="text-xs text-blue-600 font-medium mt-1">Por restaurante</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Rentabilidad</p>
              <p className="text-2xl font-bold text-green-600">+12.5%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">ROI promedio</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
