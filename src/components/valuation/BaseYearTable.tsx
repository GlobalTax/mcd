
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ValuationInputs } from '@/types/valuation';
import { formatCurrency, formatPercentage } from '@/utils/valuationUtils';

interface BaseYearTableProps {
  inputs: ValuationInputs;
  onInputChange: (key: keyof ValuationInputs, value: number) => void;
}

const BaseYearTable = ({ inputs, onInputChange }: BaseYearTableProps) => {
  const totalNonControllables = inputs.rent + inputs.serviceFees + inputs.depreciation + inputs.interest + inputs.rentIndex + inputs.miscell;
  const soi = inputs.pac - totalNonControllables;
  const cashflow = inputs.pac - inputs.rent - inputs.serviceFees - inputs.rentIndex - inputs.miscell - inputs.loanPayment;
  const cashAfterReinv = cashflow;
  const cfLibre = cashAfterReinv + inputs.loanPayment;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">Rte. PARC CENTRAL - Año Base</CardTitle>
        <div className="text-center">
          <p className="text-lg font-semibold">2024</p>
          <p className="text-sm text-gray-600">Datos de referencia</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-3 text-left font-bold w-1/2"></th>
                <th className="border border-gray-300 p-3 text-right font-bold">€</th>
                <th className="border border-gray-300 p-3 text-right font-bold">%</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold">
                <td className="border border-gray-300 p-3">P&L</td>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-3 font-semibold">SALES</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.sales}
                    onChange={(e) => onInputChange('sales', Number(e.target.value))}
                    className="text-right font-semibold border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right font-semibold">100,00%</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 p-3 font-semibold">P.A.C.</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.pac}
                    onChange={(e) => onInputChange('pac', Number(e.target.value))}
                    className="text-right font-semibold border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatPercentage((inputs.pac / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 pl-6">RENT</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.rent}
                    onChange={(e) => onInputChange('rent', Number(e.target.value))}
                    className="text-right border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((inputs.rent / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 pl-6">SERVICE FEES</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.serviceFees}
                    onChange={(e) => onInputChange('serviceFees', Number(e.target.value))}
                    className="text-right border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((inputs.serviceFees / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 pl-6">DEPRECIATION</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.depreciation}
                    onChange={(e) => onInputChange('depreciation', Number(e.target.value))}
                    className="text-right border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((inputs.depreciation / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 pl-6">INTEREST</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.interest}
                    onChange={(e) => onInputChange('interest', Number(e.target.value))}
                    className="text-right border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((inputs.interest / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 pl-6">RENT INDEX</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.rentIndex}
                    onChange={(e) => onInputChange('rentIndex', Number(e.target.value))}
                    className="text-right border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((inputs.rentIndex / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3 pl-6">MISCELL</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.miscell}
                    onChange={(e) => onInputChange('miscell', Number(e.target.value))}
                    className="text-right border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((inputs.miscell / inputs.sales) * 100)}</td>
              </tr>
              <tr className="bg-orange-100 font-semibold">
                <td className="border border-gray-300 p-3">TOTAL NON-CONTROLLABLES</td>
                <td className="border border-gray-300 p-3 text-right">{formatCurrency(totalNonControllables)}</td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((totalNonControllables / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
              </tr>
              <tr className="bg-green-100">
                <td className="border border-gray-300 p-3 font-semibold">S.O.I.</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatCurrency(soi)}</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatPercentage((soi / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">LOAN PAYMENT</td>
                <td className="border border-gray-300 p-1">
                  <Input
                    type="number"
                    value={inputs.loanPayment}
                    onChange={(e) => onInputChange('loanPayment', Number(e.target.value))}
                    className="text-right border-0 bg-transparent p-2"
                  />
                </td>
                <td className="border border-gray-300 p-3 text-right">{formatPercentage((inputs.loanPayment / inputs.sales) * 100)}</td>
              </tr>
              <tr className="bg-blue-100">
                <td className="border border-gray-300 p-3 font-semibold">CASHFLOW</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatCurrency(cashflow)}</td>
                <td className="border border-gray-300 p-3 text-right font-semibold">{formatPercentage((cashflow / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3">REMODELACION / REINVERSION</td>
                <td className="border border-gray-300 p-3 text-right">0</td>
                <td className="border border-gray-300 p-3 text-right">0,00%</td>
              </tr>
              <tr className="bg-blue-200">
                <td className="border border-gray-300 p-3 font-bold">CASH AFTER REINV</td>
                <td className="border border-gray-300 p-3 text-right font-bold">{formatCurrency(cashAfterReinv)}</td>
                <td className="border border-gray-300 p-3 text-right font-bold">{formatPercentage((cashAfterReinv / inputs.sales) * 100)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
                <td className="border border-gray-300 p-3"></td>
              </tr>
              <tr className="bg-green-300">
                <td className="border border-gray-300 p-3 font-bold text-lg">CF LIBRE</td>
                <td className="border border-gray-300 p-3 text-right font-bold text-lg">{formatCurrency(cfLibre)}</td>
                <td className="border border-gray-300 p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseYearTable;
