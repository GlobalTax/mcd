export interface AIResponse {
  id: string;
  message: string;
  type: 'text' | 'analysis' | 'prediction' | 'recommendation';
  confidence: number;
  data?: any;
  timestamp: Date;
  sessionId?: string;
}

export interface AIRequest {
  message: string;
  context?: string;
  userId?: string;
  sessionId?: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIResponse[];
  createdAt: Date;
  updatedAt: Date;
}

interface ApiClient {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
}

export class AIAssistantService {
  constructor(private client: ApiClient) {}

  async sendMessage(request: AIRequest): Promise<AIResponse> {
    return this.client.post('/ai/chat', request);
  }

  async getAnalysis(restaurantId: string): Promise<AIResponse> {
    return this.client.get(`/ai/analysis/${restaurantId}`);
  }

  async getPredictions(restaurantId: string, timeframe: string = '30d'): Promise<AIResponse> {
    return this.client.get(`/ai/predictions/${restaurantId}?timeframe=${timeframe}`);
  }

  async getRecommendations(restaurantId: string): Promise<AIResponse> {
    return this.client.get(`/ai/recommendations/${restaurantId}`);
  }

  async generateReport(type: string, data: any): Promise<Blob> {
    const response = await fetch(`${this.client['baseURL']}/ai/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    });
    return response.blob();
  }

  async getConversationHistory(sessionId: string): Promise<AIResponse[]> {
    return this.client.get(`/ai/chat/history/${sessionId}`);
  }
} 