import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Download,
  Filter,
  Search,
  Calendar,
  User,
  Activity,
  Lock,
  Unlock,
  Database,
  FileText,
  BarChart3,
  RefreshCw,
  Plus,
  Settings,
  Bell,
  Zap,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface AuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource_type: 'user' | 'restaurant' | 'franchisee' | 'valuation' | 'budget' | 'report' | 'system';
  resource_id: string;
  details: any;
  ip_address: string;
  user_agent: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failure' | 'warning';
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  category: 'security' | 'data_protection' | 'financial' | 'operational' | 'regulatory';
  status: 'active' | 'inactive' | 'draft';
  severity: 'low' | 'medium' | 'high' | 'critical';
  last_check: string;
  next_check: string;
  compliance_rate: number;
  violations_count: number;
  created_at: string;
  updated_at: string;
}

interface SecurityAlert {
  id: string;
  type: 'login_attempt' | 'data_access' | 'permission_change' | 'system_event' | 'compliance_violation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  timestamp: string;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
}

interface ComplianceReport {
  id: string;
  name: string;
  period: string;
  generated_at: string;
  generated_by: string;
  overall_compliance: number;
  total_rules: number;
  compliant_rules: number;
  violations: number;
  recommendations: string[];
  status: 'draft' | 'final' | 'archived';
}

