export class ReportService {
    constructor(client) {
        this.client = client;
    }
    async generateReport(type, filters) {
        return this.client.post('/reports/generate', { type, filters });
    }
    async getUserReports(userId) {
        return this.client.get(`/reports/${userId}`);
    }
    async getReport(id) {
        return this.client.get(`/reports/${id}`);
    }
    async deleteReport(id) {
        return this.client.delete(`/reports/${id}`);
    }
    async downloadReport(id) {
        const response = await fetch(`${this.client['baseURL']}/reports/${id}/download`);
        return response.blob();
    }
    async scheduleReport(type, filters, schedule) {
        return this.client.post('/reports/schedule', { type, filters, schedule });
    }
    async getScheduledReports(userId) {
        return this.client.get(`/reports/scheduled/${userId}`);
    }
}
