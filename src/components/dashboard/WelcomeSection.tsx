
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, ArrowRight } from 'lucide-react';

interface WelcomeSectionProps {
  onNavigateToValuation: () => void;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  onNavigateToValuation
}) => {
  return (
    <div className="text-center py-20">
      <div className="max-w-lg mx-auto">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Bienvenido al Portal McDonald's
        </h2>
        
        <p className="text-gray-600 mb-8">
          Tu asesor aún no te ha asignado restaurantes. 
          Puedes comenzar usando la herramienta de valoración.
        </p>
        
        <Button
          onClick={onNavigateToValuation}
          className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center gap-2"
        >
          Herramienta de Valoración
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
