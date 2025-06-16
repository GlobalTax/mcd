
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ValuationInputs, YearlyData } from '@/types/valuation';
import { formatNumber, formatPercentage } from '@/utils/valuationUtils';

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

  // Función para manejar cambios en inputs con formato
  const handleInputChange = (yearIndex: number, field: keyof YearlyData, value: string) => {
    // Remover puntos y convertir a número
    const numericValue = parseFloat(value.replace(/\./g, '')) || 0;
    onYearlyDataChange(yearIndex, field, numericValue);
  };

  // Generar valores de ejemplo para placeholders
  const getPlaceholderValue = (field: keyof YearlyData, yearIndex: number) => {
    const baseValues = {
      sales: 2454919,
      pac: 800058,
      rent: 281579,
      serviceFees: 122746,
      depreciation: 72092,
      interest: 19997,
      rentIndex: 75925,
      miscell: 85521,
      loanPayment: 31478
    };
    
    const growthFactor = Math.pow(1 + inputs.growthRate / 100, yearIndex);
    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, yearIndex);
    
    if (field === 'sales' || field === 'pac') {
      return Math.round(baseValues[field] * growthFactor * inflationFactor);
    } else if (field === 'loanPayment') {
      return baseValues[field];
    } else {
      return Math.round(baseValues[field] * inflationFactor);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyección Manual por Años ({inputs.remainingYears.toFixed(4)} años exactos)</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Introduce los valores proyectados para cada año. Los valores en gris claro son sugerencias basadas en el año base.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left font-bold bg-gray-50">Concepto</th>
                {Array.from({ length: yearsCount }, (_, i) => (
                  <React.Fragment key={i}>
                    <th className="border border-gray-300 p-2 text-center font-bold bg-blue-500 text-white">
                      <div>{2025 + i}</div>
                      <div className="text-xs font-normal mt-1">
                        {generatePeriodDates(i)}
                      </div>
                      {i === yearsCount - 1 && inputs.remainingYears % 1 !== 0 && (
                        <div className="text-xs text-blue-200 mt-1">
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
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-2 font-semibold bg-blue-600 text-white">SALES</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`sales-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.sales > 0 ? formatNumber(yearData.sales) : ''}
                        onChange={(e) => handleInputChange(i, 'sales', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('sales', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.sales > 0 ? formatPercentage(100) : <span className="text-gray-400">100%</span>}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* P.A.C. row */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-2 font-semibold bg-blue-600 text-white">P.A.C.</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`pac-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.pac > 0 ? formatNumber(yearData.pac) : ''}
                        onChange={(e) => handleInputChange(i, 'pac', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('pac', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.pac > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.pac / yearData.sales) * 100) : 
                        <span className="text-gray-400">~32%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* RENT row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">RENT</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`rent-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.rent > 0 ? formatNumber(yearData.rent) : ''}
                        onChange={(e) => handleInputChange(i, 'rent', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('rent', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.rent > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.rent / yearData.sales) * 100) : 
                        <span className="text-gray-400">~11%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* SERVICE FEES row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">SERVICE FEES</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`serviceFees-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.serviceFees > 0 ? formatNumber(yearData.serviceFees) : ''}
                        onChange={(e) => handleInputChange(i, 'serviceFees', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('serviceFees', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.serviceFees > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.serviceFees / yearData.sales) * 100) : 
                        <span className="text-gray-400">~5%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* DEPRECIATION row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">DEPRECIATION</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`depreciation-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.depreciation > 0 ? formatNumber(yearData.depreciation) : ''}
                        onChange={(e) => handleInputChange(i, 'depreciation', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('depreciation', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.depreciation > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.depreciation / yearData.sales) * 100) : 
                        <span className="text-gray-400">~3%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* INTEREST row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">INTEREST</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`interest-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.interest > 0 ? formatNumber(yearData.interest) : ''}
                        onChange={(e) => handleInputChange(i, 'interest', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('interest', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.interest > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.interest / yearData.sales) * 100) : 
                        <span className="text-gray-400">~1%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* RENT INDEX row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">RENT INDEX</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`rentIndex-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.rentIndex > 0 ? formatNumber(yearData.rentIndex) : ''}
                        onChange={(e) => handleInputChange(i, 'rentIndex', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('rentIndex', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.rentIndex > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.rentIndex / yearData.sales) * 100) : 
                        <span className="text-gray-400">~3%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* MISCELL row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">MISCELL</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`miscell-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.miscell > 0 ? formatNumber(yearData.miscell) : ''}
                        onChange={(e) => handleInputChange(i, 'miscell', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('miscell', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.miscell > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.miscell / yearData.sales) * 100) : 
                        <span className="text-gray-400">~3%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* TOTAL NON-CONTROLLABLES row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">TOTAL NON-CONTROLLABLES</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  return (
                    <React.Fragment key={`totalNonControllables-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-blue-25">
                        {totalNonControllables > 0 ? formatNumber(totalNonControllables) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                        {totalNonControllables > 0 && yearData.sales > 0 ? 
                          formatPercentage((totalNonControllables / yearData.sales) * 100) : 
                          <span className="text-gray-400">~26%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* S.O.I. row */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-2 font-semibold bg-blue-600 text-white">S.O.I.</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  const soi = yearData.sales - yearData.pac - totalNonControllables;
                  const hasData = yearData.sales > 0 && yearData.pac > 0 && totalNonControllables > 0;
                  return (
                    <React.Fragment key={`soi-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-blue-25">
                        {hasData ? formatNumber(soi) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25 font-bold">
                        {hasData && yearData.sales > 0 ? 
                          formatPercentage((soi / yearData.sales) * 100) : 
                          <span className="text-gray-400">~42%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* LOAN PAYMENT row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">LOAN PAYMENT</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`loanPayment-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-25">
                      <Input
                        type="text"
                        value={yearData.loanPayment > 0 ? formatNumber(yearData.loanPayment) : ''}
                        onChange={(e) => handleInputChange(i, 'loanPayment', e.target.value)}
                        placeholder={formatNumber(getPlaceholderValue('loanPayment', i))}
                        className="w-full text-right text-sm border-0 bg-transparent p-1 placeholder:text-gray-400 placeholder:text-xs"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25">
                      {yearData.loanPayment > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.loanPayment / yearData.sales) * 100) : 
                        <span className="text-gray-400">~1%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* CASHFLOW row */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 p-2 font-semibold bg-blue-600 text-white">CASHFLOW</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  const soi = yearData.sales - yearData.pac - totalNonControllables;
                  const cashflow = soi + yearData.loanPayment;
                  const hasData = yearData.sales > 0 && yearData.pac > 0 && totalNonControllables > 0 && yearData.loanPayment > 0;
                  return (
                    <React.Fragment key={`cashflow-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-blue-25">
                        {hasData ? formatNumber(cashflow) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25 font-bold">
                        {hasData && yearData.sales > 0 ? 
                          formatPercentage((cashflow / yearData.sales) * 100) : 
                          <span className="text-gray-400">~43%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* REMODELACION / REINVERSION row */}
              <tr>
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-semibold">REMODELACION / REINVERSION</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`reinversion-${i}`}>
                    <td className="border border-gray-300 p-2 text-right bg-blue-25 text-gray-400">
                      0
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-blue-25 text-gray-400">
                      0.00%
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* CASH AFTER REINV row */}
              <tr className="bg-blue-100 font-bold">
                <td className="border border-gray-300 p-2 bg-blue-600 text-white font-bold">CASH AFTER REINV</td>
                {yearlyData.map((yearData, i) => {
                  const totalNonControllables = yearData.rent + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  const soi = yearData.sales - yearData.pac - totalNonControllables;
                  const cashflow = soi + yearData.loanPayment;
                  const cashAfterReinv = cashflow;
                  const hasData = yearData.sales > 0 && yearData.pac > 0 && totalNonControllables > 0 && yearData.loanPayment > 0;
                  return (
                    <React.Fragment key={`cashAfterReinv-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-blue-50">
                        {hasData ? formatNumber(cashAfterReinv) : <span className="text-gray-400">-</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-blue-50 font-bold">
                        {hasData && yearData.sales > 0 ? 
                          formatPercentage((cashAfterReinv / yearData.sales) * 100) : 
                          <span className="text-gray-400">~43%</span>
                        }
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
