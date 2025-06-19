// Sistema de Generación Automática de Reportes
export interface ReportConfig {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  dataSources: string[];
  recipients: string[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number; // 0-6 (Sunday-Saturday)
    dayOfMonth?: number; // 1-31
    time: string; // HH:MM
  };
  filters?: Record<string, any>;
  template?: string;
  tableStyle?: string;
  chartTheme?: string;
}

export interface ReportData {
  id: string;
  configId: string;
  generatedAt: string;
  data: any;
  format: string;
  size: number;
  url?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'valuation' | 'budget' | 'performance' | 'financial' | 'custom';
  format: 'pdf' | 'excel' | 'csv' | 'json';
  sections: ReportSection[];
  schedule?: ReportSchedule;
  recipients?: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'text' | 'table' | 'chart' | 'metric' | 'summary';
  dataSource: string;
  config: any;
  order: number;
}

export interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM
  timezone: string;
  enabled: boolean;
}

interface ReportStyling {
  theme: 'light' | 'dark' | 'corporate';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo?: string;
  companyName?: string;
}

export class ReportGenerator {
  private static instance: ReportGenerator;
  private reports: ReportData[] = [];
  private configs: ReportConfig[] = [];
  private templates: Map<string, ReportTemplate> = new Map();
  private defaultConfig: ReportConfig;

  private constructor() {
    this.initializeDefaultTemplates();
    this.initializeDefaultConfigs();
    this.defaultConfig = this.configs[0] || {
      id: 'default',
      name: 'Reporte por defecto',
      description: 'Configuración por defecto',
      type: 'monthly',
      format: 'pdf',
      dataSources: [],
      recipients: []
    };
  }

  static getInstance(): ReportGenerator {
    if (!ReportGenerator.instance) {
      ReportGenerator.instance = new ReportGenerator();
    }
    return ReportGenerator.instance;
  }

  private initializeDefaultTemplates(): void {
    // Plantilla de reporte de valoración
    const valuationTemplate: ReportTemplate = {
      id: 'valuation-report',
      name: 'Reporte de Valoración DCF',
      description: 'Reporte completo de valoración DCF para restaurantes',
      type: 'valuation',
      format: 'pdf',
      sections: [
        {
          id: 'summary',
          title: 'Resumen Ejecutivo',
          type: 'summary',
          dataSource: 'valuation-summary',
          config: { includeKeyMetrics: true, includeRecommendations: true },
          order: 1,
        },
        {
          id: 'financial-metrics',
          title: 'Métricas Financieras',
          type: 'table',
          dataSource: 'financial-metrics',
          config: { columns: ['metric', 'value', 'change', 'target'] },
          order: 2,
        },
        {
          id: 'cash-flow-chart',
          title: 'Flujo de Caja Proyectado',
          type: 'chart',
          dataSource: 'cash-flow-data',
          config: { chartType: 'line', years: 5 },
          order: 3,
        },
        {
          id: 'sensitivity-analysis',
          title: 'Análisis de Sensibilidad',
          type: 'chart',
          dataSource: 'sensitivity-data',
          config: { chartType: 'heatmap' },
          order: 4,
        },
      ],
    };

    // Plantilla de reporte de presupuesto
    const budgetTemplate: ReportTemplate = {
      id: 'budget-report',
      name: 'Reporte de Presupuesto Anual',
      description: 'Análisis detallado del presupuesto anual',
      type: 'budget',
      format: 'excel',
      sections: [
        {
          id: 'budget-overview',
          title: 'Vista General del Presupuesto',
          type: 'summary',
          dataSource: 'budget-overview',
          config: { includeVariance: true },
          order: 1,
        },
        {
          id: 'budget-breakdown',
          title: 'Desglose del Presupuesto',
          type: 'table',
          dataSource: 'budget-breakdown',
          config: { groupBy: 'category' },
          order: 2,
        },
        {
          id: 'budget-chart',
          title: 'Distribución del Presupuesto',
          type: 'chart',
          dataSource: 'budget-distribution',
          config: { chartType: 'pie' },
          order: 3,
        },
      ],
    };

    // Plantilla de reporte de rendimiento
    const performanceTemplate: ReportTemplate = {
      id: 'performance-report',
      name: 'Reporte de Rendimiento',
      description: 'Análisis de rendimiento operativo',
      type: 'performance',
      format: 'pdf',
      sections: [
        {
          id: 'kpi-summary',
          title: 'Resumen de KPIs',
          type: 'metric',
          dataSource: 'kpi-data',
          config: { includeTargets: true, includeTrends: true },
          order: 1,
        },
        {
          id: 'performance-chart',
          title: 'Tendencia de Rendimiento',
          type: 'chart',
          dataSource: 'performance-trends',
          config: { chartType: 'line', period: '12months' },
          order: 2,
        },
        {
          id: 'comparison-table',
          title: 'Comparación con Objetivos',
          type: 'table',
          dataSource: 'performance-comparison',
          config: { includeVariance: true },
          order: 3,
        },
      ],
    };

    this.templates.set(valuationTemplate.id, valuationTemplate);
    this.templates.set(budgetTemplate.id, budgetTemplate);
    this.templates.set(performanceTemplate.id, performanceTemplate);
  }

