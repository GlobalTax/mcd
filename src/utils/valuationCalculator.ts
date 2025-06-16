
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
    // Proyección de ventas con crecimiento
    const sales = data.initialSales * Math.pow(1 + data.salesGrowthRate / 100, year);
    
    // Costos como porcentaje de ventas
    const pac = sales * (data.pacPercentage / 100);
    const rent = sales * (data.rentPercentage / 100);
    const serviceFees = sales * (data.serviceFeesPercentage / 100);
    
    // Costos fijos (algunos ajustados por inflación)
    const inflationFactor = Math.pow(1 + data.inflationRate / 100, year);
    const depreciation = data.depreciation; // No se ajusta por inflación
    const interest = data.interest; // No se ajusta por inflación
    const loanPayment = data.loanPayment; // No se ajusta por inflación
    const rentIndex = data.rentIndex * inflationFactor; // Se ajusta por inflación
    const miscellaneous = data.miscellaneous * inflationFactor; // Se ajusta por inflación
    
    // Cálculo del SOI (Store Operating Income)
    // SOI = Ventas - PAC - Alquiler - Service Fees - Depreciación - Intereses - Índice Alquiler - Gastos Diversos
    const soi = sales - pac - rent - serviceFees - depreciation - interest - rentIndex - miscellaneous;
    
    // Cash Flow = SOI + Pago de Préstamo (ya que el pago del préstamo reduce la deuda)
    const cashflow = soi + loanPayment;
    
    // Free Cash Flow = Cash Flow + Depreciación (ya que la depreciación es un gasto no efectivo)
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
  
  // Cálculo del Valor Presente Neto (VPN)
  const discountRate = data.discountRate / 100;
  let finalValuation = 0;
  
  // Sumar todos los flujos de caja descontados
  for (let i = 0; i < projectedCashFlows.length; i++) {
    const presentValue = projectedCashFlows[i] / Math.pow(1 + discountRate, i + 1);
    finalValuation += presentValue;
  }
  
  console.log('Primer flujo de caja:', projectedCashFlows[0]);
  console.log('Valoración final:', finalValuation);
  console.log('Datos de entrada:', data);
  
  return {
    finalValuation,
    projectedCashFlows,
    yearlyProjections
  };
}
