export interface Integration {
  id: string;
  name: string;
  type: 'accounting' | 'pos' | 'inventory' | 'hr' | 'marketing';
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  lastSync?: Date;
  errorMessage?: string;
}

interface ApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  put<T>(endpoint: string, data?: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

export class IntegrationService {
  constructor(private client: ApiClient) {}

  async getIntegrations(): Promise<Integration[]> {
    return this.client.get('/integrations');
  }

  async getIntegration(id: string): Promise<Integration> {
    return this.client.get(`/integrations/${id}`);
  }

  async createIntegration(integration: Omit<Integration, 'id' | 'status' | 'lastSync'>): Promise<Integration> {
    return this.client.post('/integrations', integration);
  }

  async updateIntegration(id: string, config: Record<string, any>): Promise<Integration> {
    return this.client.put(`/integrations/${id}`, { config });
  }

  async deleteIntegration(id: string): Promise<void> {
    return this.client.delete(`/integrations/${id}`);
  }

  async syncIntegration(id: string): Promise<void> {
    return this.client.post(`/integrations/${id}/sync`);
  }

  async testConnection(id: string): Promise<{ success: boolean; message: string }> {
    return this.client.post(`/integrations/${id}/test`);
  }

  async getSyncStatus(id: string): Promise<{ lastSync: Date; status: string; recordsProcessed: number }> {
    return this.client.get(`/integrations/${id}/status`);
  }
} 