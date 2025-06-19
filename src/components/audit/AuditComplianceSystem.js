import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shield, AlertTriangle, CheckCircle, Eye, Download, Activity, Lock, Database, FileText, RefreshCw, Settings, Bell, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
const AuditComplianceSystem = () => {
    const { user } = useAuth();
    const [auditLogs, setAuditLogs] = useState([]);
    const [complianceRules, setComplianceRules] = useState([]);
    const [securityAlerts, setSecurityAlerts] = useState([]);
    const [complianceReports, setComplianceReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState(null);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [filters, setFilters] = useState({
        severity: 'all',
        status: 'all',
        dateRange: '7d',
        user: 'all'
    });
    // Logs de auditoría de ejemplo
    const exampleAuditLogs = [
        {
            id: '1',
            user_id: 'user-1',
            user_email: 'admin@example.com',
            action: 'user_login',
            resource_type: 'user',
            resource_id: 'user-1',
            details: { method: 'email', success: true },
            ip_address: '192.168.1.100',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: new Date().toISOString(),
            severity: 'low',
            status: 'success'
        },
        {
            id: '2',
            user_id: 'user-2',
            user_email: 'franquiciado@example.com',
            action: 'data_access',
            resource_type: 'restaurant',
            resource_id: 'rest-1',
            details: { operation: 'read', fields: ['name', 'revenue', 'costs'] },
            ip_address: '192.168.1.101',
            user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            severity: 'medium',
            status: 'success'
        },
        {
            id: '3',
            user_id: 'user-3',
            user_email: 'asesor@example.com',
            action: 'permission_change',
            resource_type: 'user',
            resource_id: 'user-4',
            details: { old_role: 'franquiciado', new_role: 'admin', reason: 'promotion' },
            ip_address: '192.168.1.102',
            user_agent: 'Mozilla/5.0 (Linux x86_64) AppleWebKit/537.36',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            severity: 'high',
            status: 'success'
        },
        {
            id: '4',
            user_id: 'unknown',
            user_email: 'unknown@example.com',
            action: 'login_attempt',
            resource_type: 'user',
            resource_id: 'user-5',
            details: { method: 'email', success: false, reason: 'invalid_password' },
            ip_address: '192.168.1.103',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            severity: 'medium',
            status: 'failure'
        }
    ];
    // Reglas de compliance de ejemplo
    const exampleComplianceRules = [
        {
            id: '1',
            name: 'Autenticación de Dos Factores',
            description: 'Todos los usuarios administrativos deben tener 2FA habilitado',
            category: 'security',
            status: 'active',
            severity: 'high',
            last_check: new Date().toISOString(),
            next_check: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            compliance_rate: 95,
            violations_count: 2,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Encriptación de Datos',
            description: 'Todos los datos sensibles deben estar encriptados',
            category: 'data_protection',
            status: 'active',
            severity: 'critical',
            last_check: new Date().toISOString(),
            next_check: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            compliance_rate: 100,
            violations_count: 0,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Backup Automático',
            description: 'Backups diarios de la base de datos',
            category: 'operational',
            status: 'active',
            severity: 'medium',
            last_check: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            next_check: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
            compliance_rate: 100,
            violations_count: 0,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: new Date().toISOString()
        }
    ];
    // Alertas de seguridad de ejemplo
    const exampleSecurityAlerts = [
        {
            id: '1',
            type: 'login_attempt',
            title: 'Múltiples Intentos de Login Fallidos',
            description: 'Se detectaron 5 intentos fallidos de login para la cuenta admin@example.com',
            severity: 'high',
            status: 'investigating',
            user_email: 'admin@example.com',
            ip_address: '192.168.1.103',
            timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: '2',
            type: 'data_access',
            title: 'Acceso a Datos Sensibles',
            description: 'Usuario franquiciado@example.com accedió a datos financieros fuera de horario',
            severity: 'medium',
            status: 'new',
            user_email: 'franquiciado@example.com',
            ip_address: '192.168.1.101',
            timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
            id: '3',
            type: 'permission_change',
            title: 'Cambio de Permisos de Usuario',
            description: 'Se cambió el rol de usuario user-4 de franquiciado a admin',
            severity: 'high',
            status: 'resolved',
            user_email: 'asesor@example.com',
            ip_address: '192.168.1.102',
            timestamp: new Date(Date.now() - 10800000).toISOString(),
            resolved_at: new Date(Date.now() - 3600000).toISOString(),
            resolved_by: 'admin@example.com'
        }
    ];
    // Reportes de compliance de ejemplo
    const exampleComplianceReports = [
        {
            id: '1',
            name: 'Reporte de Compliance Q1 2024',
            period: 'Q1 2024',
            generated_at: new Date().toISOString(),
            generated_by: 'admin@example.com',
            overall_compliance: 98.5,
            total_rules: 15,
            compliant_rules: 14,
            violations: 1,
            recommendations: [
                'Implementar auditoría de accesos más frecuente',
                'Revisar políticas de contraseñas',
                'Mejorar monitoreo de actividades sospechosas'
            ],
            status: 'final'
        },
        {
            id: '2',
            name: 'Reporte de Compliance Q4 2023',
            period: 'Q4 2023',
            generated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            generated_by: 'admin@example.com',
            overall_compliance: 96.2,
            total_rules: 12,
            compliant_rules: 11,
            violations: 1,
            recommendations: [
                'Actualizar políticas de seguridad',
                'Implementar autenticación biométrica'
            ],
            status: 'archived'
        }
    ];
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        setLoading(true);
        try {
            // Por ahora usamos datos de ejemplo
            // En el futuro esto vendría de la base de datos
            setAuditLogs(exampleAuditLogs);
            setComplianceRules(exampleComplianceRules);
            setSecurityAlerts(exampleSecurityAlerts);
            setComplianceReports(exampleComplianceReports);
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast.error('Error al cargar los datos');
        }
        finally {
            setLoading(false);
        }
    };
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'low': return 'bg-green-100 text-green-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'high': return 'bg-orange-100 text-orange-800';
            case 'critical': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'bg-green-100 text-green-800';
            case 'failure': return 'bg-red-100 text-red-800';
            case 'warning': return 'bg-yellow-100 text-yellow-800';
            case 'new': return 'bg-blue-100 text-blue-800';
            case 'investigating': return 'bg-orange-100 text-orange-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            case 'false_positive': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getActionIcon = (action) => {
        switch (action) {
            case 'user_login': return _jsx(Lock, { className: "h-4 w-4 text-blue-600" });
            case 'data_access': return _jsx(Database, { className: "h-4 w-4 text-green-600" });
            case 'permission_change': return _jsx(Shield, { className: "h-4 w-4 text-purple-600" });
            case 'login_attempt': return _jsx(AlertTriangle, { className: "h-4 w-4 text-red-600" });
            default: return _jsx(Activity, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const getAlertIcon = (type) => {
        switch (type) {
            case 'login_attempt': return _jsx(Lock, { className: "h-4 w-4 text-red-600" });
            case 'data_access': return _jsx(Database, { className: "h-4 w-4 text-orange-600" });
            case 'permission_change': return _jsx(Shield, { className: "h-4 w-4 text-purple-600" });
            case 'system_event': return _jsx(Zap, { className: "h-4 w-4 text-yellow-600" });
            case 'compliance_violation': return _jsx(AlertCircle, { className: "h-4 w-4 text-red-600" });
            default: return _jsx(Bell, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const exportAuditLogs = async (format) => {
        try {
            // Simular exportación
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Logs de auditoría exportados en formato ${format.toUpperCase()}`);
        }
        catch (error) {
            console.error('Error exporting logs:', error);
            toast.error('Error al exportar los logs');
        }
    };
    const generateComplianceReport = async () => {
        try {
            // Simular generación de reporte
            await new Promise(resolve => setTimeout(resolve, 2000));
            toast.success('Reporte de compliance generado correctamente');
        }
        catch (error) {
            console.error('Error generating report:', error);
            toast.error('Error al generar el reporte');
        }
    };
    const resolveAlert = async (alertId) => {
        try {
            const { error } = await supabase
                .from('security_alerts')
                .update({
                status: 'resolved',
                resolved_at: new Date().toISOString(),
                resolved_by: user?.id
            })
                .eq('id', alertId);
            if (error)
                throw error;
            toast.success('Alerta resuelta correctamente');
            loadData();
        }
        catch (error) {
            console.error('Error resolving alert:', error);
            toast.error('Error al resolver la alerta');
        }
    };
    const overallCompliance = complianceRules.length > 0
        ? complianceRules.reduce((sum, rule) => sum + rule.compliance_rate, 0) / complianceRules.length
        : 0;
    const criticalAlerts = securityAlerts.filter(alert => alert.severity === 'critical' && alert.status === 'new').length;
    const highAlerts = securityAlerts.filter(alert => alert.severity === 'high' && alert.status === 'new').length;
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Sistema de Auditor\u00EDa y Compliance" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Monitoreo de seguridad, logs de auditor\u00EDa y cumplimiento normativo" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Button, { variant: "outline", onClick: loadData, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Actualizar"] }), _jsxs(Button, { onClick: generateComplianceReport, children: [_jsx(FileText, { className: "h-4 w-4 mr-2" }), "Generar Reporte"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Compliance General" }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "text-2xl font-bold text-green-600", children: [overallCompliance.toFixed(1), "%"] }), _jsx("p", { className: "text-xs text-gray-500", children: "Cumplimiento general" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Alertas Cr\u00EDticas" }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: criticalAlerts }), _jsx("p", { className: "text-xs text-gray-500", children: "Requieren atenci\u00F3n inmediata" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Alertas Altas" }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: highAlerts }), _jsx("p", { className: "text-xs text-gray-500", children: "Requieren revisi\u00F3n" })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm font-medium", children: "Reglas Activas" }) }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: complianceRules.filter(rule => rule.status === 'active').length }), _jsx("p", { className: "text-xs text-gray-500", children: "Pol\u00EDticas vigentes" })] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsx(TabsTrigger, { value: "overview", children: "Resumen" }), _jsx(TabsTrigger, { value: "audit", children: "Auditor\u00EDa" }), _jsx(TabsTrigger, { value: "compliance", children: "Compliance" }), _jsx(TabsTrigger, { value: "alerts", children: "Alertas" }), _jsx(TabsTrigger, { value: "reports", children: "Reportes" })] }), _jsxs(TabsContent, { value: "overview", className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Actividad de Auditor\u00EDa (\u00DAltimos 7 d\u00EDas)" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(BarChart, { data: [
                                                            { day: 'Lun', logins: 45, data_access: 23, changes: 8 },
                                                            { day: 'Mar', logins: 52, data_access: 31, changes: 12 },
                                                            { day: 'Mié', logins: 48, data_access: 28, changes: 6 },
                                                            { day: 'Jue', logins: 61, data_access: 35, changes: 15 },
                                                            { day: 'Vie', logins: 55, data_access: 29, changes: 9 },
                                                            { day: 'Sáb', logins: 38, data_access: 18, changes: 4 },
                                                            { day: 'Dom', logins: 42, data_access: 22, changes: 7 }
                                                        ], children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "day" }), _jsx(YAxis, {}), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "logins", fill: "#3b82f6", name: "Logins" }), _jsx(Bar, { dataKey: "data_access", fill: "#10b981", name: "Accesos" }), _jsx(Bar, { dataKey: "changes", fill: "#f59e0b", name: "Cambios" })] }) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Compliance por Categor\u00EDa" }) }), _jsx(CardContent, { children: _jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: [
                                                                    { name: 'Seguridad', value: 95, color: '#3b82f6' },
                                                                    { name: 'Protección de Datos', value: 100, color: '#10b981' },
                                                                    { name: 'Operacional', value: 100, color: '#f59e0b' },
                                                                    { name: 'Financiero', value: 98, color: '#8b5cf6' },
                                                                    { name: 'Regulatorio', value: 96, color: '#ef4444' }
                                                                ], cx: "50%", cy: "50%", outerRadius: 80, dataKey: "value", children: [
                                                                    { name: 'Seguridad', value: 95, color: '#3b82f6' },
                                                                    { name: 'Protección de Datos', value: 100, color: '#10b981' },
                                                                    { name: 'Operacional', value: 100, color: '#f59e0b' },
                                                                    { name: 'Financiero', value: 98, color: '#8b5cf6' },
                                                                    { name: 'Regulatorio', value: 96, color: '#ef4444' }
                                                                ].map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => [`${value}%`, 'Compliance'] })] }) }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Alertas de Seguridad Recientes" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: securityAlerts
                                                .filter(alert => alert.status === 'new' || alert.status === 'investigating')
                                                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                                                .slice(0, 5)
                                                .map((alert) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getAlertIcon(alert.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: alert.title }), _jsx(Badge, { className: getSeverityColor(alert.severity), children: alert.severity === 'low' ? 'Baja' :
                                                                                    alert.severity === 'medium' ? 'Media' :
                                                                                        alert.severity === 'high' ? 'Alta' : 'Crítica' }), _jsx(Badge, { className: getStatusColor(alert.status), children: alert.status === 'new' ? 'Nueva' :
                                                                                    alert.status === 'investigating' ? 'Investigando' :
                                                                                        alert.status === 'resolved' ? 'Resuelta' : 'Falso Positivo' })] }), _jsx("p", { className: "text-sm text-gray-600", children: alert.description }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [alert.user_email && _jsxs("span", { children: ["Usuario: ", alert.user_email] }), alert.ip_address && _jsxs("span", { children: ["IP: ", alert.ip_address] }), _jsxs("span", { children: ["Hora: ", formatDate(alert.timestamp)] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedAlert(alert), title: "Ver detalles", children: _jsx(Eye, { className: "h-4 w-4" }) }), alert.status === 'new' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => resolveAlert(alert.id), title: "Marcar como resuelta", children: _jsx(CheckCircle, { className: "h-4 w-4" }) }))] })] }, alert.id))) }) })] })] }), _jsxs(TabsContent, { value: "audit", className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Filtros de Auditor\u00EDa" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { children: "Severidad" }), _jsxs(Select, { value: filters.severity, onValueChange: (value) => setFilters({ ...filters, severity: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todas" }), _jsx(SelectItem, { value: "low", children: "Baja" }), _jsx(SelectItem, { value: "medium", children: "Media" }), _jsx(SelectItem, { value: "high", children: "Alta" }), _jsx(SelectItem, { value: "critical", children: "Cr\u00EDtica" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Estado" }), _jsxs(Select, { value: filters.status, onValueChange: (value) => setFilters({ ...filters, status: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "Todos" }), _jsx(SelectItem, { value: "success", children: "\u00C9xito" }), _jsx(SelectItem, { value: "failure", children: "Fallo" }), _jsx(SelectItem, { value: "warning", children: "Advertencia" })] })] })] }), _jsxs("div", { children: [_jsx(Label, { children: "Rango de Fechas" }), _jsxs(Select, { value: filters.dateRange, onValueChange: (value) => setFilters({ ...filters, dateRange: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "1d", children: "\u00DAltimo d\u00EDa" }), _jsx(SelectItem, { value: "7d", children: "\u00DAltimos 7 d\u00EDas" }), _jsx(SelectItem, { value: "30d", children: "\u00DAltimos 30 d\u00EDas" }), _jsx(SelectItem, { value: "90d", children: "\u00DAltimos 90 d\u00EDas" })] })] })] }), _jsxs("div", { className: "flex items-end space-x-2", children: [_jsxs(Button, { onClick: () => exportAuditLogs('csv'), children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Exportar CSV"] }), _jsxs(Button, { variant: "outline", onClick: () => exportAuditLogs('json'), children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Exportar JSON"] })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Logs de Auditor\u00EDa" }) }), _jsx(CardContent, { children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando logs..." })] })) : (_jsx("div", { className: "space-y-4", children: auditLogs.map((log) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getActionIcon(log.action) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: log.user_email }), _jsx(Badge, { className: getSeverityColor(log.severity), children: log.severity === 'low' ? 'Baja' :
                                                                                    log.severity === 'medium' ? 'Media' :
                                                                                        log.severity === 'high' ? 'Alta' : 'Crítica' }), _jsx(Badge, { className: getStatusColor(log.status), children: log.status === 'success' ? 'Éxito' :
                                                                                    log.status === 'failure' ? 'Fallo' : 'Advertencia' })] }), _jsx("p", { className: "text-sm text-gray-600", children: log.action === 'user_login' ? 'Inicio de sesión' :
                                                                            log.action === 'data_access' ? 'Acceso a datos' :
                                                                                log.action === 'permission_change' ? 'Cambio de permisos' :
                                                                                    log.action === 'login_attempt' ? 'Intento de login' : log.action }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { children: ["IP: ", log.ip_address] }), _jsxs("span", { children: ["Recurso: ", log.resource_type] }), _jsxs("span", { children: ["Hora: ", formatDate(log.timestamp)] })] })] })] }), _jsx("div", { className: "flex items-center space-x-1", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedLog(log), title: "Ver detalles", children: _jsx(Eye, { className: "h-4 w-4" }) }) })] }, log.id))) })) })] })] }), _jsx(TabsContent, { value: "compliance", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Reglas de Compliance" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: complianceRules.map((rule) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(Shield, { className: "h-8 w-8 text-blue-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: rule.name }), _jsx(Badge, { className: getSeverityColor(rule.severity), children: rule.severity === 'low' ? 'Baja' :
                                                                                rule.severity === 'medium' ? 'Media' :
                                                                                    rule.severity === 'high' ? 'Alta' : 'Crítica' }), _jsx(Badge, { variant: rule.status === 'active' ? 'default' : 'outline', children: rule.status === 'active' ? 'Activa' :
                                                                                rule.status === 'inactive' ? 'Inactiva' : 'Borrador' })] }), _jsx("p", { className: "text-sm text-gray-600", children: rule.description }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { children: ["Compliance: ", rule.compliance_rate, "%"] }), _jsxs("span", { children: ["Violaciones: ", rule.violations_count] }), _jsxs("span", { children: ["Pr\u00F3xima revisi\u00F3n: ", formatDate(rule.next_check)] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", title: "Ver detalles", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Editar regla", children: _jsx(Settings, { className: "h-4 w-4" }) })] })] }, rule.id))) }) })] }) }), _jsx(TabsContent, { value: "alerts", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Alertas de Seguridad" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: securityAlerts.map((alert) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: getAlertIcon(alert.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: alert.title }), _jsx(Badge, { className: getSeverityColor(alert.severity), children: alert.severity === 'low' ? 'Baja' :
                                                                                alert.severity === 'medium' ? 'Media' :
                                                                                    alert.severity === 'high' ? 'Alta' : 'Crítica' }), _jsx(Badge, { className: getStatusColor(alert.status), children: alert.status === 'new' ? 'Nueva' :
                                                                                alert.status === 'investigating' ? 'Investigando' :
                                                                                    alert.status === 'resolved' ? 'Resuelta' : 'Falso Positivo' })] }), _jsx("p", { className: "text-sm text-gray-600", children: alert.description }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [alert.user_email && _jsxs("span", { children: ["Usuario: ", alert.user_email] }), alert.ip_address && _jsxs("span", { children: ["IP: ", alert.ip_address] }), _jsxs("span", { children: ["Hora: ", formatDate(alert.timestamp)] }), alert.resolved_at && _jsxs("span", { children: ["Resuelta: ", formatDate(alert.resolved_at)] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedAlert(alert), title: "Ver detalles", children: _jsx(Eye, { className: "h-4 w-4" }) }), alert.status === 'new' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => resolveAlert(alert.id), title: "Marcar como resuelta", children: _jsx(CheckCircle, { className: "h-4 w-4" }) }))] })] }, alert.id))) }) })] }) }), _jsx(TabsContent, { value: "reports", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Reportes de Compliance" }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-4", children: complianceReports.map((report) => (_jsxs("div", { className: "flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx(FileText, { className: "h-8 w-8 text-blue-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-1", children: [_jsx("h3", { className: "font-medium text-gray-900", children: report.name }), _jsx(Badge, { variant: report.status === 'final' ? 'default' : report.status === 'archived' ? 'secondary' : 'outline', children: report.status === 'draft' ? 'Borrador' :
                                                                                report.status === 'final' ? 'Final' : 'Archivado' }), _jsxs(Badge, { className: "bg-green-100 text-green-800", children: [report.overall_compliance.toFixed(1), "% Compliance"] })] }), _jsxs("div", { className: "flex items-center space-x-4 mt-2 text-xs text-gray-500", children: [_jsxs("span", { children: ["Per\u00EDodo: ", report.period] }), _jsxs("span", { children: ["Reglas: ", report.compliant_rules, "/", report.total_rules] }), _jsxs("span", { children: ["Violaciones: ", report.violations] }), _jsxs("span", { children: ["Generado: ", formatDate(report.generated_at)] })] })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(Button, { variant: "ghost", size: "sm", title: "Ver reporte", children: _jsx(Eye, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", title: "Descargar PDF", children: _jsx(Download, { className: "h-4 w-4" }) })] })] }, report.id))) }) })] }) })] })] }));
};
export default AuditComplianceSystem;
