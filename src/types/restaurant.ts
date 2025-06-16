
export interface Franchisee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  restaurants: Restaurant[];
  createdAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  franchiseeId: string;
  contractEndDate: string;
  
  // New fields for central management
  siteNumber: string;
  lastYearRevenue: number;
  baseRent: number;
  rentIndex: number;
  
  // New fields for franchise and lease management
  franchiseEndDate: string;
  leaseEndDate?: string; // Optional because it might be owned by McD
  isOwnedByMcD: boolean; // Indicates if the site is owned by McDonald's
  
  currentValuation?: RestaurantValuation;
  valuationHistory: RestaurantValuation[];
  createdAt: Date;
}

export interface RestaurantValuation {
  id: string;
  restaurantId: string;
  valuationDate: string;
  
  // Parámetros básicos
  initialSales: number;
  salesGrowthRate: number;
  inflationRate: number;
  discountRate: number;
  yearsRemaining: number;
  
  // Costos fijos (porcentajes)
  pacPercentage: number;
  rentPercentage: number;
  serviceFeesPercentage: number;
  
  // Costos absolutos
  depreciation: number;
  interest: number;
  loanPayment: number;
  rentIndex: number;
  miscellaneous: number;
  
  // Resultados calculados
  finalValuation: number;
  projectedCashFlows: number[];
  
  createdAt: Date;
  createdBy: string;
}

export interface ValuationFormData {
  // Información básica
  valuationDate: string;
  
  // Datos de ventas
  initialSales: number;
  salesGrowthRate: number;
  
  // Parámetros financieros
  inflationRate: number;
  discountRate: number;
  yearsRemaining: number;
  
  // Costos como porcentaje de ventas
  pacPercentage: number;
  rentPercentage: number;
  serviceFeesPercentage: number;
  
  // Costos fijos anuales
  depreciation: number;
  interest: number;
  loanPayment: number;
  rentIndex: number;
  miscellaneous: number;
}
