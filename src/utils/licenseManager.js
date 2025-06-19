class LicenseManager {
    constructor() {
        this.licenses = new Map();
        this.usage = new Map();
        this.renewals = new Map();
        this.isEnabled = true;
    }
    // Inicializar licencias del sistema
    initialize() {
        this.loadDefaultLicenses();
    }
    // Cargar licencias por defecto
    loadDefaultLicenses() {
        const defaultLicenses = [
            {
                id: 'license_trial',
                key: 'TRIAL-XXXX-XXXX-XXXX',
                type: 'trial',
                status: 'active',
                issuedTo: 'demo@parccentral.com',
                issuedBy: 'system',
                issuedAt: new Date(),
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
                features: [
                    'dashboard',
                    'restaurants.view',
                    'valuations.basic',
                    'reports.basic'
                ],
                limits: {
                    users: 1,
                    restaurants: 5,
                    storage: 1,
                    apiCalls: 1000,
                    reports: 10,
                    customFeatures: {}
                }
            },
            {
                id: 'license_basic',
                key: 'BASIC-XXXX-XXXX-XXXX',
                type: 'basic',
                status: 'active',
                issuedTo: 'franchisee@example.com',
                issuedBy: 'admin',
                issuedAt: new Date(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
                features: [
                    'dashboard',
                    'restaurants.full',
                    'valuations.basic',
                    'budgets.basic',
                    'reports.basic',
                    'notifications'
                ],
                limits: {
                    users: 3,
                    restaurants: 10,
                    storage: 5,
                    apiCalls: 10000,
                    reports: 100,
                    customFeatures: {}
                }
            },
            {
                id: 'license_professional',
                key: 'PRO-XXXX-XXXX-XXXX',
                type: 'professional',
                status: 'active',
                issuedTo: 'manager@example.com',
                issuedBy: 'admin',
                issuedAt: new Date(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
                features: [
                    'dashboard',
                    'restaurants.full',
                    'valuations.advanced',
                    'budgets.full',
                    'reports.advanced',
                    'notifications',
                    'analytics',
                    'ai_assistant',
                    'workflows'
                ],
                limits: {
                    users: 10,
                    restaurants: 50,
                    storage: 20,
                    apiCalls: 50000,
                    reports: 500,
                    customFeatures: {
                        'ai_queries': 1000,
                        'workflow_instances': 100
                    }
                }
            },
            {
                id: 'license_enterprise',
                key: 'ENT-XXXX-XXXX-XXXX',
                type: 'enterprise',
                status: 'active',
                issuedTo: 'enterprise@example.com',
                issuedBy: 'admin',
                issuedAt: new Date(),
                expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año
                features: [
                    'dashboard',
                    'restaurants.full',
                    'valuations.advanced',
                    'budgets.full',
                    'reports.advanced',
                    'notifications',
                    'analytics',
                    'ai_assistant',
                    'workflows',
                    'admin_panel',
                    'custom_integrations',
                    'priority_support',
                    'white_label'
                ],
                limits: {
                    users: 100,
                    restaurants: 500,
                    storage: 100,
                    apiCalls: 1000000,
                    reports: 10000,
                    customFeatures: {
                        'ai_queries': 10000,
                        'workflow_instances': 1000,
                        'custom_integrations': 10
                    }
                }
            }
        ];
        defaultLicenses.forEach(license => {
            this.licenses.set(license.id, license);
        });
    }
    // Crear licencia
    createLicense(license) {
        const licenseId = `license_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const licenseKey = this.generateLicenseKey(license.type);
        const newLicense = {
            id: licenseId,
            key: licenseKey,
            issuedAt: new Date(),
            ...license
        };
        this.licenses.set(licenseId, newLicense);
        return licenseId;
    }
    // Generar clave de licencia
    generateLicenseKey(type) {
        const prefix = type.toUpperCase().substring(0, 4);
        const random = Math.random().toString(36).substring(2, 10).toUpperCase();
        return `${prefix}-${random.substring(0, 4)}-${random.substring(4, 8)}`;
    }
    // Validar licencia
    validateLicense(licenseKey) {
        const license = Array.from(this.licenses.values()).find(l => l.key === licenseKey);
        if (!license) {
            return {
                valid: false,
                reason: 'Licencia no encontrada',
                usage: this.getCurrentUsage(licenseKey),
                limits: { users: 0, restaurants: 0, storage: 0, apiCalls: 0, reports: 0, customFeatures: {} }
            };
        }
        if (license.status !== 'active') {
            return {
                valid: false,
                reason: `Licencia ${license.status}`,
                usage: this.getCurrentUsage(licenseKey),
                limits: license.limits
            };
        }
        if (license.expiresAt && license.expiresAt < new Date()) {
            return {
                valid: false,
                reason: 'Licencia expirada',
                usage: this.getCurrentUsage(licenseKey),
                limits: license.limits
            };
        }
        const currentUsage = this.getCurrentUsage(licenseKey);
        const validation = {
            valid: true,
            usage: currentUsage,
            limits: license.limits,
            recommendations: []
        };
        // Calcular días hasta expiración
        if (license.expiresAt) {
            const daysUntilExpiry = Math.ceil((license.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            validation.expiresIn = daysUntilExpiry;
            if (daysUntilExpiry <= 30) {
                validation.recommendations?.push('Renovar licencia pronto');
            }
        }
        // Verificar límites de uso
        if (currentUsage.users > license.limits.users * 0.8) {
            validation.recommendations?.push('Límite de usuarios cerca del máximo');
        }
        if (currentUsage.restaurants > license.limits.restaurants * 0.8) {
            validation.recommendations?.push('Límite de restaurantes cerca del máximo');
        }
        if (currentUsage.storage > license.limits.storage * 0.8) {
            validation.recommendations?.push('Límite de almacenamiento cerca del máximo');
        }
        if (currentUsage.apiCalls > license.limits.apiCalls * 0.8) {
            validation.recommendations?.push('Límite de llamadas API cerca del máximo');
        }
        return validation;
    }
    // Obtener uso actual
    getCurrentUsage(licenseKey) {
        const license = Array.from(this.licenses.values()).find(l => l.key === licenseKey);
        if (!license) {
            return {
                licenseId: '',
                timestamp: new Date(),
                users: 0,
                restaurants: 0,
                storage: 0,
                apiCalls: 0,
                reports: 0,
                customFeatures: {}
            };
        }
        const usageHistory = this.usage.get(license.id) || [];
        const latestUsage = usageHistory[usageHistory.length - 1];
        return latestUsage || {
            licenseId: license.id,
            timestamp: new Date(),
            users: 0,
            restaurants: 0,
            storage: 0,
            apiCalls: 0,
            reports: 0,
            customFeatures: {}
        };
    }
    // Registrar uso
    recordUsage(licenseKey, usage) {
        const license = Array.from(this.licenses.values()).find(l => l.key === licenseKey);
        if (!license)
            return;
        const currentUsage = this.getCurrentUsage(licenseKey);
        const newUsage = {
            ...currentUsage,
            ...usage,
            timestamp: new Date()
        };
        if (!this.usage.has(license.id)) {
            this.usage.set(license.id, []);
        }
        this.usage.get(license.id).push(newUsage);
    }
    // Verificar si una característica está disponible
    isFeatureAvailable(licenseKey, feature) {
        const license = Array.from(this.licenses.values()).find(l => l.key === licenseKey);
        if (!license || license.status !== 'active')
            return false;
        if (license.expiresAt && license.expiresAt < new Date())
            return false;
        return license.features.includes(feature);
    }
    // Verificar límite de uso
    checkLimit(licenseKey, limit, value) {
        const license = Array.from(this.licenses.values()).find(l => l.key === licenseKey);
        if (!license)
            return false;
        const currentUsage = this.getCurrentUsage(licenseKey);
        const limitValue = license.limits[limit];
        if (typeof limitValue === 'number') {
            return currentUsage[limit] + value <= limitValue;
        }
        return true;
    }
    // Renovar licencia
    renewLicense(licenseId, type = 'manual') {
        const license = this.licenses.get(licenseId);
        if (!license) {
            throw new Error(`License ${licenseId} not found`);
        }
        const renewalId = `renewal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const renewal = {
            id: renewalId,
            licenseId,
            type,
            status: 'pending',
            requestedAt: new Date()
        };
        if (!this.renewals.has(licenseId)) {
            this.renewals.set(licenseId, []);
        }
        this.renewals.get(licenseId).push(renewal);
        // Procesar renovación
        this.processRenewal(renewalId);
        return renewalId;
    }
    // Procesar renovación
    async processRenewal(renewalId) {
        const renewal = this.findRenewal(renewalId);
        if (!renewal)
            return;
        try {
            renewal.status = 'processing';
            // Simular procesamiento
            await new Promise(resolve => setTimeout(resolve, 2000));
            const license = this.licenses.get(renewal.licenseId);
            if (license) {
                // Extender fecha de expiración
                const newExpiryDate = new Date();
                newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
                license.expiresAt = newExpiryDate;
                renewal.newExpiryDate = newExpiryDate;
            }
            renewal.status = 'completed';
            renewal.processedAt = new Date();
        }
        catch (error) {
            renewal.status = 'failed';
            renewal.processedAt = new Date();
        }
    }
    // Encontrar renovación
    findRenewal(renewalId) {
        const allRenewals = Array.from(this.renewals.values());
        for (const renewals of allRenewals) {
            const renewal = renewals.find(r => r.id === renewalId);
            if (renewal)
                return renewal;
        }
        return undefined;
    }
    // Suspender licencia
    suspendLicense(licenseId, reason) {
        const license = this.licenses.get(licenseId);
        if (license) {
            license.status = 'suspended';
            license.metadata = { ...license.metadata, suspensionReason: reason };
        }
    }
    // Reactivar licencia
    reactivateLicense(licenseId) {
        const license = this.licenses.get(licenseId);
        if (license) {
            license.status = 'active';
            if (license.metadata) {
                delete license.metadata.suspensionReason;
            }
        }
    }
    // Revocar licencia
    revokeLicense(licenseId, reason) {
        const license = this.licenses.get(licenseId);
        if (license) {
            license.status = 'revoked';
            license.metadata = { ...license.metadata, revocationReason: reason };
        }
    }
    // Obtener licencia
    getLicense(licenseId) {
        return this.licenses.get(licenseId);
    }
    // Obtener licencia por clave
    getLicenseByKey(licenseKey) {
        return Array.from(this.licenses.values()).find(l => l.key === licenseKey);
    }
    // Obtener todas las licencias
    getAllLicenses() {
        return Array.from(this.licenses.values());
    }
    // Obtener historial de uso
    getUsageHistory(licenseId, timeRange) {
        const usageHistory = this.usage.get(licenseId) || [];
        if (timeRange) {
            return usageHistory.filter(usage => usage.timestamp >= timeRange.start && usage.timestamp <= timeRange.end);
        }
        return usageHistory;
    }
    // Obtener renovaciones
    getRenewals(licenseId) {
        return this.renewals.get(licenseId) || [];
    }
    // Obtener estadísticas de licencias
    getLicenseStats() {
        const stats = {
            totalLicenses: 0,
            activeLicenses: 0,
            expiredLicenses: 0,
            suspendedLicenses: 0,
            licensesByType: {},
            revenue: 0
        };
        this.licenses.forEach(license => {
            stats.totalLicenses++;
            if (license.status === 'active') {
                stats.activeLicenses++;
            }
            else if (license.status === 'expired') {
                stats.expiredLicenses++;
            }
            else if (license.status === 'suspended') {
                stats.suspendedLicenses++;
            }
            stats.licensesByType[license.type] = (stats.licensesByType[license.type] || 0) + 1;
            // Calcular ingresos (simplificado)
            const prices = { trial: 0, basic: 99, professional: 299, enterprise: 999 };
            stats.revenue += prices[license.type] || 0;
        });
        return stats;
    }
    // Generar reporte de licencias
    generateLicenseReport() {
        const stats = this.getLicenseStats();
        let report = '# Reporte de Licencias\n\n';
        report += `**Fecha:** ${new Date().toLocaleDateString()}\n\n`;
        report += `## Resumen\n\n`;
        report += `- Total de licencias: ${stats.totalLicenses}\n`;
        report += `- Licencias activas: ${stats.activeLicenses}\n`;
        report += `- Licencias expiradas: ${stats.expiredLicenses}\n`;
        report += `- Licencias suspendidas: ${stats.suspendedLicenses}\n`;
        report += `- Ingresos estimados: $${stats.revenue}\n\n`;
        report += `## Licencias por Tipo\n\n`;
        Object.keys(stats.licensesByType).forEach(type => {
            report += `- ${type}: ${stats.licensesByType[type]}\n`;
        });
        report += `\n## Licencias Detalladas\n\n`;
        this.licenses.forEach(license => {
            report += `### ${license.key}\n\n`;
            report += `- Tipo: ${license.type}\n`;
            report += `- Estado: ${license.status}\n`;
            report += `- Emitida a: ${license.issuedTo}\n`;
            report += `- Emitida el: ${license.issuedAt.toLocaleDateString()}\n`;
            if (license.expiresAt) {
                report += `- Expira el: ${license.expiresAt.toLocaleDateString()}\n`;
            }
            report += `- Características: ${license.features.join(', ')}\n\n`;
        });
        return report;
    }
    // Habilitar/deshabilitar license manager
    enable() {
        this.isEnabled = true;
    }
    disable() {
        this.isEnabled = false;
    }
    // Limpiar datos antiguos
    cleanup(maxAge = 365 * 24 * 60 * 60 * 1000) {
        const cutoff = new Date(Date.now() - maxAge);
        // Limpiar uso antiguo
        this.usage.forEach((usageHistory, licenseId) => {
            this.usage.set(licenseId, usageHistory.filter(usage => usage.timestamp >= cutoff));
        });
        // Limpiar renovaciones antiguas
        this.renewals.forEach((renewals, licenseId) => {
            this.renewals.set(licenseId, renewals.filter(renewal => renewal.requestedAt >= cutoff));
        });
    }
}
// Instancia global del license manager
export const licenseManager = new LicenseManager();
// Hooks de React para gestión de licencias
export const useLicenseManager = () => {
    return {
        createLicense: licenseManager.createLicense.bind(licenseManager),
        validateLicense: licenseManager.validateLicense.bind(licenseManager),
        recordUsage: licenseManager.recordUsage.bind(licenseManager),
        isFeatureAvailable: licenseManager.isFeatureAvailable.bind(licenseManager),
        checkLimit: licenseManager.checkLimit.bind(licenseManager),
        renewLicense: licenseManager.renewLicense.bind(licenseManager),
        suspendLicense: licenseManager.suspendLicense.bind(licenseManager),
        reactivateLicense: licenseManager.reactivateLicense.bind(licenseManager),
        revokeLicense: licenseManager.revokeLicense.bind(licenseManager),
        getLicense: licenseManager.getLicense.bind(licenseManager),
        getLicenseByKey: licenseManager.getLicenseByKey.bind(licenseManager),
        getAllLicenses: licenseManager.getAllLicenses.bind(licenseManager),
        getUsageHistory: licenseManager.getUsageHistory.bind(licenseManager),
        getRenewals: licenseManager.getRenewals.bind(licenseManager),
        getLicenseStats: licenseManager.getLicenseStats.bind(licenseManager),
        generateLicenseReport: licenseManager.generateLicenseReport.bind(licenseManager),
        enable: licenseManager.enable.bind(licenseManager),
        disable: licenseManager.disable.bind(licenseManager),
        cleanup: licenseManager.cleanup.bind(licenseManager)
    };
};
