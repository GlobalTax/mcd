// Sistema de gestión de errores avanzado
export interface ErrorInfo {
  id: string;
  error: Error;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  componentStack?: string;
  userAgent: string;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'javascript' | 'network' | 'validation' | 'authentication' | 'database' | 'unknown';
  context: Record<string, any>;
  resolved: boolean;
  resolution?: string;
  assignedTo?: string;
  component?: string;
  action?: string;
}

export interface ErrorReport {
  id: string;
  title: string;
  description: string;
  errorCount: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  affectedUsers: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: number;
  tags: string[];
}

export interface ErrorResolution {
  id: string;
  errorId: string;
  resolution: string;
  implementedBy: string;
  implementedAt: Date;
  testingNotes?: string;
  deploymentNotes?: string;
}

class ErrorManager {
  private errors: ErrorInfo[] = [];
  private errorReports: ErrorReport[] = [];
  private errorResolutions: ErrorResolution[] = [];
  private isEnabled = true;
  private errorHandlers: Map<string, (error: Error, context: any) => void> = new Map();

  // Capturar error
  captureError(error: Error, context: Record<string, any> = {}): string {
    if (!this.isEnabled) return '';

    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const errorInfo: ErrorInfo = {
      id: errorId,
      error,
      timestamp: new Date(),
      userId: context.userId,
      sessionId: context.sessionId,
      componentStack: context.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: this.calculateSeverity(error, context),
      category: this.categorizeError(error, context),
      context,
      resolved: false,
      component: context.component,
      action: context.action
    };

    this.errors.push(errorInfo);

    // Ejecutar handlers específicos
    this.executeErrorHandlers(error, context);

    // Crear o actualizar reporte de error
    this.updateErrorReport(errorInfo);

    // Enviar a servicios externos si es crítico
    if (errorInfo.severity === 'critical') {
      this.sendToExternalServices(errorInfo);
    }

    // Mostrar notificación al usuario si es necesario
    this.showUserNotification(errorInfo);

    return errorId;
  }

  // Capturar error de React
  captureReactError(error: Error, errorInfo: React.ErrorInfo): string {
    return this.captureError(error, {
      componentStack: errorInfo.componentStack,
      type: 'react-error'
    });
  }

  // Capturar error de red
  captureNetworkError(error: Error, requestInfo: {
    url: string;
    method: string;
    status?: number;
    response?: any;
  }): string {
    return this.captureError(error, {
      ...requestInfo,
      type: 'network-error'
    });
  }

  // Capturar error de validación
  captureValidationError(error: Error, validationInfo: {
    field: string;
    value: any;
    rule: string;
  }): string {
    return this.captureError(error, {
      ...validationInfo,
      type: 'validation-error'
    });
  }

  // Calcular severidad del error
  private calculateSeverity(error: Error, context: any): 'low' | 'medium' | 'high' | 'critical' {
    // Errores críticos
    if (error.message.includes('Authentication failed') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('Forbidden')) {
      return 'critical';
    }

    // Errores de red
    if (context.type === 'network-error') {
      if (context.status >= 500) return 'high';
      if (context.status >= 400) return 'medium';
      return 'low';
    }

    // Errores de validación
    if (context.type === 'validation-error') {
      return 'low';
    }

    // Errores de React
    if (context.type === 'react-error') {
      return 'high';
    }

    // Errores de JavaScript
    if (error.name === 'TypeError' || error.name === 'ReferenceError') {
      return 'high';
    }

    return 'medium';
  }

  // Categorizar error
  private categorizeError(error: Error, context: any): 'javascript' | 'network' | 'validation' | 'authentication' | 'database' | 'unknown' {
    if (context.type === 'network-error') return 'network';
    if (context.type === 'validation-error') return 'validation';
    if (error.message.includes('auth') || error.message.includes('login')) return 'authentication';
    if (error.message.includes('database') || error.message.includes('sql')) return 'database';
    if (error.name === 'TypeError' || error.name === 'ReferenceError') return 'javascript';
    
    return 'unknown';
  }

  // Ejecutar handlers de error
  private executeErrorHandlers(error: Error, context: any): void {
    this.errorHandlers.forEach((handler, key) => {
      try {
        handler(error, context);
      } catch (handlerError) {
        console.error(`Error in error handler ${key}:`, handlerError);
      }
    });
  }