  private initializeDefaultConfigs(): void {
    this.configs = [
      {
        id: 'daily-dashboard',
        name: 'Dashboard Diario',
        description: 'Reporte diario con métricas del dashboard',
        type: 'daily',
        format: 'pdf',
        dataSources: ['dashboard_metrics', 'restaurants_data'],
        recipients: ['admin@mcdonalds.es'],
        schedule: {
          frequency: 'daily',
          time: '08:00'
        },
        template: 'dashboard-summary'
      },
      {
        id: 'weekly-financial',
        name: 'Reporte Financiero Semanal',
        description: 'Análisis financiero semanal',
        type: 'weekly',
        format: 'excel',
        dataSources: ['financial_metrics', 'revenue_data', 'profitability_data'],
        recipients: ['finance@mcdonalds.es', 'admin@mcdonalds.es'],
        schedule: {
          frequency: 'weekly',
          dayOfWeek: 1, // Lunes
          time: '09:00'
        },
        template: 'financial-analysis'
      },
      {
        id: 'monthly-summary',
        name: 'Resumen Mensual',
        description: 'Resumen completo del mes',
        type: 'monthly',
        format: 'pdf',
        dataSources: ['all_metrics', 'restaurants_data', 'financial_data'],
        recipients: ['all@mcdonalds.es'],
        schedule: {
          frequency: 'monthly',
          dayOfMonth: 1,
          time: '10:00'
        },
        template: 'dashboard-summary'
      }
    ];
  }

  // Métodos principales
  async generateReport(configId: string, data?: any): Promise<ReportData> {
    const config = this.configs.find(c => c.id === configId);
    if (!config) {
      throw new Error(`Configuración de reporte no encontrada: ${configId}`);
    }

    const reportId = `${configId}-${Date.now()}`;
    const report: ReportData = {
      id: reportId,
      configId,
      generatedAt: new Date().toISOString(),
      data: data || {},
      format: config.format,
      size: 0,
      status: 'generating'
    };

    this.reports.push(report);

    try {
      // Simular generación de reporte
      await this.simulateReportGeneration(report);
      
      report.status = 'completed';
      report.size = this.calculateReportSize(report);
      report.url = this.generateReportUrl(report);

      // Enviar reporte a destinatarios
      await this.sendReportToRecipients(report, config);

      return report;
    } catch (error) {
      report.status = 'failed';
      report.error = error instanceof Error ? error.message : 'Error desconocido';
      throw error;
    }
  }

  private async simulateReportGeneration(report: ReportData): Promise<void> {
    // Simular tiempo de generación
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generar datos de ejemplo
    report.data = {
      generatedAt: report.generatedAt,
      metrics: {
        totalRestaurants: 25,
        activeRestaurants: 23,
        totalRevenue: 1250000,
        avgRevenue: 54347,
        growthRate: 12.5
      },
      restaurants: [
        { name: 'McDonald\'s Centro', revenue: 65000, status: 'active' },
        { name: 'McDonald\'s Norte', revenue: 58000, status: 'active' },
        { name: 'McDonald\'s Sur', revenue: 52000, status: 'active' }
      ],
      charts: {
        revenueTrend: [45000, 48000, 52000, 58000, 65000],
        monthlyGrowth: [5.2, 8.3, 11.5, 12.1, 12.5]
      }
    };
  }

