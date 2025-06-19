import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Building, Grid, List, Eye, AlertCircle, RefreshCw } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFranchisees } from '@/hooks/useFranchisees';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FranchiseeCard } from './FranchiseeCard';
import { RestaurantAssignmentDialog } from './RestaurantAssignmentDialog';
import { useNavigate } from 'react-router-dom';
import { FranchiseeFiltersComponent } from './FranchiseeFilters';
import { useFranchiseeFilters } from '@/hooks/useFranchiseeFilters';
const ITEMS_PER_PAGE = 40;
export const FranchiseesManagement = () => {
    const { franchisees, loading, error, refetch: onRefresh } = useFranchisees();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedFranchisee, setSelectedFranchisee] = useState(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [viewMode, setViewMode] = useState('cards');
    // Usar el hook de filtros
    const { filters, setFilters, filteredFranchisees, clearFilters } = useFranchiseeFilters(franchisees);
    const [formData, setFormData] = useState({
        franchisee_name: '',
        company_name: '',
        tax_id: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        email: '',
        phone: '',
        password: ''
    });
    console.log('FranchiseesManagement render - loading:', loading, 'error:', error, 'franchisees:', franchisees);
    // Cálculos de paginación con franquiciados filtrados
    const totalPages = Math.ceil(filteredFranchisees.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentFranchisees = filteredFranchisees.slice(startIndex, endIndex);
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    // Reset page cuando cambian los filtros
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filters]);
    const resetForm = () => {
        setFormData({
            franchisee_name: '',
            company_name: '',
            tax_id: '',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            email: '',
            phone: '',
            password: ''
        });
    };
    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email: formData.email,
                password: formData.password,
                user_metadata: {
                    full_name: formData.franchisee_name,
                    role: 'franchisee'
                }
            });
            if (authError) {
                toast.error('Error al crear usuario: ' + authError.message);
                return;
            }
            if (authData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({
                    role: 'franchisee',
                    full_name: formData.franchisee_name,
                    phone: formData.phone
                })
                    .eq('id', authData.user.id);
                if (profileError) {
                    console.error('Error updating profile:', profileError);
                }
                const { error: franchiseeError } = await supabase
                    .from('franchisees')
                    .insert({
                    user_id: authData.user.id,
                    franchisee_name: formData.franchisee_name,
                    company_name: formData.company_name,
                    tax_id: formData.tax_id,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    postal_code: formData.postal_code
                });
                if (franchiseeError) {
                    console.error('Error creating franchisee:', franchiseeError);
                    toast.error('Error al crear el franquiciado');
                    return;
                }
                toast.success('Franquiciado creado exitosamente');
                setIsCreateModalOpen(false);
                resetForm();
                onRefresh();
            }
        }
        catch (error) {
            console.error('Error in handleCreate:', error);
            toast.error('Error al crear el franquiciado');
        }
        finally {
            setCreating(false);
        }
    };
    const handleEdit = async (e) => {
        e.preventDefault();
        if (!selectedFranchisee)
            return;
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('franchisees')
                .update({
                franchisee_name: formData.franchisee_name,
                company_name: formData.company_name,
                tax_id: formData.tax_id,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                postal_code: formData.postal_code
            })
                .eq('id', selectedFranchisee.id);
            if (error) {
                toast.error('Error al actualizar el franquiciado');
                return;
            }
            toast.success('Franquiciado actualizado exitosamente');
            setIsEditModalOpen(false);
            setSelectedFranchisee(null);
            resetForm();
            onRefresh();
        }
        catch (error) {
            console.error('Error in handleEdit:', error);
            toast.error('Error al actualizar el franquiciado');
        }
        finally {
            setUpdating(false);
        }
    };
    const handleDelete = async (franchisee) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar el franquiciado ${franchisee.franchisee_name}?`)) {
            return;
        }
        try {
            const { error } = await supabase
                .from('franchisees')
                .delete()
                .eq('id', franchisee.id);
            if (error) {
                toast.error('Error al eliminar el franquiciado');
                return;
            }
            toast.success('Franquiciado eliminado exitosamente');
            onRefresh();
        }
        catch (error) {
            console.error('Error in handleDelete:', error);
            toast.error('Error al eliminar el franquiciado');
        }
    };
    const openEditModal = (franchisee) => {
        setSelectedFranchisee(franchisee);
        setFormData({
            franchisee_name: franchisee.franchisee_name,
            company_name: franchisee.company_name || '',
            tax_id: franchisee.tax_id || '',
            address: franchisee.address || '',
            city: franchisee.city || '',
            state: franchisee.state || '',
            postal_code: franchisee.postal_code || '',
            email: '',
            phone: '',
            password: ''
        });
        setIsEditModalOpen(true);
    };
    const openAssignModal = (franchisee) => {
        setSelectedFranchisee(franchisee);
        setIsAssignModalOpen(true);
    };
    const handleViewDetails = (franchisee) => {
        navigate(`/advisor/franchisee/${franchisee.id}`);
    };
    if (loading) {
        return (_jsx("div", { className: "flex justify-center items-center py-12", children: _jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" }), _jsx("span", { className: "text-lg", children: "Cargando franquiciados..." }), _jsx("p", { className: "text-sm text-gray-500", children: "Verificando conexi\u00F3n con la base de datos" })] }) }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex flex-col items-center py-12 space-y-4", children: [_jsxs(Alert, { className: "max-w-2xl", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsxs(AlertDescription, { children: [_jsx("strong", { children: "Error al cargar franquiciados:" }), " ", error] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { onClick: onRefresh, variant: "outline", className: "flex items-center gap-2", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Intentar de nuevo"] }), _jsx(Button, { onClick: () => window.location.reload(), variant: "outline", children: "Recargar p\u00E1gina" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Gesti\u00F3n de Franquiciados" }), _jsxs("p", { className: "text-sm text-gray-500 mt-1", children: ["Mostrando ", filteredFranchisees.length, " de ", franchisees.length, " franquiciados"] })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex border rounded-lg", children: [_jsx(Button, { variant: viewMode === 'cards' ? 'default' : 'ghost', size: "sm", onClick: () => setViewMode('cards'), className: "rounded-r-none", children: _jsx(Grid, { className: "w-4 h-4" }) }), _jsx(Button, { variant: viewMode === 'table' ? 'default' : 'ghost', size: "sm", onClick: () => setViewMode('table'), className: "rounded-l-none", children: _jsx(List, { className: "w-4 h-4" }) })] }), _jsxs(Dialog, { open: isCreateModalOpen, onOpenChange: setIsCreateModalOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "bg-red-600 hover:bg-red-700", children: [_jsx(Plus, { className: "w-4 h-4 mr-2" }), "Crear Franquiciado"] }) }), _jsxs(DialogContent, { className: "max-w-3xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Crear Nuevo Franquiciado" }) }), _jsxs("form", { onSubmit: handleCreate, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "franchisee_name", children: "Nombre del Franquiciado" }), _jsx(Input, { id: "franchisee_name", value: formData.franchisee_name, onChange: (e) => setFormData({ ...formData, franchisee_name: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "company_name", children: "Nombre de la Empresa" }), _jsx(Input, { id: "company_name", value: formData.company_name, onChange: (e) => setFormData({ ...formData, company_name: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "tax_id", children: "CIF/NIF" }), _jsx(Input, { id: "tax_id", value: formData.tax_id, onChange: (e) => setFormData({ ...formData, tax_id: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "phone", children: "Tel\u00E9fono" }), _jsx(Input, { id: "phone", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "password", children: "Contrase\u00F1a" }), _jsx(Input, { id: "password", type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), minLength: 6, required: true })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Direcci\u00F3n" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "col-span-2", children: _jsx(Input, { placeholder: "Direcci\u00F3n", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Ciudad", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Provincia", value: formData.state, onChange: (e) => setFormData({ ...formData, state: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "C\u00F3digo Postal", value: formData.postal_code, onChange: (e) => setFormData({ ...formData, postal_code: e.target.value }) }) })] })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => { setIsCreateModalOpen(false); resetForm(); }, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: creating, className: "bg-red-600 hover:bg-red-700", children: creating ? 'Creando...' : 'Crear Franquiciado' })] })] })] })] })] })] }), _jsx(FranchiseeFiltersComponent, { franchisees: franchisees, filters: filters, onFiltersChange: setFilters, onClearFilters: clearFilters }), viewMode === 'cards' && filteredFranchisees.length > 0 && (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { className: "text-sm text-gray-500", children: ["Mostrando ", startIndex + 1, "-", Math.min(endIndex, filteredFranchisees.length), " de ", filteredFranchisees.length, " franquiciados"] }), totalPages > 1 && (_jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => handlePageChange(Math.max(1, currentPage - 1)), className: currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(page), isActive: currentPage === page, className: "cursor-pointer", children: page }) }, page))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => handlePageChange(Math.min(totalPages, currentPage + 1)), className: currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) })] }) }))] })), viewMode === 'cards' ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: currentFranchisees.map((franchisee) => (_jsx(FranchiseeCard, { franchisee: franchisee, onEdit: openEditModal, onDelete: handleDelete, onAssignRestaurant: openAssignModal }, franchisee.id))) })) : (_jsxs("div", { className: "space-y-4", children: [filteredFranchisees.length > 0 && (_jsx("div", { className: "flex justify-between items-center", children: _jsxs("div", { className: "text-sm text-gray-500", children: ["Mostrando ", startIndex + 1, "-", Math.min(endIndex, filteredFranchisees.length), " de ", filteredFranchisees.length, " franquiciados"] }) })), _jsx("div", { className: "border rounded-lg", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Nombre" }), _jsx(TableHead, { children: "Empresa" }), _jsx(TableHead, { children: "CIF/NIF" }), _jsx(TableHead, { children: "Ciudad" }), _jsx(TableHead, { children: "Acciones" })] }) }), _jsx(TableBody, { children: currentFranchisees.map((franchisee) => (_jsxs(TableRow, { className: "cursor-pointer hover:bg-gray-50", onClick: () => handleViewDetails(franchisee), children: [_jsx(TableCell, { className: "font-medium", children: franchisee.franchisee_name }), _jsx(TableCell, { children: franchisee.company_name || '-' }), _jsx(TableCell, { children: franchisee.tax_id || '-' }), _jsx(TableCell, { children: franchisee.city || '-' }), _jsx(TableCell, { children: _jsxs("div", { className: "flex space-x-2", children: [_jsxs(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                                                e.stopPropagation();
                                                                openAssignModal(franchisee);
                                                            }, children: [_jsx(Plus, { className: "w-3 h-3 mr-1" }), "Asignar"] }), _jsx(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                                                e.stopPropagation();
                                                                handleViewDetails(franchisee);
                                                            }, children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "outline", onClick: (e) => {
                                                                e.stopPropagation();
                                                                openEditModal(franchisee);
                                                            }, children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "destructive", onClick: (e) => {
                                                                e.stopPropagation();
                                                                handleDelete(franchisee);
                                                            }, children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, franchisee.id))) })] }) }), totalPages > 1 && (_jsx("div", { className: "flex justify-center", children: _jsx(Pagination, { children: _jsxs(PaginationContent, { children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => handlePageChange(Math.max(1, currentPage - 1)), className: currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx(PaginationItem, { children: _jsx(PaginationLink, { onClick: () => handlePageChange(page), isActive: currentPage === page, className: "cursor-pointer", children: page }) }, page))), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => handlePageChange(Math.min(totalPages, currentPage + 1)), className: currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer' }) })] }) }) }))] })), filteredFranchisees.length === 0 && !loading && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Building, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "No se encontraron franquiciados" }), _jsx("p", { className: "text-gray-500 mb-4", children: "Intenta ajustar los filtros para encontrar lo que buscas" }), _jsxs("div", { className: "flex justify-center space-x-2", children: [_jsxs(Button, { onClick: clearFilters, variant: "outline", className: "flex items-center gap-2", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Limpiar filtros"] }), _jsxs(Button, { onClick: onRefresh, variant: "outline", className: "flex items-center gap-2", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), "Recargar datos"] })] })] })), _jsx(Dialog, { open: isEditModalOpen, onOpenChange: setIsEditModalOpen, children: _jsxs(DialogContent, { className: "max-w-3xl", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Editar Franquiciado" }) }), _jsxs("form", { onSubmit: handleEdit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_franchisee_name", children: "Nombre del Franquiciado" }), _jsx(Input, { id: "edit_franchisee_name", value: formData.franchisee_name, onChange: (e) => setFormData({ ...formData, franchisee_name: e.target.value }), required: true })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_company_name", children: "Nombre de la Empresa" }), _jsx(Input, { id: "edit_company_name", value: formData.company_name, onChange: (e) => setFormData({ ...formData, company_name: e.target.value }) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "edit_tax_id", children: "CIF/NIF" }), _jsx(Input, { id: "edit_tax_id", value: formData.tax_id, onChange: (e) => setFormData({ ...formData, tax_id: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Direcci\u00F3n" }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx("div", { className: "col-span-2", children: _jsx(Input, { placeholder: "Direcci\u00F3n", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Ciudad", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "Provincia", value: formData.state, onChange: (e) => setFormData({ ...formData, state: e.target.value }) }) }), _jsx("div", { children: _jsx(Input, { placeholder: "C\u00F3digo Postal", value: formData.postal_code, onChange: (e) => setFormData({ ...formData, postal_code: e.target.value }) }) })] })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => { setIsEditModalOpen(false); setSelectedFranchisee(null); resetForm(); }, children: "Cancelar" }), _jsx(Button, { type: "submit", disabled: updating, className: "bg-red-600 hover:bg-red-700", children: updating ? 'Actualizando...' : 'Guardar Cambios' })] })] })] }) }), _jsx(RestaurantAssignmentDialog, { isOpen: isAssignModalOpen, onClose: () => setIsAssignModalOpen(false), selectedFranchisee: selectedFranchisee })] }));
};
