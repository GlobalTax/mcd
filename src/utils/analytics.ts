// Sistema de Analytics y Métricas
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
  page: string;
  userAgent: string;
  data?: Record<string, any>;
}

export interface PageView {
  path: string;
  title: string;
  timestamp: number;
  duration?: number;
  userId?: string;
  sessionId: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  category: 'navigation' | 'resource' | 'paint' | 'layout' | 'custom';
}

export interface UserBehavior {
  clicks: number;
  scrolls: number;
  formSubmissions: number;
  errors: number;
  sessionDuration: number;
  pagesVisited: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private pageViews: PageView[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private userBehavior: UserBehavior = {
    clicks: 0,
    scrolls: 0,
    formSubmissions: 0,
    errors: 0,
    sessionDuration: 0,
    pagesVisited: 0,
  };
  private sessionId: string;
  private sessionStartTime: number;
  private currentPageStartTime: number;
  private maxEvents = 1000;
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.currentPageStartTime = Date.now();
    this.isEnabled = this.shouldEnableAnalytics();
    this.initializePerformanceObserver();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private shouldEnableAnalytics(): boolean {
    // Verificar si el usuario ha optado por no rastrear
    if (localStorage.getItem('analytics-disabled') === 'true') {
      return false;
    }
    
    // Verificar si estamos en modo desarrollo
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return false;
    }
    
    return true;
  }

