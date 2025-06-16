
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ValuationInputs, YearlyData } from '@/types/valuation';
import { formatCurrency, formatPercentage } from '@/utils/valuationUtils';

interface ProjectionTableProps {
  inputs: ValuationInputs;
  yearlyData: YearlyData[];
  onYearlyDataChange: (yearIndex: number, field: keyof YearlyData, value: number) => void;
}

const ProjectionTable = ({ inputs, yearlyData, onYearlyDataChange }: ProjectionTableProps) => {
  const yearsCount = Math.ceil(inputs.remainingYears);

  if (yearsCount === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyección Manual por Años ({inputs.remainingYears.toFixed(4)} años exactos)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left font-bold bg-gray-50">Concepto</th>
                {Array.from({ length: yearsCount }, (_, i) => (
                  <React.Fragment key={i}>
                    <th className="border border-gray-300 p-2 text-center font-bold bg-gray-50">
                      Año {i + 1}
                      {i === yearsCount - 1 && inputs.remainingYears % 1 !== 0 && (
                        <div className="text-xs text-gray-600">
                          ({((inputs.remainingYears % 1) * 12).toFixed(1)} meses)
                        </div>
                      )}
                    </th>
                    <th className="border border-gray-300 p-2 text-center font-bold bg-gray-50 w-20">
                      %
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-2 font-semibold">SALES</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.sales}
                        onChange={(e) => onYearlyDataChange(i, 'sales', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage(100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 p-2 font-semibold">P.A.C.</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.pac}
                        onChange={(e) => onYearlyDataChange(i, 'pac', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.pac / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">RENT</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.rent}
                        onChange={(e) => onYearlyDataChange(i, 'rent', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.rent / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">SERVICE FEES</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.serviceFees}
                        onChange={(e) => onYearlyDataChange(i, 'serviceFees', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.serviceFees / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">DEPRECIATION</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.depreciation}
                        onChange={(e) => onYearlyDataChange(i, 'depreciation', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.depreciation / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">INTEREST</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.interest}
                        onChange={(e) => onYearlyDataChange(i, 'interest', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.interest / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">RENT INDEX</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.rentIndex}
                        onChange={(e) => onYearlyDataChange(i, 'rentIndex', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.rentIndex / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">MISCELL</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.miscell}
                        onChange={(e) => onYearlyDataChange(i, 'miscell', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.miscell / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">LOAN PAYMENT</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={i}>
                    <td className="border border-gray-300 p-1">
                      <Input
                        type="number"
                        value={yearData.loanPayment}
                        onChange={(e) => onYearlyDataChange(i, 'loanPayment', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50">
                      {formatPercentage((yearData.loanPayment / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              <tr className="bg-green-200 font-bold">
                <td className="border border-gray-300 p-2">CF LIBRE</td>
                {yearlyData.map((yearData, i) => {
                  const yearCashAfterReinv = yearData.pac - yearData.rent - yearData.serviceFees - yearData.rentIndex - yearData.miscell - yearData.loanPayment;
                  const yearCfLibre = yearCashAfterReinv + yearData.loanPayment;
                  return (
                    <React.Fragment key={i}>
                      <td className="border border-gray-300 p-2 text-right font-bold">
                        {formatCurrency(yearCfLibre)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-gray-50 font-bold">
                        {formatPercentage((yearCfLibre / yearData.sales) * 100)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectionTable;
