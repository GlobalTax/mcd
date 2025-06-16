import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ValuationInputs {
  sales: number;
  pac: number;
  rent: number;
  serviceFees: number;
  depreciation: number;
  interest: number;
  rentIndex: number;
  miscell: number;
  loanPayment: number;
  inflationRate: number;
  discountRate: number;
  growthRate: number;
  changeDate: string;
  franchiseEndDate: string;
  remainingYears: number;
}

interface YearlyData {
  sales: number;
  pac: number;
  rent: number;
  serviceFees: number;
  depreciation: number;
  interest: number;
  rentIndex: number;
  miscell: number;
  loanPayment: number;
}

const DCFTable = () => {
  const [inputs, setInputs] = useState<ValuationInputs>({
    sales: 2454919,
    pac: 800058,
    rent: 281579,
    serviceFees: 122746,
    depreciation: 72092,
    interest: 19997,
    rentIndex: 75925,
    miscell: 85521,
    loanPayment: 31478,
    inflationRate: 1.5,
    discountRate: 21.0,
    growthRate: 3.0,
    changeDate: '',
    franchiseEndDate: '',
    remainingYears: 0
  });

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  // Calcular años restantes con máxima precisión
  useEffect(() => {
    if (inputs.changeDate && inputs.franchiseEndDate) {
      const changeDate = new Date(inputs.changeDate);
      const endDate = new Date(inputs.franchiseEndDate);
      
      if (endDate > changeDate) {
        const diffTime = endDate.getTime() - changeDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const diffYears = diffDays / 365.25;
        
        setInputs(prev => ({
          ...prev,
          remainingYears: Math.round(diffYears * 10000) / 10000
        }));
      }
    }
  }, [inputs.changeDate, inputs.franchiseEndDate]);

  // Inicializar datos anuales cuando cambian los años restantes
  useEffect(() => {
    if (inputs.remainingYears > 0) {
      const yearsCount = Math.ceil(inputs.remainingYears);
      const newYearlyData: YearlyData[] = [];
      
      for (let i = 0; i < yearsCount; i++) {
        // Usar datos base del primer año como referencia
        const growthFactor = Math.pow(1 + inputs.growthRate / 100, i);
        const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, i);
        
        newYearlyData.push({
          sales: Math.round(inputs.sales * growthFactor * inflationFactor),
          pac: Math.round(inputs.pac * growthFactor * inflationFactor),
          rent: Math.round(inputs.rent * inflationFactor),
          serviceFees: Math.round(inputs.serviceFees * inflationFactor),
          depreciation: Math.round(inputs.depreciation * inflationFactor),
          interest: Math.round(inputs.interest * inflationFactor),
          rentIndex: Math.round(inputs.rentIndex * inflationFactor),
          miscell: Math.round(inputs.miscell * inflationFactor),
          loanPayment: inputs.loanPayment
        });
      }
      
      setYearlyData(newYearlyData);
    } else {
      setYearlyData([]);
    }
  }, [inputs.remainingYears, inputs.sales, inputs.pac, inputs.rent, inputs.serviceFees, 
      inputs.depreciation, inputs.interest, inputs.rentIndex, inputs.miscell, 
      inputs.loanPayment, inputs.growthRate, inputs.inflationRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number, decimals: number = 2) => {
    return `${value.toFixed(decimals)}%`;
  };

  const handleInputChange = (key: keyof ValuationInputs, value: number | string) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleYearlyDataChange = (yearIndex: number, field: keyof YearlyData, value: number) => {
    setYearlyData(prev => {
      const newData = [...prev];
      newData[yearIndex] = {
        ...newData[yearIndex],
        [field]: value
      };
      return newData;
    });
  };

  // Cálculos principales para año base
  const totalNonControllables = inputs.rent + inputs.serviceFees + inputs.depreciation + inputs.interest + inputs.rentIndex + inputs.miscell;
  const soi = inputs.pac - totalNonControllables;
  const cashflow = inputs.pac - inputs.rent - inputs.serviceFees - inputs.rentIndex - inputs.miscell - inputs.loanPayment;
  const cashAfterReinv = cashflow;
  const cfLibre = cashAfterReinv + inputs.loanPayment;

  // Calcular proyecciones con datos manuales
  const calculateProjections = () => {
    if (yearlyData.length === 0) return [];
    
    const projections = [];
    let currentTime = 0;
    
    for (let i = 0; i < yearlyData.length; i++) {
      const yearData = yearlyData[i];
      const timeToNextYear = Math.min(1, inputs.remainingYears - currentTime);
      
      if (timeToNextYear <= 0) break;
      
      // Calcular CF con datos específicos del año
      const yearCashAfterReinv = yearData.pac - yearData.rent - yearData.serviceFees - yearData.rentIndex - yearData.miscell - yearData.loanPayment;
      const yearCfLibre = yearCashAfterReinv + yearData.loanPayment;
      
      let cfValue = yearCfLibre;
      if (timeToNextYear < 1) {
        cfValue = yearCfLibre * timeToNextYear;
      }
      
      const discountTime = currentTime + timeToNextYear;
      const presentValue = cfValue / Math.pow(1 + inputs.discountRate / 100, discountTime);
      
      projections.push({
        year: parseFloat((currentTime + timeToNextYear).toFixed(4)),
        cfValue,
        presentValue,
        timeToNextYear,
        yearData
      });
      
      currentTime += timeToNextYear;
    }
    
    return projections;
  };

  const projections = calculateProjections();
  const totalPrice = projections.reduce((sum, p) => sum + p.presentValue, 0);
  const yearsCount = Math.ceil(inputs.remainingYears);

  return (
    <div className="space-y-6 p-6 max-w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Valoración Rte. PARC CENTRAL
        </h1>
        <p className="text-gray-600">
          Modelo de valoración por flujo de caja descontado (Entrada manual por años)
        </p>
      </div>

      {/* Información de Fechas de Franquicia */}
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
                onChange={(e) => handleInputChange('changeDate', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha finalización contrato de franquicia</label>
              <Input
                type="date"
                value={inputs.franchiseEndDate}
                onChange={(e) => handleInputChange('franchiseEndDate', e.target.value)}
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

      {/* Tabla Principal P&L - Año Base */}
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
                      onChange={(e) => handleInputChange('sales', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('pac', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('rent', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('serviceFees', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('depreciation', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('interest', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('rentIndex', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('miscell', Number(e.target.value))}
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
                      onChange={(e) => handleInputChange('loanPayment', Number(e.target.value))}
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

      {/* Tabla de Proyección Anual Manual */}
      {yearsCount > 0 && (
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
                      <th key={i} className="border border-gray-300 p-2 text-center font-bold bg-gray-50">
                        Año {i + 1}
                        {i === yearsCount - 1 && inputs.remainingYears % 1 !== 0 && (
                          <div className="text-xs text-gray-600">
                            ({((inputs.remainingYears % 1) * 12).toFixed(1)} meses)
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-blue-50">
                    <td className="border border-gray-300 p-2 font-semibold">SALES</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.sales}
                          onChange={(e) => handleYearlyDataChange(i, 'sales', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="border border-gray-300 p-2 font-semibold">P.A.C.</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.pac}
                          onChange={(e) => handleYearlyDataChange(i, 'pac', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">RENT</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.rent}
                          onChange={(e) => handleYearlyDataChange(i, 'rent', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">SERVICE FEES</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.serviceFees}
                          onChange={(e) => handleYearlyDataChange(i, 'serviceFees', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">DEPRECIATION</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.depreciation}
                          onChange={(e) => handleYearlyDataChange(i, 'depreciation', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">INTEREST</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.interest}
                          onChange={(e) => handleYearlyDataChange(i, 'interest', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">RENT INDEX</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.rentIndex}
                          onChange={(e) => handleYearlyDataChange(i, 'rentIndex', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">MISCELL</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.miscell}
                          onChange={(e) => handleYearlyDataChange(i, 'miscell', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-300 p-2">LOAN PAYMENT</td>
                    {yearlyData.map((yearData, i) => (
                      <td key={i} className="border border-gray-300 p-1">
                        <Input
                          type="number"
                          value={yearData.loanPayment}
                          onChange={(e) => handleYearlyDataChange(i, 'loanPayment', Number(e.target.value))}
                          className="w-full text-right text-sm border-0 bg-transparent p-1"
                        />
                      </td>
                    ))}
                  </tr>
                  {/* Fila de CF LIBRE calculado */}
                  <tr className="bg-green-200 font-bold">
                    <td className="border border-gray-300 p-2">CF LIBRE</td>
                    {yearlyData.map((yearData, i) => {
                      const yearCashAfterReinv = yearData.pac - yearData.rent - yearData.serviceFees - yearData.rentIndex - yearData.miscell - yearData.loanPayment;
                      const yearCfLibre = yearCashAfterReinv + yearData.loanPayment;
                      return (
                        <td key={i} className="border border-gray-300 p-2 text-right font-bold">
                          {formatCurrency(yearCfLibre)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parámetros y Resultado Final */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  onChange={(e) => handleInputChange('inflationRate', Number(e.target.value))}
                  className="w-20 text-right text-sm"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tasa de Descuento:</span>
                <Input
                  type="number"
                  step="0.01"
                  value={inputs.discountRate}
                  onChange={(e) => handleInputChange('discountRate', Number(e.target.value))}
                  className="w-20 text-right text-sm"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Crecimiento Ventas:</span>
                <Input
                  type="number"
                  step="0.01"
                  value={inputs.growthRate}
                  onChange={(e) => handleInputChange('growthRate', Number(e.target.value))}
                  className="w-20 text-right text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                ({inputs.remainingYears.toFixed(4)} años exactos)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Proyecciones */}
      {projections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Proyecciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Período</th>
                    <th className="border border-gray-300 p-2 text-right">CF Libre</th>
                    <th className="border border-gray-300 p-2 text-right">Valor Presente</th>
                  </tr>
                </thead>
                <tbody>
                  {projections.map((p, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2">
                        Año {p.year}
                        {p.timeToNextYear < 1 && (
                          <span className="text-xs text-gray-600">
                            {" "}({(p.timeToNextYear * 12).toFixed(1)} meses)
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-right">{formatCurrency(p.cfValue)}</td>
                      <td className="border border-gray-300 p-2 text-right text-gray-600">{formatCurrency(p.presentValue)}</td>
                    </tr>
                  ))}
                  <tr className="bg-green-100 font-bold">
                    <td className="border border-gray-300 p-2">TOTAL</td>
                    <td className="border border-gray-300 p-2 text-right">{formatCurrency(projections.reduce((sum, p) => sum + p.cfValue, 0))}</td>
                    <td className="border border-gray-300 p-2 text-right text-green-600">{formatCurrency(totalPrice)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DCFTable;
