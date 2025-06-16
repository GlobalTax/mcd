
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

  // Función para calcular las ventas automáticamente después del primer año
  const calculateSalesForYear = (yearIndex: number): number => {
    if (yearIndex === 0) {
      return yearlyData[0]?.sales || 0;
    }
    
    const firstYearSales = yearlyData[0]?.sales || 0;
    if (firstYearSales === 0) return 0;
    
    const growthRate = inputs.growthRate / 100;
    return firstYearSales * Math.pow(1 + growthRate, yearIndex);
  };

  // Función para manejar cambios en inputs con formato
  const handleInputChange = (yearIndex: number, field: keyof YearlyData, value: string) => {
    // Remover puntos y convertir a número
    const numericValue = parseFloat(value.replace(/\./g, '')) || 0;
    onYearlyDataChange(yearIndex, field, numericValue);
  };

  // Función especial para manejar cambios en ventas del primer año
  const handleSalesChange = (yearIndex: number, value: string) => {
    if (yearIndex === 0) {
      handleInputChange(yearIndex, 'sales', value);
    }
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
          Introduce las ventas del primer año. Los años siguientes se calcularán automáticamente con el crecimiento del {inputs.growthRate}%.
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
              {/* SALES row - Manual input for first year, auto-calculated for rest */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 font-semibold bg-gray-800 text-white font-manrope">SALES (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const isFirstYear = i === 0;
                  
                  return (
                    <React.Fragment key={`sales-${i}`}>
                      <td className={`border border-gray-300 p-1 ${isFirstYear ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        {isFirstYear ? (
                          <Input
                            type="text"
                            value={yearlyData[0]?.sales > 0 ? formatNumber(yearlyData[0].sales) : ''}
                            onChange={(e) => handleSalesChange(i, e.target.value)}
                            placeholder="0"
                            className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                          />
                        ) : (
                          <div className="w-full text-right text-sm p-1 font-manrope text-gray-700">
                            {salesValue > 0 ? formatNumber(salesValue) : <span className="text-gray-400">0</span>}
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {salesValue > 0 ? formatPercentage(100) : <span className="text-gray-300">100%</span>}
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* P.A.C. row - Manual percentage, calculated amount */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 font-semibold bg-gray-800 text-white font-manrope">P.A.C. (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const pacPercentage = yearlyData[i]?.pacPercentage || 0;
                  const pacAmount = salesValue * pacPercentage / 100;
                  
                  return (
                    <React.Fragment key={`pac-${i}`}>
                      <td className="border border-gray-300 p-2 text-right bg-white font-manrope">
                        {pacAmount > 0 ? formatNumber(pacAmount) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={pacPercentage > 0 ? pacPercentage.toString() : ''}
                          onChange={(e) => handlePercentageChange(i, 'pacPercentage', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* RENT row - Manual percentage, calculated amount */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">RENT (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                  const rentAmount = salesValue * rentPercentage / 100;
                  
                  return (
                    <React.Fragment key={`rent-${i}`}>
                      <td className="border border-gray-300 p-2 text-right bg-white font-manrope">
                        {rentAmount > 0 ? formatNumber(rentAmount) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={rentPercentage > 0 ? rentPercentage.toString() : ''}
                          onChange={(e) => handlePercentageChange(i, 'rentPercentage', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* SERVICE FEES row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">SERVICE FEES (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const serviceFees = yearlyData[i]?.serviceFees || 0;
                  
                  return (
                    <React.Fragment key={`serviceFees-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={serviceFees > 0 ? formatNumber(serviceFees) : ''}
                          onChange={(e) => handleInputChange(i, 'serviceFees', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {serviceFees > 0 && salesValue > 0 ? 
                          formatPercentage((serviceFees / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* DEPRECIATION row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">DEPRECIATION (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const depreciation = yearlyData[i]?.depreciation || 0;
                  
                  return (
                    <React.Fragment key={`depreciation-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={depreciation > 0 ? formatNumber(depreciation) : ''}
                          onChange={(e) => handleInputChange(i, 'depreciation', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {depreciation > 0 && salesValue > 0 ? 
                          formatPercentage((depreciation / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* INTEREST row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">INTEREST (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const interest = yearlyData[i]?.interest || 0;
                  
                  return (
                    <React.Fragment key={`interest-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={interest > 0 ? formatNumber(interest) : ''}
                          onChange={(e) => handleInputChange(i, 'interest', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {interest > 0 && salesValue > 0 ? 
                          formatPercentage((interest / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* RENT INDEX row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">RENT INDEX (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const rentIndex = yearlyData[i]?.rentIndex || 0;
                  
                  return (
                    <React.Fragment key={`rentIndex-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={rentIndex > 0 ? formatNumber(rentIndex) : ''}
                          onChange={(e) => handleInputChange(i, 'rentIndex', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {rentIndex > 0 && salesValue > 0 ? 
                          formatPercentage((rentIndex / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* MISCELL row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">MISCELL (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const miscell = yearlyData[i]?.miscell || 0;
                  
                  return (
                    <React.Fragment key={`miscell-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={miscell > 0 ? formatNumber(miscell) : ''}
                          onChange={(e) => handleInputChange(i, 'miscell', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {miscell > 0 && salesValue > 0 ? 
                          formatPercentage((miscell / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* TOTAL NON-CONTROLLABLES row - Calculated */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">TOTAL NON-CONTROLLABLES</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                  const rentAmount = salesValue * rentPercentage / 100;
                  const serviceFees = yearlyData[i]?.serviceFees || 0;
                  const depreciation = yearlyData[i]?.depreciation || 0;
                  const interest = yearlyData[i]?.interest || 0;
                  const rentIndex = yearlyData[i]?.rentIndex || 0;
                  const miscell = yearlyData[i]?.miscell || 0;
                  const totalNonControllables = rentAmount + serviceFees + depreciation + interest + rentIndex + miscell;
                  
                  return (
                    <React.Fragment key={`totalNonControllables-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-white font-manrope">
                        {totalNonControllables > 0 ? formatNumber(totalNonControllables) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {totalNonControllables > 0 && salesValue > 0 ? 
                          formatPercentage((totalNonControllables / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* S.O.I. row - Calculated */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 font-semibold bg-gray-800 text-white font-manrope">S.O.I.</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const pacPercentage = yearlyData[i]?.pacPercentage || 0;
                  const pacAmount = salesValue * pacPercentage / 100;
                  const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                  const rentAmount = salesValue * rentPercentage / 100;
                  const serviceFees = yearlyData[i]?.serviceFees || 0;
                  const depreciation = yearlyData[i]?.depreciation || 0;
                  const interest = yearlyData[i]?.interest || 0;
                  const rentIndex = yearlyData[i]?.rentIndex || 0;
                  const miscell = yearlyData[i]?.miscell || 0;
                  const totalNonControllables = rentAmount + serviceFees + depreciation + interest + rentIndex + miscell;
                  const soi = pacAmount - totalNonControllables;
                  
                  return (
                    <React.Fragment key={`soi-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-white font-manrope">
                        {salesValue > 0 ? formatNumber(soi) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-bold font-manrope">
                        {salesValue > 0 ? 
                          formatPercentage((soi / salesValue) * 100) : 
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
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const loanPayment = yearlyData[i]?.loanPayment || 0;
                  
                  return (
                    <React.Fragment key={`loanPayment-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={loanPayment > 0 ? formatNumber(loanPayment) : ''}
                          onChange={(e) => handleInputChange(i, 'loanPayment', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {loanPayment > 0 && salesValue > 0 ? 
                          formatPercentage((loanPayment / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* REMODELACION / REINVERSION row - Manual input in euros */}
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-semibold font-manrope">REMODELACION / REINVERSION (€)</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const reinversion = yearlyData[i]?.reinversion || 0;
                  
                  return (
                    <React.Fragment key={`reinversion-${i}`}>
                      <td className="border border-gray-300 p-1 bg-blue-50">
                        <Input
                          type="text"
                          value={reinversion > 0 ? formatNumber(reinversion) : ''}
                          onChange={(e) => handleInputChange(i, 'reinversion', e.target.value)}
                          placeholder="0"
                          className="w-full text-right text-sm border-0 bg-blue-50 p-1 placeholder:text-gray-400 font-manrope"
                        />
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-manrope">
                        {reinversion > 0 && salesValue > 0 ? 
                          formatPercentage((reinversion / salesValue) * 100) : 
                          <span className="text-gray-300">0%</span>
                        }
                      </td>
                    </React.Fragment>
                  );
                })}
              </tr>
              
              {/* CASHFLOW row - Calculated */}
              <tr className="bg-white font-bold">
                <td className="border border-gray-300 p-2 bg-gray-800 text-white font-bold font-manrope">CASHFLOW</td>
                {Array.from({ length: yearsCount }, (_, i) => {
                  const salesValue = calculateSalesForYear(i);
                  const pacPercentage = yearlyData[i]?.pacPercentage || 0;
                  const pacAmount = salesValue * pacPercentage / 100;
                  const rentPercentage = yearlyData[i]?.rentPercentage || 0;
                  const rentAmount = salesValue * rentPercentage / 100;
                  const serviceFees = yearlyData[i]?.serviceFees || 0;
                  const rentIndex = yearlyData[i]?.rentIndex || 0;
                  const miscell = yearlyData[i]?.miscell || 0;
                  const loanPayment = yearlyData[i]?.loanPayment || 0;
                  const cashflow = pacAmount - rentAmount - serviceFees - rentIndex - miscell - loanPayment;
                  
                  return (
                    <React.Fragment key={`cashflow-${i}`}>
                      <td className="border border-gray-300 p-2 text-right font-bold bg-white font-manrope">
                        {salesValue > 0 ? formatNumber(cashflow) + ' €' : <span className="text-gray-300">0 €</span>}
                      </td>
                      <td className="border border-gray-300 p-2 text-right text-xs bg-white font-bold font-manrope">
                        {salesValue > 0 ? 
                          formatPercentage((cashflow / salesValue) * 100) : 
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
