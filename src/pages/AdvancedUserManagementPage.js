import { jsx as _jsx } from "react/jsx-runtime";
import AdvancedUserManagement from '@/components/admin/AdvancedUserManagement';
import ProtectedRoute from '@/components/ProtectedRoute';
const AdvancedUserManagementPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(AdvancedUserManagement, {}) }));
};
export default AdvancedUserManagementPage;
