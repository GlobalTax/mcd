import { jsx as _jsx } from "react/jsx-runtime";
import AuditComplianceSystem from '@/components/audit/AuditComplianceSystem';
import ProtectedRoute from '@/components/ProtectedRoute';
const AuditCompliancePage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(AuditComplianceSystem, {}) }));
};
export default AuditCompliancePage;
