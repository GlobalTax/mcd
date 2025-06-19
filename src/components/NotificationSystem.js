import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
export var NotificationType;
(function (NotificationType) {
    NotificationType["SUCCESS"] = "success";
    NotificationType["ERROR"] = "error";
    NotificationType["WARNING"] = "warning";
    NotificationType["INFO"] = "info";
    NotificationType["SYSTEM"] = "system";
})(NotificationType || (NotificationType = {}));
export var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["NORMAL"] = "normal";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (NotificationPriority = {}));
const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            const newNotification = {
                ...action.payload,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                timestamp: new Date(),
                read: false,
            };
            const updatedNotifications = [newNotification, ...state.notifications];
            // Mantener solo las últimas 100 notificaciones
            if (updatedNotifications.length > 100) {
                updatedNotifications.splice(100);
            }
            return {
                ...state,
                notifications: updatedNotifications,
                unreadCount: state.unreadCount + 1,
            };
        case 'REMOVE_NOTIFICATION':
            const notification = state.notifications.find(n => n.id === action.payload);
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload),
                unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
            };
        case 'MARK_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(n => n.id === action.payload ? { ...n, read: true } : n),
                unreadCount: Math.max(0, state.unreadCount - 1),
            };
        case 'MARK_ALL_AS_READ':
            return {
                ...state,
                notifications: state.notifications.map(n => ({ ...n, read: true })),
                unreadCount: 0,
            };
        case 'CLEAR_ALL':
            return {
                ...state,
                notifications: [],
                unreadCount: 0,
            };
        case 'TOGGLE_PANEL':
            return {
                ...state,
                showPanel: !state.showPanel,
            };
        case 'LOAD_NOTIFICATIONS':
            return {
                ...state,
                notifications: action.payload,
                unreadCount: action.payload.filter(n => !n.read).length,
            };
        default:
            return state;
    }
};
const NotificationContext = createContext(undefined);
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(notificationReducer, {
        notifications: [],
        unreadCount: 0,
        showPanel: false,
    });
    // Cargar notificaciones del localStorage al inicializar
    useEffect(() => {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            try {
                const notifications = JSON.parse(savedNotifications).map((n) => ({
                    ...n,
                    timestamp: new Date(n.timestamp),
                }));
                dispatch({ type: 'LOAD_NOTIFICATIONS', payload: notifications });
            }
            catch (error) {
                console.error('Error loading notifications:', error);
            }
        }
    }, []);
    // Guardar notificaciones en localStorage cuando cambien
    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(state.notifications));
    }, [state.notifications]);
    const addNotification = (notification) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    };
    const removeNotification = (id) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    };
    const markAsRead = (id) => {
        dispatch({ type: 'MARK_AS_READ', payload: id });
    };
    const markAllAsRead = () => {
        dispatch({ type: 'MARK_ALL_AS_READ' });
    };
    const clearAll = () => {
        dispatch({ type: 'CLEAR_ALL' });
    };
    const togglePanel = () => {
        dispatch({ type: 'TOGGLE_PANEL' });
    };
    const getNotificationsByType = (type) => {
        return state.notifications.filter(n => n.type === type);
    };
    const getUnreadNotifications = () => {
        return state.notifications.filter(n => !n.read);
    };
    const value = {
        state,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        togglePanel,
        getNotificationsByType,
        getUnreadNotifications,
    };
    return (_jsx(NotificationContext.Provider, { value: value, children: children }));
};
// Componente de notificación individual
const NotificationItem = ({ notification }) => {
    const { removeNotification, markAsRead } = useNotifications();
    const getIcon = () => {
        switch (notification.type) {
            case NotificationType.SUCCESS:
                return _jsx(CheckCircle, { className: "h-5 w-5 text-green-600" });
            case NotificationType.ERROR:
                return _jsx(XCircle, { className: "h-5 w-5 text-red-600" });
            case NotificationType.WARNING:
                return _jsx(AlertTriangle, { className: "h-5 w-5 text-yellow-600" });
            case NotificationType.INFO:
                return _jsx(Info, { className: "h-5 w-5 text-blue-600" });
            case NotificationType.SYSTEM:
                return _jsx(Bell, { className: "h-5 w-5 text-gray-600" });
            default:
                return _jsx(Info, { className: "h-5 w-5 text-gray-600" });
        }
    };
    const getPriorityColor = () => {
        switch (notification.priority) {
            case NotificationPriority.URGENT:
                return 'border-l-red-500 bg-red-50';
            case NotificationPriority.HIGH:
                return 'border-l-orange-500 bg-orange-50';
            case NotificationPriority.NORMAL:
                return 'border-l-blue-500 bg-blue-50';
            case NotificationPriority.LOW:
                return 'border-l-gray-500 bg-gray-50';
            default:
                return 'border-l-gray-500 bg-gray-50';
        }
    };
    return (_jsx("div", { className: cn('border-l-4 p-4 mb-2 rounded-r-lg transition-all duration-200 hover:shadow-md', getPriorityColor(), !notification.read && 'ring-2 ring-blue-200'), children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start space-x-3 flex-1", children: [_jsx("div", { className: "flex-shrink-0 mt-0.5", children: getIcon() }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900", children: notification.title }), _jsx(Badge, { variant: "outline", className: "text-xs", children: notification.priority })] }), _jsx("p", { className: "text-sm text-gray-600 mt-1", children: notification.message }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("span", { className: "text-xs text-gray-500", children: notification.timestamp.toLocaleString() }), _jsxs("div", { className: "flex space-x-2", children: [notification.action && (_jsx(Button, { size: "sm", variant: "outline", onClick: notification.action.onClick, children: notification.action.label })), !notification.read && (_jsx(Button, { size: "sm", variant: "ghost", onClick: () => markAsRead(notification.id), children: "Marcar como le\u00EDda" }))] })] })] })] }), _jsx(Button, { size: "sm", variant: "ghost", onClick: () => removeNotification(notification.id), className: "flex-shrink-0 ml-2", children: _jsx(X, { className: "h-4 w-4" }) })] }) }));
};
// Componente del panel de notificaciones
export const NotificationPanel = () => {
    const { state, togglePanel, markAllAsRead, clearAll } = useNotifications();
    if (!state.showPanel)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-black bg-opacity-50", onClick: togglePanel }), _jsx("div", { className: "absolute right-0 top-0 h-full w-96 bg-white shadow-xl", children: _jsxs(Card, { className: "h-full rounded-none border-0", children: [_jsx(CardHeader, { className: "border-b", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Bell, { className: "h-5 w-5" }), _jsx("span", { children: "Notificaciones" }), state.unreadCount > 0 && (_jsx(Badge, { variant: "destructive", className: "ml-2", children: state.unreadCount }))] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: markAllAsRead, children: "Marcar todas como le\u00EDdas" }), _jsx(Button, { size: "sm", variant: "outline", onClick: clearAll, children: "Limpiar todas" })] })] }) }), _jsx(CardContent, { className: "p-0", children: _jsx(ScrollArea, { className: "h-[calc(100vh-120px)]", children: _jsx("div", { className: "p-4", children: state.notifications.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Bell, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No hay notificaciones" })] })) : (state.notifications.map(notification => (_jsx(NotificationItem, { notification: notification }, notification.id)))) }) }) })] }) })] }));
};
// Componente del botón de notificaciones
export const NotificationButton = () => {
    const { state, togglePanel } = useNotifications();
    return (_jsxs(Button, { variant: "ghost", size: "sm", onClick: togglePanel, className: "relative", children: [_jsx(Bell, { className: "h-5 w-5" }), state.unreadCount > 0 && (_jsx(Badge, { variant: "destructive", className: "absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center", children: state.unreadCount > 99 ? '99+' : state.unreadCount }))] }));
};
// Funciones helper para crear notificaciones rápidamente
export const createNotification = {
    success: (title, message, options) => ({
        type: NotificationType.SUCCESS,
        priority: NotificationPriority.NORMAL,
        title,
        message,
        persistent: false,
        ...options,
    }),
    error: (title, message, options) => ({
        type: NotificationType.ERROR,
        priority: NotificationPriority.HIGH,
        title,
        message,
        persistent: true,
        ...options,
    }),
    warning: (title, message, options) => ({
        type: NotificationType.WARNING,
        priority: NotificationPriority.NORMAL,
        title,
        message,
        persistent: false,
        ...options,
    }),
    info: (title, message, options) => ({
        type: NotificationType.INFO,
        priority: NotificationPriority.LOW,
        title,
        message,
        persistent: false,
        ...options,
    }),
    system: (title, message, options) => ({
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.NORMAL,
        title,
        message,
        persistent: false,
        ...options,
    }),
};
