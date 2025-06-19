// Sistema de gestión de versiones
export interface Version {
  id: string;
  version: string;
  name: string;
  description: string;
  releaseDate: Date;
  type: 'major' | 'minor' | 'patch' | 'preview' | 'beta';
  status: 'draft' | 'testing' | 'released' | 'deprecated';
  changes: VersionChange[];
  compatibility: CompatibilityInfo;
  metadata?: Record<string, any>;
}

export interface VersionChange {
  id: string;
  type: 'feature' | 'bugfix' | 'improvement' | 'breaking' | 'security';
  title: string;
  description: string;
  component?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  ticketId?: string;
}

export interface CompatibilityInfo {
  minVersion: string;
  maxVersion?: string;
  breakingChanges: string[];
  migrationGuide?: string;
  deprecatedFeatures: string[];
}

export interface VersionDeployment {
  id: string;
  versionId: string;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'rolled_back';
  startedAt: Date;
  completedAt?: Date;
  deployedBy: string;
  rollbackTo?: string;
  logs: DeploymentLog[];
}

export interface DeploymentLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, any>;
}

export interface VersionMigration {
  id: string;
  fromVersion: string;
  toVersion: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  steps: MigrationStep[];
  dataBackup?: string;
}

export interface MigrationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

class VersionManager {
  private versions: Map<string, Version> = new Map();
  private deployments: Map<string, VersionDeployment> = new Map();
  private migrations: Map<string, VersionMigration> = new Map();
  private currentVersion: string = '1.0.0';
  private isEnabled = true;

  // Inicializar versiones del sistema
  initialize(): void {
    this.loadVersionHistory();
    this.setCurrentVersion();
  }

  // Cargar historial de versiones
  private loadVersionHistory(): void {
    const versionHistory: Version[] = [
      {
        id: 'v1.0.0',
        version: '1.0.0',
        name: 'Versión Inicial',
        description: 'Primera versión del sistema de gestión de franquicias McDonald\'s',
        releaseDate: new Date('2024-01-01'),
        type: 'major',
        status: 'released',
        changes: [
          {
            id: 'feat-001',
            type: 'feature',
            title: 'Sistema de autenticación',
            description: 'Implementación del sistema de autenticación con Supabase',
            component: 'auth',
            priority: 'high'
          },
          {
            id: 'feat-002',
            type: 'feature',
            title: 'Dashboard principal',
            description: 'Dashboard con métricas y resumen de restaurantes',
            component: 'dashboard',
            priority: 'high'
          },
          {
            id: 'feat-003',
            type: 'feature',
            title: 'Gestión de restaurantes',
            description: 'CRUD completo para gestión de restaurantes',
            component: 'restaurants',
            priority: 'high'
          },
          {
            id: 'feat-004',
            type: 'feature',
            title: 'Valoración DCF',
            description: 'Sistema de valoración financiera DCF',
            component: 'valuations',
            priority: 'high'
          }
        ],
        compatibility: {
          minVersion: '1.0.0',
          breakingChanges: [],
          deprecatedFeatures: []
        }
      },
      {
        id: 'v1.1.0',
        version: '1.1.0',
        name: 'Mejoras de Performance',
        description: 'Mejoras significativas en performance y experiencia de usuario',
        releaseDate: new Date('2024-02-01'),
        type: 'minor',
        status: 'released',
        changes: [
          {
            id: 'perf-001',
            type: 'improvement',
            title: 'Optimización de consultas',
            description: 'Optimización de consultas a la base de datos',
            component: 'database',
            priority: 'medium'
          },
          {
            id: 'feat-005',
            type: 'feature',
            title: 'Sistema de caché',
            description: 'Implementación de sistema de caché inteligente',
            component: 'cache',
            priority: 'medium'
          },
          {
            id: 'feat-006',
            type: 'feature',
            title: 'Lazy loading',
            description: 'Implementación de lazy loading para componentes',
            component: 'performance',
            priority: 'medium'
          }
        ],
        compatibility: {
          minVersion: '1.0.0',
          breakingChanges: [],
          deprecatedFeatures: []
        }
      },
      {
        id: 'v1.2.0',
        version: '1.2.0',
        name: 'Sistema de Presupuestos',
        description: 'Nuevo sistema completo de gestión de presupuestos',
        releaseDate: new Date('2024-03-01'),
        type: 'minor',
        status: 'released',
        changes: [
          {
            id: 'feat-007',
            type: 'feature',
            title: 'Gestión de presupuestos',
            description: 'Sistema completo de creación y gestión de presupuestos',
            component: 'budgets',
            priority: 'high'
          },
          {
            id: 'feat-008',
            type: 'feature',
            title: 'Reportes financieros',
            description: 'Generación de reportes financieros automáticos',
            component: 'reports',
            priority: 'medium'
          },
          {
            id: 'feat-009',
            type: 'feature',
            title: 'Exportación de datos',
            description: 'Exportación a Excel y PDF',
            component: 'export',
            priority: 'low'
          }
        ],
        compatibility: {
          minVersion: '1.0.0',
          breakingChanges: [],
          deprecatedFeatures: []
        }
      },
      {
        id: 'v2.0.0',
        version: '2.0.0',
        name: 'Arquitectura de Microservicios',
        description: 'Migración a arquitectura de microservicios y nuevas funcionalidades',
        releaseDate: new Date('2024-04-01'),
        type: 'major',
        status: 'released',
        changes: [
          {
            id: 'arch-001',
            type: 'breaking',
            title: 'Migración a microservicios',
            description: 'Refactorización completa a arquitectura de microservicios',
            component: 'architecture',
            priority: 'critical'
          },
          {
            id: 'feat-010',
            type: 'feature',
            title: 'Sistema de notificaciones',
            description: 'Sistema avanzado de notificaciones en tiempo real',
            component: 'notifications',
            priority: 'high'
          },
          {
            id: 'feat-011',
            type: 'feature',
            title: 'Asistente de IA',
            description: 'Asistente de IA integrado para análisis financiero',
            component: 'ai',
            priority: 'high'
          },
          {
            id: 'feat-012',
            type: 'feature',
            title: 'PWA',
            description: 'Progressive Web App con funcionalidad offline',
            component: 'pwa',
            priority: 'medium'
          }
        ],
        compatibility: {
          minVersion: '2.0.0',
          breakingChanges: [
            'Cambio en la estructura de la API',
            'Nuevos endpoints requeridos',
            'Cambios en el formato de datos'
          ],
          deprecatedFeatures: [
            'API endpoints v1',
            'Componentes legacy'
          ],
          migrationGuide: 'docs/migration-v2.md'
        }
      }
    ];

    versionHistory.forEach(version => {
      this.versions.set(version.id, version);
    });
  }

