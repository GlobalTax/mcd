class ErrorManager {
    constructor() {
        this.errors = [];
        this.errorReports = [];
        this.errorResolutions = [];
        this.isEnabled = true;
        this.errorHandlers = new Map();
    }
    // Capturar error
    captureError(error, context = {}) {
        if (!this.isEnabled)
            return '';
        const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const errorInfo = {
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
    captureReactError(error, errorInfo) {
        return this.captureError(error, {
            componentStack: errorInfo.componentStack,
            type: 'react-error'
        });
    }
    // Capturar error de red
    captureNetworkError(error, requestInfo) {
        return this.captureError(error, {
            ...requestInfo,
            type: 'network-error'
        });
    }
    // Capturar error de validación
    captureValidationError(error, validationInfo) {
        return this.captureError(error, {
            ...validationInfo,
            type: 'validation-error'
        });
    }
    // Calcular severidad del error
    calculateSeverity(error, context) {
        // Errores críticos
        if (error.message.includes('Authentication failed') ||
            error.message.includes('Unauthorized') ||
            error.message.includes('Forbidden')) {
            return 'critical';
        }
        // Errores de red
        if (context.type === 'network-error') {
            if (context.status >= 500)
                return 'high';
            if (context.status >= 400)
                return 'medium';
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
    categorizeError(error, context) {
        if (context.type === 'network-error')
            return 'network';
        if (context.type === 'validation-error')
            return 'validation';
        if (error.message.includes('auth') || error.message.includes('login'))
            return 'authentication';
        if (error.message.includes('database') || error.message.includes('sql'))
            return 'database';
        if (error.name === 'TypeError' || error.name === 'ReferenceError')
            return 'javascript';
        return 'unknown';
    }
    // Ejecutar handlers de error
    executeErrorHandlers(error, context) {
        this.errorHandlers.forEach((handler, key) => {
            try {
                handler(error, context);
            }
            catch (handlerError) {
                console.error(`Error in error handler ${key}:`, handlerError);
            }
        });
    }
    // Actualizar reporte de error
    updateErrorReport(errorInfo) {
        const existingReport = this.errorReports.find(report => report.title === errorInfo.error.message);
        if (existingReport) {
            // Actualizar reporte existente
            existingReport.errorCount++;
            existingReport.lastOccurrence = errorInfo.timestamp;
            existingReport.affectedUsers = this.countUniqueUsers(existingReport.id);
            // Actualizar severidad si es más alta
            if (this.getSeverityLevel(errorInfo.severity) > this.getSeverityLevel(existingReport.severity)) {
                existingReport.severity = errorInfo.severity;
            }
        }
        else {
            // Crear nuevo reporte
            const newReport = {
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
    countUniqueUsers(reportId) {
        const report = this.errorReports.find(r => r.id === reportId);
        if (!report)
            return 0;
        const users = new Set();
        this.errors
            .filter(error => error.error.message === report.title)
            .forEach(error => {
            if (error.userId)
                users.add(error.userId);
        });
        return users.size;
    }
    // Calcular prioridad
    calculatePriority(errorInfo) {
        const severityLevel = this.getSeverityLevel(errorInfo.severity);
        const timeFactor = Date.now() - errorInfo.timestamp.getTime();
        // Prioridad más alta para errores más severos y recientes
        return severityLevel * 10 + (timeFactor / (1000 * 60 * 60)); // Horas desde el error
    }
    // Generar tags
    generateTags(errorInfo) {
        const tags = [];
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
    getSeverityLevel(severity) {
        const levels = { low: 1, medium: 2, high: 3, critical: 4 };
        return levels[severity] || 1;
    }
    // Enviar a servicios externos
    async sendToExternalServices(errorInfo) {
        try {
            // Send to Sentry if available
            if (typeof window !== 'undefined' && window.Sentry) {
                window.Sentry.captureException(errorInfo.error, {
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
        }
        catch (error) {
            console.warn('Failed to send error to external service:', error);
        }
    }
    getEnvVar(key, defaultValue = '') {
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__[key] || defaultValue;
        }
        return defaultValue;
    }
    // Mostrar notificación al usuario
    showUserNotification(errorInfo) {
        if (errorInfo.severity === 'critical') {
            // Mostrar notificación crítica
            this.showCriticalErrorNotification(errorInfo);
        }
        else if (errorInfo.severity === 'high') {
            // Mostrar notificación de advertencia
            this.showWarningNotification(errorInfo);
        }
    }
    // Mostrar notificación de error crítico
    showCriticalErrorNotification(errorInfo) {
        // Implementar notificación crítica
        console.error('Critical error occurred:', errorInfo);
    }
    // Mostrar notificación de advertencia
    showWarningNotification(errorInfo) {
        // Implementar notificación de advertencia
        console.warn('High severity error occurred:', errorInfo);
    }
    // Registrar handler de error
    registerErrorHandler(name, handler) {
        this.errorHandlers.set(name, handler);
    }
    // Remover handler de error
    unregisterErrorHandler(name) {
        this.errorHandlers.delete(name);
    }
    // Resolver error
    resolveError(errorId, resolution, implementedBy) {
        const error = this.errors.find(e => e.id === errorId);
        if (!error)
            return;
        error.resolved = true;
        error.resolution = resolution;
        error.assignedTo = implementedBy;
        const errorResolution = {
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
    getErrors(filters) {
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
                filteredErrors = filteredErrors.filter(e => e.timestamp >= filters.dateRange.start && e.timestamp <= filters.dateRange.end);
            }
        }
        return filteredErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    // Obtener reportes de error
    getErrorReports(filters) {
        let filteredReports = [...this.errorReports];
        if (filters) {
            if (filters.status) {
                filteredReports = filteredReports.filter(r => r.status === filters.status);
            }
            if (filters.severity) {
                filteredReports = filteredReports.filter(r => r.severity === filters.severity);
            }
            if (filters.priority) {
                filteredReports = filteredReports.filter(r => r.priority >= filters.priority);
            }
        }
        return filteredReports.sort((a, b) => b.priority - a.priority);
    }
    // Obtener resoluciones de error
    getErrorResolutions(errorId) {
        let resolutions = [...this.errorResolutions];
        if (errorId) {
            resolutions = resolutions.filter(r => r.errorId === errorId);
        }
        return resolutions.sort((a, b) => b.implementedAt.getTime() - a.implementedAt.getTime());
    }
    // Obtener estadísticas de errores
    getErrorStats() {
        const totalErrors = this.errors.length;
        const resolvedErrors = this.errors.filter(e => e.resolved).length;
        const criticalErrors = this.errors.filter(e => e.severity === 'critical').length;
        const errorsByCategory = {};
        const errorsBySeverity = {};
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
    enable() {
        this.isEnabled = true;
    }
    disable() {
        this.isEnabled = false;
    }
    // Limpiar errores antiguos
    cleanup(maxAge = 30 * 24 * 60 * 60 * 1000) {
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
