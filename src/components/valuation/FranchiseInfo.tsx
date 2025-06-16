
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ValuationInputs } from '@/types/valuation';

interface FranchiseInfoProps {
  inputs: ValuationInputs;
  onInputChange: (key: keyof ValuationInputs, value: string | number) => void;
}

const FranchiseInfo = ({ inputs, onInputChange }: FranchiseInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Contrato de Franquicia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Fecha de cambio</label>
            <Input
              type="date"
              value={inputs.changeDate}
              onChange={(e) => onInputChange('changeDate', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Fecha finalización contrato de franquicia</label>
            <Input
              type="date"
              value={inputs.franchiseEndDate}
              onChange={(e) => onInputChange('franchiseEndDate', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Años restantes contratos de franquicia</label>
            <Input
              type="number"
              step="0.0001"
              value={inputs.remainingYears}
              readOnly
              className="w-full bg-gray-100"
              title="Se calcula automáticamente con precisión de 4 decimales"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FranchiseInfo;
