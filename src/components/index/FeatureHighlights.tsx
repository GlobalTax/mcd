
import { Building, Calculator, TrendingUp } from "lucide-react";

export const FeatureHighlights = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis Financiero</h3>
        <p className="text-gray-600">Herramientas avanzadas para análisis de rentabilidad y proyecciones financieras</p>
      </div>
      
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Valoración Profesional</h3>
        <p className="text-gray-600">Sistema de valoración DCF profesional para franquicias McDonald's</p>
      </div>
      
      <div className="text-center p-6">
        <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión Integral</h3>
        <p className="text-gray-600">Administración completa de restaurantes y asignaciones</p>
      </div>
    </div>
  );
};
