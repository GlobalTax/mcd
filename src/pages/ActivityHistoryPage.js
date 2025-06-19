import { jsx as _jsx } from "react/jsx-runtime";
import FranchiseeActivityHistory from '@/components/franchisee/FranchiseeActivityHistory';
import ProtectedRoute from '@/components/ProtectedRoute';
const ActivityHistoryPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['franchisee', 'asesor', 'admin', 'superadmin'], children: _jsx(FranchiseeActivityHistory, {}) }));
};
export default ActivityHistoryPage;