  private initializePerformanceObserver(): void {
    if (typeof window === 'undefined' || !this.isEnabled) return;

    // Observar métricas de navegación
    if ('PerformanceObserver' in window) {
      try {
        const navigationObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.trackPerformanceMetric('pageLoad', navEntry.loadEventEnd - navEntry.loadEventStart, 'navigation');
              this.trackPerformanceMetric('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart, 'navigation');
            }
          }
        });
        navigationObserver.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }
  }

  private addEvent(event: AnalyticsEvent): void {
    if (!this.isEnabled) return;

    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }
  }

  private getCurrentPage(): string {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  }

  private getUserAgent(): string {
    return typeof window !== 'undefined' ? window.navigator.userAgent : '';
  }

  // Métodos principales de tracking
  trackEvent(category: string, action: string, label?: string, value?: number, data?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      event: 'event',
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      page: this.getCurrentPage(),
      userAgent: this.getUserAgent(),
      data,
    };

    this.addEvent(event);
    this.sendToAnalyticsService(event);
  }

  trackPageView(path: string, title: string): void {
    const now = Date.now();
    const duration = now - this.currentPageStartTime;

    // Actualizar la página anterior con duración
    if (this.pageViews.length > 0) {
      this.pageViews[this.pageViews.length - 1].duration = duration;
    }

    const pageView: PageView = {
      path,
      title,
      timestamp: now,
      sessionId: this.sessionId,
    };

    this.pageViews.push(pageView);
    this.userBehavior.pagesVisited++;
    this.currentPageStartTime = now;

    this.sendToAnalyticsService({ type: 'pageview', ...pageView });
  }

  trackPerformanceMetric(name: string, value: number, category: PerformanceMetric['category']): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      category,
    };

    this.performanceMetrics.push(metric);
    this.sendToAnalyticsService({ type: 'performance', ...metric });
  }

  trackUserBehavior(type: keyof UserBehavior): void {
    this.userBehavior[type]++;
    this.sendToAnalyticsService({ type: 'behavior', behavior: type, value: this.userBehavior[type] });
  }

  // Métodos específicos para diferentes tipos de eventos
  trackButtonClick(buttonId: string, buttonText?: string): void {
    this.trackEvent('UI', 'button_click', buttonId, undefined, { buttonText });
    this.trackUserBehavior('clicks');
  }

  trackFormSubmission(formId: string, success: boolean): void {
    this.trackEvent('Form', 'submission', formId, success ? 1 : 0);
    this.trackUserBehavior('formSubmissions');
  }

  trackError(error: Error, context?: string): void {
    this.trackEvent('Error', 'occurred', error.message, undefined, { 
      stack: error.stack, 
      context,
      errorName: error.name 
    });
    this.trackUserBehavior('errors');
  }

  trackApiCall(endpoint: string, method: string, status: number, duration: number): void {
    this.trackEvent('API', `${method}_${status}`, endpoint, duration, { 
      method, 
      status, 
      endpoint 
    });
  }

  trackValuationAction(action: string, restaurantId?: string): void {
    this.trackEvent('Valuation', action, restaurantId);
  }

  trackBudgetAction(action: string, budgetId?: string): void {
    this.trackEvent('Budget', action, budgetId);
  }

  trackRestaurantAction(action: string, restaurantId?: string): void {
    this.trackEvent('Restaurant', action, restaurantId);
  }

  trackUserAction(action: string, userId?: string): void {
    this.trackEvent('User', action, userId);
  }

  // Métodos para métricas de rendimiento
  trackPageLoadTime(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.trackPerformanceMetric('pageLoadTime', loadTime, 'navigation');
    });
  }

  trackResourceLoadTime(resourceName: string, loadTime: number): void {
    this.trackPerformanceMetric(`resource_${resourceName}`, loadTime, 'resource');
  }

  // Métodos para comportamiento del usuario
  trackScroll(depth: number): void {
    this.trackEvent('User', 'scroll', undefined, depth);
    this.trackUserBehavior('scrolls');
  }

  trackSearch(query: string, results: number): void {
    this.trackEvent('Search', 'performed', query, results);
  }

  trackDownload(fileName: string, fileType: string): void {
    this.trackEvent('Download', 'file', fileName, undefined, { fileType });
  }

  // Métodos para obtener datos
  getEvents(category?: string): AnalyticsEvent[] {
    if (category) {
      return this.events.filter(event => event.category === category);
    }
    return [...this.events];
  }

  getPageViews(): PageView[] {
    return [...this.pageViews];
  }

  getPerformanceMetrics(category?: PerformanceMetric['category']): PerformanceMetric[] {
    if (category) {
      return this.performanceMetrics.filter(metric => metric.category === category);
    }
    return [...this.performanceMetrics];
  }

  getUserBehavior(): UserBehavior {
    return { ...this.userBehavior };
  }

  getSessionDuration(): number {
    return Date.now() - this.sessionStartTime;
  }

  // Métodos para exportar datos
  exportData(): Record<string, any> {
    return {
      sessionId: this.sessionId,
      sessionDuration: this.getSessionDuration(),
      events: this.events,
      pageViews: this.pageViews,
      performanceMetrics: this.performanceMetrics,
      userBehavior: this.userBehavior,
      timestamp: new Date().toISOString(),
    };
  }

  // Métodos para enviar datos al servidor
  private async sendToAnalyticsService(data: any): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Aquí podrías enviar a tu servicio de analytics
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      
      // Por ahora, solo log en desarrollo
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        console.log('Analytics Event:', data);
      }
    } catch (error) {
      console.error('Error sending analytics data:', error);
    }
  }

  // Métodos de configuración
  enable(): void {
    this.isEnabled = true;
    localStorage.removeItem('analytics-disabled');
  }

  disable(): void {
    this.isEnabled = false;
    localStorage.setItem('analytics-disabled', 'true');
  }

  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }

  // Método para limpiar datos
  clearData(): void {
    this.events = [];
    this.pageViews = [];
    this.performanceMetrics = [];
    this.userBehavior = {
      clicks: 0,
      scrolls: 0,
      formSubmissions: 0,
      errors: 0,
      sessionDuration: 0,
      pagesVisited: 0,
    };
  }
}

// Instancia global de analytics
export const analytics = new Analytics();

// Hook para usar analytics en componentes React
export const useAnalytics = () => {
  return analytics;
};

// Funciones helper para tracking común
export const trackPageView = (path: string, title: string) => {
  analytics.trackPageView(path, title);
};

export const trackButtonClick = (buttonId: string, buttonText?: string) => {
  analytics.trackButtonClick(buttonId, buttonText);
};

export const trackFormSubmission = (formId: string, success: boolean) => {
  analytics.trackFormSubmission(formId, success);
};

export const trackError = (error: Error, context?: string) => {
  analytics.trackError(error, context);
};

export const trackApiCall = (endpoint: string, method: string, status: number, duration: number) => {
  analytics.trackApiCall(endpoint, method, status, duration);
};

// Función para inicializar analytics en la aplicación
export const initializeAnalytics = () => {
  // Track página inicial
  analytics.trackPageView(window.location.pathname, document.title);
  
  // Track tiempo de carga de página
  analytics.trackPageLoadTime();
  
  // Track cambios de ruta
  if (typeof window !== 'undefined') {
    let currentPath = window.location.pathname;
    
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        analytics.trackPageView(window.location.pathname, document.title);
        currentPath = window.location.pathname;
      }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
}; 