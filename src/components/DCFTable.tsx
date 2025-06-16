import React, { useState, useEffect } from 'react';
import { ValuationInputs, YearlyData, ProjectionData } from '@/types/valuation';
import { calculateRemainingYears, formatNumber, formatCurrency } from '@/utils/valuationUtils';
import FranchiseInfo from './valuation/FranchiseInfo';
import BaseYearTable from './valuation/BaseYearTable';
import ProjectionTable from './valuation/ProjectionTable';
import ValuationParameters from './valuation/ValuationParameters';
import ValuationResult from './valuation/ValuationResult';
import ProjectionSummary from './valuation/ProjectionSummary';

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
      const remainingYears = calculateRemainingYears(inputs.changeDate, inputs.franchiseEndDate);
      setInputs(prev => ({
        ...prev,
        remainingYears
      }));
    }
  }, [inputs.changeDate, inputs.franchiseEndDate]);

  // Inicializar datos anuales VACÍOS cuando cambian los años restantes
  useEffect(() => {
    if (inputs.remainingYears > 0) {
      const yearsCount = Math.ceil(inputs.remainingYears);
      const newYearlyData: YearlyData[] = [];
      
      for (let i = 0; i < yearsCount; i++) {
        newYearlyData.push({
          sales: 0,
          pac: 0,
          pacPercentage: 0,
          rent: 0,
          rentPercentage: 0,
          serviceFees: 0,
          depreciation: 0,
          interest: 0,
          rentIndex: 0,
          miscell: 0,
          loanPayment: 0,
          reinversion: 0
        });
      }
      
      setYearlyData(newYearlyData);
    } else {
      setYearlyData([]);
    }
  }, [inputs.remainingYears]);

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

  // Función para calcular las ventas automáticamente
  const calculateSalesForYear = (yearIndex: number): number => {
    if (yearIndex === 0) {
      return yearlyData[0]?.sales || 0;
    }
    
    const firstYearSales = yearlyData[0]?.sales || 0;
    if (firstYearSales === 0) return 0;
    
    const growthRate = inputs.growthRate / 100;
    return firstYearSales * Math.pow(1 + growthRate, yearIndex);
  };

  // Calcular proyecciones con la nueva fórmula de cashflow
  const calculateProjections = (): ProjectionData[] => {
    if (yearlyData.length === 0) return [];
    
    const projections: ProjectionData[] = [];
    let currentTime = 0;
    
    for (let i = 0; i < yearlyData.length; i++) {
      const yearData = yearlyData[i];
      const timeToNextYear = Math.min(1, inputs.remainingYears - currentTime);
      
      if (timeToNextYear <= 0) break;
      
      // Usar las ventas calculadas automáticamente
      const salesValue = calculateSalesForYear(i);
      
      // Solo calcular si hay ventas para este año
      if (salesValue === 0) {
        currentTime += timeToNextYear;
        continue;
      }
      
      // Calcular montos basados en las nuevas fórmulas:
      const pacAmount = salesValue * (yearData.pacPercentage || 0) / 100;
      const rentAmount = salesValue * (yearData.rentPercentage || 0) / 100;
      
      // CASHFLOW = PAC - RENT - SERVICE FEES - RENT INDEX - MISCELL - LOAN PAYMENT
      const cashflow = pacAmount - rentAmount - yearData.serviceFees - yearData.rentIndex - yearData.miscell - yearData.loanPayment;
      
      // CASH AFTER REINV = CASHFLOW - REINVERSION
      const cashAfterReinv = cashflow - yearData.reinversion;
      
      // CF LIBRE = CASH AFTER REINV + DEPRECIATION
      const cfLibre = cashAfterReinv + yearData.depreciation;
      
      let cfValue = cfLibre;
      if (timeToNextYear < 1) {
        cfValue = cfLibre * timeToNextYear;
      }
      
      const discountTime = currentTime + timeToNextYear;
      const presentValue = cfValue / Math.pow(1 + inputs.discountRate / 100, discountTime);
      
      // Crear yearData actualizado con las ventas calculadas
      const updatedYearData = {
        ...yearData,
        sales: salesValue
      };
      
      projections.push({
        year: parseFloat((currentTime + timeToNextYear).toFixed(4)),
        cfValue,
        presentValue,
        timeToNextYear,
        yearData: updatedYearData
      });
      
      currentTime += timeToNextYear;
    }
    
    console.log('Proyecciones calculadas:', projections);
    console.log('CF Libre por año:', projections.map(p => p.cfValue));
    console.log('Valores presentes:', projections.map(p => p.presentValue));
    
    return projections;
  };

  const projections = calculateProjections();
  const totalPrice = projections.reduce((sum, p) => sum + p.presentValue, 0);

  return (
    <div className="font-manrope bg-white min-h-screen">
      <div className="space-y-6 p-6 max-w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Valoración Rte. PARC CENTRAL
          </h1>
          <p className="text-gray-600">
            Modelo de valoración por flujo de caja descontado (Entrada manual por años)
          </p>
        </div>

        <FranchiseInfo 
          inputs={inputs} 
          onInputChange={handleInputChange}
        />

        <BaseYearTable 
          inputs={inputs} 
          onInputChange={handleInputChange}
        />

        <ProjectionTable 
          inputs={inputs}
          yearlyData={yearlyData}
          onYearlyDataChange={handleYearlyDataChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ValuationParameters 
            inputs={inputs} 
            onInputChange={handleInputChange}
          />

          <ValuationResult 
            totalPrice={totalPrice}
            remainingYears={inputs.remainingYears}
          />
        </div>

        <ProjectionSummary 
          projections={projections}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
};

export default DCFTable;
