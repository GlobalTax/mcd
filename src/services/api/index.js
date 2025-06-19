import { createClient } from '@supabase/supabase-js';
import { RestaurantValuationService } from './restaurantValuationService';
import { BudgetService } from './budgetService';
import { AnalyticsService } from './analyticsService';
import { NotificationService } from './notificationService';
import { AIAssistantService } from './aiAssistantService';
import { ReportService } from './reportService';
import { IntegrationService } from './integrationService';
// Función helper para obtener variables de entorno de forma segura
function getEnvVar(key, defaultValue = '') {
    if (typeof window !== 'undefined' && window.__ENV__) {
        return window.__ENV__[key] || defaultValue;
    }
    return defaultValue;
}
export const MICROSERVICES = {
    valuation: {
        name: 'Valuation Service',
        baseUrl: getEnvVar('VITE_VALUATION_SERVICE_URL', 'http://localhost:3001'),
        timeout: 30000,
        retries: 3
    },
    budget: {
        name: 'Budget Service',
        baseUrl: getEnvVar('VITE_BUDGET_SERVICE_URL', 'http://localhost:3002'),
        timeout: 30000,
        retries: 3
    },
    analytics: {
        name: 'Analytics Service',
        baseUrl: getEnvVar('VITE_ANALYTICS_SERVICE_URL', 'http://localhost:3003'),
        timeout: 30000,
        retries: 3
    },
    ai: {
        name: 'AI Assistant Service',
        baseUrl: getEnvVar('VITE_AI_SERVICE_URL', 'http://localhost:3004'),
        timeout: 60000,
        retries: 2
    },
    reports: {
        name: 'Reports Service',
        baseUrl: getEnvVar('VITE_REPORTS_SERVICE_URL', 'http://localhost:3005'),
        timeout: 45000,
        retries: 3
    },
    integrations: {
        name: 'Integrations Service',
        baseUrl: getEnvVar('VITE_INTEGRATIONS_SERVICE_URL', 'http://localhost:3006'),
        timeout: 30000,
        retries: 3
    }
};
// Cliente HTTP centralizado con interceptores
class ApiClient {
    constructor(config) {
        this.baseURL = config.baseUrl;
        this.timeout = config.timeout;
        this.retries = config.retries;
    }
    async request(endpoint, options = {}, retryCount = 0) {
        const url = `${this.baseURL}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (retryCount < this.retries && this.isRetryableError(error)) {
                await this.delay(Math.pow(2, retryCount) * 1000); // Exponential backoff
                return this.request(endpoint, options, retryCount + 1);
            }
            throw error;
        }
    }
    isRetryableError(error) {
        return error.name === 'AbortError' ||
            (error.message && error.message.includes('500'));
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
    async patch(endpoint, data) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}
// Factory para crear clientes de microservicios
export class ApiServiceFactory {
    static getClient(serviceName) {
        if (!this.clients.has(serviceName)) {
            const config = MICROSERVICES[serviceName];
            if (!config) {
                throw new Error(`Microservicio no encontrado: ${serviceName}`);
            }
            this.clients.set(serviceName, new ApiClient(config));
        }
        return this.clients.get(serviceName);
    }
    static getValuationService() {
        return new RestaurantValuationService(this.getClient('valuation'));
    }
    static getBudgetService() {
        return new BudgetService(this.getClient('budget'));
    }
    static getAnalyticsService() {
        return new AnalyticsService(this.getClient('analytics'));
    }
    static getNotificationService() {
        return new NotificationService(this.getClient('notifications'));
    }
    static getAIAssistantService() {
        return new AIAssistantService(this.getClient('ai'));
    }
    static getReportService() {
        return new ReportService(this.getClient('reports'));
    }
    static getIntegrationService() {
        return new IntegrationService(this.getClient('integrations'));
    }
}
ApiServiceFactory.clients = new Map();
// Exportar servicios específicos
export const valuationService = ApiServiceFactory.getValuationService();
export const budgetService = ApiServiceFactory.getBudgetService();
export const analyticsService = ApiServiceFactory.getAnalyticsService();
export const notificationService = ApiServiceFactory.getNotificationService();
export const aiAssistantService = ApiServiceFactory.getAIAssistantService();
export const reportService = ApiServiceFactory.getReportService();
export const integrationService = ApiServiceFactory.getIntegrationService();
// Cliente Supabase para compatibilidad
export const supabase = createClient(getEnvVar('VITE_SUPABASE_URL', ''), getEnvVar('VITE_SUPABASE_ANON_KEY', ''));
