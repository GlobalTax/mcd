
import React, { useState, useEffect } from 'react';
import { ValuationInputs, YearlyData, ProjectionData } from '@/types/valuation';
import { RestaurantValuation } from '@/types/restaurantValuation';
import { calculateRemainingYears, formatNumber, formatCurrency } from '@/utils/valuationUtils';
import SimpleValuationManager from './valuation/SimpleValuationManager';
import FranchiseInfo from './valuation/FranchiseInfo';
import BaseYearTable from './valuation/BaseYearTable';
import ProjectionTable from './valuation/ProjectionTable';
import ValuationParameters from './valuation/ValuationParameters';
import ValuationResult from './valuation/ValuationResult';
import ProjectionSummary from './valuation/ProjectionSummary';
import { TableStyleEditor, defaultStyles, TableStyles } from './valuation/TableStyleEditor';

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
  const [tableStyles, setTableStyles] = useState<TableStyles>(defaultStyles);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const [currentRestaurantName, setCurrentRestaurantName] = useState<string>('');

  console.log('DCFTable - inputs:', inputs);
  console.log('DCFTable - yearlyData:', yearlyData);
  console.log('DCFTable - currentRestaurantId:', currentRestaurantId);

  // Calcular años restantes con máxima precisión
  useEffect(() => {
    if (inputs.changeDate && inputs.franchiseEndDate) {
      const remainingYears = calculateRemainingYears(inputs.changeDate, inputs.franchiseEndDate);
      console.log('Calculated remaining years:', remainingYears);
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
      console.log('Creating yearly data for', yearsCount, 'years');
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
    console.log('Input change:', key, value);
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleYearlyDataChange = (yearIndex: number, field: keyof YearlyData, value: number) => {
    console.log('Yearly data change:', yearIndex, field, value);
    setYearlyData(prev => {
      const newData = [...prev];
      newData[yearIndex] = {
        ...newData[yearIndex],
        [field]: value
      };
      console.log('Updated yearly data:', newData);
      return newData;
    });
  };

  const handleRestaurantSelected = (restaurantId: string, restaurantName: string) => {
    console.log('Restaurant selected:', restaurantId, restaurantName);
    setCurrentRestaurantId(restaurantId);
    setCurrentRestaurantName(restaurantName);
  };

  const handleValuationLoaded = (valuation: RestaurantValuation) => {
    console.log('Loading valuation:', valuation);
    // Cargar datos de la valoración
    setInputs(prev => ({
      ...prev,
      inflationRate: valuation.inflation_rate,
      discountRate: valuation.discount_rate,
      growthRate: valuation.growth_rate,
      changeDate: valuation.change_date || '',
      franchiseEndDate: valuation.franchise_end_date || '',
      remainingYears: valuation.remaining_years || 0
    }));

    if (valuation.yearly_data && Array.isArray(valuation.yearly_data)) {
      setYearlyData(valuation.yearly_data);
    }
  };

  // Función para calcular MISCELL con crecimiento por inflación
  const calculateMiscellForYear = (yearIndex: number): number => {
    if (yearIndex === 0) {
      return yearlyData[0]?.miscell || 0;
    }
    
    const firstYearMiscell = yearlyData[0]?.miscell || 0;
    if (firstYearMiscell === 0) return 0;
    
    const inflationRate = inputs.inflationRate / 100;
    return firstYearMiscell * Math.pow(1 + inflationRate, yearIndex);
  };

  // Calcular proyecciones con la nueva fórmula de cashflow
  const calculateProjections = (): ProjectionData[] => {
    if (yearlyData.length === 0 || inputs.remainingYears === 0) {
      console.log('No yearly data or remaining years');
      return [];
    }
    
    console.log('Calculating projections with:', { yearlyData, inputs });
    
    const projections: ProjectionData[] = [];
    let currentTime = 0;
    
    for (let i = 0; i < yearlyData.length; i++) {
      const yearData = yearlyData[i];
      const timeToNextYear = Math.min(1, inputs.remainingYears - currentTime);
      
      if (timeToNextYear <= 0) break;
      
      // Usar las ventas manuales introducidas
      const salesValue = yearData.sales || 0;
      
      // Solo calcular si hay ventas para este año
      if (salesValue === 0) {
        currentTime += timeToNextYear;
        continue;
      }
      
      // Calcular montos basados en las nuevas fórmulas:
      const pacAmount = salesValue * (yearData.pacPercentage || 0) / 100;
      const rentAmount = salesValue * (yearData.rentPercentage || 0) / 100;
      const serviceFees = salesValue * 0.05; // Fixed 5%
      const miscellAmount = calculateMiscellForYear(i);
      
      // CASHFLOW = PAC - RENT - SERVICE FEES - RENT INDEX - MISCELL - LOAN PAYMENT
      const cashflow = pacAmount - rentAmount - serviceFees - yearData.rentIndex - miscellAmount - yearData.loanPayment;
      
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
      
      console.log(`Year ${i+1} projection:`, {
        salesValue,
        pacAmount,
        rentAmount,
        serviceFees,
        miscellAmount,
        cashflow,
        cfLibre,
        cfValue,
        presentValue
      });
      
      projections.push({
        year: parseFloat((currentTime + timeToNextYear).toFixed(4)),
        cfValue,
        presentValue,
        timeToNextYear,
        yearData
      });
      
      currentTime += timeToNextYear;
    }
    
    console.log('Final projections:', projections);
    return projections;
  };

  const projections = calculateProjections();
  const totalPrice = projections.reduce((sum, p) => sum + p.presentValue, 0);

  console.log('Total price calculated:', totalPrice);

  const currentValuationData = {
    inputs,
    yearlyData,
    projections,
    totalPrice
  };

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: tableStyles.fontFamily }}>
      <div className="space-y-6 p-6 max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">Valoración DCF</h2>

        <TableStyleEditor 
          styles={tableStyles}
          onStylesChange={setTableStyles}
        />

        <SimpleValuationManager
          onRestaurantSelected={handleRestaurantSelected}
          onValuationLoaded={handleValuationLoaded}
          currentData={currentValuationData}
        />

        {currentRestaurantId && (
          <>
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
              tableStyles={tableStyles}
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

            {projections.length > 0 && (
              <ProjectionSummary 
                projections={projections}
                totalPrice={totalPrice}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DCFTable;
