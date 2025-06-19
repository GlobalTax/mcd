// Sistema de backup y recuperación de datos
export interface BackupData {
  id: string;
  timestamp: Date;
  type: 'full' | 'incremental' | 'differential';
  size: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  metadata: Record<string, any>;
  downloadUrl?: string;
}

export interface RestorePoint {
  id: string;
  timestamp: Date;
  description: string;
  data: any;
  version: string;
}

class BackupManager {
  private backups: BackupData[] = [];
  private restorePoints: RestorePoint[] = [];
  private isEnabled = true;

  // Crear backup completo
  async createFullBackup(): Promise<BackupData> {
    if (!this.isEnabled) throw new Error('Backup manager is disabled');

    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const backup: BackupData = {
      id: backupId,
      timestamp: new Date(),
      type: 'full',
      size: 0,
      status: 'pending',
      metadata: {}
    };

    this.backups.push(backup);

    try {
      backup.status = 'in_progress';
      
      // Obtener todos los datos de la aplicación
      const data = await this.collectAllData();
      
      // Comprimir y almacenar datos
      const compressedData = await this.compressData(data);
      backup.size = compressedData.length;
      
      // Guardar en almacenamiento local
      await this.saveToLocalStorage(backupId, compressedData);
      
      // Enviar a servidor remoto si está configurado
      if (this.isRemoteBackupEnabled()) {
        await this.saveToRemoteStorage(backupId, compressedData);
        backup.downloadUrl = await this.getRemoteDownloadUrl(backupId);
      }
      
      backup.status = 'completed';
      backup.metadata = {
        dataTypes: Object.keys(data),
        recordCount: this.getRecordCount(data),
        compressionRatio: this.calculateCompressionRatio(data, compressedData)
      };
      
    } catch (error) {
      backup.status = 'failed';
      backup.metadata = { error: error instanceof Error ? error.message : String(error) };
      throw error;
    }

    return backup;
  }

  // Crear backup incremental
  async createIncrementalBackup(lastBackupId?: string): Promise<BackupData> {
    if (!this.isEnabled) throw new Error('Backup manager is disabled');

    const backupId = `backup_inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const backup: BackupData = {
      id: backupId,
      timestamp: new Date(),
      type: 'incremental',
      size: 0,
      status: 'pending',
      metadata: { lastBackupId }
    };

    this.backups.push(backup);

    try {
      backup.status = 'in_progress';
      
      // Obtener solo los cambios desde el último backup
      const changes = await this.collectChanges(lastBackupId);
      
      if (Object.keys(changes).length === 0) {
        backup.status = 'completed';
        backup.metadata = { message: 'No changes detected' };
        return backup;
      }
      
      // Comprimir y almacenar cambios
      const compressedData = await this.compressData(changes);
      backup.size = compressedData.length;
      
      // Guardar cambios
      await this.saveToLocalStorage(backupId, compressedData);
      
      if (this.isRemoteBackupEnabled()) {
        await this.saveToRemoteStorage(backupId, compressedData);
        backup.downloadUrl = await this.getRemoteDownloadUrl(backupId);
      }
      
      backup.status = 'completed';
      backup.metadata = {
        changes: Object.keys(changes),
        recordCount: this.getRecordCount(changes),
        compressionRatio: this.calculateCompressionRatio(changes, compressedData)
      };
      
    } catch (error) {
      backup.status = 'failed';
      backup.metadata = { error: error instanceof Error ? error.message : String(error) };
      throw error;
    }

    return backup;
  }

  // Restaurar desde backup
  async restoreFromBackup(backupId: string): Promise<void> {
    if (!this.isEnabled) throw new Error('Backup manager is disabled');

    const backup = this.backups.find(b => b.id === backupId);
    if (!backup) throw new Error(`Backup ${backupId} not found`);

    if (backup.status !== 'completed') {
      throw new Error(`Backup ${backupId} is not completed`);
    }

    try {
      // Cargar datos del backup
      let compressedData: string;
      
      if (backup.downloadUrl) {
        compressedData = await this.loadFromRemoteStorage(backupId);
      } else {
        compressedData = await this.loadFromLocalStorage(backupId);
      }
      
      // Descomprimir datos
      const data = await this.decompressData(compressedData);
      
      // Crear punto de restauración antes de aplicar cambios
      await this.createRestorePoint('Before backup restoration', data);
      
      // Aplicar datos restaurados
      await this.applyRestoredData(data);
      
      console.log(`Successfully restored from backup ${backupId}`);
      
    } catch (error) {
      console.error(`Failed to restore from backup ${backupId}:`, error);
      throw error;
    }
  }

  // Crear punto de restauración
  async createRestorePoint(description: string, data?: any): Promise<RestorePoint> {
    if (!this.isEnabled) throw new Error('Backup manager is disabled');

    const restorePoint: RestorePoint = {
      id: `restore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      description,
      data: data || await this.collectAllData(),
      version: this.getAppVersion()
    };

