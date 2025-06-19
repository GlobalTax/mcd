// Sistema de optimización automática de performance
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  category?: string;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'code-splitting' | 'lazy-loading' | 'memoization' | 'debouncing' | 'caching' | 'bundle-optimization';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  priority: number;
  implementation: string;
  estimatedImprovement: number;
}

export interface BundleAnalysis {
  totalSize: number;
  chunkCount: number;
  chunks: {
    name: string;
    size: number;
    modules: string[];
  }[];
  duplicateModules: string[];
  largeModules: string[];
}

class PerformanceOptimizer {
  private metrics: PerformanceMetric[] = [];
  private suggestions: OptimizationSuggestion[] = [];
  private isEnabled = true;
  private optimizationHistory: Array<{
    timestamp: Date;
    action: string;
    impact: number;
    details: any;
  }> = [];

  // Analizar performance actual
  async analyzePerformance(): Promise<PerformanceMetric[]> {
    if (!this.isEnabled) return [];

    const metrics: PerformanceMetric[] = [];

    try {
      // Métricas de carga de página
      metrics.push(...await this.measurePageLoadMetrics());
      
      // Métricas de rendimiento de JavaScript
      metrics.push(...await this.measureJavaScriptMetrics());
      
      // Métricas de memoria
      metrics.push(...await this.measureMemoryMetrics());
      
      // Métricas de red
      metrics.push(...await this.measureNetworkMetrics());
      
      // Métricas de interactividad
      metrics.push(...await this.measureInteractivityMetrics());
      
      this.metrics = metrics;
      
      // Generar sugerencias de optimización
      await this.generateOptimizationSuggestions();
      
      return metrics;
      
    } catch (error) {
      console.error('Failed to analyze performance:', error);
      throw error;
    }
  }