  // Actualizar reporte de error
  private updateErrorReport(errorInfo: ErrorInfo): void {
    const existingReport = this.errorReports.find(report => 
      report.title === errorInfo.error.message
    );

    if (existingReport) {
      // Actualizar reporte existente
      existingReport.errorCount++;
      existingReport.lastOccurrence = errorInfo.timestamp;
      existingReport.affectedUsers = this.countUniqueUsers(existingReport.id);
      
      // Actualizar severidad si es más alta
      if (this.getSeverityLevel(errorInfo.severity) > this.getSeverityLevel(existingReport.severity)) {
        existingReport.severity = errorInfo.severity;
      }
    } else {
      // Crear nuevo reporte
      const newReport: ErrorReport = {
        id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: errorInfo.error.message,
        description: errorInfo.error.stack || '',
        errorCount: 1,
        firstOccurrence: errorInfo.timestamp,
        lastOccurrence: errorInfo.timestamp,
        affectedUsers: 1,
        severity: errorInfo.severity,
        status: 'open',
        priority: this.calculatePriority(errorInfo),
        tags: this.generateTags(errorInfo)
      };

      this.errorReports.push(newReport);
    }
  }

  // Contar usuarios únicos afectados
  private countUniqueUsers(reportId: string): number {
    const report = this.errorReports.find(r => r.id === reportId);
    if (!report) return 0;

    const users = new Set<string>();
    this.errors
      .filter(error => error.error.message === report.title)
      .forEach(error => {
        if (error.userId) users.add(error.userId);
      });

    return users.size;
  }

  // Calcular prioridad
  private calculatePriority(errorInfo: ErrorInfo): number {
    const severityLevel = this.getSeverityLevel(errorInfo.severity);
    const timeFactor = Date.now() - errorInfo.timestamp.getTime();
    
    // Prioridad más alta para errores más severos y recientes
    return severityLevel * 10 + (timeFactor / (1000 * 60 * 60)); // Horas desde el error
  }

  // Generar tags
  private generateTags(errorInfo: ErrorInfo): string[] {
    const tags: string[] = [];
    
    tags.push(errorInfo.category);
    tags.push(errorInfo.severity);
    
    if (errorInfo.context.type) {
      tags.push(errorInfo.context.type);
    }
    
    if (errorInfo.context.field) {
      tags.push(`field:${errorInfo.context.field}`);
    }
    
    return tags;
  }

