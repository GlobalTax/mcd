import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertTriangle, Info, X, Settings, Mail, Smartphone, Volume2, VolumeX } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const NotificationCenter = () => {
    const { user, franchisee } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [settings, setSettings] = useState({
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
    const exampleNotifications = [
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
        }
        catch (error) {
            console.error('Error loading notifications:', error);
            toast.error('Error al cargar las notificaciones');
        }
        finally {
            setLoading(false);
        }
    };
    const loadSettings = async () => {
        if (!user)
            return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('preferences')
                .eq('id', user.id)
                .single();
            if (error)
                throw error;
            if (data?.preferences) {
                const preferences = data.preferences;
                if (preferences?.notification_settings) {
                    setSettings(preferences.notification_settings);
                }
            }
        }
        catch (error) {
            console.error('Error loading notification settings:', error);
        }
    };
    const markAsRead = async (notificationId) => {
        try {
            setNotifications(prev => prev.map(notif => notif.id === notificationId
                ? { ...notif, read: true }
                : notif));
            // En el futuro, esto actualizaría la base de datos
            toast.success('Notificación marcada como leída');
        }
        catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Error al marcar la notificación');
        }
    };
    const markAllAsRead = async () => {
        try {
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            toast.success('Todas las notificaciones marcadas como leídas');
        }
        catch (error) {
            console.error('Error marking all notifications as read:', error);
            toast.error('Error al marcar las notificaciones');
        }
    };
    const deleteNotification = async (notificationId) => {
        try {
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
            toast.success('Notificación eliminada');
        }
        catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Error al eliminar la notificación');
        }
    };
    const updateSettings = async (newSettings) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);
            if (!user)
                return;
            const { error } = await supabase
                .from('profiles')
                .update({
                preferences: {
                    notification_settings: updatedSettings
                }
            })
                .eq('id', user.id);
            if (error)
                throw error;
            toast.success('Configuración actualizada');
        }
        catch (error) {
            console.error('Error updating notification settings:', error);
            toast.error('Error al actualizar la configuración');
        }
    };
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" });
            case 'warning': return _jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-600" });
            case 'error': return _jsx(AlertTriangle, { className: "h-5 w-5 text-red-600" });
            default: return _jsx(Info, { className: "h-5 w-5 text-blue-600" });
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60)
            return 'Hace un momento';
        if (diffInSeconds < 3600)
            return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400)
            return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        if (diffInSeconds < 2592000)
            return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
        return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
    };
    const filteredNotifications = notifications.filter(notification => {
        if (activeTab === 'all')
            return true;
        if (activeTab === 'unread')
            return !notification.read;
        if (activeTab === 'high')
            return notification.priority === 'high';
        return notification.type === activeTab;
    });
    const unreadCount = notifications.filter(n => !n.read).length;
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Centro de Notificaciones" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Gestiona tus notificaciones y alertas" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [unreadCount > 0 && (_jsx(Button, { variant: "outline", onClick: markAllAsRead, children: "Marcar todas como le\u00EDdas" })), _jsxs(Button, { variant: "outline", onClick: () => setActiveTab('settings'), children: [_jsx(Settings, { className: "h-4 w-4 mr-2" }), "Configuraci\u00F3n"] })] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "space-y-6", children: [_jsxs(TabsList, { children: [_jsxs(TabsTrigger, { value: "all", children: ["Todas (", notifications.length, ")"] }), _jsxs(TabsTrigger, { value: "unread", children: ["No le\u00EDdas (", unreadCount, ")"] }), _jsx(TabsTrigger, { value: "high", children: "Alta Prioridad" }), _jsx(TabsTrigger, { value: "warning", children: "Advertencias" }), _jsx(TabsTrigger, { value: "settings", children: "Configuraci\u00F3n" })] }), _jsx(TabsContent, { value: "all", className: "space-y-4", children: _jsx(NotificationList, { notifications: filteredNotifications, onMarkAsRead: markAsRead, onDelete: deleteNotification, loading: loading }) }), _jsx(TabsContent, { value: "unread", className: "space-y-4", children: _jsx(NotificationList, { notifications: filteredNotifications, onMarkAsRead: markAsRead, onDelete: deleteNotification, loading: loading }) }), _jsx(TabsContent, { value: "high", className: "space-y-4", children: _jsx(NotificationList, { notifications: filteredNotifications, onMarkAsRead: markAsRead, onDelete: deleteNotification, loading: loading }) }), _jsx(TabsContent, { value: "warning", className: "space-y-4", children: _jsx(NotificationList, { notifications: filteredNotifications, onMarkAsRead: markAsRead, onDelete: deleteNotification, loading: loading }) }), _jsx(TabsContent, { value: "settings", className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Configuraci\u00F3n de Notificaciones" }) }), _jsx(CardContent, { className: "space-y-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "font-medium", children: "Canales de Notificaci\u00F3n" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Mail, { className: "h-4 w-4" }), _jsx("span", { children: "Notificaciones por Email" })] }), _jsx(Button, { variant: settings.email_notifications ? "default" : "outline", size: "sm", onClick: () => updateSettings({ email_notifications: !settings.email_notifications }), children: settings.email_notifications ? 'Activado' : 'Desactivado' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Smartphone, { className: "h-4 w-4" }), _jsx("span", { children: "Notificaciones Push" })] }), _jsx(Button, { variant: settings.push_notifications ? "default" : "outline", size: "sm", onClick: () => updateSettings({ push_notifications: !settings.push_notifications }), children: settings.push_notifications ? 'Activado' : 'Desactivado' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [settings.sound_enabled ? _jsx(Volume2, { className: "h-4 w-4" }) : _jsx(VolumeX, { className: "h-4 w-4" }), _jsx("span", { children: "Sonidos de Notificaci\u00F3n" })] }), _jsx(Button, { variant: settings.sound_enabled ? "default" : "outline", size: "sm", onClick: () => updateSettings({ sound_enabled: !settings.sound_enabled }), children: settings.sound_enabled ? 'Activado' : 'Desactivado' })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "font-medium", children: "Tipos de Alertas" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Alertas Financieras" }), _jsx(Button, { variant: settings.financial_alerts ? "default" : "outline", size: "sm", onClick: () => updateSettings({ financial_alerts: !settings.financial_alerts }), children: settings.financial_alerts ? 'Activado' : 'Desactivado' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Alertas de Rendimiento" }), _jsx(Button, { variant: settings.performance_alerts ? "default" : "outline", size: "sm", onClick: () => updateSettings({ performance_alerts: !settings.performance_alerts }), children: settings.performance_alerts ? 'Activado' : 'Desactivado' })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: "Alertas del Sistema" }), _jsx(Button, { variant: settings.system_alerts ? "default" : "outline", size: "sm", onClick: () => updateSettings({ system_alerts: !settings.system_alerts }), children: settings.system_alerts ? 'Activado' : 'Desactivado' })] })] })] })] }) })] }) })] })] }));
};
const NotificationList = ({ notifications, onMarkAsRead, onDelete, loading }) => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success': return _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" });
            case 'warning': return _jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-600" });
            case 'error': return _jsx(AlertTriangle, { className: "h-5 w-5 text-red-600" });
            default: return _jsx(Info, { className: "h-5 w-5 text-blue-600" });
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60)
            return 'Hace un momento';
        if (diffInSeconds < 3600)
            return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400)
            return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        if (diffInSeconds < 2592000)
            return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
        return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
    };
    if (loading) {
        return (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando notificaciones..." })] }));
    }
    if (notifications.length === 0) {
        return (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Bell, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No hay notificaciones" })] }));
    }
    return (_jsx("div", { className: "space-y-4", children: notifications.map((notification) => (_jsx(Card, { className: !notification.read ? 'border-l-4 border-l-blue-500' : '', children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3 flex-1", children: [_jsx("div", { className: "flex-shrink-0 mt-1", children: getNotificationIcon(notification.type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx("h3", { className: "font-medium text-gray-900", children: notification.title }), _jsx(Badge, { className: getPriorityColor(notification.priority), children: notification.priority }), !notification.read && (_jsx(Badge, { variant: "outline", className: "bg-blue-50 text-blue-700", children: "Nuevo" }))] }), _jsx("p", { className: "text-sm text-gray-600 mb-2", children: notification.message }), _jsx("p", { className: "text-xs text-gray-500", children: formatTimeAgo(notification.created_at) })] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [!notification.read && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onMarkAsRead(notification.id), children: "Marcar como le\u00EDda" })), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onDelete(notification.id), children: _jsx(X, { className: "h-4 w-4" }) })] })] }) }) }, notification.id))) }));
};
export default NotificationCenter;