  private calculateReportSize(report: ReportData): number {
    // Simular cálculo de tamaño basado en datos
    const dataSize = JSON.stringify(report.data).length;
    return Math.round(dataSize / 1024); // KB
  }

  private generateReportUrl(report: ReportData): string {
    return `/reports/${report.id}.${report.format}`;
  }

  private async sendReportToRecipients(report: ReportData, config: ReportConfig): Promise<void> {
    // Simular envío de reporte
    console.log(`📧 Enviando reporte "${config.name}" a:`, config.recipients);
    
    // Aquí podrías implementar el envío real por email
    // await emailService.sendReport(report, config.recipients);
  }

  // Métodos de gestión
  getReports(filter?: { status?: string; configId?: string }): ReportData[] {
    let filteredReports = this.reports;
    
    if (filter?.status) {
      filteredReports = filteredReports.filter(r => r.status === filter.status);
    }
    
    if (filter?.configId) {
      filteredReports = filteredReports.filter(r => r.configId === filter.configId);
    }
    
    return filteredReports.sort((a, b) => 
      new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    );
  }

  getConfigs(): ReportConfig[] {
    return this.configs;
  }

  getTemplates(): ReportTemplate[] {
    return Array.from(this.templates.values());
  }

  addConfig(config: ReportConfig): void {
    this.configs.push(config);
  }

  updateConfig(configId: string, updates: Partial<ReportConfig>): void {
    const index = this.configs.findIndex(c => c.id === configId);
    if (index !== -1) {
      this.configs[index] = { ...this.configs[index], ...updates };
    }
  }

  deleteConfig(configId: string): void {
    this.configs = this.configs.filter(c => c.id !== configId);
  }

  // Métodos de exportación
  exportToPDF(report: ReportData): Promise<Blob> {
    // Simular exportación a PDF
    return new Promise(resolve => {
      setTimeout(() => {
        const blob = new Blob(['PDF content'], { type: 'application/pdf' });
        resolve(blob);
      }, 1000);
    });
  }

