export class AIAssistantService {
    constructor(client) {
        this.client = client;
    }
    async sendMessage(request) {
        return this.client.post('/ai/chat', request);
    }
    async getAnalysis(restaurantId) {
        return this.client.get(`/ai/analysis/${restaurantId}`);
    }
    async getPredictions(restaurantId, timeframe = '30d') {
        return this.client.get(`/ai/predictions/${restaurantId}?timeframe=${timeframe}`);
    }
    async getRecommendations(restaurantId) {
        return this.client.get(`/ai/recommendations/${restaurantId}`);
    }
    async generateReport(type, data) {
        const response = await fetch(`${this.client['baseURL']}/ai/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, data })
        });
        return response.blob();
    }
    async getConversationHistory(sessionId) {
        return this.client.get(`/ai/chat/history/${sessionId}`);
    }
}
