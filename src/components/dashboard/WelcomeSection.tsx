
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calculator, Plus, ArrowRight, Building2, Shield, Users, Euro, Hash, MapPin } from 'lucide-react';

interface WelcomeSectionProps {
  onNavigateToValuation: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  onNavigateToValuation
}) => {
  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <Card className="border border-gray-200/60 shadow-sm bg-gradient-to-br from-red-50/50 via-white to-yellow-50/30">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Building className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Bienvenido al Portal de McDonald's!
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Tu asesor aún no te ha asignado restaurantes. Mientras tanto, puedes usar la herramienta de valoración.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={onNavigateToValuation}
            >
              <Plus className="w-5 h-5 mr-2" />
              Ir a Herramienta de Valoración
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="relative overflow-hidden border border-gray-200/60 shadow-sm bg-white">
          <div className="absolute top-4 right-4 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold text-xs">1</span>
          </div>
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Añadir Restaurantes
            </h4>
            <p className="text-gray-600 mb-4 text-sm">
              Registra todos tus restaurantes McDonald's con sus datos operativos.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>• Número de sitio</div>
              <div>• Ubicación y dirección</div>
              <div>• Datos financieros básicos</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-200/60 shadow-sm bg-white">
          <div className="absolute top-4 right-4 w-6 h-6 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold text-xs">2</span>
          </div>
          <CardContent className="p-6">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
              <Calculator className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Realizar Valoraciones
            </h4>
            <p className="text-gray-600 mb-4 text-sm">
              Utiliza la herramienta profesional para valorar tus restaurantes.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <div>• Proyecciones de flujo de caja</div>
              <div>• Análisis de rentabilidad</div>
              <div>• Valoración de mercado</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Card */}
      <Card className="border-2 border-red-100 hover:border-red-200 transition-colors cursor-pointer shadow-sm bg-white" 
            onClick={onNavigateToValuation}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  Herramienta de Valoración
                </h4>
                <p className="text-gray-600 text-sm">
                  Accede directamente a la configuración y valoración de restaurantes
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-red-600" />
          </div>
        </CardContent>
      </Card>

      {/* Example Preview */}
      <div className="bg-gray-50/50 rounded-xl border border-gray-200/60 p-6 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-4">
          Vista Previa: Así se verán tus restaurantes
        </h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Example Restaurant Card */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-white/80">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold text-gray-700 text-sm">McDonald's Centro</h5>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Hash className="w-3 h-3" />
                    <span>Site: 12345</span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-xs">M</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <MapPin className="w-3 h-3" />
                <span>Madrid, Calle Principal 123</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Euro className="w-3 h-3 text-green-600" />
                  <span className="text-xs">€850,000</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-blue-600" />
                  <span className="text-xs">€45,000</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50 opacity-60">
            <div className="text-center text-gray-400 py-6">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span className="text-xs">Tus restaurantes aparecerán aquí</span>
            </div>
          </div>
          
          <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50 opacity-40">
            <div className="text-center text-gray-400 py-6">
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span className="text-xs">Y aquí también</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
