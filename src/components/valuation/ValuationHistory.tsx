
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RestaurantValuation } from '@/types/restaurantValuation';
import { formatCurrency } from '@/utils/valuationUtils';
import { Calendar, DollarSign, Trash2, Copy } from 'lucide-react';

interface ValuationHistoryProps {
  valuations: RestaurantValuation[];
  selectedRestaurantId: string | null;
  onLoadValuation: (valuation: RestaurantValuation) => void;
  onDeleteValuation: (id: string) => void;
  onDuplicateValuation: (valuation: RestaurantValuation) => void;
}

const ValuationHistory = ({ 
  valuations, 
  selectedRestaurantId,
  onLoadValuation,
  onDeleteValuation,
  onDuplicateValuation
}: ValuationHistoryProps) => {
  const filteredValuations = selectedRestaurantId 
    ? valuations.filter(v => v.restaurant_id === selectedRestaurantId)
    : [];

  if (!selectedRestaurantId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historial de Valoraciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Selecciona un restaurante para ver su historial de valoraciones.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Valoraciones</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredValuations.length === 0 ? (
          <p className="text-gray-500">No hay valoraciones guardadas para este restaurante.</p>
        ) : (
          <div className="space-y-3">
            {filteredValuations.map((valuation) => (
              <div key={valuation.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{valuation.valuation_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(valuation.valuation_date).toLocaleDateString('es-ES')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {valuation.total_present_value ? formatCurrency(valuation.total_present_value) : 'Sin calcular'}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    onClick={() => onLoadValuation(valuation)}
                    className="flex-1"
                  >
                    Cargar Valoración
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDuplicateValuation(valuation)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteValuation(valuation.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ValuationHistory;
