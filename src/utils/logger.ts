// Sistema de logging centralizado
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  stack?: string;
}

class Logger {
  private logLevel: LogLevel;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private sessionId: string;

  constructor() {
    this.logLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
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

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private addToLogs(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  private formatMessage(entry: LogEntry): string {
    const levelNames = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];
    return `[${entry.timestamp}] [${levelNames[entry.level]}] ${entry.message}`;
  }

  private consoleLog(entry: LogEntry) {
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

  private async sendToServer(entry: LogEntry) {
    // Solo enviar errores y warnings al servidor en producción
    if (process.env.NODE_ENV === 'production' && entry.level >= LogLevel.WARN) {
      try {
        // Aquí podrías enviar a tu servicio de logging
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(entry)
        // });
      } catch (error) {
        console.error('Failed to send log to server:', error);
      }
    }
  }

  debug(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    
    const entry = this.createLogEntry(LogLevel.DEBUG, message, data);
    this.addToLogs(entry);
    this.consoleLog(entry);
  }

  info(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.INFO)) return;
    
    const entry = this.createLogEntry(LogLevel.INFO, message, data);
    this.addToLogs(entry);
    this.consoleLog(entry);
  }

  warn(message: string, data?: any) {
    if (!this.shouldLog(LogLevel.WARN)) return;
    
    const entry = this.createLogEntry(LogLevel.WARN, message, data);
    this.addToLogs(entry);
    this.consoleLog(entry);
    this.sendToServer(entry);
  }

  error(message: string, error?: Error | any, data?: any) {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    
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

  fatal(message: string, error?: Error | any, data?: any) {
    if (!this.shouldLog(LogLevel.FATAL)) return;
    
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
  userAction(action: string, data?: any) {
    this.info(`User Action: ${action}`, data);
  }

  apiCall(endpoint: string, method: string, status?: number, duration?: number) {
    this.info(`API Call: ${method} ${endpoint}`, { status, duration });
  }

  navigation(from: string, to: string) {
    this.debug(`Navigation: ${from} -> ${to}`);
  }

  performance(metric: string, value: number) {
    this.debug(`Performance: ${metric}`, { value });
  }

  // Métodos para obtener logs
  getLogs(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.logs.filter(log => log.level >= level);
    }
    return [...this.logs];
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Método para cambiar el nivel de logging dinámicamente
  setLogLevel(level: LogLevel) {
    this.logLevel = level;
  }

  getSessionId(): string {
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
export const logReactError = (error: Error, errorInfo?: any) => {
  logger.error('React Error Boundary caught error', error, errorInfo);
};

// Función helper para logging de errores de API
export const logApiError = (endpoint: string, error: any, requestData?: any) => {
  logger.error(`API Error: ${endpoint}`, error, { requestData });
};

// Función helper para logging de errores de autenticación
export const logAuthError = (action: string, error: any) => {
  logger.error(`Authentication Error: ${action}`, error);
}; 