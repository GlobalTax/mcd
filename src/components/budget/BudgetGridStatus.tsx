
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BudgetGridStatusProps {
  loading?: boolean;
  error?: string | null;
  onReload?: () => void;
}

export const BudgetGridStatus: React.FC<BudgetGridStatusProps> = ({
  loading,
  error,
  onReload
}) => {
  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando presupuesto...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <div className="text-red-500 mb-4">
            <p className="font-semibold">Error al cargar los datos</p>
            <p className="text-sm">{error}</p>
          </div>
          <Button 
            onClick={onReload}
            variant="outline"
          >
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
};
