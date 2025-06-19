// Sistema de monitoreo y observabilidad
export interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: Date;
}

export interface PerformanceMetric {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
  metadata?: Record<string, any>;
}

export interface ErrorLog {
  error: Error;
  context: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface UserAction {
  action: string;
  component: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

class MonitoringService {
  private metrics: Metric[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private errorLogs: ErrorLog[] = [];
  private userActions: UserAction[] = [];
  private isEnabled = true;

  // Métricas de rendimiento
  trackPerformance(name: string, fn: () => any): any {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    try {
      const result = fn();
      const endTime = performance.now();
      
      this.performanceMetrics.push({
        name,
        duration: endTime - startTime,
        startTime,
        endTime
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      this.performanceMetrics.push({
        name,
        duration: endTime - startTime,
        startTime,
        endTime,
        metadata: { error: error instanceof Error ? error.message : String(error) }
      });
      throw error;
    }
  }

  async trackAsyncPerformance<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      
      this.performanceMetrics.push({
        name,
        duration: endTime - startTime,
        startTime,
        endTime
      });

      return result;
    } catch (error) {
      const endTime = performance.now();
      this.performanceMetrics.push({
        name,
        duration: endTime - startTime,
        startTime,
        endTime,
        metadata: { error: error instanceof Error ? error.message : String(error) }
      });
      throw error;
    }
  }

  // Métricas personalizadas
  trackMetric(name: string, value: number, tags: Record<string, string> = {}): void {
    if (!this.isEnabled) return;

    this.metrics.push({
      name,
      value,
      tags,
      timestamp: new Date()
    });
  }

  // Logging de errores
  logError(error: Error, context: Record<string, any> = {}, userId?: string, sessionId?: string): void {
    if (!this.isEnabled) return;

    this.errorLogs.push({
      error,
      context,
      timestamp: new Date(),
      userId,
      sessionId
    });

    // También enviar a servicio externo si está configurado
    this.sendToExternalService('error', {
      message: error.message,
      stack: error.stack,
      context,
      userId,
      sessionId,
      timestamp: new Date().toISOString()
    });
  }

  // Tracking de acciones del usuario
  trackUserAction(action: string, component: string, metadata?: Record<string, any>, userId?: string, sessionId?: string): void {
    if (!this.isEnabled) return;

    this.userActions.push({
      action,
      component,
      timestamp: new Date(),
      userId,
      sessionId,
      metadata
    });

    // Enviar a analytics
    this.sendToAnalytics(action, {
      component,
      metadata,
      userId,
      sessionId
    });
  }

  // Métricas de memoria
  trackMemoryUsage(): void {
    if (!this.isEnabled) return;

    // Check if performance.memory is available (Chrome only)
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      this.trackMetric('memory.used', memory.usedJSHeapSize);
      this.trackMetric('memory.total', memory.totalJSHeapSize);
      this.trackMetric('memory.limit', memory.jsHeapSizeLimit);
    }
  }

  // Métricas de red
  trackNetworkRequest(url: string, method: string, duration: number, status: number): void {
    if (!this.isEnabled) return;

    this.trackMetric('network.request.duration', duration, {
      url,
      method,
      status: status.toString()
    });

    this.trackMetric('network.request.count', 1, {
      url,
      method,
      status: status.toString()
    });
  }

  // Métricas de rendimiento de la aplicación
  trackAppPerformance(): void {
    if (!this.isEnabled) return;

    // First Contentful Paint
    if (performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        this.trackMetric('performance.fcp', fcp.startTime);
      }
    }

    // Largest Contentful Paint
    if (performance.getEntriesByType) {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1];
        this.trackMetric('performance.lcp', lcp.startTime);
      }
    }

