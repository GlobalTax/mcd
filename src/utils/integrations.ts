// Sistema de Integraciones Externas
export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'database' | 'file' | 'service';
  provider: string;
  enabled: boolean;
  config: Record<string, any>;
  credentials?: {
    apiKey?: string;
    secretKey?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  };
  endpoints?: {
    baseUrl: string;
    endpoints: Record<string, string>;
  };
  rateLimit?: {
    requests: number;
    window: number; // en milisegundos
  };
  retryConfig?: {
    maxRetries: number;
    backoffDelay: number;
  };
}

export interface IntegrationData {
  id: string;
  integrationId: string;
  timestamp: Date;
  operation: 'read' | 'write' | 'sync' | 'webhook';
  status: 'success' | 'error' | 'pending';
  data?: any;
  error?: string;
  duration?: number;
}

export interface WebhookPayload {
  event: string;
  timestamp: Date;
  data: any;
  signature?: string;
}

class IntegrationManager {
  private integrations: Map<string, IntegrationConfig> = new Map();
  private dataLog: IntegrationData[] = [];
  private rateLimitCounters: Map<string, { count: number; resetTime: number }> = new Map();

  constructor() {
    this.initializeDefaultIntegrations();
  }

  private initializeDefaultIntegrations(): void {
    // Integración con Google Sheets
    const googleSheetsIntegration: IntegrationConfig = {
      id: 'google-sheets',
      name: 'Google Sheets',
      type: 'api',
      provider: 'google',
      enabled: false,
      config: {
        spreadsheetId: '',
        range: 'A:Z',
        updateInterval: 300000, // 5 minutos
      },
      endpoints: {
        baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets',
        endpoints: {
          read: '/{spreadsheetId}/values/{range}',
          write: '/{spreadsheetId}/values/{range}',
        },
      },
      rateLimit: {
        requests: 100,
        window: 60000, // 1 minuto
      },
      retryConfig: {
        maxRetries: 3,
        backoffDelay: 1000,
      },
    };

    // Integración con Notion
    const notionIntegration: IntegrationConfig = {
      id: 'notion',
      name: 'Notion',
      type: 'api',
      provider: 'notion',
      enabled: false,
      config: {
        databaseId: '',
        pageId: '',
        syncDirection: 'bidirectional',
      },
      endpoints: {
        baseUrl: 'https://api.notion.com/v1',
        endpoints: {
          databases: '/databases/{databaseId}/query',
          pages: '/pages/{pageId}',
          blocks: '/blocks/{blockId}/children',
        },
      },
      rateLimit: {
        requests: 3,
        window: 1000, // 1 segundo
      },
    };

    // Integración con Slack
    const slackIntegration: IntegrationConfig = {
      id: 'slack',
      name: 'Slack',
      type: 'webhook',
      provider: 'slack',
      enabled: false,
      config: {
        channel: '#general',
        username: 'McDonald\'s Bot',
        iconEmoji: ':hamburger:',
      },
      endpoints: {
        baseUrl: 'https://hooks.slack.com/services',
        endpoints: {
          webhook: '/{webhookId}',
        },
      },
    };

    // Integración con Excel/CSV
    const excelIntegration: IntegrationConfig = {
      id: 'excel-csv',
      name: 'Excel/CSV',
      type: 'file',
      provider: 'local',
      enabled: true,
      config: {
        filePath: './data/',
        fileFormat: 'csv',
        encoding: 'utf-8',
        delimiter: ',',
      },
    };

    // Integración con Base de Datos Externa
    const externalDbIntegration: IntegrationConfig = {
      id: 'external-db',
      name: 'Base de Datos Externa',
      type: 'database',
      provider: 'postgres',
      enabled: false,
      config: {
        host: '',
        port: 5432,
        database: '',
        schema: 'public',
        tables: ['restaurants', 'valuations', 'budgets'],
      },
      retryConfig: {
        maxRetries: 5,
        backoffDelay: 2000,
      },
    };

    this.integrations.set(googleSheetsIntegration.id, googleSheetsIntegration);
    this.integrations.set(notionIntegration.id, notionIntegration);
    this.integrations.set(slackIntegration.id, slackIntegration);
    this.integrations.set(excelIntegration.id, excelIntegration);
    this.integrations.set(externalDbIntegration.id, externalDbIntegration);
  }

  // Métodos para gestionar integraciones
  addIntegration(integration: IntegrationConfig): void {
    this.integrations.set(integration.id, integration);
  }

  getIntegration(id: string): IntegrationConfig | undefined {
    return this.integrations.get(id);
  }

  getAllIntegrations(): IntegrationConfig[] {
    return Array.from(this.integrations.values());
  }

  updateIntegration(id: string, updates: Partial<IntegrationConfig>): void {
    const integration = this.integrations.get(id);
    if (integration) {
      this.integrations.set(id, { ...integration, ...updates });
    }
  }

  deleteIntegration(id: string): boolean {
    return this.integrations.delete(id);
  }

  enableIntegration(id: string): void {
    const integration = this.integrations.get(id);
    if (integration) {
      integration.enabled = true;
      this.integrations.set(id, integration);
    }
  }

