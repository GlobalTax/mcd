import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleReset = () => {
            this.setState({ hasError: false, error: undefined, errorInfo: undefined });
        };
        this.handleGoHome = () => {
            window.location.href = '/';
        };
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error, errorInfo });
        // Aquí podrías enviar el error a un servicio de logging
        // logErrorToService(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4", children: _jsxs(Card, { className: "w-full max-w-md", children: [_jsxs(CardHeader, { className: "text-center", children: [_jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100", children: _jsx(AlertTriangle, { className: "h-6 w-6 text-red-600" }) }), _jsx(CardTitle, { className: "text-xl text-red-800", children: "Algo sali\u00F3 mal" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx("p", { className: "text-gray-600 text-center", children: "Ha ocurrido un error inesperado. Por favor, intenta recargar la p\u00E1gina o contacta al soporte t\u00E9cnico." }), process.env.NODE_ENV === 'development' && this.state.error && (_jsxs("details", { className: "mt-4", children: [_jsx("summary", { className: "cursor-pointer text-sm font-medium text-gray-700", children: "Detalles del error (solo desarrollo)" }), _jsxs("div", { className: "mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto", children: [_jsxs("div", { className: "mb-2", children: [_jsx("strong", { children: "Error:" }), " ", this.state.error.message] }), this.state.errorInfo && (_jsxs("div", { children: [_jsx("strong", { children: "Stack:" }), _jsx("pre", { className: "mt-1 whitespace-pre-wrap", children: this.state.errorInfo.componentStack })] }))] })] })), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { onClick: this.handleReset, className: "flex-1", variant: "outline", children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Reintentar"] }), _jsxs(Button, { onClick: this.handleGoHome, className: "flex-1", children: [_jsx(Home, { className: "h-4 w-4 mr-2" }), "Inicio"] })] })] })] }) }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
