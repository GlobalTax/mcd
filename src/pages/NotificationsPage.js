import { jsx as _jsx } from "react/jsx-runtime";
import NotificationCenter from '@/components/NotificationCenter';
import ProtectedRoute from '@/components/ProtectedRoute';
const NotificationsPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['franchisee', 'asesor', 'admin', 'superadmin'], children: _jsx(NotificationCenter, {}) }));
};
export default NotificationsPage;
