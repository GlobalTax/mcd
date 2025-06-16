
export interface ValuationInputs {
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
  changeDate: string;
  franchiseEndDate: string;
  remainingYears: number;
}

export interface YearlyData {
  sales: number;
  pac: number;
  pacPercentage: number;
  rent: number;
  rentPercentage: number;
  serviceFees: number;
  depreciation: number;
  interest: number;
  rentIndex: number;
  miscell: number;
  loanPayment: number;
  reinversion: number;
}

export interface ProjectionData {
  year: number;
  cfValue: number;
  presentValue: number;
  timeToNextYear: number;
  yearData: YearlyData;
}
