
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/valuationUtils';

interface ValuationResultProps {
  totalPrice: number;
  remainingYears: number;
}

const ValuationResult = ({ totalPrice, remainingYears }: ValuationResultProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-700">Precio Final</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="text-4xl font-bold text-green-600">
            {formatCurrency(totalPrice)}
          </p>
          <p className="text-sm text-gray-600 mt-2">Valor Presente Total</p>
          <p className="text-xs text-gray-500 mt-1">
            ({remainingYears.toFixed(4)} años exactos)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuationResult;
