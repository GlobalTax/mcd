import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, Info, XCircle, Bell } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
export var NotificationType;
(function (NotificationType) {
    NotificationType["SUCCESS"] = "success";
    NotificationType["ERROR"] = "error";
    NotificationType["WARNING"] = "warning";
    NotificationType["INFO"] = "info";
    NotificationType["CRITICAL"] = "critical";
})(NotificationType || (NotificationType = {}));
const NotificationContext = createContext(undefined);
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider');
    }
    return context;
};
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    // Cargar notificaciones desde localStorage al inicializar
    useEffect(() => {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            try {
                const parsed = JSON.parse(savedNotifications);
                setNotifications(parsed.map((n) => ({
                    ...n,
                    timestamp: new Date(n.timestamp)
                })));
            }
            catch (error) {
                console.error('Error loading notifications from localStorage:', error);
            }
        }
    }, []);
    // Guardar notificaciones en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);
    const addNotification = (notification) => {
        const newNotification = {
            ...notification,
            id: Date.now().toString(),
            timestamp: new Date(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
        // Mostrar toast inmediato
        const toastOptions = {
            duration: notification.persistent ? Infinity : 5000,
            action: notification.action ? {
                label: notification.action.label,
                onClick: notification.action.onClick
            } : undefined
        };
        switch (notification.type) {
            case NotificationType.SUCCESS:
                toast.success(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
            case NotificationType.ERROR:
                toast.error(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
            case NotificationType.WARNING:
                toast.warning(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
            case NotificationType.INFO:
                toast.info(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
            case NotificationType.CRITICAL:
                toast.error(notification.title, {
                    description: notification.message,
                    ...toastOptions
                });
                break;
        }
    };
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(notification => notification.id === id ? { ...notification, read: true } : notification));
    };
    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
    };
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };
    const clearAll = () => {
        setNotifications([]);
    };
    const unreadCount = notifications.filter(n => !n.read).length;
    const value = {
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        unreadCount
    };
    return (_jsx(NotificationContext.Provider, { value: value, children: children }));
};
// Componente para mostrar el panel de notificaciones
export const NotificationPanel = () => {
    const { notifications, markAsRead, markAllAsRead, removeNotification, unreadCount } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const getIcon = (type) => {
        switch (type) {
            case NotificationType.SUCCESS:
                return _jsx(CheckCircle, { className: "w-4 h-4 text-green-600" });
            case NotificationType.ERROR:
                return _jsx(XCircle, { className: "w-4 h-4 text-red-600" });
            case NotificationType.WARNING:
                return _jsx(AlertCircle, { className: "w-4 h-4 text-yellow-600" });
            case NotificationType.INFO:
                return _jsx(Info, { className: "w-4 h-4 text-blue-600" });
            case NotificationType.CRITICAL:
                return _jsx(XCircle, { className: "w-4 h-4 text-red-800" });
        }
    };
    const getTypeColor = (type) => {
        switch (type) {
            case NotificationType.SUCCESS:
                return 'border-green-200 bg-green-50';
            case NotificationType.ERROR:
                return 'border-red-200 bg-red-50';
            case NotificationType.WARNING:
                return 'border-yellow-200 bg-yellow-50';
            case NotificationType.INFO:
                return 'border-blue-200 bg-blue-50';
            case NotificationType.CRITICAL:
                return 'border-red-300 bg-red-100';
        }
    };
    return (_jsxs("div", { className: "relative", children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(!isOpen), className: "relative", children: [_jsx(Bell, { className: "w-5 h-5" }), unreadCount > 0 && (_jsx(Badge, { className: "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs", children: unreadCount > 99 ? '99+' : unreadCount }))] }), isOpen && (_jsxs("div", { className: "absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Notificaciones" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: markAllAsRead, className: "text-xs", children: "Marcar todas como le\u00EDdas" })] }) }), _jsx("div", { className: "p-2", children: notifications.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Bell, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), _jsx("p", { className: "text-sm", children: "No hay notificaciones" })] })) : (notifications.map(notification => (_jsxs("div", { className: `p-3 border rounded-lg mb-2 cursor-pointer transition-colors ${notification.read ? 'opacity-75' : ''} ${getTypeColor(notification.type)}`, onClick: () => markAsRead(notification.id), children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start space-x-2 flex-1", children: [getIcon(notification.type), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: notification.title }), _jsx("p", { className: "text-xs text-gray-600 mt-1", children: notification.message }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: notification.timestamp.toLocaleString() })] })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: (e) => {
                                                e.stopPropagation();
                                                removeNotification(notification.id);
                                            }, className: "text-gray-400 hover:text-gray-600", children: "\u00D7" })] }), notification.action && (_jsx(Button, { variant: "outline", size: "sm", onClick: (e) => {
                                        e.stopPropagation();
                                        notification.action.onClick();
                                    }, className: "mt-2 w-full", children: notification.action.label }))] }, notification.id)))) })] }))] }));
};
