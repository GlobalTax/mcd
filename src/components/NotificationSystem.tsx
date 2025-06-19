import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SYSTEM = 'system',
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  persistent: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  data?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  showPanel: boolean;
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp' | 'read'> }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'CLEAR_ALL' }
  | { type: 'TOGGLE_PANEL' }
  | { type: 'LOAD_NOTIFICATIONS'; payload: Notification[] };

const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newNotification: Notification = {
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
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
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

interface NotificationContextType {
  state: NotificationState;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  togglePanel: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
  getUnreadNotifications: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
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
        const notifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        dispatch({ type: 'LOAD_NOTIFICATIONS', payload: notifications });
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(state.notifications));
  }, [state.notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const markAsRead = (id: string) => {
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

  const getNotificationsByType = (type: NotificationType) => {
    return state.notifications.filter(n => n.type === type);
  };

  const getUnreadNotifications = () => {
    return state.notifications.filter(n => !n.read);
  };

  const value: NotificationContextType = {
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

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Componente de notificación individual
const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const { removeNotification, markAsRead } = useNotifications();

  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.SUCCESS:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case NotificationType.ERROR:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case NotificationType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case NotificationType.INFO:
        return <Info className="h-5 w-5 text-blue-600" />;
      case NotificationType.SYSTEM:
        return <Bell className="h-5 w-5 text-gray-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
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

  return (
    <div
      className={cn(
        'border-l-4 p-4 mb-2 rounded-r-lg transition-all duration-200 hover:shadow-md',
        getPriorityColor(),
        !notification.read && 'ring-2 ring-blue-200'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h4>
              <Badge variant="outline" className="text-xs">
                {notification.priority}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {notification.timestamp.toLocaleString()}
              </span>
              <div className="flex space-x-2">
                {notification.action && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </Button>
                )}
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Marcar como leída
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => removeNotification(notification.id)}
          className="flex-shrink-0 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Componente del panel de notificaciones
export const NotificationPanel: React.FC = () => {
  const { state, togglePanel, markAllAsRead, clearAll } = useNotifications();

  if (!state.showPanel) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={togglePanel} />
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notificaciones</span>
                {state.unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {state.unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={markAllAsRead}>
                  Marcar todas como leídas
                </Button>
                <Button size="sm" variant="outline" onClick={clearAll}>
                  Limpiar todas
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="p-4">
                {state.notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No hay notificaciones</p>
                  </div>
                ) : (
                  state.notifications.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente del botón de notificaciones
export const NotificationButton: React.FC = () => {
  const { state, togglePanel } = useNotifications();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={togglePanel}
      className="relative"
    >
      <Bell className="h-5 w-5" />
      {state.unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
        >
          {state.unreadCount > 99 ? '99+' : state.unreadCount}
        </Badge>
      )}
    </Button>
  );
};

// Funciones helper para crear notificaciones rápidamente
export const createNotification = {
  success: (title: string, message: string, options?: Partial<Notification>) => ({
    type: NotificationType.SUCCESS,
    priority: NotificationPriority.NORMAL,
    title,
    message,
    persistent: false,
    ...options,
  }),
  
  error: (title: string, message: string, options?: Partial<Notification>) => ({
    type: NotificationType.ERROR,
    priority: NotificationPriority.HIGH,
    title,
    message,
    persistent: true,
    ...options,
  }),
  
  warning: (title: string, message: string, options?: Partial<Notification>) => ({
    type: NotificationType.WARNING,
    priority: NotificationPriority.NORMAL,
    title,
    message,
    persistent: false,
    ...options,
  }),
  
  info: (title: string, message: string, options?: Partial<Notification>) => ({
    type: NotificationType.INFO,
    priority: NotificationPriority.LOW,
    title,
    message,
    persistent: false,
    ...options,
  }),
  
  system: (title: string, message: string, options?: Partial<Notification>) => ({
    type: NotificationType.SYSTEM,
    priority: NotificationPriority.NORMAL,
    title,
    message,
    persistent: false,
    ...options,
  }),
}; 