  // Obtener nivel de severidad
  private getSeverityLevel(severity: string): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity as keyof typeof levels] || 1;
  }

  // Enviar a servicios externos
  private async sendToExternalServices(errorInfo: ErrorInfo): Promise<void> {
    try {
      // Send to Sentry if available
      if (typeof window !== 'undefined' && (window as any).Sentry) {
        (window as any).Sentry.captureException(errorInfo.error, {
          tags: { component: errorInfo.component, action: errorInfo.action },
          extra: errorInfo.context
        });
      }

      // Send to custom error reporting endpoint
      const errorEndpoint = this.getEnvVar('VITE_ERROR_REPORTING_ENDPOINT');
      if (errorEndpoint) {
        await fetch(errorEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorInfo)
        });
      }
    } catch (error) {
      console.warn('Failed to send error to external service:', error);
    }
  }

  private getEnvVar(key: string, defaultValue: string = ''): string {
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key] || defaultValue;
    }
    return defaultValue;
  }

  // Mostrar notificación al usuario
  private showUserNotification(errorInfo: ErrorInfo): void {
    if (errorInfo.severity === 'critical') {
      // Mostrar notificación crítica
      this.showCriticalErrorNotification(errorInfo);
    } else if (errorInfo.severity === 'high') {
      // Mostrar notificación de advertencia
      this.showWarningNotification(errorInfo);
    }
  }

  // Mostrar notificación de error crítico
  private showCriticalErrorNotification(errorInfo: ErrorInfo): void {
    // Implementar notificación crítica
    console.error('Critical error occurred:', errorInfo);
  }

  // Mostrar notificación de advertencia
  private showWarningNotification(errorInfo: ErrorInfo): void {
    // Implementar notificación de advertencia
    console.warn('High severity error occurred:', errorInfo);
  }

  // Registrar handler de error
  registerErrorHandler(name: string, handler: (error: Error, context: any) => void): void {
    this.errorHandlers.set(name, handler);
  }

  // Remover handler de error
  unregisterErrorHandler(name: string): void {
    this.errorHandlers.delete(name);
  }

  // Resolver error
  resolveError(errorId: string, resolution: string, implementedBy: string): void {
    const error = this.errors.find(e => e.id === errorId);
    if (!error) return;

    error.resolved = true;
    error.resolution = resolution;
    error.assignedTo = implementedBy;

    const errorResolution: ErrorResolution = {
      id: `resolution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      errorId,
      resolution,
      implementedBy,
      implementedAt: new Date()
    };

    this.errorResolutions.push(errorResolution);

    // Actualizar reporte
    const report = this.errorReports.find(r => r.title === error.error.message);
    if (report) {
      report.status = 'resolved';
    }
  }

  // Obtener errores
  getErrors(filters?: {
    severity?: string;
    category?: string;
    resolved?: boolean;
    userId?: string;
    dateRange?: { start: Date; end: Date };
  }): ErrorInfo[] {
    let filteredErrors = [...this.errors];

    if (filters) {
      if (filters.severity) {
        filteredErrors = filteredErrors.filter(e => e.severity === filters.severity);
      }
      if (filters.category) {
        filteredErrors = filteredErrors.filter(e => e.category === filters.category);
      }
      if (filters.resolved !== undefined) {
        filteredErrors = filteredErrors.filter(e => e.resolved === filters.resolved);
      }
      if (filters.userId) {
        filteredErrors = filteredErrors.filter(e => e.userId === filters.userId);
      }
      if (filters.dateRange) {
        filteredErrors = filteredErrors.filter(e => 
          e.timestamp >= filters.dateRange!.start && e.timestamp <= filters.dateRange!.end
        );
      }
    }

    return filteredErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Obtener reportes de error
  getErrorReports(filters?: {
    status?: string;
    severity?: string;
    priority?: number;
  }): ErrorReport[] {
    let filteredReports = [...this.errorReports];

    if (filters) {
      if (filters.status) {
        filteredReports = filteredReports.filter(r => r.status === filters.status);
      }
      if (filters.severity) {
        filteredReports = filteredReports.filter(r => r.severity === filters.severity);
      }
      if (filters.priority) {
        filteredReports = filteredReports.filter(r => r.priority >= filters.priority!);
      }
    }

    return filteredReports.sort((a, b) => b.priority - a.priority);
  }

  // Obtener resoluciones de error
  getErrorResolutions(errorId?: string): ErrorResolution[] {
    let resolutions = [...this.errorResolutions];

    if (errorId) {
      resolutions = resolutions.filter(r => r.errorId === errorId);
    }

    return resolutions.sort((a, b) => b.implementedAt.getTime() - a.implementedAt.getTime());
  }

  // Obtener estadísticas de errores
  getErrorStats(): {
    totalErrors: number;
    resolvedErrors: number;
    criticalErrors: number;
    errorsByCategory: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    averageResolutionTime: number;
  } {
    const totalErrors = this.errors.length;
    const resolvedErrors = this.errors.filter(e => e.resolved).length;
    const criticalErrors = this.errors.filter(e => e.severity === 'critical').length;

    const errorsByCategory: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};

    this.errors.forEach(error => {
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
    });

    // Calcular tiempo promedio de resolución
    const resolvedErrorsWithTime = this.errors.filter(e => e.resolved);
    const averageResolutionTime = resolvedErrorsWithTime.length > 0
      ? resolvedErrorsWithTime.reduce((acc, error) => {
          const resolution = this.errorResolutions.find(r => r.errorId === error.id);
          if (resolution) {
            return acc + (resolution.implementedAt.getTime() - error.timestamp.getTime());
          }
          return acc;
        }, 0) / resolvedErrorsWithTime.length
      : 0;

    return {
      totalErrors,
      resolvedErrors,
      criticalErrors,
      errorsByCategory,
      errorsBySeverity,
      averageResolutionTime
    };
  }

  // Habilitar/deshabilitar error manager
  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Limpiar errores antiguos
  cleanup(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    this.errors = this.errors.filter(error => error.timestamp >= cutoff);
  }
}

// Instancia global del error manager
export const errorManager = new ErrorManager();

// Hooks de React para gestión de errores
export const useErrorManager = () => {
  return {
    captureError: errorManager.captureError.bind(errorManager),
    captureReactError: errorManager.captureReactError.bind(errorManager),
    captureNetworkError: errorManager.captureNetworkError.bind(errorManager),
    captureValidationError: errorManager.captureValidationError.bind(errorManager),
    registerErrorHandler: errorManager.registerErrorHandler.bind(errorManager),
    unregisterErrorHandler: errorManager.unregisterErrorHandler.bind(errorManager),
    resolveError: errorManager.resolveError.bind(errorManager),
    getErrors: errorManager.getErrors.bind(errorManager),
    getErrorReports: errorManager.getErrorReports.bind(errorManager),
    getErrorResolutions: errorManager.getErrorResolutions.bind(errorManager),
    getErrorStats: errorManager.getErrorStats.bind(errorManager),
    enable: errorManager.enable.bind(errorManager),
    disable: errorManager.disable.bind(errorManager),
    cleanup: errorManager.cleanup.bind(errorManager)
  };
}; 