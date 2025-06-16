
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ValuationInputs } from '@/types/valuation';

interface ValuationParametersProps {
  inputs: ValuationInputs;
  onInputChange: (key: keyof ValuationInputs, value: number) => void;
}

const ValuationParameters = ({ inputs, onInputChange }: ValuationParametersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parámetros del Modelo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Inflación:</span>
            <Input
              type="number"
              step="0.01"
              value={inputs.inflationRate}
              onChange={(e) => onInputChange('inflationRate', Number(e.target.value))}
              className="w-20 text-right text-sm"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Tasa de Descuento:</span>
            <Input
              type="number"
              step="0.01"
              value={inputs.discountRate}
              onChange={(e) => onInputChange('discountRate', Number(e.target.value))}
              className="w-20 text-right text-sm"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Crecimiento Ventas:</span>
            <Input
              type="number"
              step="0.01"
              value={inputs.growthRate}
              onChange={(e) => onInputChange('growthRate', Number(e.target.value))}
              className="w-20 text-right text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuationParameters;
