// Sistema de Asistente de IA Integrada
export interface AIAnalysis {
  id: string;
  type: 'financial' | 'operational' | 'predictive' | 'recommendation';
  title: string;
  summary: string;
  details: string;
  confidence: number; // 0-100
  timestamp: string;
  data: any;
  recommendations: AIRecommendation[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  priority: number; // 1-10
  category: 'revenue' | 'cost' | 'efficiency' | 'risk';
  estimatedValue?: number;
  timeline?: string;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  context: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    analysisType?: string;
    dataPoints?: string[];
    confidence?: number;
  };
}

class AIAssistant {
  private static instance: AIAssistant;
  private analyses: AIAnalysis[] = [];
  private conversations: AIConversation[] = [];
  private knowledgeBase: Map<string, any> = new Map();

  private constructor() {
    this.initializeKnowledgeBase();
  }

  static getInstance(): AIAssistant {
    if (!AIAssistant.instance) {
      AIAssistant.instance = new AIAssistant();
    }
    return AIAssistant.instance;
  }

  private initializeKnowledgeBase(): void {
    // Base de conocimiento para McDonald's
    this.knowledgeBase.set('mcdonalds_metrics', {
      avgRevenuePerRestaurant: 50000,
      foodCostPercentage: 30,
      laborCostPercentage: 25,
      rentPercentage: 6,
      franchiseFee: 4,
      advertisingFee: 4
    });

    this.knowledgeBase.set('industry_benchmarks', {
      quickServiceRestaurants: {
        avgRevenue: 45000,
        foodCost: 32,
        laborCost: 28,
        rentCost: 7
      }
    });

    this.knowledgeBase.set('best_practices', [
      'Mantener food cost por debajo del 30%',
      'Optimizar horarios de personal según demanda',
      'Implementar upselling en punto de venta',
      'Monitorear métricas de satisfacción del cliente',
      'Diversificar menú según temporada'
    ]);
  }

  // Análisis financiero automático
  async analyzeFinancialData(data: any): Promise<AIAnalysis> {
    const analysis: AIAnalysis = {
      id: `financial-${Date.now()}`,
      type: 'financial',
      title: 'Análisis Financiero Automático',
      summary: '',
      details: '',
      confidence: 85,
      timestamp: new Date().toISOString(),
      data,
      recommendations: []
    };

    // Análisis de rentabilidad
    const revenue = data.totalRevenue || 0;
    const costs = data.totalCosts || 0;
    const profit = revenue - costs;
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    // Comparar con benchmarks
    const benchmarks = this.knowledgeBase.get('mcdonalds_metrics');
    const industryBenchmarks = this.knowledgeBase.get('industry_benchmarks');

    let summary = `Análisis financiero completado. `;
    let details = '';

    if (profitMargin > 15) {
      summary += 'Excelente rentabilidad. ';
      details += 'La rentabilidad está por encima del promedio de la industria. ';
    } else if (profitMargin > 10) {
      summary += 'Buena rentabilidad. ';
      details += 'La rentabilidad está en línea con el promedio de la industria. ';
    } else {
      summary += 'Rentabilidad mejorable. ';
      details += 'La rentabilidad está por debajo del promedio de la industria. ';
    }

    // Análisis de costos
    const foodCostPercentage = data.foodCostPercentage || 0;
    if (foodCostPercentage > 32) {
      details += 'El costo de alimentos está por encima del promedio. ';
      analysis.recommendations.push({
        id: 'rec-001',
        title: 'Optimizar gestión de inventario',
        description: 'Revisar proveedores y reducir desperdicios para bajar el food cost',
        impact: 'high',
        effort: 'medium',
        priority: 8,
        category: 'cost',
        estimatedValue: revenue * 0.02
      });
    }

    // Análisis de ingresos
    const avgRevenue = data.avgRevenuePerRestaurant || 0;
    if (avgRevenue < 45000) {
      details += 'Los ingresos por restaurante están por debajo del promedio. ';
      analysis.recommendations.push({
        id: 'rec-002',
        title: 'Implementar estrategias de upselling',
        description: 'Capacitar al personal en técnicas de venta adicional',
        impact: 'medium',
        effort: 'low',
        priority: 6,
        category: 'revenue',
        estimatedValue: avgRevenue * 0.05
      });
    }

    analysis.summary = summary;
    analysis.details = details;

    this.analyses.push(analysis);
    return analysis;
  }