const AuditComplianceSystem: React.FC = () => {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    dateRange: '7d',
    user: 'all'
  });

  // Logs de auditoría de ejemplo
  const exampleAuditLogs: AuditLog[] = [
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
  const exampleComplianceRules: ComplianceRule[] = [
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
  const exampleSecurityAlerts: SecurityAlert[] = [
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
  const exampleComplianceReports: ComplianceReport[] = [
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
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
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

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_login': return <Lock className="h-4 w-4 text-blue-600" />;
      case 'data_access': return <Database className="h-4 w-4 text-green-600" />;
      case 'permission_change': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'login_attempt': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <Lock className="h-4 w-4 text-red-600" />;
      case 'data_access': return <Database className="h-4 w-4 text-orange-600" />;
      case 'permission_change': return <Shield className="h-4 w-4 text-purple-600" />;
      case 'system_event': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'compliance_violation': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportAuditLogs = async (format: 'csv' | 'json') => {
    try {
      // Simular exportación
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Logs de auditoría exportados en formato ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Error al exportar los logs');
    }
  };

  const generateComplianceReport = async () => {
    try {
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Reporte de compliance generado correctamente');
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Error al generar el reporte');
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('security_alerts' as any)
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id
        })
        .eq('id', alertId);

      if (error) throw error;

      toast.success('Alerta resuelta correctamente');
      loadData();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Error al resolver la alerta');
    }
  };

  const overallCompliance = complianceRules.length > 0 
    ? complianceRules.reduce((sum, rule) => sum + rule.compliance_rate, 0) / complianceRules.length 
    : 0;

  const criticalAlerts = securityAlerts.filter(alert => alert.severity === 'critical' && alert.status === 'new').length;
  const highAlerts = securityAlerts.filter(alert => alert.severity === 'high' && alert.status === 'new').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Auditoría y Compliance</h1>
          <p className="text-gray-600 mt-2">
            Monitoreo de seguridad, logs de auditoría y cumplimiento normativo
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={generateComplianceReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Métricas de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Compliance General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {overallCompliance.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">
              Cumplimiento general
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalAlerts}
            </div>
            <p className="text-xs text-gray-500">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Alertas Altas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {highAlerts}
            </div>
            <p className="text-xs text-gray-500">
              Requieren revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Reglas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {complianceRules.filter(rule => rule.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">
              Políticas vigentes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="audit">Auditoría</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Actividad de Auditoría */}
            <Card>
              <CardHeader>
                <CardTitle>Actividad de Auditoría (Últimos 7 días)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { day: 'Lun', logins: 45, data_access: 23, changes: 8 },
                    { day: 'Mar', logins: 52, data_access: 31, changes: 12 },
                    { day: 'Mié', logins: 48, data_access: 28, changes: 6 },
                    { day: 'Jue', logins: 61, data_access: 35, changes: 15 },
                    { day: 'Vie', logins: 55, data_access: 29, changes: 9 },
                    { day: 'Sáb', logins: 38, data_access: 18, changes: 4 },
                    { day: 'Dom', logins: 42, data_access: 22, changes: 7 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="logins" fill="#3b82f6" name="Logins" />
                    <Bar dataKey="data_access" fill="#10b981" name="Accesos" />
                    <Bar dataKey="changes" fill="#f59e0b" name="Cambios" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de Compliance por Categoría */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Seguridad', value: 95, color: '#3b82f6' },
                        { name: 'Protección de Datos', value: 100, color: '#10b981' },
                        { name: 'Operacional', value: 100, color: '#f59e0b' },
                        { name: 'Financiero', value: 98, color: '#8b5cf6' },
                        { name: 'Regulatorio', value: 96, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Seguridad', value: 95, color: '#3b82f6' },
                        { name: 'Protección de Datos', value: 100, color: '#10b981' },
                        { name: 'Operacional', value: 100, color: '#f59e0b' },
                        { name: 'Financiero', value: 98, color: '#8b5cf6' },
                        { name: 'Regulatorio', value: 96, color: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`${value}%`, 'Compliance']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alertas Recientes */}
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Seguridad Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts
                  .filter(alert => alert.status === 'new' || alert.status === 'investigating')
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 5)
                  .map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{alert.title}</h3>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity === 'low' ? 'Baja' : 
                               alert.severity === 'medium' ? 'Media' : 
                               alert.severity === 'high' ? 'Alta' : 'Crítica'}
                            </Badge>
                            <Badge className={getStatusColor(alert.status)}>
                              {alert.status === 'new' ? 'Nueva' : 
                               alert.status === 'investigating' ? 'Investigando' : 
                               alert.status === 'resolved' ? 'Resuelta' : 'Falso Positivo'}
                            </Badge>
                          </div>
                                                  
                          <p className="text-sm text-gray-600">{alert.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            {alert.user_email && <span>Usuario: {alert.user_email}</span>}
                            {alert.ip_address && <span>IP: {alert.ip_address}</span>}
                            <span>Hora: {formatDate(alert.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedAlert(alert)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {alert.status === 'new' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => resolveAlert(alert.id)}
                            title="Marcar como resuelta"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros de Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Severidad</Label>
                  <Select value={filters.severity} onValueChange={(value) => setFilters({...filters, severity: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Estado</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="success">Éxito</SelectItem>
                      <SelectItem value="failure">Fallo</SelectItem>
                      <SelectItem value="warning">Advertencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Rango de Fechas</Label>
                  <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Último día</SelectItem>
                      <SelectItem value="7d">Últimos 7 días</SelectItem>
                      <SelectItem value="30d">Últimos 30 días</SelectItem>
                      <SelectItem value="90d">Últimos 90 días</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button onClick={() => exportAuditLogs('csv')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                  <Button variant="outline" onClick={() => exportAuditLogs('json')}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logs de Auditoría */}
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoría</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
                  <span className="ml-2">Cargando logs...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getActionIcon(log.action)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900">{log.user_email}</h3>
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity === 'low' ? 'Baja' : 
                               log.severity === 'medium' ? 'Media' : 
                               log.severity === 'high' ? 'Alta' : 'Crítica'}
                            </Badge>
                            <Badge className={getStatusColor(log.status)}>
                              {log.status === 'success' ? 'Éxito' : 
                               log.status === 'failure' ? 'Fallo' : 'Advertencia'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600">
                            {log.action === 'user_login' ? 'Inicio de sesión' :
                             log.action === 'data_access' ? 'Acceso a datos' :
                             log.action === 'permission_change' ? 'Cambio de permisos' :
                             log.action === 'login_attempt' ? 'Intento de login' : log.action}
                          </p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>IP: {log.ip_address}</span>
                            <span>Recurso: {log.resource_type}</span>
                            <span>Hora: {formatDate(log.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reglas de Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{rule.name}</h3>
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity === 'low' ? 'Baja' : 
                             rule.severity === 'medium' ? 'Media' : 
                             rule.severity === 'high' ? 'Alta' : 'Crítica'}
                          </Badge>
                          <Badge variant={rule.status === 'active' ? 'default' : 'outline'}>
                            {rule.status === 'active' ? 'Activa' : 
                             rule.status === 'inactive' ? 'Inactiva' : 'Borrador'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{rule.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Compliance: {rule.compliance_rate}%</span>
                          <span>Violaciones: {rule.violations_count}</span>
                          <span>Próxima revisión: {formatDate(rule.next_check)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Editar regla"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getAlertIcon(alert.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{alert.title}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity === 'low' ? 'Baja' : 
                             alert.severity === 'medium' ? 'Media' : 
                             alert.severity === 'high' ? 'Alta' : 'Crítica'}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status === 'new' ? 'Nueva' : 
                             alert.status === 'investigating' ? 'Investigando' : 
                             alert.status === 'resolved' ? 'Resuelta' : 'Falso Positivo'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          {alert.user_email && <span>Usuario: {alert.user_email}</span>}
                          {alert.ip_address && <span>IP: {alert.ip_address}</span>}
                          <span>Hora: {formatDate(alert.timestamp)}</span>
                          {alert.resolved_at && <span>Resuelta: {formatDate(alert.resolved_at)}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedAlert(alert)}
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {alert.status === 'new' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => resolveAlert(alert.id)}
                          title="Marcar como resuelta"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reportes de Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{report.name}</h3>
                          <Badge variant={report.status === 'final' ? 'default' : report.status === 'archived' ? 'secondary' : 'outline'}>
                            {report.status === 'draft' ? 'Borrador' : 
                             report.status === 'final' ? 'Final' : 'Archivado'}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">
                            {report.overall_compliance.toFixed(1)}% Compliance
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>Período: {report.period}</span>
                          <span>Reglas: {report.compliant_rules}/{report.total_rules}</span>
                          <span>Violaciones: {report.violations}</span>
                          <span>Generado: {formatDate(report.generated_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Ver reporte"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Descargar PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditComplianceSystem; 