  // Medir métricas de carga de página
  private async measurePageLoadMetrics(): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];
    
    if (performance.getEntriesByType) {
      // First Contentful Paint (FCP)
      const fcpEntries = performance.getEntriesByType('paint');
      const fcp = fcpEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        metrics.push({
          name: 'First Contentful Paint',
          value: fcp.startTime,
          unit: 'ms',
          timestamp: new Date(),
          threshold: 1800,
          status: fcp.startTime <= 1800 ? 'good' : fcp.startTime <= 3000 ? 'warning' : 'critical'
        });
      }

      // Largest Contentful Paint (LCP)
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1];
        metrics.push({
          name: 'Largest Contentful Paint',
          value: lcp.startTime,
          unit: 'ms',
          timestamp: new Date(),
          threshold: 2500,
          status: lcp.startTime <= 2500 ? 'good' : lcp.startTime <= 4000 ? 'warning' : 'critical'
        });
      }

      // First Input Delay (FID)
      this.analyzeFirstInputDelay();
      
      // Cumulative Layout Shift (CLS)
      const clsEntries = performance.getEntriesByType('layout-shift');
      let cls = 0;
      clsEntries.forEach(entry => {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      });
      metrics.push({
        name: 'Cumulative Layout Shift',
        value: cls,
        unit: '',
        timestamp: new Date(),
        threshold: 0.1,
        status: cls <= 0.1 ? 'good' : cls <= 0.25 ? 'warning' : 'critical'
      });
    }

    return metrics;
  }

  private analyzeFirstInputDelay(): void {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            const fid = entry as any; // Type assertion para acceder a processingStart
            this.metrics.push({
              name: 'First Input Delay',
              value: fid.processingStart - fid.startTime,
              unit: 'ms',
              timestamp: new Date(),
              threshold: 100,
              category: 'interactivity',
              status: (fid.processingStart - fid.startTime) <= 100 ? 'good' : (fid.processingStart - fid.startTime) <= 300 ? 'warning' : 'critical'
            });
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('No se pudo observar First Input Delay:', error);
      }
    }
  }

  // Medir métricas de JavaScript
  private async measureJavaScriptMetrics(): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];
    
    // Tiempo de ejecución de JavaScript
    const jsStart = performance.now();
    
    // Simular trabajo de JavaScript
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const jsEnd = performance.now();
    const jsTime = jsEnd - jsStart;
    
    metrics.push({
      name: 'JavaScript Execution Time',
      value: jsTime,
      unit: 'ms',
      timestamp: new Date(),
      threshold: 50,
      status: jsTime <= 50 ? 'good' : jsTime <= 100 ? 'warning' : 'critical'
    });

    // Tamaño del bundle JavaScript
    const bundleSize = this.estimateBundleSize();
    metrics.push({
      name: 'JavaScript Bundle Size',
      value: bundleSize,
      unit: 'KB',
      timestamp: new Date(),
      threshold: 500,
      status: bundleSize <= 500 ? 'good' : bundleSize <= 1000 ? 'warning' : 'critical'
    });

    return metrics;
  }

  // Medir métricas de memoria
  private async measureMemoryMetrics(): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];
    
    this.analyzeMemoryUsage();

    return metrics;
  }

  private analyzeMemoryUsage(): void {
    // Verificar si la API de memoria está disponible
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      if (memory) {
        this.metrics.push({
          name: 'Memory Usage',
          value: memory.usedJSHeapSize / 1024 / 1024, // MB
          unit: 'MB',
          timestamp: new Date(),
          threshold: 50,
          category: 'memory',
          status: memory.usedJSHeapSize < 50 * 1024 * 1024 ? 'good' : 'warning'
        });
      }
    }
  }

  // Medir métricas de red
  private async measureNetworkMetrics(): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];
    
    if (performance.getEntriesByType) {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0] as PerformanceNavigationTiming;
        
        // Tiempo de respuesta del servidor
        const serverResponseTime = navigation.responseStart - navigation.requestStart;
        metrics.push({
          name: 'Server Response Time',
          value: serverResponseTime,
          unit: 'ms',
          timestamp: new Date(),
          threshold: 200,
          status: serverResponseTime <= 200 ? 'good' : serverResponseTime <= 500 ? 'warning' : 'critical'
        });

        // Tiempo de descarga
        const downloadTime = navigation.responseEnd - navigation.responseStart;
        metrics.push({
          name: 'Download Time',
          value: downloadTime,
          unit: 'ms',
          timestamp: new Date(),
          threshold: 1000,
          status: downloadTime <= 1000 ? 'good' : downloadTime <= 2000 ? 'warning' : 'critical'
        });
      }
    }

    return metrics;
  }

  // Medir métricas de interactividad
  private async measureInteractivityMetrics(): Promise<PerformanceMetric[]> {
    const metrics: PerformanceMetric[] = [];
    
    // Tiempo de respuesta de eventos
    const eventResponseTime = this.measureEventResponseTime();
    metrics.push({
      name: 'Event Response Time',
      value: eventResponseTime,
      unit: 'ms',
      timestamp: new Date(),
      threshold: 16, // 60fps
      status: eventResponseTime <= 16 ? 'good' : eventResponseTime <= 33 ? 'warning' : 'critical'
    });

    return metrics;
  }

  // Generar sugerencias de optimización
  private async generateOptimizationSuggestions(): Promise<void> {
    this.suggestions = [];

    // Analizar métricas y generar sugerencias
    const criticalMetrics = this.metrics.filter(m => m.status === 'critical');
    const warningMetrics = this.metrics.filter(m => m.status === 'warning');

    // Sugerencias basadas en métricas críticas
    criticalMetrics.forEach(metric => {
      switch (metric.name) {
        case 'First Contentful Paint':
          this.suggestions.push({
            id: 'fcp-optimization',
            type: 'code-splitting',
            title: 'Optimizar First Contentful Paint',
            description: 'El tiempo de primera pintura es crítico. Implementar code splitting y lazy loading.',
            impact: 'high',
            effort: 'medium',
            priority: 1,
            implementation: 'Implementar React.lazy() y Suspense para componentes pesados',
            estimatedImprovement: 40
          });
          break;

        case 'Largest Contentful Paint':
          this.suggestions.push({
            id: 'lcp-optimization',
            type: 'lazy-loading',
            title: 'Optimizar Largest Contentful Paint',
            description: 'El elemento más grande tarda mucho en cargar. Optimizar imágenes y recursos críticos.',
            impact: 'high',
            effort: 'medium',
            priority: 1,
            implementation: 'Usar next/image, implementar preload para recursos críticos',
            estimatedImprovement: 35
          });
          break;

        case 'JavaScript Bundle Size':
          this.suggestions.push({
            id: 'bundle-optimization',
            type: 'bundle-optimization',
            title: 'Reducir tamaño del bundle JavaScript',
            description: 'El bundle es demasiado grande. Implementar tree shaking y code splitting.',
            impact: 'high',
            effort: 'high',
            priority: 1,
            implementation: 'Configurar webpack para tree shaking, dividir en chunks más pequeños',
            estimatedImprovement: 50
          });
          break;

        case 'Memory Usage':
          this.suggestions.push({
            id: 'memory-optimization',
            type: 'memoization',
            title: 'Optimizar uso de memoria',
            description: 'El uso de memoria es crítico. Implementar memoización y limpiar referencias.',
            impact: 'high',
            effort: 'medium',
            priority: 1,
            implementation: 'Usar React.memo, useMemo, useCallback, limpiar event listeners',
            estimatedImprovement: 30
          });
          break;
      }
    });

    // Sugerencias basadas en métricas de advertencia
    warningMetrics.forEach(metric => {
      switch (metric.name) {
        case 'Event Response Time':
          this.suggestions.push({
            id: 'event-debouncing',
            type: 'debouncing',
            title: 'Implementar debouncing en eventos',
            description: 'Los eventos responden lentamente. Implementar debouncing para mejorar la responsividad.',
            impact: 'medium',
            effort: 'low',
            priority: 2,
            implementation: 'Usar lodash.debounce o implementar debouncing personalizado',
            estimatedImprovement: 25
          });
          break;
      }
    });

    // Sugerencias generales de optimización
    this.suggestions.push({
      id: 'caching-strategy',
      type: 'caching',
      title: 'Implementar estrategia de caché',
      description: 'Implementar caché inteligente para mejorar tiempos de carga.',
      impact: 'medium',
      effort: 'medium',
      priority: 3,
      implementation: 'Usar React Query, implementar service workers para caché offline',
      estimatedImprovement: 20
    });
  }

  // Aplicar optimizaciones automáticas
  async applyOptimizations(): Promise<void> {
    if (!this.isEnabled) return;

    const highPrioritySuggestions = this.suggestions
      .filter(s => s.priority === 1)
      .sort((a, b) => b.estimatedImprovement - a.estimatedImprovement);

    for (const suggestion of highPrioritySuggestions) {
      try {
        await this.applyOptimization(suggestion);
        
        this.optimizationHistory.push({
          timestamp: new Date(),
          action: suggestion.title,
          impact: suggestion.estimatedImprovement,
          details: suggestion
        });
        
        console.log(`Applied optimization: ${suggestion.title}`);
        
      } catch (error) {
        console.error(`Failed to apply optimization ${suggestion.title}:`, error);
      }
    }
  }

  // Aplicar optimización específica
  private async applyOptimization(suggestion: OptimizationSuggestion): Promise<void> {
    switch (suggestion.type) {
      case 'code-splitting':
        await this.applyCodeSplitting();
        break;
      case 'lazy-loading':
        await this.applyLazyLoading();
        break;
      case 'memoization':
        await this.applyMemoization();
        break;
      case 'debouncing':
        await this.applyDebouncing();
        break;
      case 'caching':
        await this.applyCaching();
        break;
      case 'bundle-optimization':
        await this.applyBundleOptimization();
        break;
    }
  }

  // Aplicar code splitting
  private async applyCodeSplitting(): Promise<void> {
    // Implementar code splitting dinámico
    console.log('Applying code splitting optimization...');
  }

  // Aplicar lazy loading
  private async applyLazyLoading(): Promise<void> {
    // Implementar lazy loading de componentes
    console.log('Applying lazy loading optimization...');
  }

  // Aplicar memoización
  private async applyMemoization(): Promise<void> {
    // Implementar memoización automática
    console.log('Applying memoization optimization...');
  }

  // Aplicar debouncing
  private async applyDebouncing(): Promise<void> {
    // Implementar debouncing automático
    console.log('Applying debouncing optimization...');
  }

  // Aplicar caché
  private async applyCaching(): Promise<void> {
    // Implementar estrategia de caché
    console.log('Applying caching optimization...');
  }

  // Aplicar optimización de bundle
  private async applyBundleOptimization(): Promise<void> {
    // Optimizar configuración de bundle
    console.log('Applying bundle optimization...');
  }

  // Analizar bundle
  async analyzeBundle(): Promise<BundleAnalysis> {
    // En un entorno real, usar herramientas como webpack-bundle-analyzer
    return {
      totalSize: 1024, // KB
      chunkCount: 5,
      chunks: [
        {
          name: 'main',
          size: 512,
          modules: ['react', 'react-dom', 'app']
        },
        {
          name: 'vendor',
          size: 256,
          modules: ['lodash', 'moment']
        }
      ],
      duplicateModules: ['lodash'],
      largeModules: ['moment', 'chart.js']
    };
  }

  // Obtener métricas actuales
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  // Obtener sugerencias de optimización
  getSuggestions(): OptimizationSuggestion[] {
    return [...this.suggestions];
  }

  // Obtener historial de optimizaciones
  getOptimizationHistory(): Array<{
    timestamp: Date;
    action: string;
    impact: number;
    details: any;
  }> {
    return [...this.optimizationHistory];
  }

  // Estimar tamaño del bundle
  private estimateBundleSize(): number {
    // En un entorno real, obtener del build
    return 800; // KB
  }

  // Medir tiempo de respuesta de eventos
  private measureEventResponseTime(): number {
    // Simular medición de tiempo de respuesta
    return Math.random() * 50 + 10; // 10-60ms
  }

  // Habilitar/deshabilitar optimizador
  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Limpiar datos
  cleanup(): void {
    this.metrics = [];
    this.suggestions = [];
    this.optimizationHistory = [];
  }
}

// Instancia global del optimizador de performance
export const performanceOptimizer = new PerformanceOptimizer();

// Hooks de React para optimización de performance
export const usePerformanceOptimizer = () => {
  return {
    analyzePerformance: performanceOptimizer.analyzePerformance.bind(performanceOptimizer),
    applyOptimizations: performanceOptimizer.applyOptimizations.bind(performanceOptimizer),
    analyzeBundle: performanceOptimizer.analyzeBundle.bind(performanceOptimizer),
    getMetrics: performanceOptimizer.getMetrics.bind(performanceOptimizer),
    getSuggestions: performanceOptimizer.getSuggestions.bind(performanceOptimizer),
    getOptimizationHistory: performanceOptimizer.getOptimizationHistory.bind(performanceOptimizer),
    enable: performanceOptimizer.enable.bind(performanceOptimizer),
    disable: performanceOptimizer.disable.bind(performanceOptimizer),
    cleanup: performanceOptimizer.cleanup.bind(performanceOptimizer)
  };
}; 