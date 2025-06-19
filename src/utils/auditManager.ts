// Sistema de gestión de auditoría
export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'data_access' | 'data_modification' | 'system' | 'security' | 'user_management';
  metadata?: Record<string, any>;
}

export interface AuditQuery {
  userId?: string;
  action?: string;
  resource?: string;
  severity?: string;
  category?: string;
  dateRange?: { start: Date; end: Date };
  limit?: number;
  offset?: number;
}

export interface AuditReport {
  id: string;
  title: string;
  description: string;
  query: AuditQuery;
  events: AuditEvent[];
  summary: {
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    eventsByUser: Record<string, number>;
    eventsByAction: Record<string, number>;
  };
  generatedAt: Date;
  generatedBy: string;
}

export interface AuditAlert {
  id: string;
  name: string;
  description: string;
  condition: {
    action?: string;
    resource?: string;
    severity?: string;
    threshold: number;
    timeWindow: number; // en minutos
  };
  enabled: boolean;
  actions: string[]; // 'email', 'notification', 'webhook'
  recipients?: string[];
  webhookUrl?: string;
}

class AuditManager {
  private events: AuditEvent[] = [];
  private alerts: AuditAlert[] = [];
  private isEnabled = true;
  private alertHandlers: Map<string, (alert: AuditAlert, events: AuditEvent[]) => void> = new Map();

