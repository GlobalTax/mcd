class WorkflowManager {
    constructor() {
        this.workflows = new Map();
        this.instances = new Map();
        this.templates = new Map();
        this.isEnabled = true;
    }
    // Inicializar workflows del sistema
    initialize() {
        this.loadDefaultWorkflows();
        this.loadDefaultTemplates();
    }
    // Cargar workflows por defecto
    loadDefaultWorkflows() {
        const defaultWorkflows = [
            // Workflow de aprobación de presupuesto
            {
                id: 'budget_approval',
                name: 'Aprobación de Presupuesto',
                description: 'Workflow para aprobar presupuestos de restaurantes',
                version: '1.0.0',
                enabled: true,
                steps: [
                    {
                        id: 'step_1',
                        name: 'Creación de Presupuesto',
                        description: 'El franquiciado crea el presupuesto',
                        type: 'task',
                        assigneeType: 'auto',
                        actions: [
                            {
                                type: 'send_notification',
                                target: 'manager',
                                value: 'Nuevo presupuesto creado'
                            }
                        ]
                    },
                    {
                        id: 'step_2',
                        name: 'Revisión del Gerente',
                        description: 'El gerente revisa el presupuesto',
                        type: 'approval',
                        assigneeType: 'role',
                        assignee: 'manager',
                        timeout: 1440, // 24 horas
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'under_review'
                            }
                        ]
                    },
                    {
                        id: 'step_3',
                        name: 'Aprobación Final',
                        description: 'Aprobación final por administrador',
                        type: 'approval',
                        assigneeType: 'role',
                        assignee: 'admin',
                        conditions: [
                            {
                                type: 'field',
                                field: 'amount',
                                operator: 'greater_than',
                                value: 100000
                            }
                        ],
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'approved'
                            }
                        ]
                    },
                    {
                        id: 'step_4',
                        name: 'Notificación de Aprobación',
                        description: 'Notificar al franquiciado',
                        type: 'notification',
                        assigneeType: 'auto',
                        actions: [
                            {
                                type: 'send_notification',
                                target: 'franchisee',
                                value: 'Presupuesto aprobado'
                            }
                        ]
                    }
                ],
                triggers: [
                    {
                        type: 'on_create',
                        resource: 'budgets'
                    }
                ]
            },
            // Workflow de valoración de restaurante
            {
                id: 'restaurant_valuation',
                name: 'Valoración de Restaurante',
                description: 'Workflow para valorar restaurantes',
                version: '1.0.0',
                enabled: true,
                steps: [
                    {
                        id: 'step_1',
                        name: 'Recopilación de Datos',
                        description: 'Recopilar datos financieros del restaurante',
                        type: 'task',
                        assigneeType: 'user',
                        assignee: 'franchisee',
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'data_collection'
                            }
                        ]
                    },
                    {
                        id: 'step_2',
                        name: 'Análisis Financiero',
                        description: 'Análisis financiero por el asesor',
                        type: 'task',
                        assigneeType: 'role',
                        assignee: 'advisor',
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'financial_analysis'
                            }
                        ]
                    },
                    {
                        id: 'step_3',
                        name: 'Cálculo de Valoración',
                        description: 'Cálculo automático de la valoración',
                        type: 'action',
                        assigneeType: 'auto',
                        actions: [
                            {
                                type: 'custom',
                                customFunction: 'calculateValuation'
                            }
                        ]
                    },
                    {
                        id: 'step_4',
                        name: 'Revisión de Valoración',
                        description: 'Revisión por el gerente',
                        type: 'approval',
                        assigneeType: 'role',
                        assignee: 'manager',
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'valuation_review'
                            }
                        ]
                    },
                    {
                        id: 'step_5',
                        name: 'Generación de Reporte',
                        description: 'Generar reporte final',
                        type: 'action',
                        assigneeType: 'auto',
                        actions: [
                            {
                                type: 'custom',
                                customFunction: 'generateValuationReport'
                            }
                        ]
                    }
                ],
                triggers: [
                    {
                        type: 'on_create',
                        resource: 'valuations'
                    }
                ]
            },
            // Workflow de onboarding de franquiciado
            {
                id: 'franchisee_onboarding',
                name: 'Onboarding de Franquiciado',
                description: 'Workflow para onboarding de nuevos franquiciados',
                version: '1.0.0',
                enabled: true,
                steps: [
                    {
                        id: 'step_1',
                        name: 'Registro de Franquiciado',
                        description: 'Registro inicial del franquiciado',
                        type: 'task',
                        assigneeType: 'user',
                        assignee: 'franchisee',
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'registered'
                            }
                        ]
                    },
                    {
                        id: 'step_2',
                        name: 'Verificación de Documentos',
                        description: 'Verificación de documentos por administrador',
                        type: 'approval',
                        assigneeType: 'role',
                        assignee: 'admin',
                        timeout: 2880, // 48 horas
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'document_verification'
                            }
                        ]
                    },
                    {
                        id: 'step_3',
                        name: 'Configuración de Cuenta',
                        description: 'Configuración automática de la cuenta',
                        type: 'action',
                        assigneeType: 'auto',
                        actions: [
                            {
                                type: 'custom',
                                customFunction: 'setupUserAccount'
                            }
                        ]
                    },
                    {
                        id: 'step_4',
                        name: 'Entrenamiento',
                        description: 'Asignación de entrenamiento',
                        type: 'task',
                        assigneeType: 'role',
                        assignee: 'trainer',
                        actions: [
                            {
                                type: 'send_notification',
                                target: 'franchisee',
                                value: 'Entrenamiento asignado'
                            }
                        ]
                    },
                    {
                        id: 'step_5',
                        name: 'Activación Final',
                        description: 'Activación de la cuenta',
                        type: 'approval',
                        assigneeType: 'role',
                        assignee: 'manager',
                        actions: [
                            {
                                type: 'update_field',
                                target: 'status',
                                value: 'active'
                            },
                            {
                                type: 'send_notification',
                                target: 'franchisee',
                                value: 'Cuenta activada'
                            }
                        ]
                    }
                ],
                triggers: [
                    {
                        type: 'on_create',
                        resource: 'users',
                        conditions: [
                            {
                                type: 'field',
                                field: 'role',
                                operator: 'equals',
                                value: 'franchisee'
                            }
                        ]
                    }
                ]
            }
        ];
        defaultWorkflows.forEach(workflow => {
            this.workflows.set(workflow.id, workflow);
        });
    }
    // Cargar templates por defecto
    loadDefaultTemplates() {
        const defaultTemplates = [
            {
                id: 'template_approval',
                name: 'Template de Aprobación',
                description: 'Template genérico para workflows de aprobación',
                category: 'approval',
                workflow: {
                    name: 'Workflow de Aprobación',
                    description: 'Workflow genérico para aprobaciones',
                    version: '1.0.0',
                    enabled: true,
                    steps: [
                        {
                            id: 'step_1',
                            name: 'Solicitud',
                            description: 'Creación de la solicitud',
                            type: 'task',
                            assigneeType: 'auto'
                        },
                        {
                            id: 'step_2',
                            name: 'Aprobación',
                            description: 'Aprobación por autoridad competente',
                            type: 'approval',
                            assigneeType: 'role',
                            assignee: 'approver'
                        }
                    ],
                    triggers: [
                        {
                            type: 'on_create',
                            resource: 'requests'
                        }
                    ]
                },
                usage: 0,
                rating: 4.5,
                createdBy: 'system',
                createdAt: new Date()
            }
        ];
        defaultTemplates.forEach(template => {
            this.templates.set(template.id, template);
        });
    }
    // Crear workflow
    createWorkflow(workflow) {
        const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newWorkflow = {
            id: workflowId,
            ...workflow
        };
        this.workflows.set(workflowId, newWorkflow);
        return workflowId;
    }
    // Actualizar workflow
    updateWorkflow(workflowId, updates) {
        const workflow = this.workflows.get(workflowId);
        if (workflow) {
            this.workflows.set(workflowId, { ...workflow, ...updates });
        }
    }
    // Eliminar workflow
    deleteWorkflow(workflowId) {
        this.workflows.delete(workflowId);
    }
    // Obtener workflow
    getWorkflow(workflowId) {
        return this.workflows.get(workflowId);
    }
    // Obtener todos los workflows
    getAllWorkflows() {
        return Array.from(this.workflows.values());
    }
    // Iniciar instancia de workflow
    startWorkflow(workflowId, data, createdBy) {
        const workflow = this.workflows.get(workflowId);
        if (!workflow) {
            throw new Error(`Workflow ${workflowId} not found`);
        }
        if (!workflow.enabled) {
            throw new Error(`Workflow ${workflowId} is disabled`);
        }
        const instanceId = `instance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const instance = {
            id: instanceId,
            workflowId,
            status: 'running',
            currentStep: 0,
            data,
            startedAt: new Date(),
            createdBy,
            assignees: {},
            history: []
        };
        this.instances.set(instanceId, instance);
        // Ejecutar primer paso
        this.executeStep(instanceId, 0);
        return instanceId;
    }
    // Ejecutar paso del workflow
    executeStep(instanceId, stepIndex) {
        const instance = this.instances.get(instanceId);
        if (!instance)
            return;
        const workflow = this.workflows.get(instance.workflowId);
        if (!workflow || stepIndex >= workflow.steps.length) {
            this.completeWorkflow(instanceId);
            return;
        }
        const step = workflow.steps[stepIndex];
        // Registrar inicio del paso
        this.addHistoryItem(instanceId, step.id, 'started');
        // Verificar condiciones
        if (step.conditions && !this.evaluateConditions(step.conditions, instance.data)) {
            this.addHistoryItem(instanceId, step.id, 'skipped');
            this.executeStep(instanceId, stepIndex + 1);
            return;
        }
        // Ejecutar acciones
        if (step.actions) {
            step.actions.forEach(action => {
                this.executeAction(action, instance);
            });
        }
        // Determinar siguiente acción según el tipo de paso
        switch (step.type) {
            case 'task':
                if (step.assigneeType === 'auto') {
                    this.addHistoryItem(instanceId, step.id, 'completed');
                    this.executeStep(instanceId, stepIndex + 1);
                }
                else {
                    // Asignar a usuario/rol
                    this.assignStep(instanceId, stepIndex, step);
                }
                break;
            case 'approval':
                // Esperar aprobación
                this.assignStep(instanceId, stepIndex, step);
                break;
            case 'notification':
                // Enviar notificación y continuar
                this.addHistoryItem(instanceId, step.id, 'completed');
                this.executeStep(instanceId, stepIndex + 1);
                break;
            case 'condition':
                // Evaluar condición y decidir siguiente paso
                this.evaluateConditionStep(instanceId, stepIndex, step);
                break;
            case 'action':
                // Ejecutar acción automática
                this.addHistoryItem(instanceId, step.id, 'completed');
                this.executeStep(instanceId, stepIndex + 1);
                break;
        }
    }
    // Evaluar condiciones
    evaluateConditions(conditions, data) {
        return conditions.every(condition => {
            switch (condition.type) {
                case 'field':
                    if (!condition.field)
                        return false;
                    const fieldValue = data[condition.field];
                    return this.evaluateOperator(fieldValue, condition.operator, condition.value);
                case 'user':
                    // Implementar lógica de usuario
                    return true;
                case 'time':
                    // Implementar lógica de tiempo
                    return true;
                case 'custom':
                    if (!condition.customFunction)
                        return false;
                    try {
                        const fn = new Function('data', condition.customFunction);
                        return fn(data);
                    }
                    catch (error) {
                        console.error('Error evaluating custom condition:', error);
                        return false;
                    }
                default:
                    return false;
            }
        });
    }
    // Evaluar operador
    evaluateOperator(value, operator, expectedValue) {
        switch (operator) {
            case 'equals':
                return value === expectedValue;
            case 'not_equals':
                return value !== expectedValue;
            case 'contains':
                return String(value).includes(String(expectedValue));
            case 'greater_than':
                return Number(value) > Number(expectedValue);
            case 'less_than':
                return Number(value) < Number(expectedValue);
            case 'in':
                return Array.isArray(expectedValue) && expectedValue.includes(value);
            case 'not_in':
                return Array.isArray(expectedValue) && !expectedValue.includes(value);
            default:
                return false;
        }
    }
    // Ejecutar acción
    executeAction(action, instance) {
        switch (action.type) {
            case 'update_field':
                if (action.target && action.value !== undefined) {
                    instance.data[action.target] = action.value;
                }
                break;
            case 'send_notification':
                // Implementar envío de notificación
                console.log(`Sending notification to ${action.target}: ${action.value}`);
                break;
            case 'call_api':
                // Implementar llamada a API
                console.log(`Calling API: ${action.target}`);
                break;
            case 'create_record':
                // Implementar creación de registro
                console.log(`Creating record: ${action.target}`);
                break;
            case 'custom':
                if (action.customFunction) {
                    try {
                        const fn = new Function('instance', 'data', action.customFunction);
                        fn(instance, instance.data);
                    }
                    catch (error) {
                        console.error('Error executing custom action:', error);
                    }
                }
                break;
        }
    }
    // Asignar paso
    assignStep(instanceId, stepIndex, step) {
        const instance = this.instances.get(instanceId);
        if (!instance)
            return;
        // Determinar asignado según el tipo
        let assignee;
        switch (step.assigneeType) {
            case 'user':
                assignee = step.assignee;
                break;
            case 'role':
                // Buscar usuario con el rol
                assignee = this.findUserByRole(step.assignee);
                break;
            case 'group':
                // Buscar usuario del grupo
                assignee = this.findUserByGroup(step.assignee);
                break;
            case 'auto':
                // Asignación automática
                assignee = this.findAutoAssignee(step, instance.data);
                break;
        }
        if (assignee) {
            instance.assignees[step.id] = assignee;
            instance.currentStep = stepIndex;
        }
    }
    // Evaluar paso de condición
    evaluateConditionStep(instanceId, stepIndex, step) {
        // Implementar lógica de evaluación de condición
        this.addHistoryItem(instanceId, step.id, 'completed');
        this.executeStep(instanceId, stepIndex + 1);
    }
    // Completar workflow
    completeWorkflow(instanceId) {
        const instance = this.instances.get(instanceId);
        if (!instance)
            return;
        instance.status = 'completed';
        instance.completedAt = new Date();
    }
    // Agregar elemento al historial
    addHistoryItem(instanceId, stepId, action, userId, comment, data) {
        const instance = this.instances.get(instanceId);
        if (!instance)
            return;
        const historyItem = {
            id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            stepId,
            action: action,
            timestamp: new Date(),
            userId,
            comment,
            data
        };
        instance.history.push(historyItem);
    }
    // Aprobar paso
    approveStep(instanceId, stepId, userId, comment) {
        const instance = this.instances.get(instanceId);
        if (!instance)
            return;
        const workflow = this.workflows.get(instance.workflowId);
        if (!workflow)
            return;
        const stepIndex = workflow.steps.findIndex(s => s.id === stepId);
        if (stepIndex === -1)
            return;
        // Verificar que el usuario está asignado
        if (instance.assignees[stepId] !== userId) {
            throw new Error('User not assigned to this step');
        }
        this.addHistoryItem(instanceId, stepId, 'approved', userId, comment);
        this.executeStep(instanceId, stepIndex + 1);
    }
    // Rechazar paso
    rejectStep(instanceId, stepId, userId, comment) {
        const instance = this.instances.get(instanceId);
        if (!instance)
            return;
        this.addHistoryItem(instanceId, stepId, 'rejected', userId, comment);
        instance.status = 'failed';
    }
    // Obtener instancia
    getInstance(instanceId) {
        return this.instances.get(instanceId);
    }
    // Obtener instancias por usuario
    getInstancesByUser(userId) {
        return Array.from(this.instances.values()).filter(instance => Object.values(instance.assignees).includes(userId) && instance.status === 'running');
    }
    // Obtener todas las instancias
    getAllInstances() {
        return Array.from(this.instances.values());
    }
    // Crear template
    createTemplate(template) {
        const templateId = `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTemplate = {
            id: templateId,
            ...template,
            usage: 0,
            rating: 0,
            createdAt: new Date()
        };
        this.templates.set(templateId, newTemplate);
        return templateId;
    }
    // Obtener templates
    getTemplates(category) {
        let templates = Array.from(this.templates.values());
        if (category) {
            templates = templates.filter(t => t.category === category);
        }
        return templates.sort((a, b) => b.usage - a.usage);
    }
    // Métodos auxiliares (implementar según necesidades)
    findUserByRole(role) {
        // Implementar búsqueda de usuario por rol
        return undefined;
    }
    findUserByGroup(group) {
        // Implementar búsqueda de usuario por grupo
        return undefined;
    }
    findAutoAssignee(step, data) {
        // Implementar lógica de asignación automática
        return undefined;
    }
    // Habilitar/deshabilitar workflow manager
    enable() {
        this.isEnabled = true;
    }
    disable() {
        this.isEnabled = false;
    }
    // Limpiar instancias antiguas
    cleanup(maxAge = 90 * 24 * 60 * 60 * 1000) {
        const cutoff = new Date(Date.now() - maxAge);
        this.instances.forEach((instance, id) => {
            if (instance.completedAt && instance.completedAt < cutoff) {
                this.instances.delete(id);
            }
        });
    }
}
// Instancia global del workflow manager
export const workflowManager = new WorkflowManager();
// Hooks de React para gestión de workflows
export const useWorkflowManager = () => {
    return {
        createWorkflow: workflowManager.createWorkflow.bind(workflowManager),
        updateWorkflow: workflowManager.updateWorkflow.bind(workflowManager),
        deleteWorkflow: workflowManager.deleteWorkflow.bind(workflowManager),
        getWorkflow: workflowManager.getWorkflow.bind(workflowManager),
        getAllWorkflows: workflowManager.getAllWorkflows.bind(workflowManager),
        startWorkflow: workflowManager.startWorkflow.bind(workflowManager),
        approveStep: workflowManager.approveStep.bind(workflowManager),
        rejectStep: workflowManager.rejectStep.bind(workflowManager),
        getInstance: workflowManager.getInstance.bind(workflowManager),
        getInstancesByUser: workflowManager.getInstancesByUser.bind(workflowManager),
        getAllInstances: workflowManager.getAllInstances.bind(workflowManager),
        createTemplate: workflowManager.createTemplate.bind(workflowManager),
        getTemplates: workflowManager.getTemplates.bind(workflowManager),
        enable: workflowManager.enable.bind(workflowManager),
        disable: workflowManager.disable.bind(workflowManager),
        cleanup: workflowManager.cleanup.bind(workflowManager)
    };
};
