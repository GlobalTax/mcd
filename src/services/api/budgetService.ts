import { ValuationBudget, ValuationBudgetFormData } from '../../types/budget';

export class BudgetService {
  constructor(private client: any) {}

  async getBudgets(restaurantId?: string): Promise<ValuationBudget[]> {
    const endpoint = restaurantId ? `/budgets?restaurantId=${restaurantId}` : '/budgets';
    return this.client.get(endpoint);
  }

  async getBudget(id: string): Promise<ValuationBudget> {
    return this.client.get(`/budgets/${id}`);
  }

  async createBudget(input: ValuationBudgetFormData): Promise<ValuationBudget> {
    return this.client.post('/budgets', input);
  }

  async updateBudget(id: string, input: Partial<ValuationBudgetFormData>): Promise<ValuationBudget> {
    return this.client.put(`/budgets/${id}`, input);
  }

  async deleteBudget(id: string): Promise<void> {
    return this.client.delete(`/budgets/${id}`);
  }

  async getAnnualBudgets(year: number): Promise<ValuationBudget[]> {
    return this.client.get(`/budgets/annual/${year}`);
  }

  async compareBudgets(budgetIds: string[]): Promise<any> {
    return this.client.post('/budgets/compare', { budgetIds });
  }

  async exportBudget(id: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${this.client['baseURL']}/budgets/${id}/export?format=${format}`);
    return response.blob();
  }
} 