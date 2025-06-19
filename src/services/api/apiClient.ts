export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
  headers: Record<string, string>;
}

export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: ApiRequest;
}

export interface ApiError {
  message: string;
  status: number;
  statusText: string;
  data?: any;
  config: ApiRequest;
}

// Configuración de microservicios
export const MICROSERVICES = {
  VALUATION: {
    name: 'valuation-service',
    baseURL: process.env.REACT_APP_VALUATION_API_URL || 'http://localhost:3001',
    endpoints: {
      calculate: '/api/valuations/calculate',
      save: '/api/valuations',
      get: '/api/valuations/:id',
      list: '/api/valuations',
      update: '/api/valuations/:id',
      delete: '/api/valuations/:id',
      export: '/api/valuations/:id/export',
    },
  },
  BUDGET: {
    name: 'budget-service',
    baseURL: process.env.REACT_APP_BUDGET_API_URL || 'http://localhost:3002',
    endpoints: {
      create: '/api/budgets',
      get: '/api/budgets/:id',
      list: '/api/budgets',
      update: '/api/budgets/:id',
      delete: '/api/budgets/:id',
      analyze: '/api/budgets/:id/analyze',
      export: '/api/budgets/:id/export',
    },
  },
  ANALYTICS: {
    name: 'analytics-service',
    baseURL: process.env.REACT_APP_ANALYTICS_API_URL || 'http://localhost:3003',
    endpoints: {
      metrics: '/api/analytics/metrics',
      reports: '/api/analytics/reports',
      insights: '/api/analytics/insights',
      trends: '/api/analytics/trends',
      export: '/api/analytics/export',
    },
  },
  NOTIFICATIONS: {
    name: 'notifications-service',
    baseURL: process.env.REACT_APP_NOTIFICATIONS_API_URL || 'http://localhost:3004',
    endpoints: {
      send: '/api/notifications/send',
      list: '/api/notifications',
      markRead: '/api/notifications/:id/read',
      delete: '/api/notifications/:id',
      settings: '/api/notifications/settings',
    },
  },
  AI: {
    name: 'ai-service',
    baseURL: process.env.REACT_APP_AI_API_URL || 'http://localhost:3005',
    endpoints: {
      analyze: '/api/ai/analyze',
      generate: '/api/ai/generate',
      insights: '/api/ai/insights',
      recommendations: '/api/ai/recommendations',
    },
  },
  REPORTS: {
    name: 'reports-service',
    baseURL: process.env.REACT_APP_REPORTS_API_URL || 'http://localhost:3006',
    endpoints: {
      generate: '/api/reports/generate',
      templates: '/api/reports/templates',
      schedule: '/api/reports/schedule',
      download: '/api/reports/:id/download',
    },
  },
  INTEGRATIONS: {
    name: 'integrations-service',
    baseURL: process.env.REACT_APP_INTEGRATIONS_API_URL || 'http://localhost:3007',
    endpoints: {
      sync: '/api/integrations/sync',
      status: '/api/integrations/status',
      config: '/api/integrations/config',
      webhook: '/api/integrations/webhook',
    },
  },
} as const;

class ApiClient {
  private config: ApiConfig;
  private requestInterceptors: Array<(request: ApiRequest) => ApiRequest> = [];
  private responseInterceptors: Array<(response: ApiResponse) => ApiResponse> = [];
  private errorInterceptors: Array<(error: ApiError) => ApiError> = [];

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseURL: '',
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  // Métodos para interceptores
  addRequestInterceptor(interceptor: (request: ApiRequest) => ApiRequest): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: (response: ApiResponse) => ApiResponse): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: (error: ApiError) => ApiError): void {
    this.errorInterceptors.push(interceptor);
  }

  // Método principal para hacer requests
  async request<T = any>(request: ApiRequest): Promise<ApiResponse<T>> {
    try {
      // Aplicar interceptores de request
      let processedRequest = { ...request };
      for (const interceptor of this.requestInterceptors) {
        processedRequest = interceptor(processedRequest);
      }

      // Hacer el request con retry
      const response = await this.makeRequestWithRetry<T>(processedRequest);
      
      // Aplicar interceptores de response
      let processedResponse = response;
      for (const interceptor of this.responseInterceptors) {
        processedResponse = interceptor(processedResponse);
      }

      return processedResponse;
    } catch (error) {
      const apiError = this.createApiError(error, request);
      
      // Aplicar interceptores de error
      let processedError = apiError;
      for (const interceptor of this.errorInterceptors) {
        processedError = interceptor(processedError);
      }

      throw processedError;
    }
  }

  // Método para hacer request con retry
  private async makeRequestWithRetry<T>(request: ApiRequest, attempt: number = 1): Promise<ApiResponse<T>> {
    try {
      return await this.makeRequest<T>(request);
    } catch (error) {
      if (attempt < this.config.retries && this.shouldRetry(error)) {
        await this.delay(this.config.retryDelay * Math.pow(2, attempt - 1));
        return this.makeRequestWithRetry<T>(request, attempt + 1);
      }
      throw error;
    }
  }

  // Método para hacer el request HTTP
  private async makeRequest<T>(request: ApiRequest): Promise<ApiResponse<T>> {
    const { method, url, data, params, headers, timeout } = request;
    
    // Construir URL con parámetros
    const urlWithParams = this.buildUrl(url, params);
    
    // Construir headers
    const requestHeaders = {
      ...this.config.headers,
      ...headers,
    };

    // Configurar fetch options
    const fetchOptions: RequestInit = {
      method,
      headers: requestHeaders,
      signal: timeout ? AbortSignal.timeout(timeout) : undefined,
    };

    // Agregar body para requests que lo necesiten
    if (data && method !== 'GET') {
      fetchOptions.body = JSON.stringify(data);
    }

    // Hacer el request
    const response = await fetch(urlWithParams, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Parsear respuesta
    const responseData = await response.json();

    return {
      data: responseData,
      status: response.status,
      statusText: response.statusText,
      headers: this.parseHeaders(response.headers),
      config: request,
    };
  }

  // Construir URL con parámetros
  private buildUrl(url: string, params?: Record<string, any>): string {
    let finalUrl = url;

    // Reemplazar parámetros en la URL
    if (params) {
      Object.keys(params).forEach(key => {
        finalUrl = finalUrl.replace(`:${key}`, params[key]);
      });
    }

    return finalUrl;
  }

  // Parsear headers de respuesta
  private parseHeaders(headers: Headers): Record<string, string> {
    const parsedHeaders: Record<string, string> = {};
    headers.forEach((value, key) => {
      parsedHeaders[key] = value;
    });
    return parsedHeaders;
  }

  // Verificar si se debe reintentar
  private shouldRetry(error: any): boolean {
    // Reintentar en errores de red o 5xx
    return error.name === 'TypeError' || 
           (error.status >= 500 && error.status < 600);
  }

  // Delay para retry
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Crear error de API
  private createApiError(error: any, request: ApiRequest): ApiError {
    return {
      message: error.message || 'Unknown error',
      status: error.status || 0,
      statusText: error.statusText || '',
      data: error.data,
      config: request,
    };
  }

  // Métodos helper para diferentes tipos de requests
  async get<T = any>(url: string, params?: Record<string, any>, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      ...config,
    });
  }

  async post<T = any>(url: string, data?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'POST',
      url,
      data,
      ...config,
    });
  }

  async put<T = any>(url: string, data?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      url,
      data,
      ...config,
    });
  }

  async patch<T = any>(url: string, data?: any, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      url,
      data,
      ...config,
    });
  }

  async delete<T = any>(url: string, config?: Partial<ApiRequest>): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      url,
      ...config,
    });
  }
}

