export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
  accessCount: number;
  lastAccessed: number;
}

export interface CacheOptions {
  ttl?: number; // Default TTL in milliseconds
  maxSize?: number; // Maximum number of entries
  enableCompression?: boolean;
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  expiredEntries: number;
  hitRate: number;
}

class Cache {
  private cache = new Map<string, CacheEntry>();
  private options: Required<CacheOptions>;
  private compressionEnabled: boolean;
  private hitCount = 0;
  private missCount = 0;

  constructor(options: CacheOptions = {}) {
    this.options = {
      ttl: options.ttl || 5 * 60 * 1000, // 5 minutos por defecto
      maxSize: options.maxSize || 1000,
      enableCompression: options.enableCompression || false,
    };
    this.compressionEnabled = this.options.enableCompression;
  }

  private generateKey(key: string): string {
    return `cache_${key}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private compress(data: any): string {
    if (!this.compressionEnabled) {
      return JSON.stringify(data);
    }
    
    // Implementación básica de compresión
    const jsonString = JSON.stringify(data);
    return btoa(jsonString); // Base64 encoding como compresión básica
  }

  private decompress(compressedData: string): any {
    if (!this.compressionEnabled) {
      return JSON.parse(compressedData);
    }
    
    try {
      const jsonString = atob(compressedData); // Base64 decoding
      return JSON.parse(jsonString);
    } catch (error) {
      // Si falla la descompresión, intentar parsear como JSON normal
      return JSON.parse(compressedData);
    }
  }

  private evictLRU(): void {
    if (this.cache.size < this.options.maxSize) return;

    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    this.cache.forEach((entry, key) => {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    });

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cleanup();
    this.evictLRU();

    const cacheKey = this.generateKey(key);
    const entry: CacheEntry<T> = {
      data: this.compressionEnabled ? this.compress(data) as any : data,
      timestamp: Date.now(),
      ttl: ttl || this.options.ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    this.cache.set(cacheKey, entry);
  }

  get<T>(key: string): T | null {
    this.cleanup();

    const cacheKey = this.generateKey(key);
    const entry = this.cache.get(cacheKey) as CacheEntry<T> | undefined;

    if (!entry || this.isExpired(entry)) {
      if (entry) {
        this.cache.delete(cacheKey);
      }
      this.missCount++;
      return null;
    }

    // Actualizar estadísticas de acceso
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hitCount++;

    // Descomprimir si es necesario
    if (this.compressionEnabled) {
      return this.decompress(entry.data as any);
    }

    return entry.data;
  }

  has(key: string): boolean {
    this.cleanup();
    const cacheKey = this.generateKey(key);
    const entry = this.cache.get(cacheKey);
    return entry !== undefined && !this.isExpired(entry);
  }

  delete(key: string): boolean {
    const cacheKey = this.generateKey(key);
    return this.cache.delete(cacheKey);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    this.cleanup();
    return this.cache.size;
  }

  keys(): string[] {
    this.cleanup();
    return Array.from(this.cache.keys()).map(key => key.replace('cache_', ''));
  }

  // Métodos para caché específico por tipo
  setUserData<T>(userId: string, data: T, ttl?: number): void {
    this.set(`user_${userId}`, data, ttl);
  }

  getUserData<T>(userId: string): T | null {
    return this.get<T>(`user_${userId}`);
  }

  setRestaurantData<T>(restaurantId: string, data: T, ttl?: number): void {
    this.set(`restaurant_${restaurantId}`, data, ttl);
  }

  getRestaurantData<T>(restaurantId: string): T | null {
    return this.get<T>(`restaurant_${restaurantId}`);
  }

  setValuationData<T>(valuationId: string, data: T, ttl?: number): void {
    this.set(`valuation_${valuationId}`, data, ttl);
  }

  getValuationData<T>(valuationId: string): T | null {
    return this.get<T>(`valuation_${valuationId}`);
  }

  // Métodos para caché de API
  setApiResponse<T>(endpoint: string, params: any, data: T, ttl?: number): void {
    const key = `api_${endpoint}_${JSON.stringify(params)}`;
    this.set(key, data, ttl);
  }

  getApiResponse<T>(endpoint: string, params: any): T | null {
    const key = `api_${endpoint}_${JSON.stringify(params)}`;
    return this.get<T>(key);
  }

  // Métodos para estadísticas
  getStats(): CacheStats {
    this.cleanup();
    
    let totalSize = 0;
    let expiredCount = 0;
    const now = Date.now();
    
    this.cache.forEach(entry => {
      totalSize += JSON.stringify(entry.data).length;
      if (this.isExpired(entry)) {
        expiredCount++;
      }
    });
    
    return {
      totalEntries: this.cache.size,
      totalSize,
      expiredEntries: expiredCount,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0
    };
  }

  // Exportar caché
  export(): Record<string, any> {
    const exported: Record<string, any> = {};
    this.cache.forEach((entry, key) => {
      exported[key] = {
        data: entry.data,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed
      };
    });
    return exported;
  }

  // Importar caché
  import(data: Record<string, any>): void {
    Object.keys(data).forEach(key => {
      const entry = data[key];
      this.cache.set(key, {
        data: entry.data,
        timestamp: entry.timestamp,
        ttl: entry.ttl,
        accessCount: entry.accessCount,
        lastAccessed: entry.lastAccessed
      });
    });
  }
}

// Instancia global del caché
export const mainCache = new Cache();

// Hook para usar el caché
export const useCache = () => {
  return mainCache;
};

// Función helper para caché con async
export const withCache = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  cache: Cache = mainCache,
  ttl?: number
): Promise<T> => {
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetcher();
  cache.set(key, data, ttl);
  return data;
};

// Función para invalidar caché por patrón
export const invalidateCacheByPattern = (pattern: string, cache: Cache = mainCache): void => {
  const regex = new RegExp(pattern);
  const keysToDelete: string[] = [];
  
  cache.keys().forEach(key => {
    if (regex.test(key)) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => cache.delete(key));
}; 