class DocumentationGenerator {
    constructor() {
        this.documentation = [];
        this.isEnabled = true;
    }
    // Generar documentación automática
    async generateDocumentation() {
        if (!this.isEnabled)
            return [];
        try {
            // Escanear archivos del proyecto
            const files = await this.scanProjectFiles();
            // Procesar cada archivo
            for (const file of files) {
                await this.processFile(file);
            }
            // Generar documentación de API
            await this.generateAPIDocumentation();
            // Generar documentación de componentes
            await this.generateComponentDocumentation();
            // Generar documentación de hooks
            await this.generateHookDocumentation();
            // Generar documentación de servicios
            await this.generateServiceDocumentation();
            // Guardar documentación
            await this.saveDocumentation();
            return this.documentation;
        }
        catch (error) {
            console.error('Failed to generate documentation:', error);
            throw error;
        }
    }
    // Escanear archivos del proyecto
    async scanProjectFiles() {
        const files = [];
        // Escanear directorio src
        const srcFiles = await this.scanDirectory('src');
        files.push(...srcFiles);
        return files.filter(file => file.endsWith('.ts') ||
            file.endsWith('.tsx') ||
            file.endsWith('.js') ||
            file.endsWith('.jsx'));
    }
    // Escanear directorio recursivamente
    async scanDirectory(dir) {
        const files = [];
        try {
            // En un entorno real, usar fs.readdir
            // Por ahora, simular archivos conocidos
            const knownFiles = [
                'src/App.tsx',
                'src/main.tsx',
                'src/components/dashboard/DashboardMetrics.tsx',
                'src/hooks/useAuth.tsx',
                'src/services/restaurantValuationService.ts',
                'src/utils/analytics.ts'
            ];
            files.push(...knownFiles);
        }
        catch (error) {
            console.warn(`Failed to scan directory ${dir}:`, error);
        }
        return files;
    }
    // Procesar archivo individual
    async processFile(filePath) {
        try {
            const content = await this.readFile(filePath);
            const lines = content.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lineNumber = i + 1;
                // Detectar componentes React
                if (this.isReactComponent(line)) {
                    await this.documentReactComponent(filePath, lineNumber, lines, i);
                }
                // Detectar funciones
                if (this.isFunction(line)) {
                    await this.documentFunction(filePath, lineNumber, lines, i);
                }
                // Detectar interfaces
                if (this.isInterface(line)) {
                    await this.documentInterface(filePath, lineNumber, lines, i);
                }
                // Detectar clases
                if (this.isClass(line)) {
                    await this.documentClass(filePath, lineNumber, lines, i);
                }
                // Detectar hooks
                if (this.isHook(line)) {
                    await this.documentHook(filePath, lineNumber, lines, i);
                }
            }
        }
        catch (error) {
            console.warn(`Failed to process file ${filePath}:`, error);
        }
    }
    // Detectar componentes React
    isReactComponent(line) {
        return /^(export\s+)?(const|function)\s+\w+\s*[:=]\s*(React\.)?FC|function\s+\w+\s*\(.*\)\s*{/.test(line);
    }
    // Detectar funciones
    isFunction(line) {
        return /^(export\s+)?(async\s+)?function\s+\w+|const\s+\w+\s*[:=]\s*(async\s+)?\(/.test(line);
    }
    // Detectar interfaces
    isInterface(line) {
        return /^(export\s+)?interface\s+\w+/.test(line);
    }
    // Detectar clases
    isClass(line) {
        return /^(export\s+)?class\s+\w+/.test(line);
    }
    // Detectar hooks
    isHook(line) {
        return /^(export\s+)?(const|function)\s+use\w+/.test(line);
    }
    // Documentar componente React
    async documentReactComponent(filePath, lineNumber, lines, startIndex) {
        const line = lines[startIndex];
        const nameMatch = line.match(/(?:const|function)\s+(\w+)/);
        if (!nameMatch)
            return;
        const name = nameMatch[1];
        const description = this.extractDescription(lines, startIndex);
        const parameters = this.extractComponentProps(lines, startIndex);
        const examples = this.extractExamples(lines, startIndex);
        const docItem = {
            id: `component_${name}`,
            type: 'component',
            name,
            description,
            filePath,
            lineNumber,
            parameters,
            examples,
            dependencies: this.extractDependencies(lines, startIndex),
            tags: this.extractTags(lines, startIndex),
            lastUpdated: new Date()
        };
        this.documentation.push(docItem);
    }
    // Documentar función
    async documentFunction(filePath, lineNumber, lines, startIndex) {
        const line = lines[startIndex];
        const nameMatch = line.match(/(?:function\s+(\w+)|const\s+(\w+)\s*[:=])/);
        if (!nameMatch)
            return;
        const name = nameMatch[1] || nameMatch[2];
        const description = this.extractDescription(lines, startIndex);
        const parameters = this.extractFunctionParameters(lines, startIndex);
        const returns = this.extractReturnType(lines, startIndex);
        const examples = this.extractExamples(lines, startIndex);
        const docItem = {
            id: `function_${name}`,
            type: 'function',
            name,
            description,
            filePath,
            lineNumber,
            parameters,
            returns,
            examples,
            dependencies: this.extractDependencies(lines, startIndex),
            tags: this.extractTags(lines, startIndex),
            lastUpdated: new Date()
        };
        this.documentation.push(docItem);
    }
    // Documentar interfaz
    async documentInterface(filePath, lineNumber, lines, startIndex) {
        const line = lines[startIndex];
        const nameMatch = line.match(/interface\s+(\w+)/);
        if (!nameMatch)
            return;
        const name = nameMatch[1];
        const description = this.extractDescription(lines, startIndex);
        const parameters = this.extractInterfaceProperties(lines, startIndex);
        const docItem = {
            id: `interface_${name}`,
            type: 'interface',
            name,
            description,
            filePath,
            lineNumber,
            parameters,
            dependencies: this.extractDependencies(lines, startIndex),
            tags: this.extractTags(lines, startIndex),
            lastUpdated: new Date()
        };
        this.documentation.push(docItem);
    }
    // Documentar clase
    async documentClass(filePath, lineNumber, lines, startIndex) {
        const line = lines[startIndex];
        const nameMatch = line.match(/class\s+(\w+)/);
        if (!nameMatch)
            return;
        const name = nameMatch[1];
        const description = this.extractDescription(lines, startIndex);
        const parameters = this.extractClassMethods(lines, startIndex);
        const docItem = {
            id: `class_${name}`,
            type: 'class',
            name,
            description,
            filePath,
            lineNumber,
            parameters,
            dependencies: this.extractDependencies(lines, startIndex),
            tags: this.extractTags(lines, startIndex),
            lastUpdated: new Date()
        };
        this.documentation.push(docItem);
    }
    // Documentar hook
    async documentHook(filePath, lineNumber, lines, startIndex) {
        const line = lines[startIndex];
        const nameMatch = line.match(/(?:const|function)\s+(use\w+)/);
        if (!nameMatch)
            return;
        const name = nameMatch[1];
        const description = this.extractDescription(lines, startIndex);
        const parameters = this.extractFunctionParameters(lines, startIndex);
        const returns = this.extractReturnType(lines, startIndex);
        const examples = this.extractExamples(lines, startIndex);
        const docItem = {
            id: `hook_${name}`,
            type: 'hook',
            name,
            description,
            filePath,
            lineNumber,
            parameters,
            returns,
            examples,
            dependencies: this.extractDependencies(lines, startIndex),
            tags: this.extractTags(lines, startIndex),
            lastUpdated: new Date()
        };
        this.documentation.push(docItem);
    }
    // Extraer descripción de comentarios
    extractDescription(lines, startIndex) {
        let description = '';
        // Buscar comentarios JSDoc antes del elemento
        for (let i = startIndex - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.startsWith('//')) {
                description = line.replace('//', '').trim() + ' ' + description;
            }
            else if (line.startsWith('/**')) {
                // Procesar comentario JSDoc
                let j = i;
                while (j < lines.length && !lines[j].includes('*/')) {
                    const docLine = lines[j].replace(/^\s*\*?\s*/, '').trim();
                    if (docLine && !docLine.startsWith('@')) {
                        description += docLine + ' ';
                    }
                    j++;
                }
                break;
            }
            else if (line === '') {
                continue;
            }
            else {
                break;
            }
        }
        return description.trim();
    }
    // Extraer parámetros de componente
    extractComponentProps(lines, startIndex) {
        const parameters = [];
        // Buscar definición de props
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('Props') || line.includes('props')) {
                // Extraer propiedades de la interfaz Props
                const propsMatch = line.match(/Props\s*[:=]\s*{([^}]+)}/);
                if (propsMatch) {
                    const propsContent = propsMatch[1];
                    const propMatches = propsContent.match(/(\w+)\s*[:?]\s*([^,;]+)/g);
                    if (propMatches) {
                        propMatches.forEach(prop => {
                            const [name, type] = prop.split(':').map(s => s.trim());
                            parameters.push({
                                name,
                                type,
                                description: '',
                                required: !prop.includes('?')
                            });
                        });
                    }
                }
                break;
            }
        }
        return parameters;
    }
    // Extraer parámetros de función
    extractFunctionParameters(lines, startIndex) {
        const parameters = [];
        // Buscar parámetros en la definición de función
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('(') && line.includes(')')) {
                const paramsMatch = line.match(/\(([^)]+)\)/);
                if (paramsMatch) {
                    const paramsContent = paramsMatch[1];
                    const paramMatches = paramsContent.match(/(\w+)\s*[:?]\s*([^,;]+)/g);
                    if (paramMatches) {
                        paramMatches.forEach(param => {
                            const [name, type] = param.split(':').map(s => s.trim());
                            parameters.push({
                                name,
                                type,
                                description: '',
                                required: !param.includes('?')
                            });
                        });
                    }
                }
                break;
            }
        }
        return parameters;
    }
    // Extraer propiedades de interfaz
    extractInterfaceProperties(lines, startIndex) {
        const parameters = [];
        // Buscar propiedades de la interfaz
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('}'))
                break;
            const propMatch = line.match(/(\w+)\s*[:?]\s*([^;]+)/);
            if (propMatch) {
                const [, name, type] = propMatch;
                parameters.push({
                    name,
                    type: type.trim(),
                    description: '',
                    required: !line.includes('?')
                });
            }
        }
        return parameters;
    }
    // Extraer métodos de clase
    extractClassMethods(lines, startIndex) {
        const parameters = [];
        // Buscar métodos de la clase
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('}') && line.trim() === '}')
                break;
            const methodMatch = line.match(/(\w+)\s*\(([^)]*)\)/);
            if (methodMatch) {
                const [, name, params] = methodMatch;
                parameters.push({
                    name,
                    type: 'method',
                    description: '',
                    required: true
                });
            }
        }
        return parameters;
    }
    // Extraer tipo de retorno
    extractReturnType(lines, startIndex) {
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes(':')) {
                const returnMatch = line.match(/:\s*([^;{]+)/);
                if (returnMatch) {
                    return returnMatch[1].trim();
                }
            }
            if (line.includes('{'))
                break;
        }
        return '';
    }
    // Extraer ejemplos
    extractExamples(lines, startIndex) {
        const examples = [];
        // Buscar comentarios con ejemplos
        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i];
            if (line.includes('@example') || line.includes('Example:')) {
                const example = {
                    title: 'Usage Example',
                    code: '',
                    description: ''
                };
                // Extraer código del ejemplo
                let j = i + 1;
                while (j < lines.length && !lines[j].includes('*/')) {
                    example.code += lines[j] + '\n';
                    j++;
                }
                examples.push(example);
            }
        }
        return examples;
    }
    // Extraer dependencias
    extractDependencies(lines, startIndex) {
        const dependencies = [];
        // Buscar imports
        for (let i = 0; i < startIndex; i++) {
            const line = lines[i];
            if (line.startsWith('import')) {
                const importMatch = line.match(/from\s+['"]([^'"]+)['"]/);
                if (importMatch) {
                    dependencies.push(importMatch[1]);
                }
            }
        }
        return dependencies;
    }
    // Extraer tags
    extractTags(lines, startIndex) {
        const tags = [];
        // Buscar comentarios con tags
        for (let i = startIndex - 1; i >= 0; i--) {
            const line = lines[i];
            if (line.includes('@')) {
                const tagMatches = line.match(/@(\w+)/g);
                if (tagMatches) {
                    tags.push(...tagMatches.map(tag => tag.substring(1)));
                }
            }
            if (line === '')
                break;
        }
        return tags;
    }
    // Generar documentación de API
    async generateAPIDocumentation() {
        const apiDocs = this.documentation.filter(doc => doc.type === 'function' || doc.type === 'service');
        // Generar archivo de documentación de API
        const apiContent = this.generateMarkdown(apiDocs, 'API Documentation');
        await this.writeFile('docs/api.md', apiContent);
    }
    // Generar documentación de componentes
    async generateComponentDocumentation() {
        const componentDocs = this.documentation.filter(doc => doc.type === 'component');
        // Generar archivo de documentación de componentes
        const componentContent = this.generateMarkdown(componentDocs, 'Component Documentation');
        await this.writeFile('docs/components.md', componentContent);
    }
    // Generar documentación de hooks
    async generateHookDocumentation() {
        const hookDocs = this.documentation.filter(doc => doc.type === 'hook');
        // Generar archivo de documentación de hooks
        const hookContent = this.generateMarkdown(hookDocs, 'Hook Documentation');
        await this.writeFile('docs/hooks.md', hookContent);
    }
    // Generar documentación de servicios
    async generateServiceDocumentation() {
        const serviceDocs = this.documentation.filter(doc => doc.type === 'service');
        // Generar archivo de documentación de servicios
        const serviceContent = this.generateMarkdown(serviceDocs, 'Service Documentation');
        await this.writeFile('docs/services.md', serviceContent);
    }
    // Generar markdown
    generateMarkdown(docs, title) {
        let markdown = `# ${title}\n\n`;
        markdown += `Generated on: ${new Date().toISOString()}\n\n`;
        docs.forEach(doc => {
            markdown += `## ${doc.name}\n\n`;
            markdown += `**Type:** ${doc.type}\n\n`;
            markdown += `**File:** \`${doc.filePath}:${doc.lineNumber}\`\n\n`;
            if (doc.description) {
                markdown += `**Description:** ${doc.description}\n\n`;
            }
            if (doc.parameters && doc.parameters.length > 0) {
                markdown += `### Parameters\n\n`;
                markdown += `| Name | Type | Required | Description |\n`;
                markdown += `|------|------|----------|-------------|\n`;
                doc.parameters.forEach(param => {
                    markdown += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} |\n`;
                });
                markdown += `\n`;
            }
            if (doc.returns) {
                markdown += `**Returns:** ${doc.returns}\n\n`;
            }
            if (doc.examples && doc.examples.length > 0) {
                markdown += `### Examples\n\n`;
                doc.examples.forEach(example => {
                    markdown += `#### ${example.title}\n\n`;
                    markdown += `${example.description}\n\n`;
                    markdown += `\`\`\`typescript\n${example.code}\n\`\`\`\n\n`;
                });
            }
            if (doc.dependencies && doc.dependencies.length > 0) {
                markdown += `**Dependencies:** ${doc.dependencies.join(', ')}\n\n`;
            }
            if (doc.tags && doc.tags.length > 0) {
                markdown += `**Tags:** ${doc.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`;
            }
            markdown += `---\n\n`;
        });
        return markdown;
    }
    // Leer archivo
    async readFile(filePath) {
        // En un entorno real, usar fs.readFile
        // Por ahora, simular contenido
        return `// Mock content for ${filePath}`;
    }
    // Escribir archivo
    async writeFile(filePath, content) {
        // En un entorno real, usar fs.writeFile
        console.log(`Writing documentation to ${filePath}`);
    }
    // Guardar documentación
    async saveDocumentation() {
        // Guardar documentación en formato JSON
        const docData = {
            generatedAt: new Date().toISOString(),
            items: this.documentation
        };
        await this.writeFile('docs/documentation.json', JSON.stringify(docData, null, 2));
    }
    // Buscar en documentación
    searchDocumentation(query) {
        const searchTerm = query.toLowerCase();
        return this.documentation.filter(doc => doc.name.toLowerCase().includes(searchTerm) ||
            doc.description.toLowerCase().includes(searchTerm) ||
            doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
            doc.filePath.toLowerCase().includes(searchTerm));
    }
    // Obtener documentación por tipo
    getDocumentationByType(type) {
        return this.documentation.filter(doc => doc.type === type);
    }
    // Obtener documentación por archivo
    getDocumentationByFile(filePath) {
        return this.documentation.filter(doc => doc.filePath === filePath);
    }
    // Habilitar/deshabilitar generador
    enable() {
        this.isEnabled = true;
    }
    disable() {
        this.isEnabled = false;
    }
    // Limpiar documentación antigua
    cleanup() {
        this.documentation = [];
    }
}
// Instancia global del generador de documentación
export const documentationGenerator = new DocumentationGenerator();
// Hooks de React para documentación
export const useDocumentationGenerator = () => {
    return {
        generateDocumentation: documentationGenerator.generateDocumentation.bind(documentationGenerator),
        searchDocumentation: documentationGenerator.searchDocumentation.bind(documentationGenerator),
        getDocumentationByType: documentationGenerator.getDocumentationByType.bind(documentationGenerator),
        getDocumentationByFile: documentationGenerator.getDocumentationByFile.bind(documentationGenerator),
        enable: documentationGenerator.enable.bind(documentationGenerator),
        disable: documentationGenerator.disable.bind(documentationGenerator),
        cleanup: documentationGenerator.cleanup.bind(documentationGenerator)
    };
};
