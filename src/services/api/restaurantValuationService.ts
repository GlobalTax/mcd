import { RestaurantValuation } from '../../types/restaurantValuation';
import { ValuationInputs } from '../../types/valuation';

export class RestaurantValuationService {
  constructor(private client: any) {}

  async getValuations(restaurantId?: string): Promise<RestaurantValuation[]> {
    const endpoint = restaurantId ? `/valuations?restaurantId=${restaurantId}` : '/valuations';
    return this.client.get(endpoint);
  }

  async getValuation(id: string): Promise<RestaurantValuation> {
    return this.client.get(`/valuations/${id}`);
  }

  async createValuation(input: ValuationInputs): Promise<RestaurantValuation> {
    return this.client.post('/valuations', input);
  }

  async updateValuation(id: string, input: Partial<ValuationInputs>): Promise<RestaurantValuation> {
    return this.client.put(`/valuations/${id}`, input);
  }

  async deleteValuation(id: string): Promise<void> {
    return this.client.delete(`/valuations/${id}`);
  }

  async calculateValuation(input: ValuationInputs): Promise<RestaurantValuation> {
    return this.client.post('/valuations/calculate', input);
  }

  async getValuationHistory(restaurantId: string): Promise<RestaurantValuation[]> {
    return this.client.get(`/valuations/history/${restaurantId}`);
  }

  async exportValuation(id: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${this.client['baseURL']}/valuations/${id}/export?format=${format}`);
    return response.blob();
  }
} 