// Cliente de API para microservicios específicos
class MicroserviceClient extends ApiClient {
  private serviceConfig: typeof MICROSERVICES[keyof typeof MICROSERVICES];

  constructor(service: keyof typeof MICROSERVICES) {
    const serviceConfig = MICROSERVICES[service];
    super({
      baseURL: serviceConfig.baseURL,
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
    });
    this.serviceConfig = serviceConfig;
  }

  // Método para construir URLs de endpoints
  buildEndpointUrl(endpoint: string, params?: Record<string, any>): string {
    let url: string = this.serviceConfig.endpoints[endpoint as keyof typeof this.serviceConfig.endpoints] as string;
    if (!url) {
      throw new Error(`Endpoint ${endpoint} not found for service ${this.serviceConfig.name}`);
    }
    if (params) {
      Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, String(params[key]));
      });
    }
    return `${this.serviceConfig.baseURL}${url}`;
  }

  // Métodos específicos para cada servicio
  async callEndpoint<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    data?: any,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = this.buildEndpointUrl(endpoint, params);
    
    return this.request<T>({
      method,
      url,
      data,
      params,
    });
  }
}

// Clientes específicos para cada microservicio
export const valuationClient = new MicroserviceClient('VALUATION');
export const budgetClient = new MicroserviceClient('BUDGET');
export const analyticsClient = new MicroserviceClient('ANALYTICS');
export const notificationsClient = new MicroserviceClient('NOTIFICATIONS');
export const aiClient = new MicroserviceClient('AI');
export const reportsClient = new MicroserviceClient('REPORTS');
export const integrationsClient = new MicroserviceClient('INTEGRATIONS');

// Cliente de API principal
export const apiClient = new ApiClient();

// Configurar interceptores globales
apiClient.addRequestInterceptor((request) => {
  // Agregar token de autenticación si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    request.headers = {
      ...request.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  
  // Agregar timestamp para cache busting
  if (request.method === 'GET') {
    request.params = {
      ...request.params,
      _t: Date.now(),
    };
  }
  
  return request;
});

apiClient.addResponseInterceptor((response) => {
  // Log de respuestas exitosas
  console.log(`API Response: ${response.config.method} ${response.config.url} - ${response.status}`);
  return response;
});

apiClient.addErrorInterceptor((error) => {
  // Log de errores
  console.error(`API Error: ${error.config.method} ${error.config.url} - ${error.status}: ${error.message}`);
  
  // Manejar errores de autenticación
  if (error.status === 401) {
    localStorage.removeItem('authToken');
    window.location.href = '/auth';
  }
  
  return error;
});

// Funciones helper para uso común
export const api = {
  // Métodos generales
  get: <T = any>(url: string, params?: Record<string, any>) => apiClient.get<T>(url, params),
  post: <T = any>(url: string, data?: any) => apiClient.post<T>(url, data),
  put: <T = any>(url: string, data?: any) => apiClient.put<T>(url, data),
  patch: <T = any>(url: string, data?: any) => apiClient.patch<T>(url, data),
  delete: <T = any>(url: string) => apiClient.delete<T>(url),
  
  // Clientes de microservicios
  valuation: valuationClient,
  budget: budgetClient,
  analytics: analyticsClient,
  notifications: notificationsClient,
  ai: aiClient,
  reports: reportsClient,
  integrations: integrationsClient,
};

// Hook para usar la API en componentes React
export const useApi = () => {
  return api;
}; 