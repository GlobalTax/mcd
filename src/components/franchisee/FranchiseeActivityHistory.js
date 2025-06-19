import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Filter, Download, Eye, Clock, User, Store, DollarSign, TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
const FranchiseeActivityHistory = () => {
    const { franchisee } = useAuth();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        activity_type: '',
        entity_type: '',
        date_from: '',
        date_to: '',
        search: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const ITEMS_PER_PAGE = 20;
    useEffect(() => {
        if (franchisee) {
            loadActivities();
        }
    }, [franchisee, filters, currentPage]);
    const loadActivities = async () => {
        if (!franchisee)
            return;
        setLoading(true);
        try {
            let query = supabase
                .from('franchisee_activity_log')
                .select('*', { count: 'exact' })
                .eq('franchisee_id', franchisee.id)
                .order('created_at', { ascending: false });
            // Aplicar filtros
            if (filters.activity_type) {
                query = query.eq('activity_type', filters.activity_type);
            }
            if (filters.entity_type) {
                query = query.eq('entity_type', filters.entity_type);
            }
            if (filters.date_from) {
                query = query.gte('created_at', filters.date_from);
            }
            if (filters.date_to) {
                query = query.lte('created_at', filters.date_to);
            }
            if (filters.search) {
                query = query.ilike('activity_description', `%${filters.search}%`);
            }
            // Paginación
            const from = (currentPage - 1) * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            query = query.range(from, to);
            const { data, error, count } = await query;
            if (error)
                throw error;
            setActivities(data || []);
            setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
        }
        catch (error) {
            console.error('Error loading activities:', error);
            toast.error('Error al cargar el historial de actividad');
        }
        finally {
            setLoading(false);
        }
    };
    const getActivityIcon = (activityType) => {
        switch (activityType.toLowerCase()) {
            case 'login':
                return _jsx(User, { className: "h-4 w-4 text-blue-600" });
            case 'restaurant_update':
                return _jsx(Store, { className: "h-4 w-4 text-green-600" });
            case 'financial_update':
                return _jsx(DollarSign, { className: "h-4 w-4 text-yellow-600" });
            case 'performance_improvement':
                return _jsx(TrendingUp, { className: "h-4 w-4 text-purple-600" });
            case 'alert':
                return _jsx(AlertTriangle, { className: "h-4 w-4 text-red-600" });
            case 'success':
                return _jsx(CheckCircle, { className: "h-4 w-4 text-green-600" });
            case 'error':
                return _jsx(XCircle, { className: "h-4 w-4 text-red-600" });
            default:
                return _jsx(Activity, { className: "h-4 w-4 text-gray-600" });
        }
    };
    const getActivityColor = (activityType) => {
        switch (activityType.toLowerCase()) {
            case 'login': return 'bg-blue-100 text-blue-800';
            case 'restaurant_update': return 'bg-green-100 text-green-800';
            case 'financial_update': return 'bg-yellow-100 text-yellow-800';
            case 'performance_improvement': return 'bg-purple-100 text-purple-800';
            case 'alert': return 'bg-red-100 text-red-800';
            case 'success': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getTimeAgo = (dateString) => {
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
    const exportActivities = async () => {
        try {
            const csvContent = [
                ['Fecha', 'Tipo', 'Descripción', 'Entidad', 'Metadatos'].join(','),
                ...activities.map(activity => [
                    formatDate(activity.created_at),
                    activity.activity_type,
                    activity.activity_description,
                    activity.entity_type,
                    JSON.stringify(activity.metadata)
                ].join(','))
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `actividad_franquiciado_${franchisee?.franchisee_name}_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Historial exportado correctamente');
        }
        catch (error) {
            console.error('Error exporting activities:', error);
            toast.error('Error al exportar el historial');
        }
    };
    const clearFilters = () => {
        setFilters({
            activity_type: '',
            entity_type: '',
            date_from: '',
            date_to: '',
            search: ''
        });
        setCurrentPage(1);
    };
    return (_jsxs("div", { className: "container mx-auto p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Historial de Actividad" }), _jsxs("p", { className: "text-gray-600 mt-2", children: ["Registro detallado de todas las actividades de ", franchisee?.franchisee_name] })] }), _jsxs(Button, { onClick: exportActivities, variant: "outline", children: [_jsx(Download, { className: "h-4 w-4 mr-2" }), "Exportar CSV"] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center", children: [_jsx(Filter, { className: "h-5 w-5 mr-2" }), "Filtros"] }) }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "search", children: "Buscar" }), _jsx(Input, { id: "search", placeholder: "Buscar en descripciones...", value: filters.search, onChange: (e) => setFilters({ ...filters, search: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "activity_type", children: "Tipo de Actividad" }), _jsxs(Select, { value: filters.activity_type, onValueChange: (value) => setFilters({ ...filters, activity_type: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Todos los tipos" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todos los tipos" }), _jsx(SelectItem, { value: "login", children: "Inicio de sesi\u00F3n" }), _jsx(SelectItem, { value: "restaurant_update", children: "Actualizaci\u00F3n de restaurante" }), _jsx(SelectItem, { value: "financial_update", children: "Actualizaci\u00F3n financiera" }), _jsx(SelectItem, { value: "performance_improvement", children: "Mejora de rendimiento" }), _jsx(SelectItem, { value: "alert", children: "Alerta" }), _jsx(SelectItem, { value: "success", children: "\u00C9xito" }), _jsx(SelectItem, { value: "error", children: "Error" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "entity_type", children: "Tipo de Entidad" }), _jsxs(Select, { value: filters.entity_type, onValueChange: (value) => setFilters({ ...filters, entity_type: value }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Todas las entidades" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "Todas las entidades" }), _jsx(SelectItem, { value: "restaurant", children: "Restaurante" }), _jsx(SelectItem, { value: "financial", children: "Financiero" }), _jsx(SelectItem, { value: "user", children: "Usuario" }), _jsx(SelectItem, { value: "system", children: "Sistema" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "date_from", children: "Desde" }), _jsx(Input, { id: "date_from", type: "date", value: filters.date_from, onChange: (e) => setFilters({ ...filters, date_from: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "date_to", children: "Hasta" }), _jsx(Input, { id: "date_to", type: "date", value: filters.date_to, onChange: (e) => setFilters({ ...filters, date_to: e.target.value }) })] })] }), _jsx("div", { className: "flex justify-end mt-4", children: _jsx(Button, { variant: "outline", onClick: clearFilters, children: "Limpiar Filtros" }) })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { children: ["Actividades (", activities.length, ")"] }) }), _jsxs(CardContent, { children: [loading ? (_jsxs("div", { className: "flex items-center justify-center py-8", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-4 border-red-200 border-t-red-600" }), _jsx("span", { className: "ml-2", children: "Cargando actividades..." })] })) : activities.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx(Activity, { className: "h-12 w-12 mx-auto mb-4 text-gray-300" }), _jsx("p", { children: "No se encontraron actividades" })] })) : (_jsx("div", { className: "space-y-4", children: activities.map((activity) => (_jsxs("div", { className: "flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer", onClick: () => setSelectedActivity(activity), children: [_jsx("div", { className: "flex-shrink-0", children: getActivityIcon(activity.activity_type) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Badge, { className: getActivityColor(activity.activity_type), children: activity.activity_type }), activity.entity_type && (_jsx(Badge, { variant: "outline", children: activity.entity_type }))] }), _jsxs("div", { className: "flex items-center text-sm text-gray-500", children: [_jsx(Clock, { className: "h-4 w-4 mr-1" }), getTimeAgo(activity.created_at)] })] }), _jsx("p", { className: "mt-2 text-sm text-gray-900", children: activity.activity_description }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: formatDate(activity.created_at) })] }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Eye, { className: "h-4 w-4" }) })] }, activity.id))) })), totalPages > 1 && (_jsxs("div", { className: "flex items-center justify-between mt-6", children: [_jsxs("p", { className: "text-sm text-gray-700", children: ["P\u00E1gina ", currentPage, " de ", totalPages] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(currentPage - 1), disabled: currentPage === 1, children: "Anterior" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => setCurrentPage(currentPage + 1), disabled: currentPage === totalPages, children: "Siguiente" })] })] }))] })] }), selectedActivity && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Detalles de la Actividad" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => setSelectedActivity(null), children: _jsx(XCircle, { className: "h-4 w-4" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Tipo de Actividad" }), _jsxs("div", { className: "flex items-center mt-1", children: [getActivityIcon(selectedActivity.activity_type), _jsx(Badge, { className: `ml-2 ${getActivityColor(selectedActivity.activity_type)}`, children: selectedActivity.activity_type })] })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Descripci\u00F3n" }), _jsx("p", { className: "mt-1 text-sm", children: selectedActivity.activity_description })] }), _jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Fecha y Hora" }), _jsx("p", { className: "mt-1 text-sm", children: formatDate(selectedActivity.created_at) })] }), selectedActivity.entity_type && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Tipo de Entidad" }), _jsx("p", { className: "mt-1 text-sm", children: selectedActivity.entity_type })] })), selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (_jsxs("div", { children: [_jsx(Label, { className: "text-sm font-medium", children: "Metadatos" }), _jsx("pre", { className: "mt-1 text-sm bg-gray-100 p-2 rounded overflow-x-auto", children: JSON.stringify(selectedActivity.metadata, null, 2) })] }))] })] }) }))] }));
};
export default FranchiseeActivityHistory;