    // Cumulative Layout Shift
    if (performance.getEntriesByType) {
      const clsEntries = performance.getEntriesByType('layout-shift');
      let cls = 0;
      clsEntries.forEach(entry => {
        // Check if hadRecentInput property exists
        if ((entry as any).hadRecentInput !== undefined) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
      });
      this.trackMetric('performance.cls', cls);
    }
  }

  // Métricas de errores de JavaScript
  trackJavaScriptErrors(): void {
    if (!this.isEnabled) return;

    window.addEventListener('error', (event) => {
      this.logError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(event.reason), {
        type: 'unhandledrejection'
      });
    });
  }

  // Envío de datos a servicios externos
  private async sendToExternalService(type: string, data: any): Promise<void> {
    try {
      // Aquí se puede integrar con servicios como Sentry, LogRocket, etc.
      const monitoringEndpoint = this.getEnvVar('VITE_MONITORING_ENDPOINT');
      if (monitoringEndpoint) {
        await fetch(monitoringEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, data, timestamp: new Date().toISOString() })
        });
      }
    } catch (error) {
      console.warn('Failed to send monitoring data:', error);
    }
  }

  private getEnvVar(key: string, defaultValue: string = ''): string {
    if (typeof window !== 'undefined' && (window as any).__ENV__) {
      return (window as any).__ENV__[key] || defaultValue;
    }
    return defaultValue;
  }

  private async sendToAnalytics(action: string, data: any): Promise<void> {
    try {
      // Integración con Google Analytics, Mixpanel, etc.
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, data);
      }
    } catch (error) {
      console.warn('Failed to send analytics data:', error);
    }
  }

  // Obtener métricas para dashboard
  getMetrics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): Metric[] {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = new Date(now.getTime() - timeRanges[timeRange]);
    return this.metrics.filter(metric => metric.timestamp >= cutoff);
  }

  getPerformanceMetrics(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): PerformanceMetric[] {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = new Date(now.getTime() - timeRanges[timeRange]);
    return this.performanceMetrics.filter(metric => new Date(metric.startTime) >= cutoff);
  }

  getErrorLogs(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): ErrorLog[] {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = new Date(now.getTime() - timeRanges[timeRange]);
    return this.errorLogs.filter(log => log.timestamp >= cutoff);
  }

  getUserActions(timeRange: '1h' | '24h' | '7d' | '30d' = '24h'): UserAction[] {
    const now = new Date();
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const cutoff = new Date(now.getTime() - timeRanges[timeRange]);
    return this.userActions.filter(action => action.timestamp >= cutoff);
  }

  // Habilitar/deshabilitar monitoreo
  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Limpiar datos antiguos
  cleanup(): void {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    this.metrics = this.metrics.filter(metric => metric.timestamp >= oneDayAgo);
    this.performanceMetrics = this.performanceMetrics.filter(metric => new Date(metric.startTime) >= oneDayAgo);
    this.errorLogs = this.errorLogs.filter(log => log.timestamp >= oneDayAgo);
    this.userActions = this.userActions.filter(action => action.timestamp >= oneDayAgo);
  }
}

// Instancia global del servicio de monitoreo
export const monitoringService = new MonitoringService();

// Inicializar monitoreo
export const initializeMonitoring = (): void => {
  // Trackear errores de JavaScript
  monitoringService.trackJavaScriptErrors();

  // Trackear métricas de rendimiento de la aplicación
  monitoringService.trackAppPerformance();

  // Trackear uso de memoria periódicamente
  setInterval(() => {
    monitoringService.trackMemoryUsage();
  }, 30000); // Cada 30 segundos

  // Limpiar datos antiguos cada hora
  setInterval(() => {
    monitoringService.cleanup();
  }, 60 * 60 * 1000); // Cada hora
};

// Hooks de React para monitoreo
export const useMonitoring = () => {
  return {
    trackMetric: monitoringService.trackMetric.bind(monitoringService),
    trackPerformance: monitoringService.trackPerformance.bind(monitoringService),
    trackAsyncPerformance: monitoringService.trackAsyncPerformance.bind(monitoringService),
    logError: monitoringService.logError.bind(monitoringService),
    trackUserAction: monitoringService.trackUserAction.bind(monitoringService),
    getMetrics: monitoringService.getMetrics.bind(monitoringService),
    getPerformanceMetrics: monitoringService.getPerformanceMetrics.bind(monitoringService),
    getErrorLogs: monitoringService.getErrorLogs.bind(monitoringService),
    getUserActions: monitoringService.getUserActions.bind(monitoringService)
  };
}; 