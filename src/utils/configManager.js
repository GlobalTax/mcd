class ConfigManager {
    constructor() {
        this.config = {};
        this.configSections = {};
        this.changeHistory = [];
        this.isEnabled = true;
        this.changeListeners = new Map();
    }
    // Inicializar configuración
    initialize() {
        this.loadDefaultConfig();
        this.loadEnvironmentConfig();
        this.loadUserConfig();
        this.validateConfig();
    }
    // Cargar configuración por defecto
    loadDefaultConfig() {
        this.config = {
            // Configuración de la aplicación
            'app.name': {
                value: 'Parc Central Forecast',
                type: 'string',
                description: 'Nombre de la aplicación',
                category: 'application',
                environment: 'all',
                required: true
            },
            'app.version': {
                value: '1.0.0',
                type: 'string',
                description: 'Versión de la aplicación',
                category: 'application',
                environment: 'all',
                required: true
            },
            'app.debug': {
                value: false,
                type: 'boolean',
                description: 'Modo debug',
                category: 'application',
                environment: 'development',
                required: false,
                defaultValue: false
            },
            // Configuración de API
            'api.baseUrl': {
                value: 'https://api.parccentral.com',
                type: 'string',
                description: 'URL base de la API',
                category: 'api',
                environment: 'all',
                required: true,
                validation: {
                    pattern: '^https?://.*'
                }
            },
            'api.timeout': {
                value: 30000,
                type: 'number',
                description: 'Timeout de las peticiones API (ms)',
                category: 'api',
                environment: 'all',
                required: true,
                validation: {
                    min: 1000,
                    max: 60000
                },
                defaultValue: 30000
            },
            'api.retries': {
                value: 3,
                type: 'number',
                description: 'Número de reintentos en peticiones fallidas',
                category: 'api',
                environment: 'all',
                required: true,
                validation: {
                    min: 0,
                    max: 10
                },
                defaultValue: 3
            },
            // Configuración de autenticación
            'auth.enabled': {
                value: true,
                type: 'boolean',
                description: 'Habilitar autenticación',
                category: 'authentication',
                environment: 'all',
                required: true,
                defaultValue: true
            },
            'auth.provider': {
                value: 'supabase',
                type: 'string',
                description: 'Proveedor de autenticación',
                category: 'authentication',
                environment: 'all',
                required: true,
                validation: {
                    enum: ['supabase', 'firebase', 'auth0', 'custom']
                },
                defaultValue: 'supabase'
            },
            'auth.sessionTimeout': {
                value: 3600000, // 1 hora
                type: 'number',
                description: 'Timeout de sesión (ms)',
                category: 'authentication',
                environment: 'all',
                required: true,
                validation: {
                    min: 300000, // 5 minutos
                    max: 86400000 // 24 horas
                },
                defaultValue: 3600000
            },
            // Configuración de caché
            'cache.enabled': {
                value: true,
                type: 'boolean',
                description: 'Habilitar sistema de caché',
                category: 'cache',
                environment: 'all',
                required: true,
                defaultValue: true
            },
            'cache.ttl': {
                value: 300000, // 5 minutos
                type: 'number',
                description: 'Tiempo de vida del caché (ms)',
                category: 'cache',
                environment: 'all',
                required: true,
                validation: {
                    min: 60000, // 1 minuto
                    max: 3600000 // 1 hora
                },
                defaultValue: 300000
            },
            'cache.maxSize': {
                value: 100,
                type: 'number',
                description: 'Número máximo de elementos en caché',
                category: 'cache',
                environment: 'all',
                required: true,
                validation: {
                    min: 10,
                    max: 1000
                },
                defaultValue: 100
            },
            // Configuración de analytics
            'analytics.enabled': {
                value: true,
                type: 'boolean',
                description: 'Habilitar analytics',
                category: 'analytics',
                environment: 'production',
                required: false,
                defaultValue: false
            },
            'analytics.provider': {
                value: 'google',
                type: 'string',
                description: 'Proveedor de analytics',
                category: 'analytics',
                environment: 'production',
                required: false,
                validation: {
                    enum: ['google', 'mixpanel', 'amplitude', 'custom']
                },
                defaultValue: 'google'
            },
            'analytics.trackingId': {
                value: '',
                type: 'string',
                description: 'ID de tracking de analytics',
                category: 'analytics',
                environment: 'production',
                required: false
            },
            // Configuración de notificaciones
            'notifications.enabled': {
                value: true,
                type: 'boolean',
                description: 'Habilitar notificaciones',
                category: 'notifications',
                environment: 'all',
                required: true,
                defaultValue: true
            },
            'notifications.position': {
                value: 'top-right',
                type: 'string',
                description: 'Posición de las notificaciones',
                category: 'notifications',
                environment: 'all',
                required: true,
                validation: {
                    enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center']
                },
                defaultValue: 'top-right'
            },
            'notifications.duration': {
                value: 5000,
                type: 'number',
                description: 'Duración de las notificaciones (ms)',
                category: 'notifications',
                environment: 'all',
                required: true,
                validation: {
                    min: 1000,
                    max: 30000
                },
                defaultValue: 5000
            },
            // Configuración de tema
            'theme.mode': {
                value: 'system',
                type: 'string',
                description: 'Modo del tema',
                category: 'theme',
                environment: 'all',
                required: true,
                validation: {
                    enum: ['light', 'dark', 'system']
                },
                defaultValue: 'system'
            },
            'theme.primaryColor': {
                value: '#3b82f6',
                type: 'string',
                description: 'Color primario del tema',
                category: 'theme',
                environment: 'all',
                required: true,
                validation: {
                    pattern: '^#[0-9a-fA-F]{6}$'
                },
                defaultValue: '#3b82f6'
            },
            // Configuración de performance
            'performance.lazyLoading': {
                value: true,
                type: 'boolean',
                description: 'Habilitar lazy loading',
                category: 'performance',
                environment: 'all',
                required: true,
                defaultValue: true
            },
            'performance.memoization': {
                value: true,
                type: 'boolean',
                description: 'Habilitar memoización',
                category: 'performance',
                environment: 'all',
                required: true,
                defaultValue: true
            },
            'performance.bundleAnalysis': {
                value: false,
                type: 'boolean',
                description: 'Habilitar análisis de bundle',
                category: 'performance',
                environment: 'development',
                required: false,
                defaultValue: false
            }
        };
        // Organizar en secciones
        this.organizeConfigSections();
    }
    // Cargar configuración del entorno
    loadEnvironmentConfig() {
        // Load environment-specific configuration
        const env = this.getEnvVar('MODE', 'development');
        // Load environment variables
        const envPrefix = 'VITE_CONFIG_';
        Object.keys(process.env || {}).forEach(key => {
            if (key.startsWith(envPrefix)) {
                const configKey = key.replace(envPrefix, '').toLowerCase();
                if (this.config[configKey]) {
                    this.setValue(configKey, this.parseEnvValue(process.env[key], this.config[configKey].type));
                }
            }
        });
    }
    getEnvVar(key, defaultValue = '') {
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__[key] || defaultValue;
        }
        return defaultValue;
    }
    // Cargar configuración del usuario
    loadUserConfig() {
        try {
            const userConfig = localStorage.getItem('user_config');
            if (userConfig) {
                const parsed = JSON.parse(userConfig);
                Object.keys(parsed).forEach(key => {
                    if (this.config[key]) {
                        this.setValue(key, parsed[key]);
                    }
                });
            }
        }
        catch (error) {
            console.warn('Failed to load user config:', error);
        }
    }
    // Organizar configuración en secciones
    organizeConfigSections() {
        const sections = {};
        Object.keys(this.config).forEach(key => {
            const [category] = key.split('.');
            if (!sections[category]) {
                sections[category] = {
                    name: category,
                    description: this.getCategoryDescription(category),
                    settings: {}
                };
            }
            sections[category].settings[key] = this.config[key];
        });
        this.configSections = sections;
    }
    // Obtener descripción de categoría
    getCategoryDescription(category) {
        const descriptions = {
            app: 'Configuración general de la aplicación',
            api: 'Configuración de la API y servicios externos',
            auth: 'Configuración de autenticación y autorización',
            cache: 'Configuración del sistema de caché',
            analytics: 'Configuración de analytics y tracking',
            notifications: 'Configuración de notificaciones',
            theme: 'Configuración de tema y apariencia',
            performance: 'Configuración de optimización de performance'
        };
        return descriptions[category] || 'Configuración general';
    }
    // Validar configuración
    validateConfig() {
        const errors = [];
        Object.keys(this.config).forEach(key => {
            const setting = this.config[key];
            // Verificar valores requeridos
            if (setting.required && setting.value === undefined && setting.value === null) {
                errors.push(`Required setting ${key} is missing`);
            }
            // Validar según reglas
            if (setting.validation) {
                const validation = setting.validation;
                if (validation.min !== undefined && setting.value < validation.min) {
                    errors.push(`Setting ${key} value ${setting.value} is below minimum ${validation.min}`);
                }
                if (validation.max !== undefined && setting.value > validation.max) {
                    errors.push(`Setting ${key} value ${setting.value} is above maximum ${validation.max}`);
                }
                if (validation.pattern && !new RegExp(validation.pattern).test(setting.value)) {
                    errors.push(`Setting ${key} value ${setting.value} does not match pattern ${validation.pattern}`);
                }
                if (validation.enum && !validation.enum.includes(setting.value)) {
                    errors.push(`Setting ${key} value ${setting.value} is not in allowed values ${validation.enum.join(', ')}`);
                }
            }
        });
        if (errors.length > 0) {
            console.error('Configuration validation errors:', errors);
            throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
        }
    }
    // Obtener valor de configuración
    getValue(key) {
        const setting = this.config[key];
        if (!setting) {
            throw new Error(`Configuration key ${key} not found`);
        }
        return setting.value;
    }
    // Establecer valor de configuración
    setValue(key, value, userId, reason) {
        const setting = this.config[key];
        if (!setting) {
            throw new Error(`Configuration key ${key} not found`);
        }
        const oldValue = setting.value;
        // Validar nuevo valor
        if (setting.validation) {
            this.validateValue(key, value, setting.validation);
        }
        // Actualizar valor
        setting.value = value;
        // Registrar cambio
        const change = {
            id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            key,
            oldValue,
            newValue: value,
            timestamp: new Date(),
            userId,
            reason,
            environment: this.getEnvVar('MODE', 'development')
        };
        this.changeHistory.push(change);
        // Notificar listeners
        this.notifyChangeListeners(key, oldValue, value);
        // Guardar configuración del usuario si es persistente
        if (this.isUserConfig(key)) {
            this.saveUserConfig();
        }
    }
    // Validar valor
    validateValue(key, value, validation) {
        if (validation.min !== undefined && value < validation.min) {
            throw new Error(`Value ${value} for ${key} is below minimum ${validation.min}`);
        }
        if (validation.max !== undefined && value > validation.max) {
            throw new Error(`Value ${value} for ${key} is above maximum ${validation.max}`);
        }
        if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
            throw new Error(`Value ${value} for ${key} does not match pattern ${validation.pattern}`);
        }
        if (validation.enum && !validation.enum.includes(value)) {
            throw new Error(`Value ${value} for ${key} is not in allowed values ${validation.enum.join(', ')}`);
        }
    }
    // Verificar si es configuración del usuario
    isUserConfig(key) {
        const userConfigKeys = ['theme.mode', 'theme.primaryColor', 'notifications.position', 'notifications.duration'];
        return userConfigKeys.includes(key);
    }
    // Guardar configuración del usuario
    saveUserConfig() {
        try {
            const userConfig = {};
            Object.keys(this.config).forEach(key => {
                if (this.isUserConfig(key)) {
                    userConfig[key] = this.config[key].value;
                }
            });
            localStorage.setItem('user_config', JSON.stringify(userConfig));
        }
        catch (error) {
            console.warn('Failed to save user config:', error);
        }
    }
    // Parsear valor de variable de entorno
    parseEnvValue(value, type) {
        switch (type) {
            case 'number':
                return Number(value);
            case 'boolean':
                return value === 'true' || value === '1';
            case 'object':
            case 'array':
                try {
                    return JSON.parse(value);
                }
                catch {
                    return value;
                }
            default:
                return value;
        }
    }
    // Registrar listener de cambios
    registerChangeListener(key, listener) {
        this.changeListeners.set(key, listener);
    }
    // Remover listener de cambios
    unregisterChangeListener(key) {
        this.changeListeners.delete(key);
    }
    // Notificar listeners de cambios
    notifyChangeListeners(key, oldValue, newValue) {
        this.changeListeners.forEach((listener, listenerKey) => {
            if (listenerKey === key || listenerKey === '*') {
                try {
                    listener(key, oldValue, newValue);
                }
                catch (error) {
                    console.error(`Error in config change listener for ${key}:`, error);
                }
            }
        });
    }
    // Obtener configuración por categoría
    getConfigByCategory(category) {
        return this.configSections[category];
    }
    // Obtener todas las categorías
    getCategories() {
        return Object.keys(this.configSections);
    }
    // Obtener historial de cambios
    getChangeHistory(filters) {
        let filteredChanges = [...this.changeHistory];
        if (filters) {
            if (filters.key) {
                filteredChanges = filteredChanges.filter(c => c.key === filters.key);
            }
            if (filters.userId) {
                filteredChanges = filteredChanges.filter(c => c.userId === filters.userId);
            }
            if (filters.dateRange) {
                filteredChanges = filteredChanges.filter(c => c.timestamp >= filters.dateRange.start && c.timestamp <= filters.dateRange.end);
            }
        }
        return filteredChanges.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    // Resetear configuración a valores por defecto
    resetToDefaults(category) {
        if (category) {
            const section = this.configSections[category];
            if (section) {
                Object.keys(section.settings).forEach(key => {
                    const setting = this.config[key];
                    if (setting.defaultValue !== undefined) {
                        this.setValue(key, setting.defaultValue);
                    }
                });
            }
        }
        else {
            Object.keys(this.config).forEach(key => {
                const setting = this.config[key];
                if (setting.defaultValue !== undefined) {
                    this.setValue(key, setting.defaultValue);
                }
            });
        }
    }
    // Exportar configuración
    exportConfig() {
        const exported = {};
        Object.keys(this.config).forEach(key => {
            exported[key] = this.config[key].value;
        });
        return exported;
    }
    // Importar configuración
    importConfig(config) {
        Object.keys(config).forEach(key => {
            if (this.config[key]) {
                this.setValue(key, config[key]);
            }
        });
    }
    // Habilitar/deshabilitar config manager
    enable() {
        this.isEnabled = true;
    }
    disable() {
        this.isEnabled = false;
    }
    // Limpiar historial de cambios
    cleanup(maxAge = 30 * 24 * 60 * 60 * 1000) {
        const cutoff = new Date(Date.now() - maxAge);
        this.changeHistory = this.changeHistory.filter(change => change.timestamp >= cutoff);
    }
    getSystemInfo() {
        return {
            version: '1.0.0',
            environment: this.getEnvVar('MODE', 'development'),
            timestamp: new Date().toISOString(),
            features: this.getEnabledFeatures()
        };
    }
    getEnabledFeatures() {
        const features = [];
        Object.keys(this.config).forEach(key => {
            if (this.config[key].value === true) {
                features.push(key);
            }
        });
        return features;
    }
}
// Instancia global del config manager
export const configManager = new ConfigManager();
// Hooks de React para gestión de configuración
export const useConfigManager = () => {
    return {
        getValue: configManager.getValue.bind(configManager),
        setValue: configManager.setValue.bind(configManager),
        getConfigByCategory: configManager.getConfigByCategory.bind(configManager),
        getCategories: configManager.getCategories.bind(configManager),
        getChangeHistory: configManager.getChangeHistory.bind(configManager),
        resetToDefaults: configManager.resetToDefaults.bind(configManager),
        exportConfig: configManager.exportConfig.bind(configManager),
        importConfig: configManager.importConfig.bind(configManager),
        registerChangeListener: configManager.registerChangeListener.bind(configManager),
        unregisterChangeListener: configManager.unregisterChangeListener.bind(configManager),
        enable: configManager.enable.bind(configManager),
        disable: configManager.disable.bind(configManager),
        cleanup: configManager.cleanup.bind(configManager)
    };
};
