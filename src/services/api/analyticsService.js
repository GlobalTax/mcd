export class AnalyticsService {
    constructor(client) {
        this.client = client;
    }
    async trackEvent(eventName, properties) {
        return this.client.post('/analytics/events', { eventName, properties });
    }
    async getMetrics(params) {
        const queryString = new URLSearchParams(params).toString();
        return this.client.get(`/analytics/metrics?${queryString}`);
    }
    async getDashboard() {
        return this.client.get('/analytics/dashboard');
    }
    async getReport(endpoint) {
        return this.client.get(endpoint);
    }
    async getPredictiveAnalytics(restaurantId) {
        return this.client.get(`/analytics/predictive/${restaurantId}`);
    }
}
