
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ValuationInputs } from '@/types/valuation';
import { formatCurrency, formatPercentage } from '@/utils/valuationUtils';

interface BaseYearTableProps {
  inputs: ValuationInputs;
  onInputChange: (key: keyof ValuationInputs, value: number | string) => void;
}

const BaseYearTable = ({ inputs, onInputChange }: BaseYearTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos del Año Base</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">SALES</label>
              <Input
                type="number"
                value={inputs.sales}
                onChange={(e) => onInputChange('sales', Number(e.target.value))}
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">P.A.C.</label>
              <Input
                type="number"
                value={inputs.pac}
                onChange={(e) => onInputChange('pac', Number(e.target.value))}
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RENT</label>
              <Input
                type="number"
                value={inputs.rent}
                onChange={(e) => onInputChange('rent', Number(e.target.value))}
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SERVICE FEES</label>
              <Input
                type="number"
                value={inputs.serviceFees}
                onChange={(e) => onInputChange('serviceFees', Number(e.target.value))}
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DEPRECIATION</label>
              <Input
                type="number"
                value={inputs.depreciation}
                onChange={(e) => onInputChange('depreciation', Number(e.target.value))}
                className="text-right"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">INTEREST</label>
              <Input
                type="number"
                value={inputs.interest}
                onChange={(e) => onInputChange('interest', Number(e.target.value))}
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">RENT INDEX</label>
              <Input
                type="number"
                value={inputs.rentIndex}
                onChange={(e) => onInputChange('rentIndex', Number(e.target.value))}
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">MISCELL</label>
              <Input
                type="number"
                value={inputs.miscell}
                onChange={(e) => onInputChange('miscell', Number(e.target.value))}
                className="text-right"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LOAN PAYMENT</label>
              <Input
                type="number"
                value={inputs.loanPayment}
                onChange={(e) => onInputChange('loanPayment', Number(e.target.value))}
                className="text-right"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseYearTable;