    this.restorePoints.push(restorePoint);
    
    // Guardar en localStorage
    localStorage.setItem(`restore_point_${restorePoint.id}`, JSON.stringify(restorePoint));
    
    return restorePoint;
  }

  // Restaurar desde punto de restauración
  async restoreFromPoint(restorePointId: string): Promise<void> {
    if (!this.isEnabled) throw new Error('Backup manager is disabled');

    const restorePoint = this.restorePoints.find(rp => rp.id === restorePointId);
    if (!restorePoint) {
      // Intentar cargar desde localStorage
      const stored = localStorage.getItem(`restore_point_${restorePointId}`);
      if (!stored) throw new Error(`Restore point ${restorePointId} not found`);
      
      const parsed = JSON.parse(stored);
      await this.applyRestoredData(parsed.data);
    } else {
      await this.applyRestoredData(restorePoint.data);
    }
  }

  // Obtener lista de backups
  getBackups(): BackupData[] {
    return [...this.backups].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Obtener lista de puntos de restauración
  getRestorePoints(): RestorePoint[] {
    return [...this.restorePoints].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Eliminar backup
  async deleteBackup(backupId: string): Promise<void> {
    const backupIndex = this.backups.findIndex(b => b.id === backupId);
    if (backupIndex === -1) throw new Error(`Backup ${backupId} not found`);

    try {
      // Eliminar de almacenamiento local
      await this.deleteFromLocalStorage(backupId);
      
      // Eliminar de almacenamiento remoto
      if (this.isRemoteBackupEnabled()) {
        await this.deleteFromRemoteStorage(backupId);
      }
      
      // Eliminar de la lista
      this.backups.splice(backupIndex, 1);
      
    } catch (error) {
      console.error(`Failed to delete backup ${backupId}:`, error);
      throw error;
    }
  }

  // Programar backups automáticos
  scheduleAutomaticBackups(interval: 'daily' | 'weekly' | 'monthly'): void {
    if (!this.isEnabled) return;

    const intervals = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000
    };

    setInterval(async () => {
      try {
        await this.createIncrementalBackup();
        console.log('Automatic backup completed successfully');
      } catch (error) {
        console.error('Automatic backup failed:', error);
      }
    }, intervals[interval]);
  }

  // Métodos privados
  private async collectAllData(): Promise<Record<string, any>> {
    const data: Record<string, any> = {};
    
    // Recopilar datos de localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          data[`localStorage_${key}`] = localStorage.getItem(key);
        } catch (error) {
          console.warn(`Failed to backup localStorage key ${key}:`, error);
        }
      }
    }
    
    // Recopilar datos de sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        try {
          data[`sessionStorage_${key}`] = sessionStorage.getItem(key);
        } catch (error) {
          console.warn(`Failed to backup sessionStorage key ${key}:`, error);
        }
      }
    }
    
    // Recopilar datos de IndexedDB si está disponible
    if ('indexedDB' in window) {
      try {
        data.indexedDB = await this.collectIndexedDBData();
      } catch (error) {
        console.warn('Failed to backup IndexedDB data:', error);
      }
    }
    
    return data;
  }

  private async collectChanges(lastBackupId?: string): Promise<Record<string, any>> {
    // Implementar lógica para detectar cambios desde el último backup
    // Por ahora, retornar datos completos
    return await this.collectAllData();
  }

  private async compressData(data: any): Promise<string> {
    // Usar compresión simple (base64) por ahora
    // En producción, usar algoritmos de compresión más avanzados
    return btoa(JSON.stringify(data));
  }

  private async decompressData(compressedData: string): Promise<any> {
    return JSON.parse(atob(compressedData));
  }

  private async saveToLocalStorage(key: string, data: string): Promise<void> {
    localStorage.setItem(`backup_${key}`, data);
  }

  private async loadFromLocalStorage(key: string): Promise<string> {
    const data = localStorage.getItem(`backup_${key}`);
    if (!data) throw new Error(`Backup data not found for key ${key}`);
    return data;
  }

  private async deleteFromLocalStorage(key: string): Promise<void> {
    localStorage.removeItem(`backup_${key}`);
  }

  private async saveToRemoteStorage(key: string, data: string): Promise<void> {
    // Implementar guardado en servidor remoto
    console.log(`Saving backup ${key} to remote storage`);
  }

  private async loadFromRemoteStorage(key: string): Promise<string> {
    // Implementar carga desde servidor remoto
    throw new Error('Remote storage not implemented');
  }

  private async deleteFromRemoteStorage(key: string): Promise<void> {
    // Implementar eliminación en servidor remoto
    console.log(`Deleting backup ${key} from remote storage`);
  }

  private async getRemoteDownloadUrl(key: string): Promise<string> {
    // Implementar generación de URL de descarga
    return `https://api.example.com/backups/${key}/download`;
  }

  private isRemoteBackupEnabled(): boolean {
    return false; // Cambiar a true cuando se implemente
  }

  private async collectIndexedDBData(): Promise<any> {
    // Implementar recopilación de datos de IndexedDB
    return {};
  }

  private async applyRestoredData(data: any): Promise<void> {
    // Limpiar datos existentes
    localStorage.clear();
    sessionStorage.clear();
    
    // Aplicar datos restaurados
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('localStorage_')) {
        const actualKey = key.replace('localStorage_', '');
        localStorage.setItem(actualKey, value as string);
      } else if (key.startsWith('sessionStorage_')) {
        const actualKey = key.replace('sessionStorage_', '');
        sessionStorage.setItem(actualKey, value as string);
      }
    }
  }

  private getRecordCount(data: any): number {
    return Object.keys(data).length;
  }

  private calculateCompressionRatio(original: any, compressed: string): number {
    const originalSize = JSON.stringify(original).length;
    const compressedSize = compressed.length;
    return originalSize > 0 ? (compressedSize / originalSize) * 100 : 0;
  }

  private getAppVersion(): string {
    return '1.0.0'; // Obtener de package.json
  }

  // Habilitar/deshabilitar backup manager
  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Limpiar backups antiguos
  cleanupOldBackups(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);
    this.backups = this.backups.filter(backup => backup.timestamp >= cutoff);
  }
}

// Instancia global del backup manager
export const backupManager = new BackupManager();

// Hooks de React para backup
export const useBackupManager = () => {
  return {
    createFullBackup: backupManager.createFullBackup.bind(backupManager),
    createIncrementalBackup: backupManager.createIncrementalBackup.bind(backupManager),
    restoreFromBackup: backupManager.restoreFromBackup.bind(backupManager),
    createRestorePoint: backupManager.createRestorePoint.bind(backupManager),
    restoreFromPoint: backupManager.restoreFromPoint.bind(backupManager),
    getBackups: backupManager.getBackups.bind(backupManager),
    getRestorePoints: backupManager.getRestorePoints.bind(backupManager),
    deleteBackup: backupManager.deleteBackup.bind(backupManager),
    scheduleAutomaticBackups: backupManager.scheduleAutomaticBackups.bind(backupManager),
    enable: backupManager.enable.bind(backupManager),
    disable: backupManager.disable.bind(backupManager),
    cleanupOldBackups: backupManager.cleanupOldBackups.bind(backupManager)
  };
}; 