  disableIntegration(id: string): void {
    const integration = this.integrations.get(id);
    if (integration) {
      integration.enabled = false;
      this.integrations.set(id, integration);
    }
  }

  // Métodos para ejecutar integraciones
  async executeIntegration(id: string, operation: string, data?: any): Promise<any> {
    const integration = this.integrations.get(id);
    if (!integration || !integration.enabled) {
      throw new Error(`Integration ${id} not found or disabled`);
    }

    // Verificar rate limit
    if (!this.checkRateLimit(id)) {
      throw new Error(`Rate limit exceeded for integration ${id}`);
    }

    const startTime = Date.now();
    const logEntry: IntegrationData = {
      id: this.generateLogId(),
      integrationId: id,
      timestamp: new Date(),
      operation: operation as any,
      status: 'pending',
    };

    this.dataLog.push(logEntry);

    try {
      let result: any;

      switch (integration.type) {
        case 'api':
          result = await this.executeApiIntegration(integration, operation, data);
          break;
        case 'webhook':
          result = await this.executeWebhookIntegration(integration, operation, data);
          break;
        case 'database':
          result = await this.executeDatabaseIntegration(integration, operation, data);
          break;
        case 'file':
          result = await this.executeFileIntegration(integration, operation, data);
          break;
        default:
          throw new Error(`Unsupported integration type: ${integration.type}`);
      }

      logEntry.status = 'success';
      logEntry.data = result;
      logEntry.duration = Date.now() - startTime;

      return result;
    } catch (error) {
      logEntry.status = 'error';
      logEntry.error = error instanceof Error ? error.message : 'Unknown error';
      logEntry.duration = Date.now() - startTime;

      // Reintentar si está configurado
      if (integration.retryConfig && integration.retryConfig.maxRetries > 0) {
        return this.retryIntegration(integration, operation, 0, data);
      }

      throw error;
    }
  }

