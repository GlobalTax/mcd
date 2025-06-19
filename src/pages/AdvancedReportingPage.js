import { jsx as _jsx } from "react/jsx-runtime";
import AdvancedReportingSystem from '@/components/reports/AdvancedReportingSystem';
import ProtectedRoute from '@/components/ProtectedRoute';
const AdvancedReportingPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin', 'asesor'], children: _jsx(AdvancedReportingSystem, {}) }));
};
export default AdvancedReportingPage;
