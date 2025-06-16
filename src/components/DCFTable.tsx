
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

  // Calcular años restantes automáticamente cuando cambien las fechas
  useEffect(() => {
    if (inputs.changeDate && inputs.franchiseEndDate) {
      const changeDate = new Date(inputs.changeDate);
      const endDate = new Date(inputs.franchiseEndDate);
      
      if (endDate > changeDate) {
        const diffTime = endDate.getTime() - changeDate.getTime();
        const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25); // Considerar años bisiestos
        
        setInputs(prev => ({
          ...prev,
          remainingYears: Math.round(diffYears * 10) / 10 // Redondear a 1 decimal
        }));
      }
    }
  }, [inputs.changeDate, inputs.franchiseEndDate]);

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

  // Cálculos principales
  const totalNonControllables = inputs.rent + inputs.serviceFees + inputs.depreciation + inputs.interest + inputs.rentIndex + inputs.miscell;
  const soi = inputs.pac - totalNonControllables; // S.O.I. = P.A.C. - TOTAL NON-CONTROLLABLES
  const cashflow = inputs.pac - inputs.rent - inputs.serviceFees - inputs.rentIndex - inputs.miscell - inputs.loanPayment; // CASHFLOW corregido
  const cashAfterReinv = cashflow; // Sin reinversión por ahora
  const cfLibre = cashAfterReinv + inputs.loanPayment;

  // Proyección basada en años restantes exactos del contrato
  const projections = [];
  const yearsToProject = inputs.remainingYears > 0 ? inputs.remainingYears : 20; // Usar años restantes exactos o 20 por defecto
  
  // Crear proyecciones para años completos y la fracción final
  const fullYears = Math.floor(yearsToProject);
  const remainingFraction = yearsToProject - fullYears;
  
  // Proyecciones para años completos
  for (let year = 1; year <= fullYears; year++) {
    let cfValue;
    if (year === 1) {
      cfValue = cfLibre;
    } else {
      const growthFactor = Math.pow(1 + inputs.growthRate / 100, year - 1);
      const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, year - 1);
      cfValue = cfLibre * growthFactor * inflationFactor;
    }
    
    const presentValue = cfValue / Math.pow(1 + inputs.discountRate / 100, year);
    projections.push({
      year,
      cfValue,
      presentValue
    });
  }
  
  // Si hay una fracción de año restante, calcular proporcionalmente
  if (remainingFraction > 0) {
    const finalYear = fullYears + 1;
    const growthFactor = Math.pow(1 + inputs.growthRate / 100, finalYear - 1);
    const inflationFactor = Math.pow(1 + inputs.inflationRate / 100, finalYear - 1);
    const fullYearCfValue = cfLibre * growthFactor * inflationFactor;
    
    // Calcular el flujo proporcional para la fracción del año
    const cfValue = fullYearCfValue * remainingFraction;
    const presentValue = cfValue / Math.pow(1 + inputs.discountRate / 100, finalYear);
    
    projections.push({
      year: parseFloat(finalYear.toFixed(1)),
      cfValue,
      presentValue
    });
  }

  const totalPrice = projections.reduce((sum, p) => sum + p.presentValue, 0);

  const handleInputChange = (key: keyof ValuationInputs, value: number | string) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Valoración Rte. PARC CENTRAL
        </h1>
        <p className="text-gray-600">
          Modelo de valoración por flujo de caja descontado
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
                step="0.1"
                value={inputs.remainingYears}
                readOnly
                className="w-full bg-gray-100"
                title="Se calcula automáticamente basado en las fechas"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla Principal P&L */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Rte. PARC CENTRAL</CardTitle>
          <div className="text-center">
            <p className="text-lg font-semibold">2024</p>
            <p className="text-sm text-gray-600">31-dic-24 / 30-dic-25</p>
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

      {/* Parámetros y Proyección */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  step="0.1"
                  value={inputs.inflationRate}
                  onChange={(e) => handleInputChange('inflationRate', Number(e.target.value))}
                  className="w-20 text-right text-sm"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tasa de Descuento:</span>
                <Input
                  type="number"
                  step="0.1"
                  value={inputs.discountRate}
                  onChange={(e) => handleInputChange('discountRate', Number(e.target.value))}
                  className="w-20 text-right text-sm"
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Crecimiento Ventas:</span>
                <Input
                  type="number"
                  step="0.1"
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
                ({yearsToProject} años de proyección)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desglose CF (Primeros 5 años)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {projections.slice(0, 5).map(p => (
                <div key={p.year} className="flex justify-between text-sm">
                  <span>Año {p.year}</span>
                  <span>{formatCurrency(p.cfValue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proyección completa */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose CF ({yearsToProject} años)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
              {projections.map(p => (
                <div key={p.year} className="flex justify-between">
                  <span>Año {p.year}</span>
                  <span>{formatCurrency(p.cfValue)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DCFTable;