  exportToExcel(report: ReportData): Promise<Blob> {
    // Simular exportación a Excel
    return new Promise(resolve => {
      setTimeout(() => {
        const blob = new Blob(['Excel content'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        resolve(blob);
      }, 1000);
    });
  }

  exportToCSV(report: ReportData): Promise<Blob> {
    // Simular exportación a CSV
    return new Promise(resolve => {
      setTimeout(() => {
        const csvContent = this.convertToCSV(report.data);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        resolve(blob);
      }, 500);
    });
  }

  private convertToCSV(data: any): string {
    // Conversión básica a CSV
    if (data.restaurants && Array.isArray(data.restaurants)) {
      const headers = Object.keys(data.restaurants[0]).join(',');
      const rows = data.restaurants.map((r: any) => 
        Object.values(r).map(v => `"${v}"`).join(',')
      ).join('\n');
      return `${headers}\n${rows}`;
    }
    return '';
  }

  // Programación de reportes
  scheduleReport(configId: string): void {
    const config = this.configs.find(c => c.id === configId);
    if (!config || !config.schedule) {
      throw new Error('Configuración de programación no encontrada');
    }

    // Aquí implementarías la lógica de programación real
    console.log(`📅 Programando reporte "${config.name}" con frecuencia: ${config.schedule.frequency}`);
  }

  cancelScheduledReport(configId: string): void {
    console.log(`❌ Cancelando reporte programado: ${configId}`);
  }

  // Métodos para gestionar plantillas
  addTemplate(template: ReportTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): ReportTemplate | undefined {
    return this.templates.get(id);
  }

  getAllTemplates(): ReportTemplate[] {
    return Array.from(this.templates.values());
  }

  updateTemplate(id: string, updates: Partial<ReportTemplate>): void {
    const template = this.templates.get(id);
    if (template) {
      this.templates.set(id, { ...template, ...updates });
    }
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id);
  }

  // Generación de reportes usando plantillas
  async generateReportFromTemplate(templateId: string, data: any, format?: string): Promise<ReportData> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Plantilla no encontrada: ${templateId}`);
    }

    const reportFormat = format || template.format;
    const reportId = this.generateReportId();
    
    const report: ReportData = {
      id: reportId,
      configId: templateId,
      generatedAt: new Date().toISOString(),
      data: {},
      format: reportFormat,
      size: 0,
      status: 'generating'
    };

    this.reports.push(report);

    try {
      // Generar contenido del reporte
      const content = await this.generateReportContent(template, data);
      report.data = content;
      
      // Generar archivo según formato
      let fileUrl = '';
      switch (reportFormat) {
        case 'pdf':
          fileUrl = await this.generatePDF(content, template);
          break;
        case 'excel':
          fileUrl = await this.generateExcel(content, template);
          break;
        case 'csv':
          fileUrl = await this.generateCSV(content, template);
          break;
        default:
          fileUrl = `/reports/${reportId}.json`;
      }

      report.url = fileUrl;
      report.size = this.calculateReportSize(report);
      report.status = 'completed';

      return report;
    } catch (error) {
      report.status = 'failed';
      report.error = error instanceof Error ? error.message : 'Error desconocido';
      throw error;
    }
  }

  private async generateReportContent(template: ReportTemplate, data: any): Promise<any> {
    const content: any = {
      metadata: {
        title: template.name,
        description: template.description,
        generatedAt: new Date().toISOString(),
        template: template.id,
      },
      sections: [],
    };

    // Generar cada sección del reporte
    for (const section of template.sections.sort((a, b) => a.order - b.order)) {
      const sectionData = await this.generateSectionContent(section, data);
      content.sections.push({
        id: section.id,
        title: section.title,
        type: section.type,
        content: sectionData,
      });
    }

    return content;
  }

  private async generateSectionContent(section: ReportSection, data: any): Promise<any> {
    switch (section.type) {
      case 'summary':
        return this.generateSummarySection(section, data);
      case 'table':
        return this.generateTableSection(section, data);
      case 'chart':
        return this.generateChartSection(section, data);
      case 'metric':
        return this.generateMetricSection(section, data);
      default:
        return { error: 'Unknown section type' };
    }
  }

  private generateSummarySection(section: ReportSection, data: any): any {
    const summaryData = this.getDataFromSource(section.dataSource, data);
    
    return {
      keyMetrics: summaryData.keyMetrics || [],
      recommendations: summaryData.recommendations || [],
      highlights: summaryData.highlights || [],
      risks: summaryData.risks || [],
    };
  }

  private generateTableSection(section: ReportSection, data: any): any {
    const tableData = this.getDataFromSource(section.dataSource, data);
    
    return {
      type: 'table',
      title: section.title,
      data: tableData,
      style: 'default',
      columns: section.config.columns || Object.keys(tableData[0] || {})
    };
  }

  private generateChartSection(section: ReportSection, data: any): any {
    const chartData = this.getDataFromSource(section.dataSource, data);
    
    return {
      type: 'chart',
      title: section.title,
      data: chartData,
      chartType: section.config.chartType || 'bar',
      theme: 'light',
      options: section.config.options || {}
    };
  }

  private generateMetricSection(section: ReportSection, data: any): any {
    const metricData = this.getDataFromSource(section.dataSource, data);
    
    return {
      metrics: metricData,
      includeTargets: section.config.includeTargets,
      includeTrends: section.config.includeTrends,
    };
  }

  private getDataFromSource(dataSource: string, data: any): any {
    // Simular obtención de datos desde diferentes fuentes
    switch (dataSource) {
      case 'valuation-summary':
        return {
          keyMetrics: [
            { name: 'Valor Presente', value: data.presentValue, format: 'currency' },
            { name: 'TIR', value: data.irr, format: 'percentage' },
            { name: 'Período de Recuperación', value: data.paybackPeriod, format: 'years' },
          ],
          recommendations: data.recommendations || [],
        };
      case 'financial-metrics':
        return data.financialMetrics || [];
      case 'cash-flow-data':
        return data.cashFlow || [];
      case 'sensitivity-data':
        return data.sensitivityAnalysis || [];
      case 'budget-overview':
        return data.budgetOverview || {};
      case 'budget-breakdown':
        return data.budgetBreakdown || [];
      case 'budget-distribution':
        return data.budgetDistribution || [];
      case 'kpi-data':
        return data.kpis || [];
      case 'performance-trends':
        return data.performanceTrends || [];
      case 'performance-comparison':
        return data.performanceComparison || [];
      default:
        return data[dataSource] || [];
    }
  }

  // Métodos para generar archivos
  private async generatePDF(content: any, template: ReportTemplate): Promise<string> {
    // Simular generación de PDF
    const fileName = `${template.id}-${Date.now()}.pdf`;
    
    // Aquí podrías usar librerías como jsPDF, Puppeteer, o servicios externos
    // Por ahora, simulamos la generación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `/reports/${fileName}`;
  }

  private async generateExcel(content: any, template: ReportTemplate): Promise<string> {
    // Simular generación de Excel
    const fileName = `${template.id}-${Date.now()}.xlsx`;
    
    // Aquí podrías usar librerías como ExcelJS
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `/reports/${fileName}`;
  }

  private async generateCSV(content: any, template: ReportTemplate): Promise<string> {
    // Simular generación de CSV
    const fileName = `${template.id}-${Date.now()}.csv`;
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return `/reports/${fileName}`;
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  scheduleReportFromTemplate(templateId: string, schedule: ReportSchedule): void {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Plantilla no encontrada: ${templateId}`);
    }

    // Aquí implementarías la lógica de programación real
    console.log(`📅 Programando reporte desde plantilla "${template.name}"`);
    this.startScheduledReport(templateId, schedule);
  }

  private startScheduledReport(templateId: string, schedule: ReportSchedule): void {
    // Implementar lógica de programación de reportes
    // Podrías usar setInterval o una librería como node-cron
    console.log(`Scheduled report ${templateId} to run ${schedule.frequency} at ${schedule.time}`);
  }

  // Métodos para generar reportes
  getReport(id: string): ReportData | undefined {
    return this.reports.find(report => report.id === id);
  }

  getAllReports(): ReportData[] {
    return [...this.reports];
  }

  getReportsByTemplate(templateId: string): ReportData[] {
    return this.reports.filter(report => report.configId === templateId);
  }

  deleteReport(id: string): boolean {
    const index = this.reports.findIndex(report => report.id === id);
    if (index !== -1) {
      this.reports.splice(index, 1);
      return true;
    }
    return false;
  }

  // Métodos de utilidad
  exportTemplate(templateId: string): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }
    
    return JSON.stringify(template, null, 2);
  }

  importTemplate(templateJson: string): void {
    try {
      const template: ReportTemplate = JSON.parse(templateJson);
      this.addTemplate(template);
    } catch (error) {
      throw new Error('Invalid template JSON');
    }
  }

  // Métodos para análisis de reportes
  getReportStats(): any {
    const totalReports = this.reports.length;
    const completedReports = this.reports.filter(r => r.status === 'completed').length;
    const failedReports = this.reports.filter(r => r.status === 'failed').length;
    const pendingReports = this.reports.filter(r => r.status === 'pending').length;

    const reportsByFormat = this.reports.reduce((acc, report) => {
      acc[report.format] = (acc[report.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const reportsByTemplate = this.reports.reduce((acc, report) => {
      acc[report.configId] = (acc[report.configId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalReports,
      completed: completedReports,
      failed: failedReports,
      pending: pendingReports,
      successRate: totalReports > 0 ? (completedReports / totalReports) * 100 : 0,
      byFormat: reportsByFormat,
      byTemplate: reportsByTemplate,
    };
  }

  updateDefaultConfig(newConfig: Partial<ReportConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...newConfig };
  }

  getDefaultConfig(): ReportConfig {
    return { ...this.defaultConfig };
  }
}

// Exportar instancia singleton
export const reportGenerator = ReportGenerator.getInstance();

// Hooks de conveniencia para React
export const useReportGenerator = () => {
  return {
    generateReport: (configId: string, data?: any) => reportGenerator.generateReport(configId, data),
    getReports: (filter?: { status?: string; configId?: string }) => reportGenerator.getReports(filter),
    getConfigs: () => reportGenerator.getConfigs(),
    getTemplates: () => reportGenerator.getTemplates(),
    exportToPDF: (report: ReportData) => reportGenerator.exportToPDF(report),
    exportToExcel: (report: ReportData) => reportGenerator.exportToExcel(report),
    exportToCSV: (report: ReportData) => reportGenerator.exportToCSV(report),
    scheduleReport: (configId: string) => reportGenerator.scheduleReport(configId),
    cancelScheduledReport: (configId: string) => reportGenerator.cancelScheduledReport(configId)
  };
}; 