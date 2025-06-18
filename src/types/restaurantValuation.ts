
export interface RestaurantValuation {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  valuation_name: string;
  valuation_date: string;
  change_date?: string;
  franchise_end_date?: string;
  remaining_years?: number;
  inflation_rate: number;
  discount_rate: number;
  growth_rate: number;
  yearly_data: YearlyValuationData[];
  total_present_value?: number;
  projections?: any;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface YearlyValuationData {
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

export interface ValuationScenario {
  id: string;
  valuation_id: string;
  scenario_name: string;
  scenario_description?: string;
  inflation_rate_modifier: number;
  discount_rate_modifier: number;
  growth_rate_modifier: number;
  yearly_modifications: Record<string, any>;
  total_present_value?: number;
  projections?: any;
  variance_from_base?: number;
  variance_percentage?: number;
  created_at: string;
  updated_at: string;
}

export interface RestaurantOption {
  id: string;
  name: string;
  site_number: string;
}
