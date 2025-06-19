class Cache {
    constructor(options = {}) {
        this.cache = new Map();
        this.hitCount = 0;
        this.missCount = 0;
        this.options = {
            ttl: options.ttl || 5 * 60 * 1000, // 5 minutos por defecto
            maxSize: options.maxSize || 1000,
            enableCompression: options.enableCompression || false,
        };
        this.compressionEnabled = this.options.enableCompression;
    }
    generateKey(key) {
        return `cache_${key}`;
    }
    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    compress(data) {
        if (!this.compressionEnabled) {
            return JSON.stringify(data);
        }
        // Implementación básica de compresión
        const jsonString = JSON.stringify(data);
        return btoa(jsonString); // Base64 encoding como compresión básica
    }
    decompress(compressedData) {
        if (!this.compressionEnabled) {
            return JSON.parse(compressedData);
        }
        try {
            const jsonString = atob(compressedData); // Base64 decoding
            return JSON.parse(jsonString);
        }
        catch (error) {
            // Si falla la descompresión, intentar parsear como JSON normal
            return JSON.parse(compressedData);
        }
    }
    evictLRU() {
        if (this.cache.size < this.options.maxSize)
            return;
        let oldestKey = null;
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
    cleanup() {
        const now = Date.now();
        const keysToDelete = [];
        this.cache.forEach((entry, key) => {
            if (this.isExpired(entry)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }
    set(key, data, ttl) {
        this.cleanup();
        this.evictLRU();
        const cacheKey = this.generateKey(key);
        const entry = {
            data: this.compressionEnabled ? this.compress(data) : data,
            timestamp: Date.now(),
            ttl: ttl || this.options.ttl,
            accessCount: 0,
            lastAccessed: Date.now(),
        };
        this.cache.set(cacheKey, entry);
    }
    get(key) {
        this.cleanup();
        const cacheKey = this.generateKey(key);
        const entry = this.cache.get(cacheKey);
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
            return this.decompress(entry.data);
        }
        return entry.data;
    }
    has(key) {
        this.cleanup();
        const cacheKey = this.generateKey(key);
        const entry = this.cache.get(cacheKey);
        return entry !== undefined && !this.isExpired(entry);
    }
    delete(key) {
        const cacheKey = this.generateKey(key);
        return this.cache.delete(cacheKey);
    }
    clear() {
        this.cache.clear();
    }
    size() {
        this.cleanup();
        return this.cache.size;
    }
    keys() {
        this.cleanup();
        return Array.from(this.cache.keys()).map(key => key.replace('cache_', ''));
    }
    // Métodos para caché específico por tipo
    setUserData(userId, data, ttl) {
        this.set(`user_${userId}`, data, ttl);
    }
    getUserData(userId) {
        return this.get(`user_${userId}`);
    }
    setRestaurantData(restaurantId, data, ttl) {
        this.set(`restaurant_${restaurantId}`, data, ttl);
    }
    getRestaurantData(restaurantId) {
        return this.get(`restaurant_${restaurantId}`);
    }
    setValuationData(valuationId, data, ttl) {
        this.set(`valuation_${valuationId}`, data, ttl);
    }
    getValuationData(valuationId) {
        return this.get(`valuation_${valuationId}`);
    }
    // Métodos para caché de API
    setApiResponse(endpoint, params, data, ttl) {
        const key = `api_${endpoint}_${JSON.stringify(params)}`;
        this.set(key, data, ttl);
    }
    getApiResponse(endpoint, params) {
        const key = `api_${endpoint}_${JSON.stringify(params)}`;
        return this.get(key);
    }
    // Métodos para estadísticas
    getStats() {
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
    export() {
        const exported = {};
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
    import(data) {
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
export const withCache = async (key, fetcher, cache = mainCache, ttl) => {
    const cached = cache.get(key);
    if (cached !== null) {
        return cached;
    }
    const data = await fetcher();
    cache.set(key, data, ttl);
    return data;
};
// Función para invalidar caché por patrón
export const invalidateCacheByPattern = (pattern, cache = mainCache) => {
    const regex = new RegExp(pattern);
    const keysToDelete = [];
    cache.keys().forEach(key => {
        if (regex.test(key)) {
            keysToDelete.push(key);
        }
    });
    keysToDelete.forEach(key => cache.delete(key));
};
