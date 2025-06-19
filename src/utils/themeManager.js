class ThemeManager {
    constructor() {
        this.themes = new Map();
        this.subscribers = new Set();
        this.initializeThemes();
        this.loadSavedTheme();
    }
    static getInstance() {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }
    initializeThemes() {
        // Tema McDonald's Clásico
        const mcdonaldsClassic = {
            id: 'mcdonalds-classic',
            name: 'McDonald\'s Clásico',
            description: 'Tema oficial con los colores tradicionales de McDonald\'s',
            isDark: false,
            isCustom: false,
            colors: {
                primary: '#FFC72C',
                secondary: '#D70015',
                accent: '#FF6B35',
                background: '#FFFFFF',
                surface: '#F8F9FA',
                text: {
                    primary: '#1A1A1A',
                    secondary: '#6B7280',
                    disabled: '#9CA3AF'
                },
                border: '#E5E7EB',
                error: '#EF4444',
                warning: '#F59E0B',
                success: '#10B981',
                info: '#3B82F6',
                chart: {
                    primary: ['#FFC72C', '#D70015', '#FF6B35', '#FFB347', '#FF8C42'],
                    secondary: ['#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280'],
                    background: '#FFFFFF',
                    grid: '#E5E7EB'
                }
            },
            fonts: {
                primary: 'Inter, system-ui, sans-serif',
                secondary: 'Roboto, sans-serif',
                sizes: {
                    xs: '0.75rem',
                    sm: '0.875rem',
                    base: '1rem',
                    lg: '1.125rem',
                    xl: '1.25rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem'
                },
                weights: {
                    light: 300,
                    normal: 400,
                    medium: 500,
                    semibold: 600,
                    bold: 700
                }
            },
            spacing: {
                xs: '0.25rem',
                sm: '0.5rem',
                md: '1rem',
                lg: '1.5rem',
                xl: '2rem',
                '2xl': '3rem',
                '3xl': '4rem'
            },
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }
        };
        // Tema Oscuro
        const darkTheme = {
            id: 'dark-theme',
            name: 'Modo Oscuro',
            description: 'Tema oscuro para uso nocturno',
            isDark: true,
            isCustom: false,
            colors: {
                primary: '#FFC72C',
                secondary: '#D70015',
                accent: '#FF6B35',
                background: '#0F172A',
                surface: '#1E293B',
                text: {
                    primary: '#F8FAFC',
                    secondary: '#CBD5E1',
                    disabled: '#64748B'
                },
                border: '#334155',
                error: '#EF4444',
                warning: '#F59E0B',
                success: '#10B981',
                info: '#3B82F6',
                chart: {
                    primary: ['#FFC72C', '#D70015', '#FF6B35', '#FFB347', '#FF8C42'],
                    secondary: ['#334155', '#475569', '#64748B', '#94A3B8', '#CBD5E1'],
                    background: '#1E293B',
                    grid: '#334155'
                }
            },
            fonts: mcdonaldsClassic.fonts,
            spacing: mcdonaldsClassic.spacing,
            shadows: {
                sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
                md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
                xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
                '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }
        };
        // Tema Profesional
        const professionalTheme = {
            id: 'professional',
            name: 'Profesional',
            description: 'Tema elegante y profesional',
            isDark: false,
            isCustom: false,
            colors: {
                primary: '#2563EB',
                secondary: '#1E40AF',
                accent: '#3B82F6',
                background: '#FFFFFF',
                surface: '#F8FAFC',
                text: {
                    primary: '#0F172A',
                    secondary: '#475569',
                    disabled: '#94A3B8'
                },
                border: '#E2E8F0',
                error: '#DC2626',
                warning: '#D97706',
                success: '#059669',
                info: '#2563EB',
                chart: {
                    primary: ['#2563EB', '#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD'],
                    secondary: ['#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B'],
                    background: '#FFFFFF',
                    grid: '#E2E8F0'
                }
            },
            fonts: mcdonaldsClassic.fonts,
            spacing: mcdonaldsClassic.spacing,
            shadows: mcdonaldsClassic.shadows
        };
        // Tema Accesible
        const accessibleTheme = {
            id: 'accessible',
            name: 'Alto Contraste',
            description: 'Tema optimizado para accesibilidad',
            isDark: false,
            isCustom: false,
            colors: {
                primary: '#000000',
                secondary: '#FFFFFF',
                accent: '#0066CC',
                background: '#FFFFFF',
                surface: '#F0F0F0',
                text: {
                    primary: '#000000',
                    secondary: '#333333',
                    disabled: '#666666'
                },
                border: '#000000',
                error: '#CC0000',
                warning: '#CC6600',
                success: '#006600',
                info: '#0066CC',
                chart: {
                    primary: ['#000000', '#0066CC', '#CC0000', '#006600', '#CC6600'],
                    secondary: ['#F0F0F0', '#E0E0E0', '#D0D0D0', '#C0C0C0', '#B0B0B0'],
                    background: '#FFFFFF',
                    grid: '#000000'
                }
            },
            fonts: {
                ...mcdonaldsClassic.fonts,
                sizes: {
                    xs: '0.875rem',
                    sm: '1rem',
                    base: '1.125rem',
                    lg: '1.25rem',
                    xl: '1.375rem',
                    '2xl': '1.5rem',
                    '3xl': '1.875rem',
                    '4xl': '2.25rem'
                }
            },
            spacing: mcdonaldsClassic.spacing,
            shadows: {
                sm: '0 2px 4px 0 rgba(0, 0, 0, 0.3)',
                md: '0 4px 8px 0 rgba(0, 0, 0, 0.3)',
                lg: '0 8px 16px 0 rgba(0, 0, 0, 0.3)',
                xl: '0 16px 32px 0 rgba(0, 0, 0, 0.3)',
                '2xl': '0 32px 64px 0 rgba(0, 0, 0, 0.3)'
            }
        };
        // Agregar temas al mapa
        this.themes.set(mcdonaldsClassic.id, mcdonaldsClassic);
        this.themes.set(darkTheme.id, darkTheme);
        this.themes.set(professionalTheme.id, professionalTheme);
        this.themes.set(accessibleTheme.id, accessibleTheme);
        // Establecer tema por defecto
        this.currentTheme = mcdonaldsClassic;
    }
    loadSavedTheme() {
        try {
            const savedThemeId = localStorage.getItem('selected-theme');
            if (savedThemeId && this.themes.has(savedThemeId)) {
                this.currentTheme = this.themes.get(savedThemeId);
            }
            // Cargar tema personalizado si existe
            const customTheme = localStorage.getItem('custom-theme');
            if (customTheme) {
                try {
                    const parsed = JSON.parse(customTheme);
                    this.themes.set('custom', parsed);
                }
                catch (error) {
                    console.error('Error cargando tema personalizado:', error);
                }
            }
            this.applyTheme(this.currentTheme);
        }
        catch (error) {
            console.error('Error cargando tema guardado:', error);
        }
    }
    // Aplicar tema al DOM
    applyTheme(theme) {
        const root = document.documentElement;
        // Aplicar colores
        Object.entries(theme.colors).forEach(([key, value]) => {
            if (typeof value === 'string') {
                root.style.setProperty(`--color-${key}`, value);
            }
            else if (typeof value === 'object') {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    if (Array.isArray(subValue)) {
                        subValue.forEach((color, index) => {
                            root.style.setProperty(`--color-${key}-${subKey}-${index}`, color);
                        });
                    }
                    else {
                        root.style.setProperty(`--color-${key}-${subKey}`, subValue);
                    }
                });
            }
        });
        // Aplicar fuentes
        root.style.setProperty('--font-primary', theme.fonts.primary);
        root.style.setProperty('--font-secondary', theme.fonts.secondary);
        Object.entries(theme.fonts.sizes).forEach(([key, value]) => {
            root.style.setProperty(`--font-size-${key}`, value);
        });
        Object.entries(theme.fonts.weights).forEach(([key, value]) => {
            root.style.setProperty(`--font-weight-${key}`, value.toString());
        });
        // Aplicar espaciado
        Object.entries(theme.spacing).forEach(([key, value]) => {
            root.style.setProperty(`--spacing-${key}`, value);
        });
        // Aplicar sombras
        Object.entries(theme.shadows).forEach(([key, value]) => {
            root.style.setProperty(`--shadow-${key}`, value);
        });
        // Aplicar clase de tema oscuro
        if (theme.isDark) {
            document.body.classList.add('dark');
        }
        else {
            document.body.classList.remove('dark');
        }
        // Notificar a los suscriptores
        this.subscribers.forEach(callback => callback(theme));
    }
    // Cambiar tema
    setTheme(themeId) {
        const theme = this.themes.get(themeId);
        if (theme) {
            this.currentTheme = theme;
            this.applyTheme(theme);
            localStorage.setItem('selected-theme', themeId);
        }
    }
    // Obtener tema actual
    getCurrentTheme() {
        return this.currentTheme;
    }
    // Obtener todos los temas
    getThemes() {
        return Array.from(this.themes.values());
    }
    // Crear tema personalizado
    createCustomTheme(theme) {
        const customTheme = {
            ...theme,
            id: 'custom',
            isCustom: true
        };
        this.themes.set('custom', customTheme);
        localStorage.setItem('custom-theme', JSON.stringify(customTheme));
        return 'custom';
    }
    // Actualizar tema personalizado
    updateCustomTheme(updates) {
        const customTheme = this.themes.get('custom');
        if (customTheme) {
            const updatedTheme = { ...customTheme, ...updates };
            this.themes.set('custom', updatedTheme);
            localStorage.setItem('custom-theme', JSON.stringify(updatedTheme));
            if (this.currentTheme.id === 'custom') {
                this.currentTheme = updatedTheme;
                this.applyTheme(updatedTheme);
            }
        }
    }
    // Eliminar tema personalizado
    removeCustomTheme() {
        this.themes.delete('custom');
        localStorage.removeItem('custom-theme');
        if (this.currentTheme.id === 'custom') {
            this.setTheme('mcdonalds-classic');
        }
    }
    // Suscribirse a cambios de tema
    subscribe(callback) {
        this.subscribers.add(callback);
        // Devolver función para desuscribirse
        return () => {
            this.subscribers.delete(callback);
        };
    }
    // Detectar preferencia de tema del sistema
    detectSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (e.matches) {
                this.setTheme('dark-theme');
            }
            else {
                this.setTheme('mcdonalds-classic');
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        // Aplicar tema inicial basado en preferencia del sistema
        if (mediaQuery.matches) {
            this.setTheme('dark-theme');
        }
    }
    // Exportar tema
    exportTheme(themeId) {
        const theme = this.themes.get(themeId);
        if (theme) {
            return JSON.stringify(theme, null, 2);
        }
        return '';
    }
    // Importar tema
    importTheme(themeJson) {
        try {
            const theme = JSON.parse(themeJson);
            const importedTheme = {
                ...theme,
                id: `imported-${Date.now()}`,
                isCustom: true
            };
            this.themes.set(importedTheme.id, importedTheme);
            return importedTheme.id;
        }
        catch (error) {
            console.error('Error importando tema:', error);
            return null;
        }
    }
    // Generar paleta de colores
    generateColorPalette(baseColor) {
        const colors = [];
        const base = this.hexToRgb(baseColor);
        if (base) {
            // Generar variaciones
            for (let i = 0; i < 5; i++) {
                const lightness = 0.1 + (i * 0.2);
                colors.push(this.adjustLightness(baseColor, lightness));
            }
        }
        return colors;
    }
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    adjustLightness(hex, lightness) {
        const rgb = this.hexToRgb(hex);
        if (!rgb)
            return hex;
        const newR = Math.round(rgb.r + (255 - rgb.r) * lightness);
        const newG = Math.round(rgb.g + (255 - rgb.g) * lightness);
        const newB = Math.round(rgb.b + (255 - rgb.b) * lightness);
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
}
// Exportar instancia singleton
export const themeManager = ThemeManager.getInstance();
// Hook de React para usar el tema (requiere importación de React en el componente)
export const useTheme = () => {
    // Este hook debe ser usado en un componente React
    // La implementación real requiere React.useState y React.useEffect
    return {
        currentTheme: themeManager.getCurrentTheme(),
        setTheme: (themeId) => themeManager.setTheme(themeId),
        getThemes: () => themeManager.getThemes(),
        createCustomTheme: (theme) => themeManager.createCustomTheme(theme),
        updateCustomTheme: (updates) => themeManager.updateCustomTheme(updates),
        removeCustomTheme: () => themeManager.removeCustomTheme(),
        exportTheme: (themeId) => themeManager.exportTheme(themeId),
        importTheme: (themeJson) => themeManager.importTheme(themeJson),
        generateColorPalette: (baseColor) => themeManager.generateColorPalette(baseColor)
    };
};
