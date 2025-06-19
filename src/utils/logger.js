// Sistema de logging centralizado
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["FATAL"] = 4] = "FATAL";
})(LogLevel || (LogLevel = {}));
class Logger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.logLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
        this.sessionId = this.generateSessionId();
    }
    generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    createLogEntry(level, message, data) {
        return {
            timestamp: new Date().toISOString(),
            level,
            message,
            data,
            sessionId: this.sessionId,
            url: window.location.href,
            userAgent: navigator.userAgent,
        };
    }
    shouldLog(level) {
        return level >= this.logLevel;
    }
    addToLogs(entry) {
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }
    formatMessage(entry) {
        const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
        return `[${entry.timestamp}] [${levelNames[entry.level]}] ${entry.message}`;
    }
    consoleLog(entry) {
        const message = this.formatMessage(entry);
        switch (entry.level) {
            case LogLevel.DEBUG:
                console.debug(message, entry.data);
                break;
            case LogLevel.INFO:
                console.info(message, entry.data);
                break;
            case LogLevel.WARN:
                console.warn(message, entry.data);
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(message, entry.data);
                break;
        }
    }
    async sendToServer(entry) {
        // Solo enviar errores y warnings al servidor en producción
        if (process.env.NODE_ENV === 'production' && entry.level >= LogLevel.WARN) {
            try {
                // Aquí podrías enviar a tu servicio de logging
                // await fetch('/api/logs', {
                //   method: 'POST',
                //   headers: { 'Content-Type': 'application/json' },
                //   body: JSON.stringify(entry)
                // });
            }
            catch (error) {
                console.error('Failed to send log to server:', error);
            }
        }
    }
    debug(message, data) {
        if (!this.shouldLog(LogLevel.DEBUG))
            return;
        const entry = this.createLogEntry(LogLevel.DEBUG, message, data);
        this.addToLogs(entry);
        this.consoleLog(entry);
    }
    info(message, data) {
        if (!this.shouldLog(LogLevel.INFO))
            return;
        const entry = this.createLogEntry(LogLevel.INFO, message, data);
        this.addToLogs(entry);
        this.consoleLog(entry);
    }
    warn(message, data) {
        if (!this.shouldLog(LogLevel.WARN))
            return;
        const entry = this.createLogEntry(LogLevel.WARN, message, data);
        this.addToLogs(entry);
        this.consoleLog(entry);
        this.sendToServer(entry);
    }
    error(message, error, data) {
        if (!this.shouldLog(LogLevel.ERROR))
            return;
        const entry = this.createLogEntry(LogLevel.ERROR, message, {
            ...data,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : error
        });
        this.addToLogs(entry);
        this.consoleLog(entry);
        this.sendToServer(entry);
    }
    fatal(message, error, data) {
        if (!this.shouldLog(LogLevel.FATAL))
            return;
        const entry = this.createLogEntry(LogLevel.FATAL, message, {
            ...data,
            error: error instanceof Error ? {
                message: error.message,
                stack: error.stack,
                name: error.name
            } : error
        });
        this.addToLogs(entry);
        this.consoleLog(entry);
        this.sendToServer(entry);
    }
    // Métodos específicos para diferentes tipos de eventos
    userAction(action, data) {
        this.info(`User Action: ${action}`, data);
    }
    apiCall(endpoint, method, status, duration) {
        this.info(`API Call: ${method} ${endpoint}`, { status, duration });
    }
    navigation(from, to) {
        this.debug(`Navigation: ${from} -> ${to}`);
    }
    performance(metric, value) {
        this.debug(`Performance: ${metric}`, { value });
    }
    // Métodos para obtener logs
    getLogs(level) {
        if (level !== undefined) {
            return this.logs.filter(log => log.level >= level);
        }
        return [...this.logs];
    }
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }
    clearLogs() {
        this.logs = [];
    }
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
    // Método para cambiar el nivel de logging dinámicamente
    setLogLevel(level) {
        this.logLevel = level;
    }
    getSessionId() {
        return this.sessionId;
    }
}
// Instancia global del logger
export const logger = new Logger();
// Hook para usar el logger en componentes React
export const useLogger = () => {
    return logger;
};
// Función helper para logging de errores de React
export const logReactError = (error, errorInfo) => {
    logger.error('React Error Boundary caught error', error, errorInfo);
};
// Función helper para logging de errores de API
export const logApiError = (endpoint, error, requestData) => {
    logger.error(`API Error: ${endpoint}`, error, { requestData });
};
// Función helper para logging de errores de autenticación
export const logAuthError = (action, error) => {
    logger.error(`Authentication Error: ${action}`, error);
};
