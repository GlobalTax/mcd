export class IntegrationService {
    constructor(client) {
        this.client = client;
    }
    async getIntegrations() {
        return this.client.get('/integrations');
    }
    async getIntegration(id) {
        return this.client.get(`/integrations/${id}`);
    }
    async createIntegration(integration) {
        return this.client.post('/integrations', integration);
    }
    async updateIntegration(id, config) {
        return this.client.put(`/integrations/${id}`, { config });
    }
    async deleteIntegration(id) {
        return this.client.delete(`/integrations/${id}`);
    }
    async syncIntegration(id) {
        return this.client.post(`/integrations/${id}/sync`);
    }
    async testConnection(id) {
        return this.client.post(`/integrations/${id}/test`);
    }
    async getSyncStatus(id) {
        return this.client.get(`/integrations/${id}/status`);
    }
}