  // Análisis predictivo
  async generatePredictions(data: any): Promise<AIAnalysis> {
    const analysis: AIAnalysis = {
      id: `predictive-${Date.now()}`,
      type: 'predictive',
      title: 'Predicciones y Tendencias',
      summary: '',
      details: '',
      confidence: 75,
      timestamp: new Date().toISOString(),
      data,
      recommendations: []
    };

    // Simular predicciones basadas en datos históricos
    const historicalRevenue = data.historicalRevenue || [];
    if (historicalRevenue.length >= 3) {
      const recentTrend = this.calculateTrend(historicalRevenue.slice(-3));
      const predictedRevenue = historicalRevenue[historicalRevenue.length - 1] * (1 + recentTrend);

      analysis.summary = `Basado en tendencias recientes, se predice un crecimiento del ${(recentTrend * 100).toFixed(1)}% en los próximos meses.`;
      analysis.details = `Análisis de tendencias: ${recentTrend > 0 ? 'Crecimiento positivo' : 'Tendencia a la baja'}. Predicción de ingresos: €${predictedRevenue.toLocaleString()}`;

      if (recentTrend < 0) {
        analysis.recommendations.push({
          id: 'rec-003',
          title: 'Implementar campaña de marketing',
          description: 'Lanzar promociones para revertir la tendencia de ventas',
          impact: 'high',
          effort: 'medium',
          priority: 9,
          category: 'revenue',
          estimatedValue: predictedRevenue * 0.03
        });
      }
    }

    this.analyses.push(analysis);
    return analysis;
  }

  // Chat inteligente
  async chat(message: string, context?: string): Promise<AIMessage> {
    const conversationId = context || `conv-${Date.now()}`;
    let conversation = this.conversations.find(c => c.id === conversationId);
    
    if (!conversation) {
      conversation = {
        id: conversationId,
        messages: [],
        context: 'McDonald\'s Franchise Management',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.conversations.push(conversation);
    }

    // Agregar mensaje del usuario
    const userMessage: AIMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    conversation.messages.push(userMessage);

    // Generar respuesta de IA
    const response = await this.generateAIResponse(message, conversation);
    conversation.messages.push(response);
    conversation.updatedAt = new Date().toISOString();

    return response;
  }

  private async generateAIResponse(message: string, conversation: AIConversation): Promise<AIMessage> {
    const lowerMessage = message.toLowerCase();
    let response = '';

    // Respuestas basadas en palabras clave
    if (lowerMessage.includes('rentabilidad') || lowerMessage.includes('beneficio')) {
      response = 'Para mejorar la rentabilidad, te recomiendo:\n' +
        '• Revisar el food cost (objetivo: <30%)\n' +
        '• Optimizar horarios de personal\n' +
        '• Implementar upselling\n' +
        '• Reducir desperdicios de inventario';
    } else if (lowerMessage.includes('ventas') || lowerMessage.includes('ingresos')) {
      response = 'Estrategias para aumentar ventas:\n' +
        '• Promociones temporales\n' +
        '• Mejorar experiencia del cliente\n' +
        '• Optimizar menú según demanda\n' +
        '• Capacitar personal en ventas';
    } else if (lowerMessage.includes('costos') || lowerMessage.includes('gastos')) {
      response = 'Para controlar costos:\n' +
        '• Negociar con proveedores\n' +
        '• Optimizar inventario\n' +
        '• Reducir desperdicios\n' +
        '• Eficiencia energética';
    } else if (lowerMessage.includes('personal') || lowerMessage.includes('empleados')) {
      response = 'Gestión de personal:\n' +
        '• Capacitación continua\n' +
        '• Horarios flexibles según demanda\n' +
        '• Incentivos por rendimiento\n' +
        '• Ambiente de trabajo positivo';
    } else {
      response = 'Hola, soy tu asistente de IA para McDonald\'s. Puedo ayudarte con:\n' +
        '• Análisis financiero\n' +
        '• Optimización de operaciones\n' +
        '• Predicciones de ventas\n' +
        '• Recomendaciones estratégicas\n\n' +
        '¿En qué puedo ayudarte específicamente?';
    }

    return {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      metadata: {
        analysisType: 'chat_response',
        confidence: 85
      }
    };
  }

  // Generación automática de reportes
  async generateReport(data: any, type: 'financial' | 'operational' | 'summary'): Promise<string> {
    let report = '';

    switch (type) {
      case 'financial':
        report = this.generateFinancialReport(data);
        break;
      case 'operational':
        report = this.generateOperationalReport(data);
        break;
      case 'summary':
        report = this.generateSummaryReport(data);
        break;
    }

    return report;
  }

  private generateFinancialReport(data: any): string {
    return `
# Reporte Financiero - McDonald's

## Resumen Ejecutivo
- Ingresos totales: €${(data.totalRevenue || 0).toLocaleString()}
- Costos totales: €${(data.totalCosts || 0).toLocaleString()}
- Beneficio neto: €${((data.totalRevenue || 0) - (data.totalCosts || 0)).toLocaleString()}
- Margen de beneficio: ${(((data.totalRevenue || 0) - (data.totalCosts || 0)) / (data.totalRevenue || 1) * 100).toFixed(1)}%

## Análisis de Costos
- Food cost: ${(data.foodCostPercentage || 0).toFixed(1)}%
- Costo de personal: ${(data.laborCostPercentage || 0).toFixed(1)}%
- Alquiler: ${(data.rentPercentage || 0).toFixed(1)}%

## Recomendaciones
${this.generateRecommendations(data).map(r => `- ${r.title}: ${r.description}`).join('\n')}
    `.trim();
  }

  private generateOperationalReport(data: any): string {
    return `
# Reporte Operacional - McDonald's

## Métricas Clave
- Restaurantes activos: ${data.activeRestaurants || 0}
- Promedio de ventas por restaurante: €${(data.avgRevenue || 0).toLocaleString()}
- Eficiencia operacional: ${(data.operationalEfficiency || 0).toFixed(1)}%

## Análisis de Rendimiento
${this.analyzeOperationalData(data)}

## Acciones Recomendadas
${this.generateOperationalRecommendations(data).map(r => `- ${r.title}`).join('\n')}
    `.trim();
  }

  private generateSummaryReport(data: any): string {
    return `
# Resumen Ejecutivo - McDonald's

## Puntos Destacados
- Estado general: ${this.getOverallStatus(data)}
- Tendencias principales: ${this.getMainTrends(data)}
- Áreas de mejora: ${this.getImprovementAreas(data)}

## Próximos Pasos
${this.getNextSteps(data).map(step => `- ${step}`).join('\n')}
    `.trim();
  }

  // Métodos de utilidad
  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;
    const changes = [];
    for (let i = 1; i < data.length; i++) {
      changes.push((data[i] - data[i-1]) / data[i-1]);
    }
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  }

