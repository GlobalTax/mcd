import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { Building, Edit, Trash2, Plus, Search, MapPin, Hash, ExternalLink, Settings2, Calendar, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
const ITEMS_PER_PAGE = 40;
export const BaseRestaurantsTable = ({ restaurants, onRefresh }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [columnSettings, setColumnSettings] = useState({
        franchiseeInfo: false,
        propertyDetails: false,
        dates: false,
        location: true
    });
    const [formData, setFormData] = useState({
        site_number: '',
        restaurant_name: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'España',
        restaurant_type: 'traditional',
        property_type: '',
        autonomous_community: '',
        square_meters: '',
        seating_capacity: '',
        opening_date: ''
    });
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(restaurant => restaurant.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.site_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (restaurant.city && restaurant.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (restaurant.address && restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [restaurants, searchTerm]);
    // Cálculos de paginación
    const totalPages = Math.ceil(filteredRestaurants.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentRestaurants = filteredRestaurants.slice(startIndex, endIndex);
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll suave hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Reset page cuando cambia el término de búsqueda
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);
    const createGoogleMapsLink = (address, city) => {
        if (!address && !city)
            return null;
        const fullAddress = [address, city].filter(Boolean).join(', ');
        const encodedAddress = encodeURIComponent(fullAddress);
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    };
    const formatDate = (dateString) => {
        if (!dateString)
            return '-';
        return new Date(dateString).toLocaleDateString('es-ES');
    };
    const resetForm = () => {
        setFormData({
            site_number: '',
            restaurant_name: '',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            country: 'España',
            restaurant_type: 'traditional',
            property_type: '',
            autonomous_community: '',
            square_meters: '',
            seating_capacity: '',
            opening_date: ''
        });
    };
    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { error } = await supabase
                .from('base_restaurants')
                .insert({
                site_number: formData.site_number,
                restaurant_name: formData.restaurant_name,
                address: formData.address,
                city: formData.city,
                state: formData.state || null,
                postal_code: formData.postal_code || null,
                country: formData.country,
                restaurant_type: formData.restaurant_type,
                property_type: formData.property_type || null,
                autonomous_community: formData.autonomous_community || null,
                square_meters: formData.square_meters ? parseInt(formData.square_meters) : null,
                seating_capacity: formData.seating_capacity ? parseInt(formData.seating_capacity) : null,
                opening_date: formData.opening_date || null
            });
            if (error) {
                toast.error('Error al crear el restaurante');
                return;
            }
            toast.success('Restaurante creado exitosamente');
            setIsCreateModalOpen(false);
            resetForm();
            onRefresh();
        }
        catch (error) {
            console.error('Error in handleCreate:', error);
            toast.error('Error al crear el restaurante');
        }
        finally {
            setCreating(false);
        }
    };
    const handleEdit = async (e) => {
        e.preventDefault();
        if (!selectedRestaurant)
            return;
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('base_restaurants')
                .update({
                site_number: formData.site_number,
                restaurant_name: formData.restaurant_name,
                address: formData.address,
                city: formData.city,
                state: formData.state || null,
                postal_code: formData.postal_code || null,
                country: formData.country,
                restaurant_type: formData.restaurant_type,
                property_type: formData.property_type || null,
                autonomous_community: formData.autonomous_community || null,
                square_meters: formData.square_meters ? parseInt(formData.square_meters) : null,
                seating_capacity: formData.seating_capacity ? parseInt(formData.seating_capacity) : null,
                opening_date: formData.opening_date || null
            })
                .eq('id', selectedRestaurant.id);
            if (error) {
                toast.error('Error al actualizar el restaurante');
                return;
            }
            toast.success('Restaurante actualizado exitosamente');
            setIsEditModalOpen(false);
            setSelectedRestaurant(null);
            resetForm();
            onRefresh();
        }
        catch (error) {
            console.error('Error in handleEdit:', error);
            toast.error('Error al actualizar el restaurante');
        }
        finally {
            setUpdating(false);
        }
    };
    const handleDelete = async (restaurant) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar el restaurante ${restaurant.restaurant_name}?`)) {
            return;
        }
        try {
            const { error } = await supabase
                .from('base_restaurants')
                .delete()
                .eq('id', restaurant.id);
            if (error) {
                toast.error('Error al eliminar el restaurante');
                return;
            }
            toast.success('Restaurante eliminado exitosamente');
            onRefresh();
        }
        catch (error) {
            console.error('Error in handleDelete:', error);
            toast.error('Error al eliminar el restaurante');
        }
    };
    const openEditModal = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setFormData({
            site_number: restaurant.site_number,
            restaurant_name: restaurant.restaurant_name,
            address: restaurant.address,
            city: restaurant.city,
            state: restaurant.state || '',
            postal_code: restaurant.postal_code || '',
            country: restaurant.country,
            restaurant_type: restaurant.restaurant_type,
            property_type: restaurant.property_type || '',
            autonomous_community: restaurant.autonomous_community || '',
            square_meters: restaurant.square_meters?.toString() || '',
            seating_capacity: restaurant.seating_capacity?.toString() || '',
            opening_date: restaurant.opening_date || ''
        });
        setIsEditModalOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("h3", { className: "text-lg font-semibold", children: ["Restaurantes Base (", filteredRestaurants.length, ")"] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Dialog, { open: isColumnSettingsOpen, onOpenChange: setIsColumnSettingsOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "sm", children: [_jsx(Settings2, { className: "w-4 h-4 mr-2" }), "Columnas"] }) }), _jsxs(DialogContent, { className: "max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Configurar Columnas" }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "franchiseeInfo", checked: columnSettings.franchiseeInfo, onCheckedChange: (checked) => setColumnSettings(prev => ({ ...prev, franchiseeInfo: checked })) }), _jsxs(Label, { htmlFor: "franchiseeInfo", className: "flex items-center gap-2", children: [_jsx(User, { className: "w-4 h-4" }), "Informaci\u00F3n de Franquiciado"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "propertyDetails", checked: columnSettings.propertyDetails, onCheckedChange: (checked) => setColumnSettings(prev => ({ ...prev, propertyDetails: checked })) }), _jsxs(Label, { htmlFor: "propertyDetails", className: "flex items-center gap-2", children: [_jsx(Building, { className: "w-4 h-4" }), "Detalles de Propiedad"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "dates", checked: columnSettings.dates, onCheckedChange: (checked) => setColumnSettings(prev => ({ ...prev, dates: checked })) }), _jsxs(Label, { htmlFor: "dates", className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), "Fechas"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "location", checked: columnSettings.location, onCheckedChange: (checked) => setColumnSettings(prev => ({ ...prev, location: checked })) }), _jsxs(Label, { htmlFor: "location", className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-4 h-4" }), "Ubicaci\u00F3n Detallada"] })] })] })] })] }), _jsxs(Dialog, { open: isCreateModalOpen, onOpenChange: setIsCreateModalOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "bg-red-600 hover:bg-red-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Crear Restaurante"] }) }), _jsxs(DialogContent, { className: "max-w-3xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Crear Nuevo Restaurante" }) }), _jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "site_number", children: "N\u00FAmero de Sitio" }), _jsx(Input, { id: "site_number", value: formData.site_number, onChange: (e) => setFormData({ ...formData, site_number: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "restaurant_name", children: "Nombre del Restaurante" }), _jsx(Input, { id: "restaurant_name", value: formData.restaurant_name, onChange: (e) => setFormData({ ...formData, restaurant_name: e.target.value }), required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Direcci\u00F3n" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "col-span-2", children: _jsx(Input, { placeholder: "Direcci\u00F3n", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Ciudad", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Provincia", value: formData.state, onChange: (e) => setFormData({ ...formData, state: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "C\u00F3digo Postal", value: formData.postal_code, onChange: (e) => setFormData({ ...formData, postal_code: e.target.value }) }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "country", children: "Pa\u00EDs" }), _jsx(Input, { id: "country", value: formData.country, onChange: (e) => setFormData({ ...formData, country: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "restaurant_type", children: "Tipo de Restaurante" }), _jsx(Input, { id: "restaurant_type", value: formData.restaurant_type, onChange: (e) => setFormData({ ...formData, restaurant_type: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "property_type", children: "Tipo de Propiedad" }), _jsx(Input, { id: "property_type", value: formData.property_type, onChange: (e) => setFormData({ ...formData, property_type: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "autonomous_community", children: "Comunidad Aut\u00F3noma" }), _jsx(Input, { id: "autonomous_community", value: formData.autonomous_community, onChange: (e) => setFormData({ ...formData, autonomous_community: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "square_meters", children: "Metros Cuadrados" }), _jsx(Input, { id: "square_meters", type: "number", value: formData.square_meters, onChange: (e) => setFormData({ ...formData, square_meters: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "seating_capacity", children: "Capacidad de Asientos" }), _jsx(Input, { id: "seating_capacity", type: "number", value: formData.seating_capacity, onChange: (e) => setFormData({ ...formData, seating_capacity: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "opening_date", children: "Fecha de Apertura" }), _jsx(Input, { id: "opening_date", type: "date", value: formData.opening_date, onChange: (e) => setFormData({ ...formData, opening_date: e.target.value }) })] })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => { setIsCreateModalOpen(false); resetForm(); }, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: creating, className: "bg-red-600 hover:bg-red-700", children: creating ? 'Creando...' : 'Crear Restaurante' })] })] })] })] })] })] }), _jsx("div", { className: "mb-6", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-3 h-4 w-4 text-gray-400" }), _jsx(Input, { placeholder: "Buscar restaurantes por nombre, n\u00FAmero de sitio, ciudad o direcci\u00F3n...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10" })] }) }), filteredRestaurants.length > 0 && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["Mostrando ", startIndex + 1, "-", Math.min(endIndex, filteredRestaurants.length), " de ", filteredRestaurants.length, " restaurantes"] }), totalPages > 1 && (_jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => handlePageChange(Math.max(1, currentPage - 1)), className: currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(page), isActive: currentPage === page, className: "cursor-pointer", children: page }) }, page))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => handlePageChange(Math.min(totalPages, currentPage + 1)), className: currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) })] }) }))] })), _jsx("div", { className: "border rounded-lg overflow-x-auto", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Restaurante" }), _jsx(TableHead, { children: "Ubicaci\u00F3n" }), columnSettings.franchiseeInfo && _jsx(TableHead, { children: "Franquiciado" }), columnSettings.propertyDetails && _jsx(TableHead, { children: "Propiedad" }), columnSettings.dates && _jsx(TableHead, { children: "Fecha Apertura" }), columnSettings.location && _jsx(TableHead, { children: "Ubicaci\u00F3n Detallada" }), _jsx(TableHead, { children: "Tipo" }), _jsx(TableHead, { children: "Capacidad" }), _jsx(TableHead, { children: "Acciones" })] }) }), _jsx(TableBody, { children: currentRestaurants.map((restaurant) => {
                                const googleMapsLink = createGoogleMapsLink(restaurant.address, restaurant.city);
                                return (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: restaurant.restaurant_name }), _jsxs("div", { className: "text-sm text-gray-500 flex items-center gap-1", children: [_jsx(Hash, { className: "w-3 h-3" }), restaurant.site_number] })] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-start gap-1", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400 mt-0.5" }), _jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: restaurant.city }), googleMapsLink && (_jsx("a", { href: googleMapsLink, target: "_blank", rel: "noopener noreferrer", className: "text-blue-600 hover:text-blue-800 transition-colors", title: "Ver en Google Maps", children: _jsx(ExternalLink, { className: "w-3 h-3" }) }))] }), _jsx("div", { className: "text-gray-500", children: restaurant.address })] })] }) }), columnSettings.franchiseeInfo && (_jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [restaurant.franchisee_name && (_jsx("div", { className: "font-medium", children: restaurant.franchisee_name })), restaurant.franchisee_email && (_jsx("div", { className: "text-gray-500", children: restaurant.franchisee_email })), restaurant.company_tax_id && (_jsx("div", { className: "text-xs text-gray-400", children: restaurant.company_tax_id }))] }) })), columnSettings.propertyDetails && (_jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [restaurant.property_type && (_jsx("div", { children: restaurant.property_type })), restaurant.autonomous_community && (_jsx("div", { className: "text-gray-500", children: restaurant.autonomous_community }))] }) })), columnSettings.dates && (_jsx(TableCell, { children: _jsxs("div", { className: "text-sm flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3 text-gray-400" }), formatDate(restaurant.opening_date)] }) })), columnSettings.location && (_jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [restaurant.state && (_jsx("div", { children: restaurant.state })), restaurant.postal_code && (_jsx("div", { className: "text-gray-500", children: restaurant.postal_code })), restaurant.country && (_jsx("div", { className: "text-xs text-gray-400", children: restaurant.country }))] }) })), _jsx(TableCell, { children: _jsx(Badge, { variant: "outline", children: restaurant.restaurant_type === 'traditional' ? 'Tradicional' : restaurant.restaurant_type }) }), _jsx(TableCell, { children: _jsxs("div", { className: "text-sm", children: [restaurant.seating_capacity && (_jsxs("div", { children: [restaurant.seating_capacity, " asientos"] })), restaurant.square_meters && (_jsxs("div", { className: "text-gray-500", children: [restaurant.square_meters, " m\u00B2"] }))] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { size: "sm", variant: "outline", onClick: () => openEditModal(restaurant), children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "destructive", onClick: () => handleDelete(restaurant), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, restaurant.id));
                            }) })] }) }), totalPages > 1 && (_jsx("div", { className: "flex justify-center", children: _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => handlePageChange(Math.max(1, currentPage - 1)), className: currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(page), isActive: currentPage === page, className: "cursor-pointer", children: page }) }, page))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => handlePageChange(Math.min(totalPages, currentPage + 1)), className: currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) })] }) }) })), filteredRestaurants.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Building, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: searchTerm ? 'No se encontraron restaurantes' : 'No hay restaurantes' }), _jsx("p", { className: "text-gray-500", children: searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea el primer restaurante para comenzar' })] })), _jsx(Dialog, { open: isEditModalOpen, onOpenChange: setIsEditModalOpen, children: _jsxs(DialogContent, { className: "max-w-3xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Editar Restaurante" }) }), _jsxs("form", { onSubmit: handleEdit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_site_number", children: "N\u00FAmero de Sitio" }), _jsx(Input, { id: "edit_site_number", value: formData.site_number, onChange: (e) => setFormData({ ...formData, site_number: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_restaurant_name", children: "Nombre del Restaurante" }), _jsx(Input, { id: "edit_restaurant_name", value: formData.restaurant_name, onChange: (e) => setFormData({ ...formData, restaurant_name: e.target.value }), required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Direcci\u00F3n" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "col-span-2", children: _jsx(Input, { placeholder: "Direcci\u00F3n", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Ciudad", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Provincia", value: formData.state, onChange: (e) => setFormData({ ...formData, state: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "C\u00F3digo Postal", value: formData.postal_code, onChange: (e) => setFormData({ ...formData, postal_code: e.target.value }) }) })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_country", children: "Pa\u00EDs" }), _jsx(Input, { id: "edit_country", value: formData.country, onChange: (e) => setFormData({ ...formData, country: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_restaurant_type", children: "Tipo de Restaurante" }), _jsx(Input, { id: "edit_restaurant_type", value: formData.restaurant_type, onChange: (e) => setFormData({ ...formData, restaurant_type: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_property_type", children: "Tipo de Propiedad" }), _jsx(Input, { id: "edit_property_type", value: formData.property_type, onChange: (e) => setFormData({ ...formData, property_type: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_autonomous_community", children: "Comunidad Aut\u00F3noma" }), _jsx(Input, { id: "edit_autonomous_community", value: formData.autonomous_community, onChange: (e) => setFormData({ ...formData, autonomous_community: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_square_meters", children: "Metros Cuadrados" }), _jsx(Input, { id: "edit_square_meters", type: "number", value: formData.square_meters, onChange: (e) => setFormData({ ...formData, square_meters: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_seating_capacity", children: "Capacidad de Asientos" }), _jsx(Input, { id: "edit_seating_capacity", type: "number", value: formData.seating_capacity, onChange: (e) => setFormData({ ...formData, seating_capacity: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_opening_date", children: "Fecha de Apertura" }), _jsx(Input, { id: "edit_opening_date", type: "date", value: formData.opening_date, onChange: (e) => setFormData({ ...formData, opening_date: e.target.value }) })] })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => { setIsEditModalOpen(false); setSelectedRestaurant(null); resetForm(); }, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: updating, className: "bg-red-600 hover:bg-red-700", children: updating ? 'Actualizando...' : 'Guardar Cambios' })] })] })] }) })] }));
};
