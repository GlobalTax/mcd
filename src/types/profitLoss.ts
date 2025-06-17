
export interface ProfitLossData {
  id: string;
  restaurant_id: string;
  year: number;
  month: number;
  
  // Revenue Section
  net_sales: number;
  other_revenue: number;
  total_revenue: number;
  
  // Cost of Sales
  food_cost: number;
  paper_cost: number;
  total_cost_of_sales: number;
  
  // Labor Costs
  management_labor: number;
  crew_labor: number;
  benefits: number;
  total_labor: number;
  
  // Operating Expenses
  rent: number;
  utilities: number;
  maintenance: number;
  advertising: number;
  insurance: number;
  supplies: number;
  other_expenses: number;
  total_operating_expenses: number;
  
  // McDonald's Specific Fees
  franchise_fee: number;
  advertising_fee: number;
  rent_percentage: number;
  total_mcdonalds_fees: number;
  
  // Calculated Fields
  gross_profit: number;
  operating_income: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  notes?: string;
}

export interface ProfitLossTemplate {
  id: string;
  name: string;
  description?: string;
  template_data: {
    categories: {
      revenue: string[];
      cost_of_sales: string[];
      labor: string[];
      operating_expenses: string[];
      mcdonalds_fees: string[];
    };
    percentages: Record<string, number>;
  };
  is_default: boolean;
  created_at: string;
}

export interface ProfitLossFormData {
  restaurant_id: string;
  year: number;
  month: number;
  net_sales: number;
  other_revenue: number;
  food_cost: number;
  paper_cost: number;
  management_labor: number;
  crew_labor: number;
  benefits: number;
  rent: number;
  utilities: number;
  maintenance: number;
  advertising: number;
  insurance: number;
  supplies: number;
  other_expenses: number;
  franchise_fee: number;
  advertising_fee: number;
  rent_percentage: number;
  notes?: string;
}

export interface ProfitLossMetrics {
  grossMargin: number;
  operatingMargin: number;
  laborPercentage: number;
  foodCostPercentage: number;
  totalExpensePercentage: number;
}
