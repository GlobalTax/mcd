import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Clock, AlertCircle, Zap, Shield, Palette, Brain, Rocket } from 'lucide-react';
const improvements = [
    {
        id: 'performance',
        name: 'Performance Extrema',
        description: 'Optimización de renderizado, lazy loading inteligente, compresión de datos y métricas de rendimiento',
        status: 'completed',
        priority: 'high',
        category: 'Performance',
        progress: 100,
        icon: _jsx(Rocket, { className: "w-5 h-5" }),
        benefits: [
            'Lazy loading inteligente de componentes',
            'Optimización de imágenes automática',
            'Compresión de datos en tiempo real',
            'Métricas de Web Vitals',
            'Gestión de cola de requests',
            'Prefetching inteligente'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'ai-assistant',
        name: 'Sistema de IA Integrada',
        description: 'Asistente de IA para análisis financiero, predicciones y recomendaciones automáticas',
        status: 'completed',
        priority: 'high',
        category: 'Inteligencia Artificial',
        progress: 100,
        icon: _jsx(Brain, { className: "w-5 h-5" }),
        benefits: [
            'Análisis financiero automático',
            'Predicciones de tendencias',
            'Chat inteligente contextual',
            'Generación de reportes automáticos',
            'Recomendaciones personalizadas',
            'Base de conocimiento McDonald\'s'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'pwa',
        name: 'PWA Completa',
        description: 'Progressive Web App con funcionalidad offline, instalación y sincronización',
        status: 'completed',
        priority: 'high',
        category: 'PWA',
        progress: 100,
        icon: _jsx(Zap, { className: "w-5 h-5" }),
        benefits: [
            'Instalación como app nativa',
            'Funcionalidad offline completa',
            'Service Worker avanzado',
            'Sincronización en background',
            'Notificaciones push',
            'Caché inteligente'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'security',
        name: 'Seguridad Avanzada',
        description: 'Sistema de seguridad con encriptación, auditoría y protección contra ataques',
        status: 'completed',
        priority: 'high',
        category: 'Seguridad',
        progress: 100,
        icon: _jsx(Shield, { className: "w-5 h-5" }),
        benefits: [
            'Encriptación de datos sensibles',
            'Validación de contraseñas robusta',
            'Control de intentos de login',
            'Rate limiting inteligente',
            'Auditoría completa',
            'Protección XSS/CSRF'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'themes',
        name: 'Temas Dinámicos',
        description: 'Sistema de temas personalizables con múltiples opciones visuales',
        status: 'completed',
        priority: 'medium',
        category: 'UI/UX',
        progress: 100,
        icon: _jsx(Palette, { className: "w-5 h-5" }),
        benefits: [
            'Temas predefinidos (McDonald\'s, Oscuro, Profesional)',
            'Tema accesible alto contraste',
            'Personalización de colores',
            'Detección automática de preferencias',
            'Exportar/importar temas',
            'Transiciones suaves'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'notifications',
        name: 'Sistema de Notificaciones',
        description: 'Sistema avanzado de notificaciones con diferentes tipos y prioridades',
        status: 'completed',
        priority: 'medium',
        category: 'Comunicación',
        progress: 100,
        icon: _jsx(AlertCircle, { className: "w-5 h-5" }),
        benefits: [
            'Notificaciones en tiempo real',
            'Diferentes tipos (success, warning, error, info)',
            'Notificaciones push',
            'Historial de notificaciones',
            'Configuración personalizada',
            'Integración con eventos del sistema'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'analytics',
        name: 'Analytics y Métricas',
        description: 'Sistema completo de analytics y métricas de uso',
        status: 'completed',
        priority: 'medium',
        category: 'Analytics',
        progress: 100,
        icon: _jsx(CheckCircle, { className: "w-5 h-5" }),
        benefits: [
            'Tracking de eventos personalizados',
            'Métricas de rendimiento',
            'Análisis de comportamiento',
            'Reportes automáticos',
            'Dashboard de analytics',
            'Exportación de datos'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'integrations',
        name: 'Integraciones Externas',
        description: 'Sistema de integraciones con APIs externas (bancos, contabilidad, mercado)',
        status: 'completed',
        priority: 'medium',
        category: 'Integraciones',
        progress: 100,
        icon: _jsx(Clock, { className: "w-5 h-5" }),
        benefits: [
            'APIs de bancos simuladas',
            'Integración contable',
            'Datos de mercado en tiempo real',
            'Sincronización automática',
            'Manejo de errores robusto',
            'Retry automático'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'reports',
        name: 'Reportes Automáticos',
        description: 'Generación automática de reportes y exportación de datos',
        status: 'completed',
        priority: 'medium',
        category: 'Reportes',
        progress: 100,
        icon: _jsx(CheckCircle, { className: "w-5 h-5" }),
        benefits: [
            'Reportes financieros automáticos',
            'Exportación a PDF/Excel',
            'Plantillas personalizables',
            'Programación de reportes',
            'Envío por email',
            'Archivo histórico'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'cache',
        name: 'Sistema de Caché Inteligente',
        description: 'Caché inteligente con estrategias optimizadas y invalidación automática',
        status: 'completed',
        priority: 'medium',
        category: 'Performance',
        progress: 100,
        icon: _jsx(Zap, { className: "w-5 h-5" }),
        benefits: [
            'Caché en memoria y localStorage',
            'Invalidación automática',
            'Estrategias de caché optimizadas',
            'Compresión de datos',
            'Sincronización entre pestañas',
            'Limpieza automática'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'logging',
        name: 'Sistema de Logging',
        description: 'Sistema centralizado de logging con diferentes niveles y persistencia',
        status: 'completed',
        priority: 'low',
        category: 'Debugging',
        progress: 100,
        icon: _jsx(CheckCircle, { className: "w-5 h-5" }),
        benefits: [
            'Logging estructurado',
            'Diferentes niveles (debug, info, warn, error)',
            'Persistencia en localStorage',
            'Exportación de logs',
            'Filtros y búsqueda',
            'Integración con errores'
        ],
        implementationDate: '2024-01-15'
    },
    {
        id: 'dashboard-advanced',
        name: 'Dashboard Avanzado',
        description: 'Dashboard mejorado con KPIs, alertas y visualizaciones avanzadas',
        status: 'completed',
        priority: 'medium',
        category: 'UI/UX',
        progress: 100,
        icon: _jsx(CheckCircle, { className: "w-5 h-5" }),
        benefits: [
            'KPIs personalizables',
            'Alertas inteligentes',
            'Gráficos interactivos',
            'Widgets arrastrables',
            'Vistas personalizadas',
            'Exportación de dashboard'
        ],
        implementationDate: '2024-01-15'
    }
];
const getStatusColor = (status) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'in-progress':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'pending':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-800';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800';
        case 'low':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};
const getCategoryColor = (category) => {
    const colors = {
        'Performance': 'bg-purple-100 text-purple-800',
        'Inteligencia Artificial': 'bg-blue-100 text-blue-800',
        'PWA': 'bg-orange-100 text-orange-800',
        'Seguridad': 'bg-red-100 text-red-800',
        'UI/UX': 'bg-pink-100 text-pink-800',
        'Comunicación': 'bg-indigo-100 text-indigo-800',
        'Analytics': 'bg-teal-100 text-teal-800',
        'Integraciones': 'bg-cyan-100 text-cyan-800',
        'Reportes': 'bg-emerald-100 text-emerald-800',
        'Debugging': 'bg-slate-100 text-slate-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
};
export const ImprovementsProgress = () => {
    const completedCount = improvements.filter(imp => imp.status === 'completed').length;
    const totalCount = improvements.length;
    const overallProgress = (completedCount / totalCount) * 100;
    const categories = [...new Set(improvements.map(imp => imp.category))];
    const categoryProgress = categories.map(category => {
        const categoryImps = improvements.filter(imp => imp.category === category);
        const completed = categoryImps.filter(imp => imp.status === 'completed').length;
        return {
            category,
            progress: (completed / categoryImps.length) * 100,
            total: categoryImps.length,
            completed
        };
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-6 h-6 text-green-600" }), "Progreso de Mejoras Implementadas"] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: "Progreso General" }), _jsxs("span", { className: "text-sm text-gray-600", children: [completedCount, "/", totalCount, " completadas"] })] }), _jsx(Progress, { value: overallProgress, className: "h-3" }), _jsxs("div", { className: "text-2xl font-bold text-green-600", children: [overallProgress.toFixed(0), "%"] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Progreso por Categor\u00EDa" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: categoryProgress.map((cat) => (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm font-medium", children: cat.category }), _jsxs("span", { className: "text-sm text-gray-600", children: [cat.completed, "/", cat.total] })] }), _jsx(Progress, { value: cat.progress, className: "h-2" })] }, cat.category))) }) })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3", children: improvements.map((improvement) => (_jsxs(Card, { className: "hover:shadow-lg transition-shadow", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-primary", children: improvement.icon }), _jsx(CardTitle, { className: "text-lg", children: improvement.name })] }), _jsx(Badge, { className: getStatusColor(improvement.status), children: improvement.status === 'completed' ? 'Completado' :
                                                improvement.status === 'in-progress' ? 'En Progreso' : 'Pendiente' })] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [_jsxs(Badge, { variant: "outline", className: getPriorityColor(improvement.priority), children: [improvement.priority === 'high' ? 'Alta' :
                                                    improvement.priority === 'medium' ? 'Media' : 'Baja', " Prioridad"] }), _jsx(Badge, { variant: "outline", className: getCategoryColor(improvement.category), children: improvement.category })] })] }), _jsxs(CardContent, { className: "pt-0", children: [_jsx("p", { className: "text-sm text-gray-600 mb-3", children: improvement.description }), _jsxs("div", { className: "space-y-2 mb-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { children: "Progreso" }), _jsxs("span", { children: [improvement.progress, "%"] })] }), _jsx(Progress, { value: improvement.progress, className: "h-2" })] }), improvement.implementationDate && (_jsxs("p", { className: "text-xs text-gray-500 mb-3", children: ["Implementado: ", new Date(improvement.implementationDate).toLocaleDateString('es-ES')] })), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-xs font-medium text-gray-700", children: "Beneficios:" }), _jsxs("ul", { className: "text-xs text-gray-600 space-y-1", children: [improvement.benefits.slice(0, 3).map((benefit, index) => (_jsxs("li", { className: "flex items-start gap-1", children: [_jsx(CheckCircle, { className: "w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" }), benefit] }, index))), improvement.benefits.length > 3 && (_jsxs("li", { className: "text-xs text-gray-500", children: ["+", improvement.benefits.length - 3, " beneficios m\u00E1s"] }))] })] })] })] }, improvement.id))) }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Estad\u00EDsticas de Implementaci\u00F3n" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: completedCount }), _jsx("div", { className: "text-sm text-gray-600", children: "Completadas" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: improvements.filter(imp => imp.priority === 'high').length }), _jsx("div", { className: "text-sm text-gray-600", children: "Alta Prioridad" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: categories.length }), _jsx("div", { className: "text-sm text-gray-600", children: "Categor\u00EDas" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: new Date().toLocaleDateString('es-ES') }), _jsx("div", { className: "text-sm text-gray-600", children: "\u00DAltima Actualizaci\u00F3n" })] })] }) })] })] }));
};
