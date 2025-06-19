import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Bot, User, Loader2, Sparkles, Lightbulb, TrendingUp, Calculator, FileText, BarChart3, RefreshCw, Copy, Target, DollarSign } from 'lucide-react';
import { useAnalytics } from '@/utils/analytics';
import { useNotifications, createNotification } from '@/components/NotificationSystem';
const AIAssistant = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [selectedMode, setSelectedMode] = useState('chat');
    const [conversationContext, setConversationContext] = useState('');
    const [aiPersonality, setAiPersonality] = useState('advisor');
    const messagesEndRef = useRef(null);
    const analytics = useAnalytics();
    const { addNotification } = useNotifications();
    // Mensaje de bienvenida
    useEffect(() => {
        const welcomeMessage = {
            id: 'welcome',
            type: 'assistant',
            content: `¡Hola! Soy tu asistente IA especializado en gestión de franquicias McDonald's. Puedo ayudarte con:

• Análisis de valoración DCF
• Revisión de presupuestos
• Análisis de rendimiento
• Generación de reportes
• Cálculos financieros
• Insights y recomendaciones

¿En qué puedo ayudarte hoy?`,
            timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
    }, []);
    // Auto-scroll al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    // Acciones rápidas predefinidas
    const quickActions = [
        {
            id: 'valuation-analysis',
            title: 'Análisis de Valoración',
            description: 'Analizar la valoración DCF de un restaurante',
            icon: _jsx(Calculator, { className: "h-4 w-4" }),
            category: 'analysis',
            action: () => handleQuickAction('valuation-analysis'),
        },
        {
            id: 'budget-review',
            title: 'Revisar Presupuesto',
            description: 'Revisar y optimizar el presupuesto anual',
            icon: _jsx(DollarSign, { className: "h-4 w-4" }),
            category: 'analysis',
            action: () => handleQuickAction('budget-review'),
        },
        {
            id: 'performance-insights',
            title: 'Insights de Rendimiento',
            description: 'Obtener insights sobre el rendimiento operativo',
            icon: _jsx(TrendingUp, { className: "h-4 w-4" }),
            category: 'insight',
            action: () => handleQuickAction('performance-insights'),
        },
        {
            id: 'risk-assessment',
            title: 'Evaluación de Riesgos',
            description: 'Identificar y evaluar riesgos financieros',
            icon: _jsx(Target, { className: "h-4 w-4" }),
            category: 'analysis',
            action: () => handleQuickAction('risk-assessment'),
        },
        {
            id: 'generate-report',
            title: 'Generar Reporte',
            description: 'Crear un reporte personalizado',
            icon: _jsx(FileText, { className: "h-4 w-4" }),
            category: 'report',
            action: () => handleQuickAction('generate-report'),
        },
        {
            id: 'market-analysis',
            title: 'Análisis de Mercado',
            description: 'Analizar tendencias del mercado',
            icon: _jsx(BarChart3, { className: "h-4 w-4" }),
            category: 'analysis',
            action: () => handleQuickAction('market-analysis'),
        },
    ];
    const handleQuickAction = async (actionId) => {
        const action = quickActions.find(a => a.id === actionId);
        if (!action)
            return;
        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: `Quiero ${action.title.toLowerCase()}`,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const response = await generateAIResponse(action.title);
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.content,
                timestamp: new Date(),
                metadata: response.metadata,
            };
            setMessages(prev => [...prev, assistantMessage]);
            analytics.trackEvent('AI', 'quick_action', actionId);
            addNotification(createNotification.success('Análisis Completado', 'El asistente IA ha procesado tu solicitud'));
        }
        catch (error) {
            addNotification(createNotification.error('Error', 'No se pudo procesar la solicitud'));
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSendMessage = async () => {
        if (!input.trim() || isLoading)
            return;
        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: input,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        try {
            const response = await generateAIResponse(input);
            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.content,
                timestamp: new Date(),
                metadata: response.metadata,
            };
            setMessages(prev => [...prev, assistantMessage]);
            analytics.trackEvent('AI', 'message_sent', 'user_input');
        }
        catch (error) {
            addNotification(createNotification.error('Error', 'No se pudo procesar el mensaje'));
        }
        finally {
            setIsLoading(false);
        }
    };
    const generateAIResponse = async (input) => {
        // Simular respuesta de IA con delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        // Simular análisis basado en el input
        const analysis = generateMockAnalysis(input);
        let content = '';
        let metadata = {};
        if (input.toLowerCase().includes('valoración') || input.toLowerCase().includes('dcf')) {
            content = `Basándome en el análisis de valoración DCF, aquí están mis observaciones:

**Análisis de Valoración:**
• Valor Presente Neto: €2,450,000
• Tasa Interna de Retorno: 18.5%
• Período de Recuperación: 4.2 años

**Recomendaciones:**
• Considerar optimización de costos operativos
• Evaluar estrategias de crecimiento de ingresos
• Revisar supuestos de inflación y tasas de descuento

**Riesgos Identificados:**
• Sensibilidad a cambios en costos de materias primas
• Dependencia de la economía local
• Competencia creciente en el sector

¿Te gustaría que profundice en algún aspecto específico?`;
            metadata = { analysis, type: 'valuation' };
        }
        else if (input.toLowerCase().includes('presupuesto') || input.toLowerCase().includes('budget')) {
            content = `He revisado el presupuesto anual y aquí están mis insights:

**Análisis Presupuestario:**
• Ingresos proyectados: €1,200,000
• Gastos operativos: €850,000
• Margen operativo: 29.2%

**Oportunidades de Optimización:**
• Reducción de costos de inventario (5-8%)
• Optimización de personal (3-5%)
• Mejoras en eficiencia energética (2-3%)

**Alertas:**
• Costos de alquiler por encima del promedio del sector
• Gastos de marketing podrían optimizarse
• Necesidad de fondo de emergencia

¿Quieres que genere un plan de acción detallado?`;
            metadata = { analysis, type: 'budget' };
        }
        else if (input.toLowerCase().includes('rendimiento') || input.toLowerCase().includes('performance')) {
            content = `Análisis de rendimiento operativo:

**KPIs Principales:**
• Rotación de inventario: 12.5x (Excelente)
• Margen bruto: 65.3% (Por encima del promedio)
• Satisfacción del cliente: 4.2/5 (Bueno)

**Tendencias Positivas:**
• Crecimiento de ventas: +8.3% vs año anterior
• Reducción de desperdicios: -15%
• Mejora en tiempo de servicio: -12%

**Áreas de Mejora:**
• Costos de personal por venta
• Eficiencia en horarios pico
• Gestión de inventario en productos perecederos

¿Necesitas un análisis más detallado de algún KPI específico?`;
            metadata = { analysis, type: 'performance' };
        }
        else {
            content = `Entiendo tu consulta sobre "${input}". Como asistente especializado en gestión de franquicias McDonald's, puedo ayudarte con:

**Servicios que ofrezco:**
• Análisis financiero detallado
• Valoraciones DCF personalizadas
• Optimización de presupuestos
• Análisis de rendimiento operativo
• Generación de reportes
• Evaluación de riesgos

**Para obtener el mejor análisis, puedes:**
1. Hacer preguntas específicas sobre métricas
2. Solicitar análisis comparativos
3. Pedir recomendaciones de optimización
4. Solicitar generación de reportes

¿En qué área específica te gustaría que me enfoque?`;
            metadata = { analysis, type: 'general' };
        }
        return { content, metadata };
    };
    const generateMockAnalysis = (input) => {
        return {
            type: 'general',
            insights: [
                'Análisis basado en datos históricos y tendencias del sector',
                'Consideración de factores macroeconómicos locales',
                'Comparación con benchmarks de la industria',
            ],
            recommendations: [
                'Implementar monitoreo continuo de KPIs',
                'Revisar estrategia de precios trimestralmente',
                'Optimizar gestión de inventario',
            ],
            risks: [
                'Volatilidad en costos de materias primas',
                'Cambios en regulaciones locales',
                'Competencia creciente',
            ],
            opportunities: [
                'Expansión a nuevos mercados',
                'Digitalización de procesos',
                'Optimización de costos operativos',
            ],
            confidence: 0.85,
        };
    };
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        addNotification(createNotification.success('Copiado', 'Texto copiado al portapapeles'));
    };
    const exportConversation = () => {
        const conversation = messages
            .map(msg => `${msg.type === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
            .join('\n\n');
        const blob = new Blob([conversation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversacion-ia-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        analytics.trackEvent('AI', 'export_conversation');
        addNotification(createNotification.success('Exportado', 'Conversación exportada correctamente'));
    };
    const clearConversation = () => {
        setMessages([]);
        setConversationContext('');
        analytics.trackEvent('AI', 'clear_conversation');
        addNotification(createNotification.info('Conversación Limpiada', 'Se ha iniciado una nueva conversación'));
    };
    return (_jsxs("div", { className: "h-screen flex flex-col bg-gray-50", children: [_jsx("div", { className: "bg-white border-b p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg", children: _jsx(Bot, { className: "h-6 w-6 text-white" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Asistente IA" }), _jsx("p", { className: "text-sm text-gray-600", children: "Especializado en Gesti\u00F3n de Franquicias McDonald's" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs(Badge, { variant: "outline", className: "flex items-center space-x-1", children: [_jsx(Sparkles, { className: "h-3 w-3" }), _jsx("span", { children: "IA Avanzada" })] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: clearConversation, children: [_jsx(RefreshCw, { className: "h-4 w-4 mr-2" }), "Nueva Conversaci\u00F3n"] })] })] }) }), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsxs("div", { className: "w-80 bg-white border-r p-4 overflow-y-auto", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Acciones R\u00E1pidas" }), _jsx("div", { className: "space-y-2", children: quickActions.map((action) => (_jsx(Button, { variant: "outline", className: "w-full justify-start h-auto p-3", onClick: action.action, disabled: isLoading, children: _jsxs("div", { className: "flex items-center space-x-3", children: [action.icon, _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: action.title }), _jsx("div", { className: "text-xs text-gray-500", children: action.description })] })] }) }, action.id))) })] }), _jsxs("div", { className: "mb-6", children: [_jsx("h3", { className: "text-lg font-semibold mb-3", children: "Configuraci\u00F3n" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Personalidad IA" }), _jsxs("select", { value: aiPersonality, onChange: (e) => setAiPersonality(e.target.value), className: "w-full mt-1 p-2 border rounded-md", children: [_jsx("option", { value: "advisor", children: "Asesor Financiero" }), _jsx("option", { value: "analyst", children: "Analista de Datos" }), _jsx("option", { value: "assistant", children: "Asistente General" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Contexto" }), _jsx(Textarea, { value: conversationContext, onChange: (e) => setConversationContext(e.target.value), placeholder: "Agrega contexto adicional para el an\u00E1lisis...", className: "mt-1", rows: 3 })] })] })] })] }), _jsx("div", { className: "flex-1 flex flex-col", children: _jsxs(Tabs, { value: selectedMode, onValueChange: (value) => setSelectedMode(value), className: "flex-1 flex flex-col", children: [_jsx("div", { className: "border-b bg-white px-4", children: _jsxs(TabsList, { className: "grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "chat", children: "Chat" }), _jsx(TabsTrigger, { value: "analysis", children: "An\u00E1lisis" }), _jsx(TabsTrigger, { value: "insights", children: "Insights" })] }) }), _jsxs(TabsContent, { value: "chat", className: "flex-1 flex flex-col p-4", children: [_jsx(ScrollArea, { className: "flex-1 mb-4", children: _jsxs("div", { className: "space-y-4", children: [messages.map((message) => (_jsx("div", { className: `flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-3xl p-4 rounded-lg ${message.type === 'user'
                                                                ? 'bg-blue-500 text-white'
                                                                : 'bg-white border shadow-sm'}`, children: [_jsxs("div", { className: "flex items-start space-x-2", children: [message.type === 'assistant' && (_jsx(Bot, { className: "h-5 w-5 text-blue-500 mt-1 flex-shrink-0" })), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "whitespace-pre-wrap", children: message.content }), message.metadata?.analysis && (_jsxs("div", { className: "mt-3 pt-3 border-t border-gray-200", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-2", children: [_jsx(Lightbulb, { className: "h-4 w-4 text-yellow-500" }), _jsx("span", { className: "text-sm font-medium", children: "An\u00E1lisis IA" })] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Confianza: ", Math.round(message.metadata.analysis.confidence * 100), "%"] })] }))] }), message.type === 'user' && (_jsx(User, { className: "h-5 w-5 text-white mt-1 flex-shrink-0" }))] }), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsx("span", { className: "text-xs opacity-70", children: message.timestamp.toLocaleTimeString() }), message.type === 'assistant' && (_jsx("div", { className: "flex space-x-1", children: _jsx(Button, { size: "sm", variant: "ghost", onClick: () => copyToClipboard(message.content), children: _jsx(Copy, { className: "h-3 w-3" }) }) }))] })] }) }, message.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-white border shadow-sm p-4 rounded-lg", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Loader2, { className: "h-5 w-5 animate-spin text-blue-500" }), _jsx("span", { className: "text-gray-600", children: "El asistente est\u00E1 pensando..." })] }) }) })), _jsx("div", { ref: messagesEndRef })] }) }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Input, { value: input, onChange: (e) => setInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleSendMessage(), placeholder: "Escribe tu pregunta o solicitud...", disabled: isLoading, className: "flex-1" }), _jsx(Button, { onClick: handleSendMessage, disabled: isLoading || !input.trim(), children: _jsx(Send, { className: "h-4 w-4" }) })] })] }), _jsx(TabsContent, { value: "analysis", className: "flex-1 p-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "h-5 w-5" }), _jsx("span", { children: "An\u00E1lisis Avanzado" })] }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-600", children: "Aqu\u00ED puedes solicitar an\u00E1lisis m\u00E1s detallados y especializados." }) })] }) }), _jsx(TabsContent, { value: "insights", className: "flex-1 p-4", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center space-x-2", children: [_jsx(Lightbulb, { className: "h-5 w-5" }), _jsx("span", { children: "Insights y Recomendaciones" })] }) }), _jsx(CardContent, { children: _jsx("p", { className: "text-gray-600", children: "Descubre insights autom\u00E1ticos y recomendaciones personalizadas." }) })] }) })] }) })] })] }));
};
export default AIAssistant;
