
import { useState, useEffect } from 'react';
import { ValuationInputs, YearlyData } from '@/types/valuation';
import { RestaurantValuation } from '@/types/restaurantValuation';
import { calculateRemainingYears } from '@/utils/valuationUtils';
import { TableStyles, defaultStyles } from '@/components/valuation/TableStyleEditor';

const initialInputs: ValuationInputs = {
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
};

export const useValuationState = () => {
  const [inputs, setInputs] = useState<ValuationInputs>(initialInputs);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [tableStyles, setTableStyles] = useState<TableStyles>(defaultStyles);
  const [currentRestaurantId, setCurrentRestaurantId] = useState<string | null>(null);
  const [currentRestaurantName, setCurrentRestaurantName] = useState<string>('');

  console.log('useValuationState - inputs:', inputs);
  console.log('useValuationState - yearlyData:', yearlyData);
  console.log('useValuationState - currentRestaurantId:', currentRestaurantId);

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

  return {
    inputs,
    yearlyData,
    tableStyles,
    currentRestaurantId,
    currentRestaurantName,
    setTableStyles,
    handleInputChange,
    handleYearlyDataChange,
    handleRestaurantSelected,
    handleValuationLoaded
  };
};
