export class BudgetService {
    constructor(client) {
        this.client = client;
    }
    async getBudgets(restaurantId) {
        const endpoint = restaurantId ? `/budgets?restaurantId=${restaurantId}` : '/budgets';
        return this.client.get(endpoint);
    }
    async getBudget(id) {
        return this.client.get(`/budgets/${id}`);
    }
    async createBudget(input) {
        return this.client.post('/budgets', input);
    }
    async updateBudget(id, input) {
        return this.client.put(`/budgets/${id}`, input);
    }
    async deleteBudget(id) {
        return this.client.delete(`/budgets/${id}`);
    }
    async getAnnualBudgets(year) {
        return this.client.get(`/budgets/annual/${year}`);
    }
    async compareBudgets(budgetIds) {
        return this.client.post('/budgets/compare', { budgetIds });
    }
    async exportBudget(id, format = 'pdf') {
        const response = await fetch(`${this.client['baseURL']}/budgets/${id}/export?format=${format}`);
        return response.blob();
    }
}
