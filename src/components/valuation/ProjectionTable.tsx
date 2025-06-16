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

  // Función para manejar cambios en porcentajes
  const handlePercentageChange = (yearIndex: number, field: 'pacPercentage' | 'rentPercentage', value: string) => {
    const numericValue = parseFloat(value) || 0;
    onYearlyDataChange(yearIndex, field as keyof YearlyData, numericValue);
  };

  return (
    <Card className="bg-white border border-gray-200 font-manrope">
      <CardHeader className="bg-white">
        <CardTitle className="text-gray-900 font-manrope">Proyección Manual por Años ({inputs.remainingYears.toFixed(4)} años exactos)</CardTitle>
        <p className="text-sm text-gray-600 mt-2 font-manrope">
          Introduce los valores proyectados para cada año. Los campos en azul suave son para entrada manual.
        </p>
      </CardHeader>
      <CardContent className="bg-white font-manrope">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm bg-white font-manrope">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left font-bold bg-white font-manrope">Concepto</th>
                {Array.from({ length: yearsCount }, (_, i) => (
                  <React.Fragment key={i}>
                    <th className="border border-gray-300 p-2 text-center font-bold bg-gray-800 text-white font-manrope">
                      <div>{2025 + i}</div>
                      <div className="text-xs font-normal mt-1 font-manrope">
                        {generatePeriodDates(i)}
                      </div>
                      {i === yearsCount - 1 && inputs.remainingYears % 1 !== 0 && (
                        <div className="text-xs text-gray-300 mt-1 font-manrope">
                          ({((inputs.remainingYears % 1) * 12).toFixed(1)} meses)
                        </div>
                      )}
                    </th>
                    <th className="border border-gray-300 p-2 text-center font-bold bg-white w-20 font-manrope">
                      %
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white font-manrope">
              {/* SALES row - Manual input */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 font-semibold bg-gray-800 text-white font-manrope">SALES (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`sales-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.sales > 0 ? formatNumber(yearData.sales) : ''}
                        onChange={(e) => handleInputChange(i, 'sales', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.sales > 0 ? formatPercentage(100) : <span className="text-gray-300">100%</span>}
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* P.A.C. row - Manual percentage, calculated amount */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 font-semibold bg-gray-800 text-white font-manrope">P.A.C. (%)</td>
                {yearlyData.map((yearData, i) => {
                  const pacAmount = yearData.sales * (yearData.pacPercentage || 0) / 100;
                  return (
                    <React.Fragment key={`pac-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={yearData.pacPercentage > 0 ? yearData.pacPercentage.toString() : ''}
                          onChange={(e) => handlePercentageChange(i, 'pacPercentage', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {pacAmount > 0 ? formatNumber(pacAmount) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* RENT row - Manual percentage, calculated amount */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">RENT (%)</td>
                {yearlyData.map((yearData, i) => {
                  const rentAmount = yearData.sales * (yearData.rentPercentage || 0) / 100;
                  return (
                    <React.Fragment key={`rent-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={yearData.rentPercentage > 0 ? yearData.rentPercentage.toString() : ''}
                          onChange={(e) => handlePercentageChange(i, 'rentPercentage', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {rentAmount > 0 ? formatNumber(rentAmount) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* SERVICE FEES row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">SERVICE FEES (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`serviceFees-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.serviceFees > 0 ? formatNumber(yearData.serviceFees) : ''}
                        onChange={(e) => handleInputChange(i, 'serviceFees', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.serviceFees > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.serviceFees / yearData.sales) * 100) : 
                        <span className="text-gray-300">0%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* DEPRECIATION row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">DEPRECIATION (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`depreciation-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.depreciation > 0 ? formatNumber(yearData.depreciation) : ''}
                        onChange={(e) => handleInputChange(i, 'depreciation', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.depreciation > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.depreciation / yearData.sales) * 100) : 
                        <span className="text-gray-300">0%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* INTEREST row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">INTEREST (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`interest-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.interest > 0 ? formatNumber(yearData.interest) : ''}
                        onChange={(e) => handleInputChange(i, 'interest', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.interest > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.interest / yearData.sales) * 100) : 
                        <span className="text-gray-300">0%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* RENT INDEX row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">RENT INDEX (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`rentIndex-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.rentIndex > 0 ? formatNumber(yearData.rentIndex) : ''}
                        onChange={(e) => handleInputChange(i, 'rentIndex', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.rentIndex > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.rentIndex / yearData.sales) * 100) : 
                        <span className="text-gray-300">0%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* MISCELL row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">MISCELL (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`miscell-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.miscell > 0 ? formatNumber(yearData.miscell) : ''}
                        onChange={(e) => handleInputChange(i, 'miscell', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.miscell > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.miscell / yearData.sales) * 100) : 
                        <span className="text-gray-300">0%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* TOTAL NON-CONTROLLABLES row - Calculated (RENT + SERVICE FEES + DEPRECIATION + INTEREST + RENT INDEX + MISCELL) */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">TOTAL NON-CONTROLLABLES</td>
                {yearlyData.map((yearData, i) => {
                  const rentAmount = yearData.sales * (yearData.rentPercentage || 0) / 100;
                  const totalNonControllables = rentAmount + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  return (
                    <React.Fragment key={`totalNonControllables-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-white font-manrope">
                        {totalNonControllables > 0 ? formatNumber(totalNonControllables) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {totalNonControllables > 0 && yearData.sales > 0 ? 
                          formatPercentage((totalNonControllables / yearData.sales) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* S.O.I. row - Calculated (PAC - TOTAL NON-CONTROLLABLES) */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 font-semibold bg-gray-800 text-white font-manrope">S.O.I.</td>
                {yearlyData.map((yearData, i) => {
                  const pacAmount = yearData.sales * (yearData.pacPercentage || 0) / 100;
                  const rentAmount = yearData.sales * (yearData.rentPercentage || 0) / 100;
                  const totalNonControllables = rentAmount + yearData.serviceFees + yearData.depreciation + yearData.interest + yearData.rentIndex + yearData.miscell;
                  const soi = pacAmount - totalNonControllables;
                  const hasData = yearData.sales > 0 && (pacAmount > 0 || totalNonControllables > 0);
                  return (
                    <React.Fragment key={`soi-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-white font-manrope">
                        {hasData ? formatNumber(soi) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-bold font-manrope">
                        {hasData && yearData.sales > 0 ? 
                          formatPercentage((soi / yearData.sales) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* LOAN PAYMENT row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">LOAN PAYMENT (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`loanPayment-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.loanPayment > 0 ? formatNumber(yearData.loanPayment) : ''}
                        onChange={(e) => handleInputChange(i, 'loanPayment', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.loanPayment > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.loanPayment / yearData.sales) * 100) : 
                        <span className="text-gray-300">0%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* REMODELACION / REINVERSION row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">REMODELACION / REINVERSION (€)</td>
                {yearlyData.map((yearData, i) => (
                  <React.Fragment key={`reinversion-${i}`}>
                    <td className="border border-gray-300 p-1 bg-blue-50">
                      <Input
                        type="text"
                        value={yearData.reinversion > 0 ? formatNumber(yearData.reinversion) : ''}
                        onChange={(e) => handleInputChange(i, 'reinversion', e.target.value)}
                        placeholder="0"
                        className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                      {yearData.reinversion > 0 && yearData.sales > 0 ? 
                        formatPercentage((yearData.reinversion / yearData.sales) * 100) : 
                        <span className="text-gray-300">0%</span>
                      }
                    </td>
                  </React.Fragment>
                ))}
              </tr>
              
              {/* CASHFLOW row - Calculated (PAC - RENT - SERVICE FEES - RENT INDEX - MISCELL - LOAN PAYMENT) */}
              <tr className="bg-white font-bold">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-bold font-manrope">CASHFLOW</td>
                {yearlyData.map((yearData, i) => {
                  const pacAmount = yearData.sales * (yearData.pacPercentage || 0) / 100;
                  const rentAmount = yearData.sales * (yearData.rentPercentage || 0) / 100;
                  const cashflow = pacAmount - rentAmount - yearData.serviceFees - yearData.rentIndex - yearData.miscell - yearData.loanPayment;
                  const hasData = yearData.sales > 0 && (pacAmount > 0 || rentAmount > 0 || yearData.serviceFees > 0 || yearData.rentIndex > 0 || yearData.miscell > 0 || yearData.loanPayment > 0);
                  return (
                    <React.Fragment key={`cashflow-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-white font-manrope">
                        {hasData ? formatNumber(cashflow) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-bold font-manrope">
                        {hasData && yearData.sales > 0 ? 
                          formatPercentage((cashflow / yearData.sales) * 100) : 
                          <span className="text-gray-300">0%</span>
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
