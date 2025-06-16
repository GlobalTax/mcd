
import React, { useState, useEffect } from 'react';
import { ValuationInputs, YearlyData, ProjectionData } from '@/types/valuation';
import { calculateRemainingYears } from '@/utils/valuationUtils';
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

  // Inicializar datos anuales cuando cambian los años restantes
  useEffect(() => {
    if (inputs.remainingYears > 0) {
      const yearsCount = Math.ceil(inputs.remainingYears);
      const newYearlyData: YearlyData[] = [];
      
      for (let i = 0; i < yearsCount; i++) {
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

  // Calcular proyecciones con datos manuales
  const calculateProjections = (): ProjectionData[] => {
    if (yearlyData.length === 0) return [];
    
    const projections: ProjectionData[] = [];
    let currentTime = 0;
    
    for (let i = 0; i < yearlyData.length; i++) {
      const yearData = yearlyData[i];
      const timeToNextYear = Math.min(1, inputs.remainingYears - currentTime);
      
      if (timeToNextYear <= 0) break;
      
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
  );
};

export default DCFTable;
