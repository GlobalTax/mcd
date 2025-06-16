
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
    cashAfterReinv: number;
  }[];
}

export function calculateRestaurantValuation(data: ValuationFormData): ValuationResult {
  // Usar directamente el número de años especificado
  const years = data.yearsRemaining;
  const projectedCashFlows: number[] = [];
  const yearlyProjections = [];
  
  for (let year = 1; year <= years; year++) {
    // Proyección de ventas con crecimiento
    const sales = data.initialSales * Math.pow(1 + data.salesGrowthRate / 100, year);
    
    // Costos como porcentaje de ventas
    const pac = sales * (data.pacPercentage / 100);
    const rent = sales * (data.rentPercentage / 100);
    const serviceFees = sales * (data.serviceFeesPercentage / 100);
    
    // Costos fijos (algunos ajustados por inflación)
    const inflationFactor = Math.pow(1 + data.inflationRate / 100, year);
    const depreciation = data.depreciation * inflationFactor;
    const interest = data.interest * inflationFactor;
    const rentIndex = data.rentIndex * inflationFactor;
    const miscellaneous = data.miscellaneous * inflationFactor;
    
    // Total Non-Controllables (según el modelo de Excel)
    const totalNonControllables = rent + serviceFees + depreciation + interest + rentIndex + miscellaneous;
    
    // S.O.I. = Sales - P.A.C. - Total Non-Controllables
    const soi = sales - pac - totalNonControllables;
    
    // CASHFLOW = S.O.I. + LOAN PAYMENT
    const cashflow = soi + (data.loanPayment * inflationFactor);
    
    // CASH AFTER REINV = CASHFLOW - REINVERSION (asumiendo 0% reinversión como en el Excel)
    const cashAfterReinv = cashflow; // Sin reinversión por ahora
    
    // CF LIBRE = CASH AFTER REINV + DEPRECIATION (ya que la depreciación es gasto no efectivo)
    const freeCashFlow = cashAfterReinv + (data.depreciation * inflationFactor);
    
    // Usar CASH AFTER REINV para el cálculo del VNA (no Free Cash Flow)
    projectedCashFlows.push(cashAfterReinv);
    
    yearlyProjections.push({
      year: 2024 + year,
      sales,
      pac,
      rent,
      serviceFees,
      soi,
      cashflow,
      freeCashFlow,
      cashAfterReinv
    });
  }
  
  // Implementación de la fórmula VNA usando CASH AFTER REINV
  const discountRate = data.discountRate / 100;
  
  // VNA basado en CASH AFTER REINV
  let finalValuation = 0;
  for (let i = 0; i < years && i < projectedCashFlows.length; i++) {
    const presentValue = projectedCashFlows[i] / Math.pow(1 + discountRate, i + 1);
    finalValuation += presentValue;
  }
  
  console.log('Años utilizados para el cálculo:', years);
  console.log('Tasa de descuento:', discountRate);
  console.log('CASH AFTER REINV proyectados:', projectedCashFlows);
  console.log('VNA calculado (Precio) basado en CASH AFTER REINV:', finalValuation);
  
  return {
    finalValuation,
    projectedCashFlows,
    yearlyProjections
  };
}
