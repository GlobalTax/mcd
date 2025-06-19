export class RestaurantValuationService {
    constructor(client) {
        this.client = client;
    }
    async getValuations(restaurantId) {
        const endpoint = restaurantId ? `/valuations?restaurantId=${restaurantId}` : '/valuations';
        return this.client.get(endpoint);
    }
    async getValuation(id) {
        return this.client.get(`/valuations/${id}`);
    }
    async createValuation(input) {
        return this.client.post('/valuations', input);
    }
    async updateValuation(id, input) {
        return this.client.put(`/valuations/${id}`, input);
    }
    async deleteValuation(id) {
        return this.client.delete(`/valuations/${id}`);
    }
    async calculateValuation(input) {
        return this.client.post('/valuations/calculate', input);
    }
    async getValuationHistory(restaurantId) {
        return this.client.get(`/valuations/history/${restaurantId}`);
    }
    async exportValuation(id, format = 'pdf') {
        const response = await fetch(`${this.client['baseURL']}/valuations/${id}/export?format=${format}`);
        return response.blob();
    }
}
