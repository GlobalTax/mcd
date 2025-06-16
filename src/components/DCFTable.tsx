
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DCFAssumptions {
  salesGrowthRate: number;
  cogsMargin: number;
  opexMargin: number;
  taxRate: number;
  capexMargin: number;
  workingCapitalMargin: number;
  wacc: number;
  terminalGrowthRate: number;
  initialSales: number;
}

const DCFTable = () => {
  const [assumptions, setAssumptions] = useState<DCFAssumptions>({
    salesGrowthRate: 0.05,
    cogsMargin: 0.60,
    opexMargin: 0.15,
    taxRate: 0.25,
    capexMargin: 0.03,
    workingCapitalMargin: 0.02,
    wacc: 0.10,
    terminalGrowthRate: 0.02,
    initialSales: 500000
  });

  const [projections, setProjections] = useState<any[]>([]);
  const [enterpriseValue, setEnterpriseValue] = useState(0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const calculateProjections = () => {
    const years = 30;
    const newProjections = [];

    for (let year = 1; year <= years; year++) {
      const sales = assumptions.initialSales * Math.pow(1 + assumptions.salesGrowthRate, year - 1);
      const cogs = sales * assumptions.cogsMargin;
      const grossMargin = sales - cogs;
      const opex = sales * assumptions.opexMargin;
      const ebitda = grossMargin - opex;
      const depreciation = (sales * assumptions.capexMargin) * 0.5; // Asumimos D&A como 50% de CAPEX
      const ebit = ebitda - depreciation;
      const taxes = ebit > 0 ? ebit * assumptions.taxRate : 0;
      const nopat = ebit - taxes;
      const capex = sales * assumptions.capexMargin;
      const workingCapitalChange = sales * assumptions.workingCapitalMargin;
      const fcf = nopat + depreciation - capex - workingCapitalChange;
      const presentValue = fcf / Math.pow(1 + assumptions.wacc, year);

      newProjections.push({
        year,
        sales,
        cogs,
        grossMargin,
        opex,
        ebitda,
        depreciation,
        ebit,
        taxes,
        nopat,
        capex,
        workingCapitalChange,
        fcf,
        presentValue
      });
    }

    // Calcular valor terminal
    const lastYearFCF = newProjections[years - 1].fcf;
    const terminalValue = (lastYearFCF * (1 + assumptions.terminalGrowthRate)) / (assumptions.wacc - assumptions.terminalGrowthRate);
    const terminalValuePV = terminalValue / Math.pow(1 + assumptions.wacc, years);
    
    // Valor de empresa
    const sumPVFCF = newProjections.reduce((sum, projection) => sum + projection.presentValue, 0);
    const totalEnterpriseValue = sumPVFCF + terminalValuePV;

    setProjections(newProjections);
    setEnterpriseValue(totalEnterpriseValue);
  };

  useEffect(() => {
    calculateProjections();
  }, [assumptions]);

  const handleAssumptionChange = (key: keyof DCFAssumptions, value: number) => {
    setAssumptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modelo de Valoración por Flujo de Caja Descontado (DCF)
        </h1>
        <p className="text-gray-600">
          Recreación fiel del modelo financiero. Modifica los supuestos para ver los cambios en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supuestos Clave */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700">Supuestos Clave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="initialSales">Ventas Iniciales (€)</Label>
              <Input
                id="initialSales"
                type="number"
                value={assumptions.initialSales}
                onChange={(e) => handleAssumptionChange('initialSales', Number(e.target.value))}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="salesGrowth">Tasa de Crecimiento en Ventas (%)</Label>
              <Input
                id="salesGrowth"
                type="number"
                step="0.01"
                value={assumptions.salesGrowthRate * 100}
                onChange={(e) => handleAssumptionChange('salesGrowthRate', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="cogsMargin">Margen Coste de Ventas (% Ventas)</Label>
              <Input
                id="cogsMargin"
                type="number"
                step="0.01"
                value={assumptions.cogsMargin * 100}
                onChange={(e) => handleAssumptionChange('cogsMargin', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="opexMargin">Gastos Operativos (% Ventas)</Label>
              <Input
                id="opexMargin"
                type="number"
                step="0.01"
                value={assumptions.opexMargin * 100}
                onChange={(e) => handleAssumptionChange('opexMargin', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="taxRate">Tasa Impositiva (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={assumptions.taxRate * 100}
                onChange={(e) => handleAssumptionChange('taxRate', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="capexMargin">CAPEX (% Ventas)</Label>
              <Input
                id="capexMargin"
                type="number"
                step="0.01"
                value={assumptions.capexMargin * 100}
                onChange={(e) => handleAssumptionChange('capexMargin', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="workingCapital">Var. Fondo Maniobra (% Ventas)</Label>
              <Input
                id="workingCapital"
                type="number"
                step="0.01"
                value={assumptions.workingCapitalMargin * 100}
                onChange={(e) => handleAssumptionChange('workingCapitalMargin', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="wacc">Tasa de Descuento (WACC) (%)</Label>
              <Input
                id="wacc"
                type="number"
                step="0.01"
                value={assumptions.wacc * 100}
                onChange={(e) => handleAssumptionChange('wacc', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
            <div>
              <Label htmlFor="terminalGrowth">Tasa Crecimiento a Perpetuidad (%)</Label>
              <Input
                id="terminalGrowth"
                type="number"
                step="0.01"
                value={assumptions.terminalGrowthRate * 100}
                onChange={(e) => handleAssumptionChange('terminalGrowthRate', Number(e.target.value) / 100)}
                className="bg-blue-50"
              />
            </div>
          </CardContent>
        </Card>

        {/* Valoración */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-700">Valoración</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Valor de Empresa</p>
              <p className="text-4xl font-bold text-green-600">
                {formatCurrency(enterpriseValue)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Primeros 5 años - Vista resumida */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Primeros 5 Años</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1"></th>
                    {projections.slice(0, 5).map(p => (
                      <th key={p.year} className="text-center py-1">Año {p.year}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs">
                  <tr>
                    <td className="py-1 font-medium">Ventas</td>
                    {projections.slice(0, 5).map(p => (
                      <td key={p.year} className="text-center py-1">{formatCurrency(p.sales)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">EBITDA</td>
                    {projections.slice(0, 5).map(p => (
                      <td key={p.year} className="text-center py-1">{formatCurrency(p.ebitda)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">FCF</td>
                    {projections.slice(0, 5).map(p => (
                      <td key={p.year} className="text-center py-1">{formatCurrency(p.fcf)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla completa de proyecciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Proyecciones Financieras Completas (30 años)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="border p-2 text-left">Concepto</th>
                  {Array.from({length: 10}, (_, i) => (
                    <th key={i} className="border p-2 text-center">Año {i + 1}</th>
                  ))}
                  <th className="border p-2 text-center">...</th>
                  {Array.from({length: 5}, (_, i) => (
                    <th key={i + 26} className="border p-2 text-center">Año {i + 26}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2" colSpan={17}>ESTADO DE RESULTADOS</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Ventas</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.sales)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.sales)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Coste de Ventas</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.cogs)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.cogs)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">MARGEN BRUTO</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.grossMargin)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.grossMargin)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Gastos Operativos</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.opex)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.opex)}</td>
                  ))}
                </tr>
                <tr className="border-t-2 border-blue-600">
                  <td className="border p-2 font-bold">EBITDA</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right font-semibold">{formatCurrency(p.ebitda)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right font-semibold">{formatCurrency(p.ebitda)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">D&A</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.depreciation)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.depreciation)}</td>
                  ))}
                </tr>
                <tr className="border-t-2 border-blue-600">
                  <td className="border p-2 font-bold">EBIT</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right font-semibold">{formatCurrency(p.ebit)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right font-semibold">{formatCurrency(p.ebit)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Impuestos</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.taxes)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.taxes)}</td>
                  ))}
                </tr>
                <tr className="border-t-2 border-blue-600">
                  <td className="border p-2 font-bold">NOPAT</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right font-semibold">{formatCurrency(p.nopat)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right font-semibold">{formatCurrency(p.nopat)}</td>
                  ))}
                </tr>
                
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2" colSpan={17}>FLUJO DE CAJA LIBRE</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">(+) NOPAT</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.nopat)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.nopat)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">(+) D&A</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.depreciation)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.depreciation)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">(-) CAPEX</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.capex)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.capex)}</td>
                  ))}
                </tr>
                <tr>
                  <td className="border p-2 font-medium">(-) Var. Fondo Maniobra</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.workingCapitalChange)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">-{formatCurrency(p.workingCapitalChange)}</td>
                  ))}
                </tr>
                <tr className="border-t-2 border-blue-600 bg-blue-50">
                  <td className="border p-2 font-bold">FLUJO DE CAJA LIBRE</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right font-bold">{formatCurrency(p.fcf)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right font-bold">{formatCurrency(p.fcf)}</td>
                  ))}
                </tr>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2" colSpan={17}>VALORACIÓN</td>
                </tr>
                <tr>
                  <td className="border p-2 font-medium">Valor Presente del FCF</td>
                  {projections.slice(0, 10).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.presentValue)}</td>
                  ))}
                  <td className="border p-2 text-center">...</td>
                  {projections.slice(25, 30).map(p => (
                    <td key={p.year} className="border p-2 text-right">{formatCurrency(p.presentValue)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DCFTable;
