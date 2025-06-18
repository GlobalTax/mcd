
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Valuation {
  id: string;
  valuation_name: string;
  valuation_date: string;
  total_present_value?: number;
}

interface LoadValuationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  valuations: Valuation[];
  onLoadValuation: (valuation: Valuation) => void;
}

const LoadValuationDialog = ({
  isOpen,
  onOpenChange,
  valuations,
  onLoadValuation
}: LoadValuationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cargar Valoración Existente</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {valuations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay valoraciones guardadas para este restaurante
            </p>
          ) : (
            valuations.map((valuation) => (
              <div 
                key={valuation.id} 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onLoadValuation(valuation)}
              >
                <h4 className="font-medium">{valuation.valuation_name}</h4>
                <p className="text-sm text-gray-600">
                  {new Date(valuation.valuation_date).toLocaleDateString('es-ES')}
                </p>
                {valuation.total_present_value && (
                  <p className="text-sm text-green-600 font-medium">
                    €{valuation.total_present_value.toLocaleString('es-ES')}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadValuationDialog;
