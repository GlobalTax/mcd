import { useState, useEffect, useCallback } from 'react';
import { useNotifications, createNotification } from '@/components/NotificationSystem';
import { useAnalytics } from '@/utils/analytics';
export const useServiceWorker = () => {
    const [swState, setSwState] = useState({
        isSupported: false,
        isInstalled: false,
        isUpdated: false,
        isOnline: navigator.onLine,
        isReady: false,
        registration: null,
    });
    const [pwaFeatures, setPwaFeatures] = useState({
        canInstall: false,
        isInstalled: false,
        canShare: false,
        canSync: false,
        canPush: false,
    });
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const { addNotification } = useNotifications();
    const analytics = useAnalytics();
    // Verificar soporte del Service Worker
    useEffect(() => {
        const isSupported = 'serviceWorker' in navigator;
        setSwState(prev => ({ ...prev, isSupported }));
        if (isSupported) {
            registerServiceWorker();
            checkPWAFeatures();
        }
    }, []);
    // Monitorear estado de conexión
    useEffect(() => {
        const handleOnline = () => {
            setSwState(prev => ({ ...prev, isOnline: true }));
            addNotification(createNotification.success('Conexión Restaurada', 'Ya estás conectado a internet'));
        };
        const handleOffline = () => {
            setSwState(prev => ({ ...prev, isOnline: false }));
            addNotification(createNotification.warning('Sin Conexión', 'Estás trabajando en modo offline'));
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [addNotification]);
    // Registrar Service Worker
    const registerServiceWorker = useCallback(async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            setSwState(prev => ({
                ...prev,
                isInstalled: true,
                registration,
            }));
            // Manejar actualizaciones del Service Worker
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            setSwState(prev => ({ ...prev, isUpdated: true }));
                            addNotification(createNotification.info('Nueva Versión Disponible', 'Hay una nueva versión de la aplicación disponible. Recarga para actualizar.'));
                        }
                    });
                }
            });
            // Manejar estado del Service Worker
            if (registration.active) {
                setSwState(prev => ({ ...prev, isReady: true }));
            }
            registration.addEventListener('activate', () => {
                setSwState(prev => ({ ...prev, isReady: true }));
            });
            analytics.trackEvent('PWA', 'service_worker_registered');
        }
        catch (error) {
            console.error('Error registering service worker:', error);
            analytics.trackEvent('PWA', 'service_worker_error', error);
        }
    }, [addNotification, analytics]);
    // Verificar características PWA
    const checkPWAFeatures = useCallback(() => {
        const features = {
            canInstall: false,
            isInstalled: false,
            canShare: false,
            canSync: false,
            canPush: false,
        };
        // Verificar si se puede instalar
        features.canInstall = 'BeforeInstallPromptEvent' in window;
        // Verificar si ya está instalado
        features.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
        // Verificar si se puede compartir
        features.canShare = 'share' in navigator;
        // Verificar si se puede sincronizar en background
        features.canSync = 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype;
        // Verificar si se pueden enviar push notifications
        features.canPush = 'serviceWorker' in navigator && 'PushManager' in window;
        setPwaFeatures(features);
    }, []);
    // Manejar evento de instalación
    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            addNotification(createNotification.info('Instalar App', 'Puedes instalar esta aplicación en tu dispositivo para un mejor acceso.'));
        };
        const handleAppInstalled = () => {
            setPwaFeatures(prev => ({ ...prev, isInstalled: true }));
            setDeferredPrompt(null);
            addNotification(createNotification.success('App Instalada', 'La aplicación se ha instalado correctamente en tu dispositivo.'));
            analytics.trackEvent('PWA', 'app_installed');
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [addNotification, analytics]);
    // Instalar PWA
    const installPWA = useCallback(async () => {
        if (!deferredPrompt) {
            addNotification(createNotification.error('Error', 'No se puede instalar la aplicación en este momento'));
            return false;
        }
        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                analytics.trackEvent('PWA', 'install_accepted');
                return true;
            }
            else {
                analytics.trackEvent('PWA', 'install_declined');
                return false;
            }
        }
        catch (error) {
            console.error('Error installing PWA:', error);
            analytics.trackEvent('PWA', 'install_error', error);
            return false;
        }
    }, [deferredPrompt, addNotification, analytics]);
    // Actualizar Service Worker
    const updateServiceWorker = useCallback(async () => {
        if (!swState.registration)
            return;
        try {
            await swState.registration.update();
            setSwState(prev => ({ ...prev, isUpdated: false }));
            addNotification(createNotification.success('Actualización Completada', 'La aplicación se ha actualizado correctamente.'));
            analytics.trackEvent('PWA', 'service_worker_updated');
        }
        catch (error) {
            console.error('Error updating service worker:', error);
            analytics.trackEvent('PWA', 'update_error', error);
        }
    }, [swState.registration, addNotification, analytics]);
    // Compartir contenido
    const shareContent = useCallback(async (data) => {
        if (!pwaFeatures.canShare) {
            addNotification(createNotification.error('Error', 'Compartir no está disponible en este dispositivo'));
            return false;
        }
        try {
            await navigator.share(data);
            analytics.trackEvent('PWA', 'content_shared', JSON.stringify(data));
            return true;
        }
        catch (error) {
            console.error('Error sharing content:', error);
            analytics.trackEvent('PWA', 'share_error', error instanceof Error ? error.message : 'Unknown error');
            return false;
        }
    }, [pwaFeatures.canShare, addNotification, analytics]);
    // Sincronización en background
    const registerBackgroundSync = async (tag) => {
        if (!swState.registration)
            return;
        try {
            // Verificar si la API de sync está disponible
            if ('sync' in swState.registration) {
                await swState.registration.sync.register(tag);
            }
        }
        catch (error) {
            console.error('Error registering background sync:', error);
        }
    };
    // Solicitar permisos de notificación
    const requestNotificationPermission = useCallback(async () => {
        if (!pwaFeatures.canPush) {
            addNotification(createNotification.error('Error', 'Las notificaciones push no están disponibles'));
            return false;
        }
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                addNotification(createNotification.success('Permisos Otorgados', 'Ahora recibirás notificaciones importantes.'));
                analytics.trackEvent('PWA', 'notification_permission_granted');
                return true;
            }
            else {
                addNotification(createNotification.warning('Permisos Denegados', 'No podrás recibir notificaciones importantes.'));
                analytics.trackEvent('PWA', 'notification_permission_denied');
                return false;
            }
        }
        catch (error) {
            console.error('Error requesting notification permission:', error);
            analytics.trackEvent('PWA', 'notification_permission_error', error);
            return false;
        }
    }, [pwaFeatures.canPush, addNotification, analytics]);
    // Enviar notificación push
    const showNotification = (title, options = {}) => {
        if (!('Notification' in window) || Notification.permission !== 'granted')
            return;
        const notificationOptions = {
            body: options.body || 'Nueva notificación del sistema',
            icon: options.icon || '/favicon.ico',
            badge: options.badge || '/favicon.ico',
            tag: options.tag || 'default',
            requireInteraction: options.requireInteraction || false,
            silent: options.silent || false,
            ...options
        };
        const notification = new Notification(title, notificationOptions);
        analytics.trackEvent('PWA', 'push_notification_sent', title);
    };
    // Limpiar caché
    const clearCache = useCallback(async () => {
        if (!swState.registration)
            return;
        try {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
            addNotification(createNotification.success('Caché Limpiado', 'Se han eliminado todos los datos en caché.'));
            analytics.trackEvent('PWA', 'cache_cleared');
        }
        catch (error) {
            console.error('Error clearing cache:', error);
            analytics.trackEvent('PWA', 'cache_clear_error', error);
        }
    }, [swState.registration, addNotification, analytics]);
    // Obtener información del caché
    const getCacheInfo = useCallback(async () => {
        try {
            const cacheNames = await caches.keys();
            const cacheInfo = await Promise.all(cacheNames.map(async (cacheName) => {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                return {
                    name: cacheName,
                    size: keys.length,
                    urls: keys.map(key => key.url),
                };
            }));
            return cacheInfo;
        }
        catch (error) {
            console.error('Error getting cache info:', error);
            return [];
        }
    }, []);
    return {
        // Estado
        ...swState,
        ...pwaFeatures,
        // Acciones
        installPWA,
        updateServiceWorker,
        shareContent,
        registerBackgroundSync,
        requestNotificationPermission,
        showNotification,
        clearCache,
        getCacheInfo,
        // Utilidades
        isPWAReady: swState.isReady && swState.isInstalled,
        canUseOffline: swState.isInstalled && swState.isReady,
    };
};