  private generateRecommendations(data: any): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    if ((data.foodCostPercentage || 0) > 32) {
      recommendations.push({
        id: 'rec-fin-001',
        title: 'Optimizar gestión de inventario',
        description: 'Reducir food cost mediante mejor gestión de proveedores',
        impact: 'high',
        effort: 'medium',
        priority: 8,
        category: 'cost'
      });
    }

    if ((data.avgRevenue || 0) < 45000) {
      recommendations.push({
        id: 'rec-fin-002',
        title: 'Estrategia de upselling',
        description: 'Implementar técnicas de venta adicional',
        impact: 'medium',
        effort: 'low',
        priority: 6,
        category: 'revenue'
      });
    }

    return recommendations;
  }

  private analyzeOperationalData(data: any): string {
    const efficiency = data.operationalEfficiency || 0;
    if (efficiency > 85) return 'Excelente eficiencia operacional';
    if (efficiency > 70) return 'Buena eficiencia operacional';
    return 'Eficiencia operacional mejorable';
  }

  private generateOperationalRecommendations(data: any): AIRecommendation[] {
    return [
      {
        id: 'rec-op-001',
        title: 'Optimizar horarios de personal',
        description: 'Ajustar personal según demanda',
        impact: 'medium',
        effort: 'low',
        priority: 5,
        category: 'efficiency'
      }
    ];
  }

  private getOverallStatus(data: any): string {
    const profitMargin = ((data.totalRevenue || 0) - (data.totalCosts || 0)) / (data.totalRevenue || 1) * 100;
    if (profitMargin > 15) return 'Excelente';
    if (profitMargin > 10) return 'Bueno';
    return 'Mejorable';
  }

  private getMainTrends(data: any): string {
    return 'Crecimiento estable en ingresos, control de costos efectivo';
  }

  private getImprovementAreas(data: any): string {
    return 'Optimización de inventario, eficiencia operacional';
  }

  private getNextSteps(data: any): string[] {
    return [
      'Implementar recomendaciones de IA',
      'Monitorear métricas clave',
      'Revisar resultados en 30 días'
    ];
  }

  // Métodos de gestión
  getAnalyses(filter?: { type?: string }): AIAnalysis[] {
    let filtered = this.analyses;
    if (filter?.type) {
      filtered = filtered.filter(a => a.type === filter.type);
    }
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getConversations(): AIConversation[] {
    return this.conversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getConversation(id: string): AIConversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  clearConversation(id: string): void {
    this.conversations = this.conversations.filter(c => c.id !== id);
  }
}

// Exportar instancia singleton
export const aiAssistant = AIAssistant.getInstance();

// Hooks de conveniencia para React
export const useAIAssistant = () => {
  return {
    analyzeFinancialData: (data: any) => aiAssistant.analyzeFinancialData(data),
    generatePredictions: (data: any) => aiAssistant.generatePredictions(data),
    chat: (message: string, context?: string) => aiAssistant.chat(message, context),
    generateReport: (data: any, type: 'financial' | 'operational' | 'summary') => 
      aiAssistant.generateReport(data, type),
    getAnalyses: (filter?: { type?: string }) => aiAssistant.getAnalyses(filter),
    getConversations: () => aiAssistant.getConversations(),
    getConversation: (id: string) => aiAssistant.getConversation(id),
    clearConversation: (id: string) => aiAssistant.clearConversation(id)
  };
}; 