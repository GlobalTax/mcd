class PerformanceManager {
    constructor() {
        this.metrics = [];
        this.resourceCache = new Map();
        this.requestQueue = [];
        this.activeRequests = 0;
        this.observers = new Map();
        this.config = {
            enableLazyLoading: true,
            enableImageOptimization: true,
            enableCodeSplitting: true,
            enableServiceWorker: true,
            enableCompression: true,
            enablePrefetching: true,
            maxConcurrentRequests: 6,
            cacheExpiration: 30,
            enableMetrics: true
        };
        this.initializePerformanceMonitoring();
    }
    static getInstance() {
        if (!PerformanceManager.instance) {
            PerformanceManager.instance = new PerformanceManager();
        }
        return PerformanceManager.instance;
    }
    initializePerformanceMonitoring() {
        if (!this.config.enableMetrics)
            return;
        // Observar métricas de Web Vitals
        this.observeWebVitals();
        // Observar métricas de memoria
        this.observeMemoryUsage();
        // Observar métricas de red
        this.observeNetworkActivity();
        // Limpiar métricas antiguas periódicamente
        setInterval(() => this.cleanupOldMetrics(), 60000); // Cada minuto
    }
    observeWebVitals() {
        // First Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const fcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (entry.name === 'first-contentful-paint') {
                            this.recordMetric('firstContentfulPaint', entry.startTime);
                        }
                    });
                });
                fcpObserver.observe({ entryTypes: ['paint'] });
                this.observers.set('fcp', fcpObserver);
            }
            catch (error) {
                console.warn('No se pudo observar FCP:', error);
            }
            // Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    if (lastEntry) {
                        this.recordMetric('largestContentfulPaint', lastEntry.startTime);
                    }
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.set('lcp', lcpObserver);
            }
            catch (error) {
                console.warn('No se pudo observar LCP:', error);
            }
            // Cumulative Layout Shift
            try {
                const clsObserver = new PerformanceObserver((list) => {
                    let clsValue = 0;
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    });
                    this.recordMetric('cumulativeLayoutShift', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.set('cls', clsObserver);
            }
            catch (error) {
                console.warn('No se pudo observar CLS:', error);
            }
            // First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        this.recordMetric('firstInputDelay', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.set('fid', fidObserver);
            }
            catch (error) {
                console.warn('No se pudo observar FID:', error);
            }
        }
    }
    observeMemoryUsage() {
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                this.recordMetric('memoryUsage', memory.usedJSHeapSize / 1024 / 1024); // MB
            }, 5000); // Cada 5 segundos
        }
    }
    observeNetworkActivity() {
        if ('PerformanceObserver' in window) {
            try {
                const networkObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach((entry) => {
                        if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
                            this.recordNetworkRequest(entry);
                        }
                    });
                });
                networkObserver.observe({ entryTypes: ['resource'] });
                this.observers.set('network', networkObserver);
            }
            catch (error) {
                console.warn('No se pudo observar actividad de red:', error);
            }
        }
    }
    recordMetric(key, value) {
        const currentMetrics = this.getCurrentMetrics();
        currentMetrics[key] = value;
        currentMetrics.timestamp = new Date().toISOString();
    }
    recordNetworkRequest(entry) {
        const currentMetrics = this.getCurrentMetrics();
        currentMetrics.networkRequests++;
        // Calcular tasa de acierto de caché
        const cacheHit = entry.transferSize === 0;
        if (cacheHit) {
            currentMetrics.cacheHitRate = (currentMetrics.cacheHitRate * 0.9) + 0.1;
        }
        else {
            currentMetrics.cacheHitRate = currentMetrics.cacheHitRate * 0.9;
        }
    }
    getCurrentMetrics() {
        if (this.metrics.length === 0 ||
            Date.now() - new Date(this.metrics[this.metrics.length - 1].timestamp).getTime() > 60000) {
            const newMetrics = {
                pageLoadTime: 0,
                firstContentfulPaint: 0,
                largestContentfulPaint: 0,
                cumulativeLayoutShift: 0,
                firstInputDelay: 0,
                timeToInteractive: 0,
                memoryUsage: 0,
                networkRequests: 0,
                cacheHitRate: 0,
                timestamp: new Date().toISOString()
            };
            this.metrics.push(newMetrics);
        }
        return this.metrics[this.metrics.length - 1];
    }
    // Lazy Loading Inteligente
    async lazyLoadComponent(componentPath, priority = 'medium') {
        if (!this.config.enableLazyLoading) {
            return import(componentPath);
        }
        // Verificar caché
        const cached = this.resourceCache.get(componentPath);
        if (cached && Date.now() - cached.timestamp < this.config.cacheExpiration * 60 * 1000) {
            return cached.data;
        }
        // Cargar con prioridad
        const loadPromise = import(componentPath);
        if (priority === 'high') {
            return loadPromise;
        }
        // Para prioridades bajas, usar requestIdleCallback si está disponible
        if (priority === 'low' && 'requestIdleCallback' in window) {
            return new Promise((resolve) => {
                window.requestIdleCallback(() => {
                    loadPromise.then(resolve);
                });
            });
        }
        return loadPromise;
    }
    // Optimización de Imágenes
    optimizeImage(src, options = {}) {
        if (!this.config.enableImageOptimization) {
            return src;
        }
        // Simular optimización de imagen
        const params = new URLSearchParams();
        if (options.width)
            params.append('w', options.width.toString());
        if (options.height)
            params.append('h', options.height.toString());
        if (options.quality)
            params.append('q', options.quality.toString());
        if (options.format)
            params.append('f', options.format);
        return `${src}?${params.toString()}`;
    }
    // Compresión de Datos
    compressData(data) {
        if (!this.config.enableCompression) {
            return JSON.stringify(data);
        }
        // Simulación de compresión (en producción usar LZ-string o similar)
        const jsonString = JSON.stringify(data);
        return btoa(jsonString);
    }
    decompressData(compressedData) {
        if (!this.config.enableCompression) {
            return JSON.parse(compressedData);
        }
        try {
            const jsonString = atob(compressedData);
            return JSON.parse(jsonString);
        }
        catch (error) {
            console.error('Error descomprimiendo datos:', error);
            return null;
        }
    }
    // Gestión de Cola de Requests
    async queueRequest(requestFn, priority = 'medium') {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                request: async () => {
                    try {
                        const result = await requestFn();
                        resolve(result);
                    }
                    catch (error) {
                        reject(error);
                    }
                },
                priority
            });
            // Ordenar cola por prioridad
            this.requestQueue.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        });
    }
    processQueue() {
        if (this.requestQueue.length > 0 && this.activeRequests < this.config.maxConcurrentRequests) {
            const nextRequest = this.requestQueue.shift();
            if (nextRequest) {
                nextRequest.request();
            }
        }
    }
    // Prefetching Inteligente
    prefetchResource(url, type = 'api') {
        if (!this.config.enablePrefetching)
            return;
        // Verificar si ya está en caché
        if (this.resourceCache.has(url))
            return;
        // Crear link de prefetch
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        link.as = type;
        document.head.appendChild(link);
        // También precargar en caché
        fetch(url)
            .then(response => response.json())
            .then(data => {
            this.resourceCache.set(url, {
                data,
                timestamp: Date.now()
            });
        })
            .catch(error => {
            console.warn('Error prefetching resource:', url, error);
        });
    }
    // Optimización de Renderizado
    debounceRender(fn, delay) {
        let timeoutId;
        return ((...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        });
    }
    throttleRender(fn, limit) {
        let inThrottle;
        return ((...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        });
    }
    // Virtualización de Listas
    createVirtualList(items, itemHeight, containerHeight, renderItem) {
        const visibleCount = Math.ceil(containerHeight / itemHeight);
        const scrollTop = window.scrollY || 0;
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + visibleCount, items.length);
        return {
            visibleItems: items.slice(startIndex, endIndex),
            startIndex,
            endIndex,
            totalHeight: items.length * itemHeight
        };
    }
    // Métricas de Performance
    getPerformanceMetrics(filter) {
        let filteredMetrics = [...this.metrics];
        if (filter?.startDate) {
            filteredMetrics = filteredMetrics.filter(m => m.timestamp >= filter.startDate);
        }
        if (filter?.endDate) {
            filteredMetrics = filteredMetrics.filter(m => m.timestamp <= filter.endDate);
        }
        return filteredMetrics;
    }
    getAverageMetrics() {
        if (this.metrics.length === 0)
            return {};
        const sum = this.metrics.reduce((acc, metric) => ({
            pageLoadTime: acc.pageLoadTime + metric.pageLoadTime,
            firstContentfulPaint: acc.firstContentfulPaint + metric.firstContentfulPaint,
            largestContentfulPaint: acc.largestContentfulPaint + metric.largestContentfulPaint,
            cumulativeLayoutShift: acc.cumulativeLayoutShift + metric.cumulativeLayoutShift,
            firstInputDelay: acc.firstInputDelay + metric.firstInputDelay,
            timeToInteractive: acc.timeToInteractive + metric.timeToInteractive,
            memoryUsage: acc.memoryUsage + metric.memoryUsage,
            networkRequests: acc.networkRequests + metric.networkRequests,
            cacheHitRate: acc.cacheHitRate + metric.cacheHitRate
        }), {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0,
            timeToInteractive: 0,
            memoryUsage: 0,
            networkRequests: 0,
            cacheHitRate: 0
        });
        const count = this.metrics.length;
        return {
            pageLoadTime: sum.pageLoadTime / count,
            firstContentfulPaint: sum.firstContentfulPaint / count,
            largestContentfulPaint: sum.largestContentfulPaint / count,
            cumulativeLayoutShift: sum.cumulativeLayoutShift / count,
            firstInputDelay: sum.firstInputDelay / count,
            timeToInteractive: sum.timeToInteractive / count,
            memoryUsage: sum.memoryUsage / count,
            networkRequests: sum.networkRequests / count,
            cacheHitRate: sum.cacheHitRate / count
        };
    }
    // Análisis de Performance
    analyzePerformance() {
        const avgMetrics = this.getAverageMetrics();
        const issues = [];
        const recommendations = [];
        let score = 100;
        // Analizar FCP
        if (avgMetrics.firstContentfulPaint && avgMetrics.firstContentfulPaint > 2000) {
            issues.push('First Contentful Paint es lento (>2s)');
            recommendations.push('Optimizar carga de recursos críticos');
            score -= 20;
        }
        // Analizar LCP
        if (avgMetrics.largestContentfulPaint && avgMetrics.largestContentfulPaint > 2500) {
            issues.push('Largest Contentful Paint es lento (>2.5s)');
            recommendations.push('Optimizar imágenes y recursos grandes');
            score -= 20;
        }
        // Analizar CLS
        if (avgMetrics.cumulativeLayoutShift && avgMetrics.cumulativeLayoutShift > 0.1) {
            issues.push('Cumulative Layout Shift es alto (>0.1)');
            recommendations.push('Establecer dimensiones fijas para elementos');
            score -= 15;
        }
        // Analizar FID
        if (avgMetrics.firstInputDelay && avgMetrics.firstInputDelay > 100) {
            issues.push('First Input Delay es alto (>100ms)');
            recommendations.push('Reducir JavaScript bloqueante');
            score -= 15;
        }
        // Analizar uso de memoria
        if (avgMetrics.memoryUsage && avgMetrics.memoryUsage > 50) {
            issues.push('Uso de memoria alto (>50MB)');
            recommendations.push('Implementar limpieza de memoria');
            score -= 10;
        }
        // Analizar tasa de caché
        if (avgMetrics.cacheHitRate && avgMetrics.cacheHitRate < 0.5) {
            issues.push('Tasa de acierto de caché baja (<50%)');
            recommendations.push('Mejorar estrategia de caché');
            score -= 10;
        }
        return {
            score: Math.max(0, score),
            issues,
            recommendations
        };
    }
    // Configuración
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
    getConfig() {
        return { ...this.config };
    }
    // Limpieza
    cleanupOldMetrics() {
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        this.metrics = this.metrics.filter(m => new Date(m.timestamp).getTime() > oneHourAgo);
        // Limpiar caché expirado
        const now = Date.now();
        for (const [key, value] of this.resourceCache.entries()) {
            if (now - value.timestamp > this.config.cacheExpiration * 60 * 1000) {
                this.resourceCache.delete(key);
            }
        }
    }
    // Destruir observadores
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}
// Exportar instancia singleton
export const performanceManager = PerformanceManager.getInstance();
// Funciones de utilidad
export const lazyLoad = (componentPath, priority) => performanceManager.lazyLoadComponent(componentPath, priority);
export const optimizeImage = (src, options) => performanceManager.optimizeImage(src, options);
export const debounce = (fn, delay) => performanceManager.debounceRender(fn, delay);
export const throttle = (fn, limit) => performanceManager.throttleRender(fn, limit);