  // Establecer versión actual
  private setCurrentVersion(): void {
    this.currentVersion = '2.0.0';
  }

  // Crear nueva versión
  createVersion(version: Omit<Version, 'id' | 'releaseDate'>): string {
    const versionId = `v${version.version}`;
    
    const newVersion: Version = {
      id: versionId,
      releaseDate: new Date(),
      ...version
    };

    this.versions.set(versionId, newVersion);
    return versionId;
  }

  // Actualizar versión
  updateVersion(versionId: string, updates: Partial<Version>): void {
    const version = this.versions.get(versionId);
    if (version) {
      this.versions.set(versionId, { ...version, ...updates });
    }
  }

  // Obtener versión
  getVersion(versionId: string): Version | undefined {
    return this.versions.get(versionId);
  }

  // Obtener todas las versiones
  getAllVersions(): Version[] {
    return Array.from(this.versions.values()).sort((a, b) => 
      this.compareVersions(b.version, a.version)
    );
  }

  // Obtener versión actual
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  // Comparar versiones
  compareVersions(version1: string, version2: string): number {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1 = v1Parts[i] || 0;
      const v2 = v2Parts[i] || 0;
      
      if (v1 > v2) return 1;
      if (v1 < v2) return -1;
    }
    
    return 0;
  }

  // Verificar compatibilidad
  isCompatible(targetVersion: string, currentVersion: string): boolean {
    const target = this.versions.get(`v${targetVersion}`);
    if (!target) return false;

    const comparison = this.compareVersions(currentVersion, target.compatibility.minVersion);
    return comparison >= 0;
  }

  // Obtener cambios entre versiones
  getChangesBetweenVersions(fromVersion: string, toVersion: string): VersionChange[] {
    const from = this.versions.get(`v${fromVersion}`);
    const to = this.versions.get(`v${toVersion}`);
    
    if (!from || !to) return [];

    const fromIndex = this.getVersionIndex(fromVersion);
    const toIndex = this.getVersionIndex(toVersion);
    
    if (fromIndex === -1 || toIndex === -1) return [];

    const changes: VersionChange[] = [];
    
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const version = this.getAllVersions()[i];
      if (version) {
        changes.push(...version.changes);
      }
    }

    return changes;
  }

  // Obtener índice de versión
  private getVersionIndex(version: string): number {
    const versions = this.getAllVersions();
    return versions.findIndex(v => v.version === version);
  }

  // Iniciar deployment
  startDeployment(versionId: string, environment: string, deployedBy: string): string {
    const version = this.versions.get(versionId);
    if (!version) {
      throw new Error(`Version ${versionId} not found`);
    }

    const deploymentId = `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const deployment: VersionDeployment = {
      id: deploymentId,
      versionId,
      environment: environment as any,
      status: 'pending',
      startedAt: new Date(),
      deployedBy,
      logs: []
    };

    this.deployments.set(deploymentId, deployment);

    // Iniciar proceso de deployment
    this.processDeployment(deploymentId);

    return deploymentId;
  }

  // Procesar deployment
  private async processDeployment(deploymentId: string): Promise<void> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    try {
      deployment.status = 'in_progress';
      this.addDeploymentLog(deploymentId, 'info', 'Deployment started');

      // Simular pasos de deployment
      await this.deployStep(deploymentId, 'Backup database');
      await this.deployStep(deploymentId, 'Deploy new version');
      await this.deployStep(deploymentId, 'Run migrations');
      await this.deployStep(deploymentId, 'Update configuration');
      await this.deployStep(deploymentId, 'Health checks');

      deployment.status = 'completed';
      deployment.completedAt = new Date();
      this.addDeploymentLog(deploymentId, 'info', 'Deployment completed successfully');

    } catch (error) {
      deployment.status = 'failed';
      deployment.completedAt = new Date();
      this.addDeploymentLog(deploymentId, 'error', `Deployment failed: ${error}`);
    }
  }

  // Ejecutar paso de deployment
  private async deployStep(deploymentId: string, step: string): Promise<void> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    this.addDeploymentLog(deploymentId, 'info', `Executing: ${step}`);
    
    // Simular tiempo de ejecución
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.addDeploymentLog(deploymentId, 'info', `Completed: ${step}`);
  }

  // Agregar log de deployment
  private addDeploymentLog(deploymentId: string, level: string, message: string, details?: Record<string, any>): void {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    const log: DeploymentLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level: level as any,
      message,
      details
    };

    deployment.logs.push(log);
  }

  // Rollback deployment
  rollbackDeployment(deploymentId: string, rollbackTo: string): void {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) return;

    deployment.status = 'rolled_back';
    deployment.rollbackTo = rollbackTo;
    deployment.completedAt = new Date();
    
    this.addDeploymentLog(deploymentId, 'info', `Rollback to version ${rollbackTo}`);
  }

  // Obtener deployment
  getDeployment(deploymentId: string): VersionDeployment | undefined {
    return this.deployments.get(deploymentId);
  }

  // Obtener deployments por versión
  getDeploymentsByVersion(versionId: string): VersionDeployment[] {
    return Array.from(this.deployments.values()).filter(d => d.versionId === versionId);
  }

  // Iniciar migración
  startMigration(fromVersion: string, toVersion: string): string {
    const migrationId = `migration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const migration: VersionMigration = {
      id: migrationId,
      fromVersion,
      toVersion,
      status: 'pending',
      startedAt: new Date(),
      steps: this.generateMigrationSteps(fromVersion, toVersion)
    };

    this.migrations.set(migrationId, migration);

    // Iniciar proceso de migración
    this.processMigration(migrationId);

    return migrationId;
  }

  // Generar pasos de migración
  private generateMigrationSteps(fromVersion: string, toVersion: string): MigrationStep[] {
    const steps: MigrationStep[] = [
      {
        id: 'backup',
        name: 'Backup de datos',
        description: 'Crear backup completo de la base de datos',
        status: 'pending'
      },
      {
        id: 'schema',
        name: 'Actualizar esquema',
        description: 'Actualizar esquema de la base de datos',
        status: 'pending'
      },
      {
        id: 'data',
        name: 'Migrar datos',
        description: 'Migrar datos al nuevo formato',
        status: 'pending'
      },
      {
        id: 'config',
        name: 'Actualizar configuración',
        description: 'Actualizar archivos de configuración',
        status: 'pending'
      },
      {
        id: 'verify',
        name: 'Verificar migración',
        description: 'Verificar que la migración fue exitosa',
        status: 'pending'
      }
    ];

    return steps;
  }

  // Procesar migración
  private async processMigration(migrationId: string): Promise<void> {
    const migration = this.migrations.get(migrationId);
    if (!migration) return;

    try {
      migration.status = 'in_progress';

      for (const step of migration.steps) {
        step.status = 'running';
        step.startedAt = new Date();

        // Simular ejecución del paso
        await new Promise(resolve => setTimeout(resolve, 2000));

        step.status = 'completed';
        step.completedAt = new Date();
      }

      migration.status = 'completed';
      migration.completedAt = new Date();

    } catch (error) {
      migration.status = 'failed';
      migration.completedAt = new Date();
      
      // Marcar paso actual como fallido
      const currentStep = migration.steps.find(s => s.status === 'running');
      if (currentStep) {
        currentStep.status = 'failed';
        currentStep.error = error instanceof Error ? error.message : String(error);
      }
    }
  }

  // Obtener migración
  getMigration(migrationId: string): VersionMigration | undefined {
    return this.migrations.get(migrationId);
  }

  // Obtener todas las migraciones
  getAllMigrations(): VersionMigration[] {
    return Array.from(this.migrations.values()).sort((a, b) => 
      b.startedAt.getTime() - a.startedAt.getTime()
    );
  }

  // Generar changelog
  generateChangelog(fromVersion?: string, toVersion?: string): string {
    const versions = this.getAllVersions();
    let relevantVersions = versions;

    if (fromVersion && toVersion) {
      const fromIndex = versions.findIndex(v => v.version === fromVersion);
      const toIndex = versions.findIndex(v => v.version === toVersion);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        relevantVersions = versions.slice(fromIndex, toIndex + 1);
      }
    }

    let changelog = '# Changelog\n\n';

    relevantVersions.forEach(version => {
      changelog += `## ${version.version} - ${version.name}\n\n`;
      changelog += `**Fecha:** ${version.releaseDate.toLocaleDateString()}\n\n`;
      changelog += `${version.description}\n\n`;

      // Agrupar cambios por tipo
      const changesByType: Record<string, VersionChange[]> = {};
      version.changes.forEach(change => {
        if (!changesByType[change.type]) {
          changesByType[change.type] = [];
        }
        changesByType[change.type].push(change);
      });

      Object.keys(changesByType).forEach(type => {
        const changes = changesByType[type];
        changelog += `### ${this.getChangeTypeLabel(type)}\n\n`;
        
        changes.forEach(change => {
          changelog += `- **${change.title}** - ${change.description}\n`;
          if (change.component) {
            changelog += `  - Componente: ${change.component}\n`;
          }
        });
        
        changelog += '\n';
      });

      if (version.compatibility.breakingChanges.length > 0) {
        changelog += '### ⚠️ Cambios Breaking\n\n';
        version.compatibility.breakingChanges.forEach(change => {
          changelog += `- ${change}\n`;
        });
        changelog += '\n';
      }

      changelog += '---\n\n';
    });

    return changelog;
  }

  // Obtener etiqueta de tipo de cambio
  private getChangeTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      feature: '✨ Nuevas Funcionalidades',
      bugfix: '🐛 Correcciones de Bugs',
      improvement: '⚡ Mejoras',
      breaking: '💥 Cambios Breaking',
      security: '🔒 Seguridad'
    };

    return labels[type] || type;
  }

  // Habilitar/deshabilitar version manager
  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Limpiar datos antiguos
  cleanup(maxAge: number = 365 * 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    
    // Limpiar deployments antiguos
    this.deployments.forEach((deployment, id) => {
      if (deployment.completedAt && deployment.completedAt < cutoff) {
        this.deployments.delete(id);
      }
    });

    // Limpiar migraciones antiguas
    this.migrations.forEach((migration, id) => {
      if (migration.completedAt && migration.completedAt < cutoff) {
        this.migrations.delete(id);
      }
    });
  }
}

