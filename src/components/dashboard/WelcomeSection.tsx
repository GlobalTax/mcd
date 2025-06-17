
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
      <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 via-white to-yellow-50">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Building className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Bienvenido al Portal de McDonald's!
            </h3>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Tu asesor aún no te ha asignado restaurantes. Mientras tanto, puedes usar la herramienta de valoración.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
        <Card className="relative overflow-hidden border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <div className="absolute top-4 right-4 w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold">1</span>
          </div>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Añadir Restaurantes
            </h4>
            <p className="text-gray-600 mb-4">
              Registra todos tus restaurantes McDonald's con sus datos operativos.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div>• Número de sitio</div>
              <div>• Ubicación y dirección</div>
              <div>• Datos financieros básicos</div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-lg bg-white/60 backdrop-blur-sm">
          <div className="absolute top-4 right-4 w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
            <span className="text-red-600 font-bold">2</span>
          </div>
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Realizar Valoraciones
            </h4>
            <p className="text-gray-600 mb-4">
              Utiliza la herramienta profesional para valorar tus restaurantes.
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div>• Proyecciones de flujo de caja</div>
              <div>• Análisis de rentabilidad</div>
              <div>• Valoración de mercado</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Card */}
      <Card className="border-2 border-red-100 hover:border-red-200 transition-colors cursor-pointer shadow-lg bg-white/60 backdrop-blur-sm" 
            onClick={onNavigateToValuation}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center">
                <Calculator className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  Herramienta de Valoración
                </h4>
                <p className="text-gray-600">
                  Accede directamente a la configuración y valoración de restaurantes
                </p>
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-red-600" />
          </div>
        </CardContent>
      </Card>

      {/* Example Preview */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Vista Previa: Así se verán tus restaurantes
        </h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Example Restaurant Card */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold text-gray-700">McDonald's Centro</h5>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Hash className="w-4 h-4" />
                    <span>Site: 12345</span>
                  </div>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 font-bold">M</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <MapPin className="w-4 h-4" />
                <span>Madrid, Calle Principal 123</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Euro className="w-4 h-4 text-green-600" />
                  <span className="text-xs">€850,000</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="text-xs">€45,000</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 opacity-60">
            <div className="text-center text-gray-400 py-8">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Tus restaurantes aparecerán aquí</span>
            </div>
          </div>
          
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 opacity-40">
            <div className="text-center text-gray-400 py-8">
              <Plus className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm">Y aquí también</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
