
import { ValuationFormData } from '@/types/restaurant';

export interface ValuationResult {
  finalValuation: number;
  projectedCashFlows: number[];
  yearlyProjections: {
    year: number;
    sales: number;
    pac: number;
    rent: number;
    serviceFees: number;
    soi: number;
    cashflow: number;
    freeCashFlow: number;
  }[];
}

export function calculateRestaurantValuation(data: ValuationFormData): ValuationResult {
  const years = data.yearsRemaining;
  const projectedCashFlows: number[] = [];
  const yearlyProjections = [];
  
  for (let year = 1; year <= years; year++) {
    const sales = data.initialSales * Math.pow(1 + data.salesGrowthRate / 100, year);
    
    // Costos como porcentaje de ventas
    const pac = sales * (data.pacPercentage / 100);
    const rent = sales * (data.rentPercentage / 100);
    const serviceFees = sales * (data.serviceFeesPercentage / 100);
    
    // Costos fijos (ajustados por inflación)
    const inflationFactor = Math.pow(1 + data.inflationRate / 100, year);
    const depreciation = data.depreciation;
    const interest = data.interest;
    const rentIndex = data.rentIndex * inflationFactor;
    const miscellaneous = data.miscellaneous * inflationFactor;
    
    // Cálculo del SOI (Store Operating Income)
    const totalNonControllables = rent + serviceFees + depreciation + interest + rentIndex + miscellaneous;
    const soi = sales - pac - totalNonControllables;
    
    // Flujo de caja
    const cashflow = soi + data.loanPayment;
    const freeCashFlow = cashflow + depreciation;
    
    projectedCashFlows.push(freeCashFlow);
    
    yearlyProjections.push({
      year: 2024 + year - 1,
      sales,
      pac,
      rent,
      serviceFees,
      soi,
      cashflow,
      freeCashFlow
    });
  }
  
  // Cálculo del valor presente neto
  const discountRate = data.discountRate / 100;
  let finalValuation = 0;
  
  for (let i = 0; i < projectedCashFlows.length; i++) {
    const presentValue = projectedCashFlows[i] / Math.pow(1 + discountRate, i + 1);
    finalValuation += presentValue;
  }
  
  return {
    finalValuation,
    projectedCashFlows,
    yearlyProjections
  };
}