// Instancia global del version manager
export const versionManager = new VersionManager();

// Hooks de React para gestión de versiones
export const useVersionManager = () => {
  return {
    createVersion: versionManager.createVersion.bind(versionManager),
    updateVersion: versionManager.updateVersion.bind(versionManager),
    getVersion: versionManager.getVersion.bind(versionManager),
    getAllVersions: versionManager.getAllVersions.bind(versionManager),
    getCurrentVersion: versionManager.getCurrentVersion.bind(versionManager),
    compareVersions: versionManager.compareVersions.bind(versionManager),
    isCompatible: versionManager.isCompatible.bind(versionManager),
    getChangesBetweenVersions: versionManager.getChangesBetweenVersions.bind(versionManager),
    startDeployment: versionManager.startDeployment.bind(versionManager),
    rollbackDeployment: versionManager.rollbackDeployment.bind(versionManager),
    getDeployment: versionManager.getDeployment.bind(versionManager),
    getDeploymentsByVersion: versionManager.getDeploymentsByVersion.bind(versionManager),
    startMigration: versionManager.startMigration.bind(versionManager),
    getMigration: versionManager.getMigration.bind(versionManager),
    getAllMigrations: versionManager.getAllMigrations.bind(versionManager),
    generateChangelog: versionManager.generateChangelog.bind(versionManager),
    enable: versionManager.enable.bind(versionManager),
    disable: versionManager.disable.bind(versionManager),
    cleanup: versionManager.cleanup.bind(versionManager)
  };
}; 