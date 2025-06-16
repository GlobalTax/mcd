
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

  // Función para generar las fechas de cada período
  const generatePeriodDates = (yearIndex: number) => {
    const baseYear = 2025;
    const startYear = baseYear + yearIndex;
    const endYear = startYear + 1;
    
    const startDate = `16-jun-${startYear.toString().slice(-2)}`;
    const endDate = `15-jun-${endYear.toString().slice(-2)}`;
    
    return `${startDate} / ${endDate}`;
  };

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
                    <th className="border border-gray-300 p-2 text-center font-bold bg-green-500 text-white">
                      <div>{2025 + i}</div>
                      <div className="text-xs font-normal mt-1">
                        {generatePeriodDates(i)}
                      </div>
                      {i === yearsCount - 1 && inputs.remainingYears % 1 !== 0 && (
                        <div className="text-xs text-gray-200 mt-1">
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
              {/* SALES row */}
              <tr className="bg-green-200">
                <td className="border border-gray-300 p-2 font-semibold bg-green-600 text-white">SALES</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`sales-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.sales}
                        onChange={(e) => onYearlyDataChange(i, 'sales', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage(100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* P.A.C. row */}
              <tr className="bg-green-200">
                <td className="border border-gray-300 p-2 font-semibold bg-green-600 text-white">P.A.C.</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`pac-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.pac}
                        onChange={(e) => onYearlyDataChange(i, 'pac', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.pac / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* RENT row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">RENT</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`rent-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.rent}
                        onChange={(e) => onYearlyDataChange(i, 'rent', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.rent / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* SERVICE FEES row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">SERVICE FEES</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`serviceFees-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.serviceFees}
                        onChange={(e) => onYearlyDataChange(i, 'serviceFees', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.serviceFees / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* DEPRECIATION row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">DEPRECIATION</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`depreciation-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.depreciation}
                        onChange={(e) => onYearlyDataChange(i, 'depreciation', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.depreciation / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* INTEREST row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">INTEREST</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`interest-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.interest}
                        onChange={(e) => onYearlyDataChange(i, 'interest', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.interest / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* RENT INDEX row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">RENT INDEX</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`rentIndex-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.rentIndex}
                        onChange={(e) => onYearlyDataChange(i, 'rentIndex', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.rentIndex / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* MISCELL row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">MISCELL</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`miscell-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.miscell}
                        onChange={(e) => onYearlyDataChange(i, 'miscell', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.miscell / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* TOTAL NON-CONTROLLABLES row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">TOTAL NON-CONTROLLABLES</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  return (
                    <React.Fragment key={`totalNonControllables-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-green-100">
                        {formatCurrency(totalNonControllables)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                        {formatPercentage((totalNonControllables / yearData.sales) * 100)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* S.O.I. row */}
              <tr className="bg-green-200">
                <td className="border border-gray-300 p-2 font-semibold bg-green-600 text-white">S.O.I.</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  const soi = yearData.sales - yearData.pac - totalNonControllables;
                  return (
                    <React.Fragment key={`soi-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-green-100">
                        {formatCurrency(soi)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-green-100 font-bold">
                        {formatPercentage((soi / yearData.sales) * 100)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* LOAN PAYMENT row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">LOAN PAYMENT</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`loanPayment-${i}`}>
                    <td className="border border-gray-300 p-1 bg-green-100">
                      <Input
                        type="number"
                        value={yearData.loanPayment}
                        onChange={(e) => onYearlyDataChange(i, 'loanPayment', Number(e.target.value))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      {formatPercentage((yearData.loanPayment / yearData.sales) * 100)}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* CASHFLOW row */}
              <tr className="bg-green-200">
                <td className="border border-gray-300 p-2 font-semibold bg-green-600 text-white">CASHFLOW</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  const soi = yearData.sales - yearData.pac - totalNonControllables;
                  const cashflow = soi + yearData.loanPayment;
                  return (
                    <React.Fragment key={`cashflow-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-green-100">
                        {formatCurrency(cashflow)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-green-100 font-bold">
                        {formatPercentage((cashflow / yearData.sales) * 100)}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* REMODELACION / REINVERSION row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-semibold">REMODELACION / REINVERSION</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`reinversion-${i}`}>
                    <td className="border border-gray-300 p-2 text-right bg-green-100">
                      0
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-green-100">
                      0.00%
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* CASH AFTER REINV row */}
              <tr className="bg-green-200 font-bold">
                <td className="border border-gray-300 p-2 bg-green-600 text-white font-bold">CASH AFTER REINV</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  const soi = yearData.sales - yearData.pac - totalNonControllables;
                  const cashflow = soi + yearData.loanPayment;
                  const cashAfterReinv = cashflow;
                  return (
                    <React.Fragment key={`cashAfterReinv-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-green-100">
                        {formatCurrency(cashAfterReinv)}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-green-100 font-bold">
                        {formatPercentage((cashAfterReinv / yearData.sales) * 100)}
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
