// Sistema de Seguridad Avanzada para McDonald's Portal
export interface SecurityConfig {
  encryptionKey: string;
  sessionTimeout: number; // en minutos
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  enableAuditLog: boolean;
  enableRateLimiting: boolean;
  allowedOrigins: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  success: boolean;
}

export interface SecurityEvent {
  type: 'login_attempt' | 'data_access' | 'permission_change' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  userId?: string;
  ipAddress?: string;
  details?: any;
}

class SecurityManager {
  private static instance: SecurityManager;
  private config: SecurityConfig;
  private auditLogs: AuditLog[] = [];
  private securityEvents: SecurityEvent[] = [];
  private loginAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();

  private constructor() {
    this.config = {
      encryptionKey: process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-change-in-production',
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireSpecialChars: true,
      enableAuditLog: true,
      enableRateLimiting: true,
      allowedOrigins: ['localhost:3000', 'localhost:5173', 'your-domain.com']
    };
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Encriptación de datos sensibles
  encryptData(data: string): string {
    try {
      // Simulación de encriptación (en producción usar crypto-js o similar)
      const encoded = btoa(data);
      return `encrypted_${encoded}_${Date.now()}`;
    } catch (error) {
      console.error('Error encriptando datos:', error);
      throw new Error('Error de encriptación');
    }
  }

  decryptData(encryptedData: string): string {
    try {
      if (!encryptedData.startsWith('encrypted_')) {
        throw new Error('Datos no encriptados');
      }
      
      const parts = encryptedData.split('_');
      const encoded = parts[1];
      return atob(encoded);
    } catch (error) {
      console.error('Error desencriptando datos:', error);
      throw new Error('Error de desencriptación');
    }
  }

  // Validación de contraseñas
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.config.passwordMinLength) {
      errors.push(`La contraseña debe tener al menos ${this.config.passwordMinLength} caracteres`);
    }

