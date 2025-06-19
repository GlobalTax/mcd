export interface Report {
  id: string;
  userId: string;
  type: 'valuation' | 'budget' | 'analytics' | 'compliance';
  status: 'pending' | 'generating' | 'completed' | 'failed';
  filters: Record<string, any>;
  data?: any;
  createdAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface ReportSchedule {
  id: string;
  userId: string;
  type: string;
  filters: Record<string, any>;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  enabled: boolean;
  lastRun?: Date;
  nextRun: Date;
}

interface ApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}

export class ReportService {
  constructor(private client: ApiClient) {}

  async generateReport(type: string, filters: Record<string, any>): Promise<Report> {
    return this.client.post('/reports/generate', { type, filters });
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return this.client.get(`/reports/${userId}`);
  }

  async getReport(id: string): Promise<Report> {
    return this.client.get(`/reports/${id}`);
  }

  async deleteReport(id: string): Promise<void> {
    return this.client.delete(`/reports/${id}`);
  }

  async downloadReport(id: string): Promise<Blob> {
    const response = await fetch(`${this.client['baseURL']}/reports/${id}/download`);
    return response.blob();
  }

  async scheduleReport(
    type: string, 
    filters: Record<string, any>, 
    schedule: Omit<ReportSchedule, 'id' | 'userId' | 'lastRun'>
  ): Promise<Report> {
    return this.client.post('/reports/schedule', { type, filters, schedule });
  }

  async getScheduledReports(userId: string): Promise<Report[]> {
    return this.client.get(`/reports/scheduled/${userId}`);
  }
} 