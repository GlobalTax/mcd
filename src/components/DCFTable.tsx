import React, { useState } from 'react';
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
    growthRate: 3.0
  });

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
  const soi = inputs.sales - inputs.pac - totalNonControllables;
  const cashflow = soi - inputs.loanPayment;
  const cfLibre = cashflow + inputs.loanPayment;

  // Proyección de 20 años
  const projections = [];
  for (let year = 1; year <= 20; year++) {
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

  const totalPrice = projections.reduce((sum, p) => sum + p.presentValue, 0);

  const handleInputChange = (key: keyof ValuationInputs, value: number) => {
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

      {/* Tabla Principal P&L con inputs editables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">Rte. PARC CENTRAL - 2024</CardTitle>
          <p className="text-center text-sm text-gray-600">31-dic-24 / 30-dic-25</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-700 text-white">
                  <th className="border border-gray-300 p-3 text-left font-bold">P&L</th>
                  <th className="border border-gray-300 p-3 text-right font-bold">€</th>
                  <th className="border border-gray-300 p-3 text-right font-bold">%</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-50">
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
                <tr className="bg-blue-100">
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
                <tr className="bg-green-100">
                  <td className="border border-gray-300 p-3 font-semibold">CASHFLOW</td>
                  <td className="border border-gray-300 p-3 text-right font-semibold">{formatCurrency(cashflow)}</td>
                  <td className="border border-gray-300 p-3 text-right font-semibold">{formatPercentage((cashflow / inputs.sales) * 100)}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-3">REMODELACION / REINVERSION</td>
                  <td className="border border-gray-300 p-3 text-right">0</td>
                  <td className="border border-gray-300 p-3 text-right">0,00%</td>
                </tr>
                <tr className="bg-green-200">
                  <td className="border border-gray-300 p-3 font-bold">CASH AFTER REINV</td>
                  <td className="border border-gray-300 p-3 text-right font-bold">{formatCurrency(cashflow)}</td>
                  <td className="border border-gray-300 p-3 text-right font-bold">{formatPercentage((cashflow / inputs.sales) * 100)}</td>
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

      {/* Proyección completa de 20 años */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose CF (20 años)</CardTitle>
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
