interface ApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
}

export class AnalyticsService {
  constructor(private client: ApiClient) {}

  async trackEvent(eventName: string, properties: Record<string, any>): Promise<void> {
    return this.client.post('/analytics/events', { eventName, properties });
  }

  async getMetrics(params: Record<string, any>): Promise<any> {
    const queryString = new URLSearchParams(params).toString();
    return this.client.get(`/analytics/metrics?${queryString}`);
  }

  async getDashboard(): Promise<any> {
    return this.client.get('/analytics/dashboard');
  }

  async getReport(endpoint: string): Promise<any> {
    return this.client.get(endpoint);
  }

  async getPredictiveAnalytics(restaurantId: string): Promise<any> {
    return this.client.get(`/analytics/predictive/${restaurantId}`);
  }
} 