  private async executeApiIntegration(integration: IntegrationConfig, operation: string, data?: any): Promise<any> {
    const endpoint = integration.endpoints?.endpoints[operation];
    if (!endpoint) {
      throw new Error(`Endpoint not found for operation: ${operation}`);
    }

    const url = `${integration.endpoints!.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar autenticación según el proveedor
    if (integration.credentials?.apiKey) {
      headers['Authorization'] = `Bearer ${integration.credentials.apiKey}`;
    }

    const response = await fetch(url, {
      method: operation === 'read' ? 'GET' : 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async executeWebhookIntegration(integration: IntegrationConfig, operation: string, data?: any): Promise<any> {
    const webhookUrl = integration.endpoints?.endpoints.webhook;
    if (!webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    const payload: WebhookPayload = {
      event: operation,
      timestamp: new Date(),
      data: data || {},
    };

    // Agregar firma si está configurada
    if (integration.credentials?.secretKey) {
      payload.signature = this.generateSignature(payload, integration.credentials.secretKey);
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private async executeDatabaseIntegration(integration: IntegrationConfig, operation: string, data?: any): Promise<any> {
    // Simular integración con base de datos externa
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (operation) {
      case 'read':
        return { records: [], count: 0 };
      case 'write':
        return { success: true, affectedRows: 1 };
      case 'sync':
        return { syncedRecords: 10, conflicts: 0 };
      default:
        throw new Error(`Unsupported database operation: ${operation}`);
    }
  }

  private async executeFileIntegration(integration: IntegrationConfig, operation: string, data?: any): Promise<any> {
    // Simular integración con archivos
    await new Promise(resolve => setTimeout(resolve, 300));

    switch (operation) {
      case 'read':
        return { data: [], format: integration.config.fileFormat };
      case 'write':
        return { success: true, filePath: `${integration.config.filePath}export_${Date.now()}.${integration.config.fileFormat}` };
      case 'sync':
        return { syncedFiles: 1, errors: 0 };
      default:
        throw new Error(`Unsupported file operation: ${operation}`);
    }
  }

  private async retryIntegration(integration: IntegrationConfig, operation: string, attempt: number, data?: any): Promise<any> {
    try {
      const result = await this.executeIntegration(integration.id, operation, data);
      return result;
    } catch (error) {
      if (attempt < integration.retryConfig!.maxRetries) {
        await this.delay(integration.retryConfig!.backoffDelay * Math.pow(2, attempt));
        return this.retryIntegration(integration, operation, attempt + 1, data);
      }
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private checkRateLimit(integrationId: string): boolean {
    const integration = this.integrations.get(integrationId);
    if (!integration?.rateLimit) {
      return true;
    }

    const now = Date.now();
    const counter = this.rateLimitCounters.get(integrationId);

    if (!counter || now > counter.resetTime) {
      this.rateLimitCounters.set(integrationId, {
        count: 1,
        resetTime: now + integration.rateLimit.window,
      });
      return true;
    }

    if (counter.count >= integration.rateLimit.requests) {
      return false;
    }

    counter.count++;
    return true;
  }

  private generateSignature(payload: WebhookPayload, secretKey: string): string {
    // Implementar generación de firma HMAC
    const message = JSON.stringify(payload);
    // Aquí usarías crypto.createHmac('sha256', secretKey).update(message).digest('hex')
    return 'signature_placeholder';
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Métodos para sincronización automática
  async syncData(integrationId: string, direction: 'inbound' | 'outbound' | 'bidirectional'): Promise<any> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    const results: any = {};

    if (direction === 'inbound' || direction === 'bidirectional') {
      results.inbound = await this.executeIntegration(integrationId, 'sync', { direction: 'inbound' });
    }

    if (direction === 'outbound' || direction === 'bidirectional') {
      results.outbound = await this.executeIntegration(integrationId, 'sync', { direction: 'outbound' });
    }

    return results;
  }

  // Métodos para webhooks
  async handleWebhook(integrationId: string, payload: WebhookPayload): Promise<any> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    // Verificar firma si está configurada
    if (integration.credentials?.secretKey && payload.signature) {
      const expectedSignature = this.generateSignature(payload, integration.credentials.secretKey);
      if (payload.signature !== expectedSignature) {
        throw new Error('Invalid webhook signature');
      }
    }

    // Procesar el webhook según el tipo de evento
    switch (payload.event) {
      case 'data_updated':
        return this.handleDataUpdate(integrationId, payload.data);
      case 'notification':
        return this.handleNotification(integrationId, payload.data);
      default:
        return { processed: true, event: payload.event };
    }
  }

  private async handleDataUpdate(integrationId: string, data: any): Promise<any> {
    // Procesar actualización de datos
    console.log(`Processing data update for integration ${integrationId}:`, data);
    return { success: true, updatedRecords: 1 };
  }

  private async handleNotification(integrationId: string, data: any): Promise<any> {
    // Procesar notificación
    console.log(`Processing notification for integration ${integrationId}:`, data);
    return { success: true, notificationSent: true };
  }

  // Métodos para obtener logs y estadísticas
  getIntegrationLogs(integrationId?: string): IntegrationData[] {
    if (integrationId) {
      return this.dataLog.filter(log => log.integrationId === integrationId);
    }
    return [...this.dataLog];
  }

  getIntegrationStats(): any {
    const stats: any = {};

    Array.from(this.integrations.values()).forEach(integration => {
      const logs = this.getIntegrationLogs(integration.id);
      const totalOperations = logs.length;
      const successfulOperations = logs.filter(log => log.status === 'success').length;
      const failedOperations = logs.filter(log => log.status === 'error').length;

      stats[integration.id] = {
        name: integration.name,
        enabled: integration.enabled,
        totalOperations,
        successfulOperations,
        failedOperations,
        successRate: totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0,
        averageDuration: logs.length > 0 
          ? logs.reduce((sum, log) => sum + (log.duration || 0), 0) / logs.length 
          : 0,
      };
    });

    return stats;
  }

  // Métodos de utilidad
  testConnection(integrationId: string): Promise<boolean> {
    return this.executeIntegration(integrationId, 'test', {})
      .then(() => true)
      .catch(() => false);
  }

  validateCredentials(integrationId: string): Promise<boolean> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      return Promise.resolve(false);
    }

    // Validar credenciales según el tipo de integración
    switch (integration.type) {
      case 'api':
        return this.validateApiCredentials(integration);
      case 'webhook':
        return this.validateWebhookCredentials(integration);
      default:
        return Promise.resolve(true);
    }
  }

  private async validateApiCredentials(integration: IntegrationConfig): Promise<boolean> {
    try {
      await this.executeApiIntegration(integration, 'test', {});
      return true;
    } catch (error) {
      return false;
    }
  }

  private async validateWebhookCredentials(integration: IntegrationConfig): Promise<boolean> {
    // Validar que la URL del webhook sea accesible
    const webhookUrl = integration.endpoints?.endpoints.webhook;
    if (!webhookUrl) {
      return false;
    }

    try {
      const response = await fetch(webhookUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  private cleanupExpiredIntegrations(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    Array.from(this.integrations.entries()).forEach(([key, integration]) => {
      if (integration.credentials?.expiresAt && new Date(integration.credentials.expiresAt).getTime() < now) {
        expiredKeys.push(key);
      }
    });
    
    expiredKeys.forEach(key => this.integrations.delete(key));
  }
}

// Instancia global del gestor de integraciones
export const integrationManager = new IntegrationManager();

// Funciones helper para uso común
export const syncWithGoogleSheets = async (data: any): Promise<any> => {
  return integrationManager.executeIntegration('google-sheets', 'write', data);
};

export const sendSlackNotification = async (message: string, channel?: string): Promise<any> => {
  return integrationManager.executeIntegration('slack', 'notification', { 
    text: message, 
    channel: channel || '#general' 
  });
};

export const exportToExcel = async (data: any): Promise<any> => {
  return integrationManager.executeIntegration('excel-csv', 'write', data);
};

export const syncWithNotion = async (data: any): Promise<any> => {
  return integrationManager.executeIntegration('notion', 'sync', data);
};

// Hook para usar el gestor de integraciones en componentes React
export const useIntegrations = () => {
  return integrationManager;
}; 