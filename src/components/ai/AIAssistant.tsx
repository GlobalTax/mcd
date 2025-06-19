import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Calculator,
  FileText,
  BarChart3,
  Settings,
  RefreshCw,
  Copy,
  Download,
  Share2,
  MessageSquare,
  Zap,
  Target,
  DollarSign,
  Building2
} from 'lucide-react';
import { useAnalytics } from '@/utils/analytics';
import { useNotifications, createNotification } from '@/components/NotificationSystem';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    analysis?: any;
    suggestions?: string[];
    data?: any;
  };
}

interface AIAnalysis {
  type: 'valuation' | 'budget' | 'performance' | 'general';
  insights: string[];
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  confidence: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'analysis' | 'report' | 'calculation' | 'insight';
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'chat' | 'analysis' | 'insights'>('chat');
  const [conversationContext, setConversationContext] = useState<string>('');
  const [aiPersonality, setAiPersonality] = useState<'analyst' | 'advisor' | 'assistant'>('advisor');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();
  const { addNotification } = useNotifications();

  // Mensaje de bienvenida
  useEffect(() => {
    const welcomeMessage: Message = {
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
  const quickActions: QuickAction[] = [
    {
      id: 'valuation-analysis',
      title: 'Análisis de Valoración',
      description: 'Analizar la valoración DCF de un restaurante',
      icon: <Calculator className="h-4 w-4" />,
      category: 'analysis',
      action: () => handleQuickAction('valuation-analysis'),
    },
    {
      id: 'budget-review',
      title: 'Revisar Presupuesto',
      description: 'Revisar y optimizar el presupuesto anual',
      icon: <DollarSign className="h-4 w-4" />,
      category: 'analysis',
      action: () => handleQuickAction('budget-review'),
    },
    {
      id: 'performance-insights',
      title: 'Insights de Rendimiento',
      description: 'Obtener insights sobre el rendimiento operativo',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'insight',
      action: () => handleQuickAction('performance-insights'),
    },
    {
      id: 'risk-assessment',
      title: 'Evaluación de Riesgos',
      description: 'Identificar y evaluar riesgos financieros',
      icon: <Target className="h-4 w-4" />,
      category: 'analysis',
      action: () => handleQuickAction('risk-assessment'),
    },
    {
      id: 'generate-report',
      title: 'Generar Reporte',
      description: 'Crear un reporte personalizado',
      icon: <FileText className="h-4 w-4" />,
      category: 'report',
      action: () => handleQuickAction('generate-report'),
    },
    {
      id: 'market-analysis',
      title: 'Análisis de Mercado',
      description: 'Analizar tendencias del mercado',
      icon: <BarChart3 className="h-4 w-4" />,
      category: 'analysis',
      action: () => handleQuickAction('market-analysis'),
    },
  ];

  const handleQuickAction = async (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (!action) return;

    const userMessage: Message = {
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
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: response.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      analytics.trackEvent('AI', 'quick_action', actionId);
      addNotification(createNotification.success('Análisis Completado', 'El asistente IA ha procesado tu solicitud'));
    } catch (error) {
      addNotification(createNotification.error('Error', 'No se pudo procesar la solicitud'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
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
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        metadata: response.metadata,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      analytics.trackEvent('AI', 'message_sent', 'user_input');
    } catch (error) {
      addNotification(createNotification.error('Error', 'No se pudo procesar el mensaje'));
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (input: string): Promise<{ content: string; metadata?: any }> => {
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
    } else if (input.toLowerCase().includes('presupuesto') || input.toLowerCase().includes('budget')) {
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
    } else if (input.toLowerCase().includes('rendimiento') || input.toLowerCase().includes('performance')) {
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
    } else {
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

  const generateMockAnalysis = (input: string): AIAnalysis => {
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

  const copyToClipboard = (text: string) => {
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Asistente IA</h1>
              <p className="text-sm text-gray-600">Especializado en Gestión de Franquicias McDonald's</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>IA Avanzada</span>
            </Badge>
            <Button variant="outline" size="sm" onClick={clearConversation}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Nueva Conversación
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar con acciones rápidas */}
        <div className="w-80 bg-white border-r p-4 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Acciones Rápidas</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={action.action}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-3">
                    {action.icon}
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Configuración</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Personalidad IA</label>
                <select
                  value={aiPersonality}
                  onChange={(e) => setAiPersonality(e.target.value as any)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="advisor">Asesor Financiero</option>
                  <option value="analyst">Analista de Datos</option>
                  <option value="assistant">Asistente General</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Contexto</label>
                <Textarea
                  value={conversationContext}
                  onChange={(e) => setConversationContext(e.target.value)}
                  placeholder="Agrega contexto adicional para el análisis..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Área principal de chat */}
        <div className="flex-1 flex flex-col">
          <Tabs value={selectedMode} onValueChange={(value: any) => setSelectedMode(value)} className="flex-1 flex flex-col">
            <div className="border-b bg-white px-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="analysis">Análisis</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="flex-1 flex flex-col p-4">
              {/* Mensajes */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border shadow-sm'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'assistant' && (
                            <Bot className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            {message.metadata?.analysis && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                                  <span className="text-sm font-medium">Análisis IA</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  Confianza: {Math.round(message.metadata.analysis.confidence * 100)}%
                                </div>
                              </div>
                            )}
                          </div>
                          {message.type === 'user' && (
                            <User className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.type === 'assistant' && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border shadow-sm p-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                          <span className="text-gray-600">El asistente está pensando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Escribe tu pregunta o solicitud..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="flex-1 p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Análisis Avanzado</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Aquí puedes solicitar análisis más detallados y especializados.
                  </p>
                  {/* Contenido del análisis */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5" />
                    <span>Insights y Recomendaciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Descubre insights automáticos y recomendaciones personalizadas.
                  </p>
                  {/* Contenido de insights */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 