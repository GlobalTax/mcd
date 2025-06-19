class Analytics {
    constructor() {
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
        this.maxEvents = 1000;
        this.sessionId = this.generateSessionId();
        this.sessionStartTime = Date.now();
        this.currentPageStartTime = Date.now();
        this.isEnabled = this.shouldEnableAnalytics();
        this.initializePerformanceObserver();
    }
    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    shouldEnableAnalytics() {
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
    initializePerformanceObserver() {
        if (typeof window === 'undefined' || !this.isEnabled)
            return;
        // Observar métricas de navegación
        if ('PerformanceObserver' in window) {
            try {
                const navigationObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'navigation') {
                            const navEntry = entry;
                            this.trackPerformanceMetric('pageLoad', navEntry.loadEventEnd - navEntry.loadEventStart, 'navigation');
                            this.trackPerformanceMetric('domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart, 'navigation');
                        }
                    }
                });
                navigationObserver.observe({ entryTypes: ['navigation'] });
            }
            catch (error) {
                console.warn('PerformanceObserver not supported:', error);
            }
        }
    }
    addEvent(event) {
        if (!this.isEnabled)
            return;
        this.events.push(event);
        if (this.events.length > this.maxEvents) {
            this.events.shift();
        }
    }
    getCurrentPage() {
        return typeof window !== 'undefined' ? window.location.pathname : '/';
    }
    getUserAgent() {
        return typeof window !== 'undefined' ? window.navigator.userAgent : '';
    }
    // Métodos principales de tracking
    trackEvent(category, action, label, value, data) {
        const event = {
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
    trackPageView(path, title) {
        const now = Date.now();
        const duration = now - this.currentPageStartTime;
        // Actualizar la página anterior con duración
        if (this.pageViews.length > 0) {
            this.pageViews[this.pageViews.length - 1].duration = duration;
        }
        const pageView = {
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
    trackPerformanceMetric(name, value, category) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            category,
        };
        this.performanceMetrics.push(metric);
        this.sendToAnalyticsService({ type: 'performance', ...metric });
    }
    trackUserBehavior(type) {
        this.userBehavior[type]++;
        this.sendToAnalyticsService({ type: 'behavior', behavior: type, value: this.userBehavior[type] });
    }
    // Métodos específicos para diferentes tipos de eventos
    trackButtonClick(buttonId, buttonText) {
        this.trackEvent('UI', 'button_click', buttonId, undefined, { buttonText });
        this.trackUserBehavior('clicks');
    }
    trackFormSubmission(formId, success) {
        this.trackEvent('Form', 'submission', formId, success ? 1 : 0);
        this.trackUserBehavior('formSubmissions');
    }
    trackError(error, context) {
        this.trackEvent('Error', 'occurred', error.message, undefined, {
            stack: error.stack,
            context,
            errorName: error.name
        });
        this.trackUserBehavior('errors');
    }
    trackApiCall(endpoint, method, status, duration) {
        this.trackEvent('API', `${method}_${status}`, endpoint, duration, {
            method,
            status,
            endpoint
        });
    }
    trackValuationAction(action, restaurantId) {
        this.trackEvent('Valuation', action, restaurantId);
    }
    trackBudgetAction(action, budgetId) {
        this.trackEvent('Budget', action, budgetId);
    }
    trackRestaurantAction(action, restaurantId) {
        this.trackEvent('Restaurant', action, restaurantId);
    }
    trackUserAction(action, userId) {
        this.trackEvent('User', action, userId);
    }
    // Métodos para métricas de rendimiento
    trackPageLoadTime() {
        if (typeof window === 'undefined')
            return;
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.trackPerformanceMetric('pageLoadTime', loadTime, 'navigation');
        });
    }
    trackResourceLoadTime(resourceName, loadTime) {
        this.trackPerformanceMetric(`resource_${resourceName}`, loadTime, 'resource');
    }
    // Métodos para comportamiento del usuario
    trackScroll(depth) {
        this.trackEvent('User', 'scroll', undefined, depth);
        this.trackUserBehavior('scrolls');
    }
    trackSearch(query, results) {
        this.trackEvent('Search', 'performed', query, results);
    }
    trackDownload(fileName, fileType) {
        this.trackEvent('Download', 'file', fileName, undefined, { fileType });
    }
    // Métodos para obtener datos
    getEvents(category) {
        if (category) {
            return this.events.filter(event => event.category === category);
        }
        return [...this.events];
    }
    getPageViews() {
        return [...this.pageViews];
    }
    getPerformanceMetrics(category) {
        if (category) {
            return this.performanceMetrics.filter(metric => metric.category === category);
        }
        return [...this.performanceMetrics];
    }
    getUserBehavior() {
        return { ...this.userBehavior };
    }
    getSessionDuration() {
        return Date.now() - this.sessionStartTime;
    }
    // Métodos para exportar datos
    exportData() {
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
    async sendToAnalyticsService(data) {
        if (!this.isEnabled)
            return;
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
        }
        catch (error) {
            console.error('Error sending analytics data:', error);
        }
    }
    // Métodos de configuración
    enable() {
        this.isEnabled = true;
        localStorage.removeItem('analytics-disabled');
    }
    disable() {
        this.isEnabled = false;
        localStorage.setItem('analytics-disabled', 'true');
    }
    isAnalyticsEnabled() {
        return this.isEnabled;
    }
    // Método para limpiar datos
    clearData() {
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
export const trackPageView = (path, title) => {
    analytics.trackPageView(path, title);
};
export const trackButtonClick = (buttonId, buttonText) => {
    analytics.trackButtonClick(buttonId, buttonText);
};
export const trackFormSubmission = (formId, success) => {
    analytics.trackFormSubmission(formId, success);
};
export const trackError = (error, context) => {
    analytics.trackError(error, context);
};
export const trackApiCall = (endpoint, method, status, duration) => {
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