  // Registrar evento de auditoría
  logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): string {
    if (!this.isEnabled) return '';

    const eventId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const auditEvent: AuditEvent = {
      id: eventId,
      timestamp: new Date(),
      ...event,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };

    this.events.push(auditEvent);

    // Verificar alertas
    this.checkAlerts(auditEvent);

    // Enviar a servicios externos si es crítico
    if (auditEvent.severity === 'critical') {
      this.sendToExternalAudit(auditEvent);
    }

    return eventId;
  }

  // Registrar evento de autenticación
  logAuthEvent(userId: string, action: 'login' | 'logout' | 'register' | 'password_reset' | 'failed_login', details?: Record<string, any>): string {
    return this.logEvent({
      userId,
      action,
      resource: 'auth',
      details: details || {},
      severity: action === 'failed_login' ? 'high' : 'medium',
      category: 'authentication'
    });
  }

  // Registrar evento de acceso a datos
  logDataAccessEvent(userId: string, resource: string, resourceId: string, action: 'view' | 'export' | 'download', details?: Record<string, any>): string {
    return this.logEvent({
      userId,
      action,
      resource,
      resourceId,
      details: details || {},
      severity: 'low',
      category: 'data_access'
    });
  }

  // Registrar evento de modificación de datos
  logDataModificationEvent(userId: string, resource: string, resourceId: string, action: 'create' | 'update' | 'delete', oldValue?: any, newValue?: any): string {
    const details: Record<string, any> = {};
    if (oldValue !== undefined) details.oldValue = oldValue;
    if (newValue !== undefined) details.newValue = newValue;

    return this.logEvent({
      userId,
      action,
      resource,
      resourceId,
      details,
      severity: action === 'delete' ? 'high' : 'medium',
      category: 'data_modification'
    });
  }

  // Registrar evento de sistema
  logSystemEvent(action: string, details?: Record<string, any>, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): string {
    return this.logEvent({
      action,
      resource: 'system',
      details: details || {},
      severity,
      category: 'system'
    });
  }

  // Registrar evento de seguridad
  logSecurityEvent(userId: string, action: string, details?: Record<string, any>, severity: 'low' | 'medium' | 'high' | 'critical' = 'high'): string {
    return this.logEvent({
      userId,
      action,
      resource: 'security',
      details: details || {},
      severity,
      category: 'security'
    });
  }

  // Registrar evento de gestión de usuarios
  logUserManagementEvent(userId: string, action: string, targetUserId: string, details?: Record<string, any>): string {
    return this.logEvent({
      userId,
      action,
      resource: 'users',
      resourceId: targetUserId,
      details: details || {},
      severity: 'medium',
      category: 'user_management'
    });
  }

  // Obtener IP del cliente
  private getClientIP(): string {
    // En un entorno real, obtener de headers HTTP
    return '127.0.0.1';
  }

  // Verificar alertas
  private checkAlerts(event: AuditEvent): void {
    this.alerts.forEach(alert => {
      if (!alert.enabled) return;

      const condition = alert.condition;
      let matches = true;

      // Verificar condiciones
      if (condition.action && event.action !== condition.action) matches = false;
      if (condition.resource && event.resource !== condition.resource) matches = false;
      if (condition.severity && event.severity !== condition.severity) matches = false;

      if (matches) {
        // Verificar umbral en ventana de tiempo
        const timeWindow = new Date(event.timestamp.getTime() - condition.timeWindow * 60 * 1000);
        const recentEvents = this.events.filter(e => 
          e.timestamp >= timeWindow &&
          e.action === event.action &&
          e.resource === event.resource
        );

        if (recentEvents.length >= condition.threshold) {
          this.triggerAlert(alert, recentEvents);
        }
      }
    });
  }

  // Disparar alerta
  private triggerAlert(alert: AuditAlert, events: AuditEvent[]): void {
    alert.actions.forEach(action => {
      switch (action) {
        case 'email':
          this.sendEmailAlert(alert, events);
          break;
        case 'notification':
          this.sendNotificationAlert(alert, events);
          break;
        case 'webhook':
          this.sendWebhookAlert(alert, events);
          break;
      }
    });

    // Ejecutar handlers personalizados
    this.alertHandlers.forEach(handler => {
      try {
        handler(alert, events);
      } catch (error) {
        console.error('Error in alert handler:', error);
      }
    });
  }

  // Enviar alerta por email
  private async sendEmailAlert(alert: AuditAlert, events: AuditEvent[]): Promise<void> {
    if (!alert.recipients || alert.recipients.length === 0) return;

    try {
      // Implementar envío de email
      console.log(`Sending email alert to ${alert.recipients.join(', ')}`);
    } catch (error) {
      console.error('Failed to send email alert:', error);
    }
  }

  // Enviar alerta por notificación
  private sendNotificationAlert(alert: AuditAlert, events: AuditEvent[]): void {
    // Implementar notificación en la aplicación
    console.log(`Sending notification alert: ${alert.name}`);
  }

  // Enviar alerta por webhook
  private async sendWebhookAlert(alert: AuditAlert, events: AuditEvent[]): Promise<void> {
    if (!alert.webhookUrl) return;

    try {
      await fetch(alert.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert: alert.name,
          description: alert.description,
          events: events,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  // Enviar a servicios externos
  private async sendToExternalAudit(auditEvent: AuditEvent): Promise<void> {
    try {
      // Use a safer way to access environment variables
      const auditEndpoint = this.getEnvVar('VITE_AUDIT_ENDPOINT');
      if (auditEndpoint) {
        await fetch(auditEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getEnvVar('VITE_AUDIT_API_KEY', '')}`
          },
          body: JSON.stringify(auditEvent)
        });
      }
    } catch (error) {
      console.warn('Failed to send audit event to external service:', error);
    }
  }

  private getEnvVar(key: string, defaultValue: string = ''): string {
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key] || defaultValue;
    }
    return defaultValue;
  }

  // Consultar eventos de auditoría
  queryEvents(query: AuditQuery): AuditEvent[] {
    let filteredEvents = [...this.events];

    if (query.userId) {
      filteredEvents = filteredEvents.filter(e => e.userId === query.userId);
    }
    if (query.action) {
      filteredEvents = filteredEvents.filter(e => e.action === query.action);
    }
    if (query.resource) {
      filteredEvents = filteredEvents.filter(e => e.resource === query.resource);
    }
    if (query.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === query.severity);
    }
    if (query.category) {
      filteredEvents = filteredEvents.filter(e => e.category === query.category);
    }
    if (query.dateRange) {
      filteredEvents = filteredEvents.filter(e => 
        e.timestamp >= query.dateRange!.start && e.timestamp <= query.dateRange!.end
      );
    }

    // Ordenar por timestamp descendente
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Aplicar paginación
    if (query.offset) {
      filteredEvents = filteredEvents.slice(query.offset);
    }
    if (query.limit) {
      filteredEvents = filteredEvents.slice(0, query.limit);
    }

    return filteredEvents;
  }

  // Generar reporte de auditoría
  generateReport(title: string, description: string, query: AuditQuery, generatedBy: string): AuditReport {
    const events = this.queryEvents(query);
    
    const summary = {
      totalEvents: events.length,
      eventsByCategory: {} as Record<string, number>,
      eventsBySeverity: {} as Record<string, number>,
      eventsByUser: {} as Record<string, number>,
      eventsByAction: {} as Record<string, number>
    };

    events.forEach(event => {
      summary.eventsByCategory[event.category] = (summary.eventsByCategory[event.category] || 0) + 1;
      summary.eventsBySeverity[event.severity] = (summary.eventsBySeverity[event.severity] || 0) + 1;
      if (event.userId) {
        summary.eventsByUser[event.userId] = (summary.eventsByUser[event.userId] || 0) + 1;
      }
      summary.eventsByAction[event.action] = (summary.eventsByAction[event.action] || 0) + 1;
    });

    const report: AuditReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      query,
      events,
      summary,
      generatedAt: new Date(),
      generatedBy
    };

    return report;
  }

  // Crear alerta
  createAlert(alert: AuditAlert): void {
    this.alerts.push(alert);
  }

  // Actualizar alerta
  updateAlert(alertId: string, updates: Partial<AuditAlert>): void {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.alerts[alertIndex] = { ...this.alerts[alertIndex], ...updates };
    }
  }

  // Eliminar alerta
  deleteAlert(alertId: string): void {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  // Obtener alertas
  getAlerts(): AuditAlert[] {
    return [...this.alerts];
  }

  // Registrar handler de alerta
  registerAlertHandler(name: string, handler: (alert: AuditAlert, events: AuditEvent[]) => void): void {
    this.alertHandlers.set(name, handler);
  }

  // Remover handler de alerta
  unregisterAlertHandler(name: string): void {
    this.alertHandlers.delete(name);
  }

  // Obtener estadísticas de auditoría
  getAuditStats(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): {
    totalEvents: number;
    eventsByCategory: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    eventsByUser: Record<string, number>;
    eventsByAction: Record<string, number>;
    criticalEvents: number;
    failedLogins: number;
  } {
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = new Date(Date.now() - timeRanges[timeRange]);
    const recentEvents = this.events.filter(e => e.timestamp >= cutoff);

    const stats = {
      totalEvents: recentEvents.length,
      eventsByCategory: {} as Record<string, number>,
      eventsBySeverity: {} as Record<string, number>,
      eventsByUser: {} as Record<string, number>,
      eventsByAction: {} as Record<string, number>,
      criticalEvents: 0,
      failedLogins: 0
    };

    recentEvents.forEach(event => {
      stats.eventsByCategory[event.category] = (stats.eventsByCategory[event.category] || 0) + 1;
      stats.eventsBySeverity[event.severity] = (stats.eventsBySeverity[event.severity] || 0) + 1;
      if (event.userId) {
        stats.eventsByUser[event.userId] = (stats.eventsByUser[event.userId] || 0) + 1;
      }
      stats.eventsByAction[event.action] = (stats.eventsByAction[event.action] || 0) + 1;
      
      if (event.severity === 'critical') stats.criticalEvents++;
      if (event.action === 'failed_login') stats.failedLogins++;
    });

    return stats;
  }

  // Exportar eventos
  exportEvents(query: AuditQuery, format: 'json' | 'csv' = 'json'): string {
    const events = this.queryEvents(query);
    
    if (format === 'csv') {
      return this.convertToCSV(events);
    }
    
    return JSON.stringify(events, null, 2);
  }

  // Convertir a CSV
  private convertToCSV(events: AuditEvent[]): string {
    const headers = ['id', 'timestamp', 'userId', 'action', 'resource', 'resourceId', 'severity', 'category'];
    const csv = [headers.join(',')];
    
    events.forEach(event => {
      const row = headers.map(header => {
        const value = event[header as keyof AuditEvent];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csv.push(row.join(','));
    });
    
    return csv.join('\n');
  }

  // Habilitar/deshabilitar audit manager
  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Limpiar eventos antiguos
  cleanup(maxAge: number = 90 * 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    this.events = this.events.filter(event => event.timestamp >= cutoff);
  }
}

// Instancia global del audit manager
export const auditManager = new AuditManager();

// Hooks de React para gestión de auditoría
export const useAuditManager = () => {
  return {
    logEvent: auditManager.logEvent.bind(auditManager),
    logAuthEvent: auditManager.logAuthEvent.bind(auditManager),
    logDataAccessEvent: auditManager.logDataAccessEvent.bind(auditManager),
    logDataModificationEvent: auditManager.logDataModificationEvent.bind(auditManager),
    logSystemEvent: auditManager.logSystemEvent.bind(auditManager),
    logSecurityEvent: auditManager.logSecurityEvent.bind(auditManager),
    logUserManagementEvent: auditManager.logUserManagementEvent.bind(auditManager),
    queryEvents: auditManager.queryEvents.bind(auditManager),
    generateReport: auditManager.generateReport.bind(auditManager),
    createAlert: auditManager.createAlert.bind(auditManager),
    updateAlert: auditManager.updateAlert.bind(auditManager),
    deleteAlert: auditManager.deleteAlert.bind(auditManager),
    getAlerts: auditManager.getAlerts.bind(auditManager),
    registerAlertHandler: auditManager.registerAlertHandler.bind(auditManager),
    unregisterAlertHandler: auditManager.unregisterAlertHandler.bind(auditManager),
    getAuditStats: auditManager.getAuditStats.bind(auditManager),
    exportEvents: auditManager.exportEvents.bind(auditManager),
    enable: auditManager.enable.bind(auditManager),
    disable: auditManager.disable.bind(auditManager),
    cleanup: auditManager.cleanup.bind(auditManager)
  };
}; 