import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Settings,
  Mail,
  Smartphone,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
  action_url?: string;
  priority: 'low' | 'medium' | 'high';
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  sound_enabled: boolean;
  financial_alerts: boolean;
  performance_alerts: boolean;
  system_alerts: boolean;
}

const NotificationCenter: React.FC = () => {
  const { user, franchisee } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    sound_enabled: true,
    financial_alerts: true,
    performance_alerts: true,
    system_alerts: true
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Notificaciones de ejemplo
  const exampleNotifications: Notification[] = [
    {
      id: '1',
      title: 'Actualización de P&L Completada',
      message: 'Se ha actualizado el P&L del restaurante McDonald\'s Plaza Mayor con los datos de este mes.',
      type: 'success',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
      read: false,
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Alerta de Rendimiento',
      message: 'El restaurante McDonald\'s Centro Comercial ha experimentado una caída del 15% en ventas este mes.',
      type: 'warning',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
      read: false,
      priority: 'high'
    },
    {
      id: '3',
      title: 'Nueva Valoración Disponible',
      message: 'Se ha generado una nueva valoración DCF para el restaurante McDonald\'s Parque Central.',
      type: 'info',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 día atrás
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Mantenimiento Programado',
      message: 'El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 4:00 AM.',
      type: 'info',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 días atrás
      read: true,
      priority: 'low'
    }
  ];

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadSettings();
    }
  }, [user]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Por ahora usamos notificaciones de ejemplo
      // En el futuro esto vendría de la base de datos
      setNotifications(exampleNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Error al cargar las notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if ((data as any)?.preferences) {
        const preferences = (data as any).preferences as any;
        if (preferences?.notification_settings) {
          setSettings(preferences.notification_settings);
        }
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );

      // En el futuro, esto actualizaría la base de datos
      toast.success('Notificación marcada como leída');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Error al marcar la notificación');
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );

      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Error al marcar las notificaciones');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );

      toast.success('Notificación eliminada');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Error al eliminar la notificación');
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: {
            notification_settings: updatedSettings
          }
        } as unknown as Record<string, any>)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Configuración actualizada');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Error al actualizar la configuración');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'high') return notification.priority === 'high';
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Centro de Notificaciones</h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus notificaciones y alertas
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
          <Button variant="outline" onClick={() => setActiveTab('settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todas ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            No leídas ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="high">
            Alta Prioridad
          </TabsTrigger>
          <TabsTrigger value="warning">
            Advertencias
          </TabsTrigger>
          <TabsTrigger value="settings">
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="warning" className="space-y-4">
          <NotificationList 
            notifications={filteredNotifications}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Canales de Notificación</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Notificaciones por Email</span>
                      </div>
                      <Button
                        variant={settings.email_notifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings({ email_notifications: !settings.email_notifications })}
                      >
                        {settings.email_notifications ? 'Activado' : 'Desactivado'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Notificaciones Push</span>
                      </div>
                      <Button
                        variant={settings.push_notifications ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings({ push_notifications: !settings.push_notifications })}
                      >
                        {settings.push_notifications ? 'Activado' : 'Desactivado'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {settings.sound_enabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        <span>Sonidos de Notificación</span>
                      </div>
                      <Button
                        variant={settings.sound_enabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings({ sound_enabled: !settings.sound_enabled })}
                      >
                        {settings.sound_enabled ? 'Activado' : 'Desactivado'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Tipos de Alertas</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Alertas Financieras</span>
                      <Button
                        variant={settings.financial_alerts ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings({ financial_alerts: !settings.financial_alerts })}
                      >
                        {settings.financial_alerts ? 'Activado' : 'Desactivado'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Alertas de Rendimiento</span>
                      <Button
                        variant={settings.performance_alerts ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings({ performance_alerts: !settings.performance_alerts })}
                      >
                        {settings.performance_alerts ? 'Activado' : 'Desactivado'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Alertas del Sistema</span>
                      <Button
                        variant={settings.system_alerts ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings({ system_alerts: !settings.system_alerts })}
                      >
                        {settings.system_alerts ? 'Activado' : 'Desactivado'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
  loading
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600"></div>
        <span className="ml-2">Cargando notificaciones...</span>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No hay notificaciones</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <Card key={notification.id} className={!notification.read ? 'border-l-4 border-l-blue-500' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                    {!notification.read && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Nuevo
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {notification.message}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(notification.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Marcar como leída
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationCenter; 