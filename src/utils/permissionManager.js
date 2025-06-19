class PermissionManager {
    constructor() {
        this.permissions = new Map();
        this.roles = new Map();
        this.userPermissions = new Map();
        this.permissionChecks = [];
        this.isEnabled = true;
    }
    // Inicializar permisos del sistema
    initialize() {
        this.loadDefaultPermissions();
        this.loadDefaultRoles();
    }
    // Cargar permisos por defecto
    loadDefaultPermissions() {
        const defaultPermissions = [
            // Permisos de autenticación
            {
                id: 'auth.login',
                name: 'Iniciar sesión',
                description: 'Permite al usuario iniciar sesión en el sistema',
                resource: 'auth',
                action: 'login'
            },
            {
                id: 'auth.logout',
                name: 'Cerrar sesión',
                description: 'Permite al usuario cerrar sesión',
                resource: 'auth',
                action: 'logout'
            },
            {
                id: 'auth.register',
                name: 'Registrarse',
                description: 'Permite al usuario registrarse en el sistema',
                resource: 'auth',
                action: 'register'
            },
            // Permisos de dashboard
            {
                id: 'dashboard.view',
                name: 'Ver dashboard',
                description: 'Permite ver el dashboard principal',
                resource: 'dashboard',
                action: 'view'
            },
            {
                id: 'dashboard.export',
                name: 'Exportar dashboard',
                description: 'Permite exportar datos del dashboard',
                resource: 'dashboard',
                action: 'export'
            },
            // Permisos de restaurantes
            {
                id: 'restaurants.view',
                name: 'Ver restaurantes',
                description: 'Permite ver la lista de restaurantes',
                resource: 'restaurants',
                action: 'view'
            },
            {
                id: 'restaurants.create',
                name: 'Crear restaurante',
                description: 'Permite crear nuevos restaurantes',
                resource: 'restaurants',
                action: 'create'
            },
            {
                id: 'restaurants.edit',
                name: 'Editar restaurante',
                description: 'Permite editar restaurantes existentes',
                resource: 'restaurants',
                action: 'edit'
            },
            {
                id: 'restaurants.delete',
                name: 'Eliminar restaurante',
                description: 'Permite eliminar restaurantes',
                resource: 'restaurants',
                action: 'delete'
            },
            {
                id: 'restaurants.view_own',
                name: 'Ver restaurantes propios',
                description: 'Permite ver solo los restaurantes del usuario',
                resource: 'restaurants',
                action: 'view',
                conditions: [
                    {
                        type: 'field',
                        field: 'owner_id',
                        operator: 'equals',
                        value: '{{user.id}}'
                    }
                ]
            },
            // Permisos de valoración
            {
                id: 'valuations.view',
                name: 'Ver valoraciones',
                description: 'Permite ver valoraciones de restaurantes',
                resource: 'valuations',
                action: 'view'
            },
            {
                id: 'valuations.create',
                name: 'Crear valoración',
                description: 'Permite crear nuevas valoraciones',
                resource: 'valuations',
                action: 'create'
            },
            {
                id: 'valuations.edit',
                name: 'Editar valoración',
                description: 'Permite editar valoraciones existentes',
                resource: 'valuations',
                action: 'edit'
            },
            {
                id: 'valuations.delete',
                name: 'Eliminar valoración',
                description: 'Permite eliminar valoraciones',
                resource: 'valuations',
                action: 'delete'
            },
            {
                id: 'valuations.view_own',
                name: 'Ver valoraciones propias',
                description: 'Permite ver solo las valoraciones del usuario',
                resource: 'valuations',
                action: 'view',
                conditions: [
                    {
                        type: 'field',
                        field: 'created_by',
                        operator: 'equals',
                        value: '{{user.id}}'
                    }
                ]
            },
            // Permisos de presupuestos
            {
                id: 'budgets.view',
                name: 'Ver presupuestos',
                description: 'Permite ver presupuestos',
                resource: 'budgets',
                action: 'view'
            },
            {
                id: 'budgets.create',
                name: 'Crear presupuesto',
                description: 'Permite crear nuevos presupuestos',
                resource: 'budgets',
                action: 'create'
            },
            {
                id: 'budgets.edit',
                name: 'Editar presupuesto',
                description: 'Permite editar presupuestos existentes',
                resource: 'budgets',
                action: 'edit'
            },
            {
                id: 'budgets.delete',
                name: 'Eliminar presupuesto',
                description: 'Permite eliminar presupuestos',
                resource: 'budgets',
                action: 'delete'
            },
            {
                id: 'budgets.approve',
                name: 'Aprobar presupuesto',
                description: 'Permite aprobar presupuestos',
                resource: 'budgets',
                action: 'approve'
            },
            // Permisos de usuarios
            {
                id: 'users.view',
                name: 'Ver usuarios',
                description: 'Permite ver la lista de usuarios',
                resource: 'users',
                action: 'view'
            },
            {
                id: 'users.create',
                name: 'Crear usuario',
                description: 'Permite crear nuevos usuarios',
                resource: 'users',
                action: 'create'
            },
            {
                id: 'users.edit',
                name: 'Editar usuario',
                description: 'Permite editar usuarios existentes',
                resource: 'users',
                action: 'edit'
            },
            {
                id: 'users.delete',
                name: 'Eliminar usuario',
                description: 'Permite eliminar usuarios',
                resource: 'users',
                action: 'delete'
            },
            {
                id: 'users.view_own',
                name: 'Ver perfil propio',
                description: 'Permite ver solo el perfil del usuario',
                resource: 'users',
                action: 'view',
                conditions: [
                    {
                        type: 'field',
                        field: 'id',
                        operator: 'equals',
                        value: '{{user.id}}'
                    }
                ]
            },
            // Permisos de reportes
            {
                id: 'reports.view',
                name: 'Ver reportes',
                description: 'Permite ver reportes',
                resource: 'reports',
                action: 'view'
            },
            {
                id: 'reports.create',
                name: 'Crear reporte',
                description: 'Permite crear nuevos reportes',
                resource: 'reports',
                action: 'create'
            },
            {
                id: 'reports.export',
                name: 'Exportar reporte',
                description: 'Permite exportar reportes',
                resource: 'reports',
                action: 'export'
            },
            // Permisos de configuración
            {
                id: 'settings.view',
                name: 'Ver configuración',
                description: 'Permite ver la configuración del sistema',
                resource: 'settings',
                action: 'view'
            },
            {
                id: 'settings.edit',
                name: 'Editar configuración',
                description: 'Permite editar la configuración del sistema',
                resource: 'settings',
                action: 'edit'
            },
            // Permisos de administración
            {
                id: 'admin.access',
                name: 'Acceso administrativo',
                description: 'Permite acceso a funciones administrativas',
                resource: 'admin',
                action: 'access'
            },
            {
                id: 'admin.system',
                name: 'Administración del sistema',
                description: 'Permite administrar el sistema completo',
                resource: 'admin',
                action: 'system'
            }
        ];
        defaultPermissions.forEach(permission => {
            this.permissions.set(permission.id, permission);
        });
    }
    // Cargar roles por defecto
    loadDefaultRoles() {
        const defaultRoles = [
            {
                id: 'super_admin',
                name: 'Super Administrador',
                description: 'Acceso completo al sistema',
                permissions: [
                    'admin.access',
                    'admin.system',
                    'users.view',
                    'users.create',
                    'users.edit',
                    'users.delete',
                    'settings.view',
                    'settings.edit'
                ]
            },
            {
                id: 'admin',
                name: 'Administrador',
                description: 'Administrador con permisos limitados',
                permissions: [
                    'admin.access',
                    'users.view',
                    'users.create',
                    'users.edit',
                    'settings.view',
                    'settings.edit'
                ]
            },
            {
                id: 'manager',
                name: 'Gerente',
                description: 'Gerente con acceso a múltiples restaurantes',
                permissions: [
                    'dashboard.view',
                    'dashboard.export',
                    'restaurants.view',
                    'restaurants.create',
                    'restaurants.edit',
                    'valuations.view',
                    'valuations.create',
                    'valuations.edit',
                    'budgets.view',
                    'budgets.create',
                    'budgets.edit',
                    'budgets.approve',
                    'reports.view',
                    'reports.create',
                    'reports.export'
                ]
            },
            {
                id: 'franchisee',
                name: 'Franquiciado',
                description: 'Franquiciado con acceso a sus restaurantes',
                permissions: [
                    'dashboard.view',
                    'restaurants.view_own',
                    'restaurants.edit',
                    'valuations.view_own',
                    'valuations.create',
                    'valuations.edit',
                    'budgets.view',
                    'budgets.create',
                    'budgets.edit',
                    'reports.view',
                    'users.view_own'
                ]
            },
            {
                id: 'advisor',
                name: 'Asesor',
                description: 'Asesor con acceso de solo lectura',
                permissions: [
                    'dashboard.view',
                    'restaurants.view',
                    'valuations.view',
                    'budgets.view',
                    'reports.view',
                    'reports.export'
                ]
            },
            {
                id: 'user',
                name: 'Usuario',
                description: 'Usuario básico',
                permissions: [
                    'auth.login',
                    'auth.logout',
                    'dashboard.view',
                    'users.view_own'
                ]
            }
        ];
        defaultRoles.forEach(role => {
            this.roles.set(role.id, role);
        });
    }
    // Verificar permiso
    can(userId, resource, action, context) {
        if (!this.isEnabled)
            return true;
        const userPerms = this.userPermissions.get(userId);
        if (!userPerms)
            return false;
        // Buscar permiso directo
        const directPermission = userPerms.permissions.find(permId => {
            const permission = this.permissions.get(permId);
            return permission && permission.resource === resource && permission.action === action;
        });
        if (directPermission) {
            const permission = this.permissions.get(directPermission);
            if (permission && this.evaluateConditions(permission.conditions, context, userId)) {
                this.recordPermissionCheck(userId, resource, action, context, true);
                return true;
            }
        }
        // Buscar en roles
        for (const roleId of userPerms.roles) {
            const role = this.roles.get(roleId);
            if (role) {
                for (const permId of role.permissions) {
                    const permission = this.permissions.get(permId);
                    if (permission &&
                        permission.resource === resource &&
                        permission.action === action &&
                        this.evaluateConditions(permission.conditions, context, userId)) {
                        this.recordPermissionCheck(userId, resource, action, context, true);
                        return true;
                    }
                }
            }
        }
        // Buscar en permisos personalizados
        for (const permission of userPerms.customPermissions) {
            if (permission.resource === resource &&
                permission.action === action &&
                this.evaluateConditions(permission.conditions, context, userId)) {
                this.recordPermissionCheck(userId, resource, action, context, true);
                return true;
            }
        }
        this.recordPermissionCheck(userId, resource, action, context, false, 'Permission not found');
        return false;
    }
    // Evaluar condiciones de permiso
    evaluateConditions(conditions, context, userId) {
        if (!conditions || conditions.length === 0)
            return true;
        return conditions.every(condition => {
            switch (condition.type) {
                case 'field':
                    if (!condition.field || !context)
                        return false;
                    const fieldValue = this.getFieldValue(context, condition.field, userId);
                    return this.evaluateOperator(fieldValue, condition.operator, condition.value);
                case 'time':
                    return this.evaluateTimeCondition(condition);
                case 'location':
                    return this.evaluateLocationCondition(condition);
                case 'custom':
                    return this.evaluateCustomCondition(condition, context, userId);
                default:
                    return false;
            }
        });
    }
    // Obtener valor de campo
    getFieldValue(context, field, userId) {
        // Reemplazar variables de usuario
        if (field === '{{user.id}}')
            return userId;
        if (field === '{{user.role}}')
            return this.getUserRole(userId);
        // Obtener valor del contexto
        return context[field];
    }
    // Evaluar operador
    evaluateOperator(value, operator, expectedValue) {
        switch (operator) {
            case 'equals':
                return value === expectedValue;
            case 'not_equals':
                return value !== expectedValue;
            case 'contains':
                return String(value).includes(String(expectedValue));
            case 'greater_than':
                return Number(value) > Number(expectedValue);
            case 'less_than':
                return Number(value) < Number(expectedValue);
            case 'in':
                return Array.isArray(expectedValue) && expectedValue.includes(value);
            case 'not_in':
                return Array.isArray(expectedValue) && !expectedValue.includes(value);
            default:
                return false;
        }
    }
    // Evaluar condición de tiempo
    evaluateTimeCondition(condition) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();
        // Implementar lógica de tiempo según el valor
        return true; // Simplificado por ahora
    }
    // Evaluar condición de ubicación
    evaluateLocationCondition(condition) {
        // Implementar lógica de ubicación
        return true; // Simplificado por ahora
    }
    // Evaluar condición personalizada
    evaluateCustomCondition(condition, context, userId) {
        if (!condition.customFunction)
            return false;
        try {
            // En un entorno real, usar una función segura para evaluar
            const fn = new Function('context', 'userId', condition.customFunction);
            return fn(context, userId);
        }
        catch (error) {
            console.error('Error evaluating custom condition:', error);
            return false;
        }
    }
    // Registrar verificación de permiso
    recordPermissionCheck(userId, resource, action, context, result, reason) {
        const check = {
            userId,
            resource,
            action,
            context,
            result,
            reason,
            timestamp: new Date()
        };
        this.permissionChecks.push(check);
    }
    // Asignar rol a usuario
    assignRole(userId, roleId) {
        let userPerms = this.userPermissions.get(userId);
        if (!userPerms) {
            userPerms = {
                userId,
                roles: [],
                permissions: [],
                customPermissions: []
            };
            this.userPermissions.set(userId, userPerms);
        }
        if (!userPerms.roles.includes(roleId)) {
            userPerms.roles.push(roleId);
        }
    }
    // Remover rol de usuario
    removeRole(userId, roleId) {
        const userPerms = this.userPermissions.get(userId);
        if (userPerms) {
            userPerms.roles = userPerms.roles.filter(role => role !== roleId);
        }
    }
    // Asignar permiso directo a usuario
    assignPermission(userId, permissionId) {
        let userPerms = this.userPermissions.get(userId);
        if (!userPerms) {
            userPerms = {
                userId,
                roles: [],
                permissions: [],
                customPermissions: []
            };
            this.userPermissions.set(userId, userPerms);
        }
        if (!userPerms.permissions.includes(permissionId)) {
            userPerms.permissions.push(permissionId);
        }
    }
    // Remover permiso directo de usuario
    removePermission(userId, permissionId) {
        const userPerms = this.userPermissions.get(userId);
        if (userPerms) {
            userPerms.permissions = userPerms.permissions.filter(perm => perm !== permissionId);
        }
    }
    // Agregar permiso personalizado
    addCustomPermission(userId, permission) {
        let userPerms = this.userPermissions.get(userId);
        if (!userPerms) {
            userPerms = {
                userId,
                roles: [],
                permissions: [],
                customPermissions: []
            };
            this.userPermissions.set(userId, userPerms);
        }
        userPerms.customPermissions.push(permission);
    }
    // Obtener roles de usuario
    getUserRoles(userId) {
        const userPerms = this.userPermissions.get(userId);
        return userPerms ? userPerms.roles : [];
    }
    // Obtener permisos de usuario
    getUserPermissions(userId) {
        const userPerms = this.userPermissions.get(userId);
        return userPerms ? userPerms.permissions : [];
    }
    // Obtener todos los permisos efectivos de usuario
    getEffectivePermissions(userId) {
        const userPerms = this.userPermissions.get(userId);
        if (!userPerms)
            return [];
        const effectivePermissions = [];
        // Permisos directos
        userPerms.permissions.forEach(permId => {
            const permission = this.permissions.get(permId);
            if (permission) {
                effectivePermissions.push(permission);
            }
        });
        // Permisos de roles
        userPerms.roles.forEach(roleId => {
            const role = this.roles.get(roleId);
            if (role) {
                role.permissions.forEach(permId => {
                    const permission = this.permissions.get(permId);
                    if (permission && !effectivePermissions.find(p => p.id === permission.id)) {
                        effectivePermissions.push(permission);
                    }
                });
            }
        });
        // Permisos personalizados
        effectivePermissions.push(...userPerms.customPermissions);
        return effectivePermissions;
    }
    // Obtener rol del usuario
    getUserRole(userId) {
        const roles = this.getUserRoles(userId);
        return roles.length > 0 ? roles[0] : 'user';
    }
    // Crear nuevo permiso
    createPermission(permission) {
        this.permissions.set(permission.id, permission);
    }
    // Crear nuevo rol
    createRole(role) {
        this.roles.set(role.id, role);
    }
    // Obtener todos los permisos
    getAllPermissions() {
        return Array.from(this.permissions.values());
    }
    // Obtener todos los roles
    getAllRoles() {
        return Array.from(this.roles.values());
    }
    // Obtener historial de verificaciones de permisos
    getPermissionCheckHistory(filters) {
        let filteredChecks = [...this.permissionChecks];
        if (filters) {
            if (filters.userId) {
                filteredChecks = filteredChecks.filter(c => c.userId === filters.userId);
            }
            if (filters.resource) {
                filteredChecks = filteredChecks.filter(c => c.resource === filters.resource);
            }
            if (filters.action) {
                filteredChecks = filteredChecks.filter(c => c.action === filters.action);
            }
            if (filters.result !== undefined) {
                filteredChecks = filteredChecks.filter(c => c.result === filters.result);
            }
            if (filters.dateRange) {
                filteredChecks = filteredChecks.filter(c => c.timestamp >= filters.dateRange.start && c.timestamp <= filters.dateRange.end);
            }
        }
        return filteredChecks.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }
    // Habilitar/deshabilitar permission manager
    enable() {
        this.isEnabled = true;
    }
    disable() {
        this.isEnabled = false;
    }
    // Limpiar historial de verificaciones
    cleanup(maxAge = 30 * 24 * 60 * 60 * 1000) {
        const cutoff = new Date(Date.now() - maxAge);
        this.permissionChecks = this.permissionChecks.filter(check => check.timestamp >= cutoff);
    }
}
// Instancia global del permission manager
export const permissionManager = new PermissionManager();
// Hooks de React para gestión de permisos
export const usePermissionManager = () => {
    return {
        can: permissionManager.can.bind(permissionManager),
        assignRole: permissionManager.assignRole.bind(permissionManager),
        removeRole: permissionManager.removeRole.bind(permissionManager),
        assignPermission: permissionManager.assignPermission.bind(permissionManager),
        removePermission: permissionManager.removePermission.bind(permissionManager),
        addCustomPermission: permissionManager.addCustomPermission.bind(permissionManager),
        getUserRoles: permissionManager.getUserRoles.bind(permissionManager),
        getUserPermissions: permissionManager.getUserPermissions.bind(permissionManager),
        getEffectivePermissions: permissionManager.getEffectivePermissions.bind(permissionManager),
        createPermission: permissionManager.createPermission.bind(permissionManager),
        createRole: permissionManager.createRole.bind(permissionManager),
        getAllPermissions: permissionManager.getAllPermissions.bind(permissionManager),
        getAllRoles: permissionManager.getAllRoles.bind(permissionManager),
        getPermissionCheckHistory: permissionManager.getPermissionCheckHistory.bind(permissionManager),
        enable: permissionManager.enable.bind(permissionManager),
        disable: permissionManager.disable.bind(permissionManager),
        cleanup: permissionManager.cleanup.bind(permissionManager)
    };
};