    if (this.config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('La contraseña debe contener al menos un carácter especial');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (!/\d/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generación de contraseñas seguras
  generateSecurePassword(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Asegurar al menos un carácter de cada tipo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)];

    // Completar el resto
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Mezclar la contraseña
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Control de intentos de login
  checkLoginAttempts(userId: string, ipAddress: string): { allowed: boolean; remainingAttempts: number } {
    const key = `${userId}_${ipAddress}`;
    const attempts = this.loginAttempts.get(key);

    if (!attempts) {
      return { allowed: true, remainingAttempts: this.config.maxLoginAttempts };
    }

    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
    const lockoutDuration = 15 * 60 * 1000; // 15 minutos

    if (attempts.count >= this.config.maxLoginAttempts && timeSinceLastAttempt < lockoutDuration) {
      this.logSecurityEvent({
        type: 'login_attempt',
        severity: 'high',
        message: `Demasiados intentos de login para usuario ${userId}`,
        timestamp: new Date().toISOString(),
        userId,
        ipAddress
      });

      return { allowed: false, remainingAttempts: 0 };
    }

    if (timeSinceLastAttempt >= lockoutDuration) {
      this.loginAttempts.delete(key);
      return { allowed: true, remainingAttempts: this.config.maxLoginAttempts };
    }

    return { allowed: true, remainingAttempts: this.config.maxLoginAttempts - attempts.count };
  }

  recordLoginAttempt(userId: string, ipAddress: string, success: boolean): void {
    const key = `${userId}_${ipAddress}`;
    const attempts = this.loginAttempts.get(key) || { count: 0, lastAttempt: 0 };

    if (!success) {
      attempts.count++;
    } else {
      attempts.count = 0;
    }

    attempts.lastAttempt = Date.now();
    this.loginAttempts.set(key, attempts);

    this.logAuditEvent({
      userId,
      action: success ? 'login_success' : 'login_failed',
      resource: 'authentication',
      ipAddress,
      success,
      userAgent: navigator.userAgent,
      details: { attemptCount: attempts.count }
    });
  }

  // Rate limiting
  checkRateLimit(identifier: string, limit: number, windowMs: number): boolean {
    if (!this.config.enableRateLimiting) {
      return true;
    }

    const now = Date.now();
    const rateLimit = this.rateLimitMap.get(identifier);

    if (!rateLimit || now > rateLimit.resetTime) {
      this.rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (rateLimit.count >= limit) {
      return false;
    }

    rateLimit.count++;
    return true;
  }

  // Validación de entrada
  sanitizeInput(input: string): string {
    // Eliminar caracteres peligrosos
    return input
      .replace(/[<>]/g, '') // Prevenir XSS básico
      .replace(/javascript:/gi, '') // Prevenir javascript: URLs
      .trim();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Auditoría
  logAuditEvent(event: Omit<AuditLog, 'id' | 'timestamp'>): void {
    if (!this.config.enableAuditLog) {
      return;
    }

    const auditLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...event
    };

    this.auditLogs.push(auditLog);

    // Mantener solo los últimos 1000 logs
    if (this.auditLogs.length > 1000) {
      this.auditLogs = this.auditLogs.slice(-1000);
    }

    // En producción, enviar a base de datos o servicio de logging
    console.log('🔒 Audit Log:', auditLog);
  }

  logSecurityEvent(event: SecurityEvent): void {
    this.securityEvents.push(event);

    // Mantener solo los últimos 500 eventos
    if (this.securityEvents.length > 500) {
      this.securityEvents = this.securityEvents.slice(-500);
    }

    // En producción, enviar alertas según severidad
    if (event.severity === 'critical' || event.severity === 'high') {
      this.sendSecurityAlert(event);
    }

    console.log('🚨 Security Event:', event);
  }

  private sendSecurityAlert(event: SecurityEvent): void {
    // En producción, enviar notificación por email, Slack, etc.
    console.log('🚨 SECURITY ALERT:', event);
  }

  // Validación de origen (CORS)
  validateOrigin(origin: string): boolean {
    return this.config.allowedOrigins.includes(origin);
  }

  // Validación de token JWT (simulada)
  validateToken(token: string): { isValid: boolean; userId?: string; error?: string } {
    try {
      // En producción, usar una librería JWT real
      if (!token || token.length < 10) {
        return { isValid: false, error: 'Token inválido' };
      }

      // Simular validación de token
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return { isValid: false, error: 'Token malformado' };
      }

      // Verificar expiración
      if (decoded.exp && Date.now() > decoded.exp * 1000) {
        return { isValid: false, error: 'Token expirado' };
      }

      return { isValid: true, userId: decoded.userId };
    } catch (error) {
      return { isValid: false, error: 'Error validando token' };
    }
  }

  private decodeToken(token: string): any {
    try {
      // Simulación de decodificación JWT
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Generación de tokens seguros
  generateSecureToken(userId: string, expiresIn: number = 3600): string {
    const payload = {
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn
    };

    // En producción, usar una librería JWT real
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payloadEncoded = btoa(JSON.stringify(payload));
    const signature = btoa('signature-placeholder');

    return `${header}.${payloadEncoded}.${signature}`;
  }

  // Limpieza de datos sensibles
  sanitizeSensitiveData(data: any): any {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'creditCard'];
    
    if (typeof data === 'object' && data !== null) {
      const sanitized = Array.isArray(data) ? [] : {};
      
      for (const [key, value] of Object.entries(data)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          sanitized[key] = '[REDACTED]';
        } else if (typeof value === 'object' && value !== null) {
          sanitized[key] = this.sanitizeSensitiveData(value);
        } else {
          sanitized[key] = value;
        }
      }
      
      return sanitized;
    }
    
    return data;
  }

  // Obtener logs de auditoría
  getAuditLogs(filter?: { userId?: string; action?: string; startDate?: string; endDate?: string }): AuditLog[] {
    let logs = [...this.auditLogs];

    if (filter?.userId) {
      logs = logs.filter(log => log.userId === filter.userId);
    }

    if (filter?.action) {
      logs = logs.filter(log => log.action === filter.action);
    }

    if (filter?.startDate) {
      logs = logs.filter(log => log.timestamp >= filter.startDate!);
    }

    if (filter?.endDate) {
      logs = logs.filter(log => log.timestamp <= filter.endDate!);
    }

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Obtener eventos de seguridad
  getSecurityEvents(filter?: { severity?: string; type?: string; startDate?: string; endDate?: string }): SecurityEvent[] {
    let events = [...this.securityEvents];

    if (filter?.severity) {
      events = events.filter(event => event.severity === filter.severity);
    }

    if (filter?.type) {
      events = events.filter(event => event.type === filter.type);
    }

    if (filter?.startDate) {
      events = events.filter(event => event.timestamp >= filter.startDate!);
    }

    if (filter?.endDate) {
      events = events.filter(event => event.timestamp <= filter.endDate!);
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Configuración
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Limpieza de datos temporales
  cleanup(): void {
    const now = Date.now();
    
    // Limpiar intentos de login antiguos
    for (const [key, attempts] of this.loginAttempts.entries()) {
      if (now - attempts.lastAttempt > 60 * 60 * 1000) { // 1 hora
        this.loginAttempts.delete(key);
      }
    }

    // Limpiar rate limits antiguos
    for (const [key, rateLimit] of this.rateLimitMap.entries()) {
      if (now > rateLimit.resetTime) {
        this.rateLimitMap.delete(key);
      }
    }
  }
}

// Exportar instancia singleton
export const securityManager = SecurityManager.getInstance();

// Funciones de utilidad
export const sanitizeInput = (input: string): string => securityManager.sanitizeInput(input);
export const validateEmail = (email: string): boolean => securityManager.validateEmail(email);
export const validatePhone = (phone: string): boolean => securityManager.validatePhone(phone);
export const generateSecurePassword = (length?: number): string => securityManager.generateSecurePassword(length);
export const encryptData = (data: string): string => securityManager.encryptData(data);
export const decryptData = (data: string): string => securityManager.decryptData(data); 