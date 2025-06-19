# 🍔 McDonald's Franchise Management - Visual Guide

## 📱 Interfaz Principal

### Dashboard Principal
```
┌─────────────────────────────────────────────────────────────┐
│ 🍔 McDonald's Franchise Management                    👤 Admin │
├─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard │ 🏪 Restaurantes │ 👥 Franquiciados │ 💰 Valoraciones │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ 💰 Ingresos  │ │ 🏪 Restaurantes│ │ 👥 Franquiciados│ │ 📈 Margen   │ │
│  │   €2.4M     │ │     156     │ │     89      │ │   18.5%     │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
│                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐   │
│  │ 📊 Ingresos Mensuales   │ │ 🗺️ Rendimiento Regional │   │
│  │                         │ │                         │   │
│  │ [Gráfico de Barras]     │ │ [Mapa Interactivo]      │   │
│  └─────────────────────────┘ └─────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 📋 Actividad Reciente                                  │ │
│  │ • Nueva valoración completada - Hace 2h                │ │
│  │ • Presupuesto actualizado - Hace 4h                    │ │
│  │ • Nuevo franquiciado registrado - Hace 6h              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Gestión de Restaurantes
```
┌─────────────────────────────────────────────────────────────┐
│ 🏪 Gestión de Restaurantes                          [+ Añadir] │
├─────────────────────────────────────────────────────────────┤
│ Nombre          │ Ubicación        │ Franquiciado │ Estado │ │
├─────────────────────────────────────────────────────────────┤
│ McDonald's Centro│ Madrid Centro   │ Juan Pérez   │ ✅ Activo│ │
│ McDonald's Plaza │ Madrid Plaza    │ Ana López    │ ✅ Activo│ │
│ McDonald's Norte │ Madrid Norte    │ Carlos Ruiz  │ ⚠️ Mant.│ │
└─────────────────────────────────────────────────────────────┘
```

### Valoraciones DCF
```
┌─────────────────────────────────────────────────────────────┐
│ 💰 Calculadora de Valoración DCF                          │
├─────────────────────────────────────────────────────────────┤
│ Restaurante: [McDonald's Centro ▼]                        │
│ Año Base: [2024] Período: [5 años ▼]                      │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 📊 Proyecciones Financieras                            │ │
│ │ Año │ Ingresos │ Costos │ EBITDA │ FCF                 │ │
│ │ 2024│ €500K   │ €350K  │ €150K  │ €120K               │ │
│ │ 2025│ €550K   │ €375K  │ €175K  │ €140K               │ │
│ │ 2026│ €605K   │ €400K  │ €205K  │ €165K               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────┐ ┌─────────────┐                            │
│ │ 💰 VPN      │ │ 📈 TIR      │                            │
│ │ €2,450,000  │ │   18.5%     │                            │
│ └─────────────┘ └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

### Presupuestos Anuales
```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Presupuesto Anual 2024                          [+ Nuevo] │
├─────────────────────────────────────────────────────────────┤
│ Concepto           │ Presupuestado │ Real      │ Var. │ %   │
├─────────────────────────────────────────────────────────────┤
│ Ingresos Ventas    │ €2,500,000    │ €2,450,000│ -50K │ -2% │
│ Costos Operación   │ €1,800,000    │ €1,750,000│ +50K │ +3% │
│ Margen Operativo   │ €700,000      │ €700,000  │ €0   │ 0%  │
│ Gastos Admin.      │ €200,000      │ €195,000  │ +5K  │ +3% │
│ EBITDA             │ €500,000      │ €505,000  │ +5K  │ +1% │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Funcionalidades Principales

### 1. **Dashboard Inteligente**
- ✅ Métricas en tiempo real
- ✅ Gráficos interactivos
- ✅ Alertas automáticas
- ✅ KPIs personalizables

### 2. **Gestión de Restaurantes**
- ✅ CRUD completo
- ✅ Filtros avanzados
- ✅ Búsqueda inteligente
- ✅ Estados y seguimiento

### 3. **Valoraciones DCF**
- ✅ Calculadora automática
- ✅ Proyecciones financieras
- ✅ Análisis de sensibilidad
- ✅ Reportes detallados

### 4. **Presupuestos**
- ✅ Presupuestos anuales
- ✅ Seguimiento vs real
- ✅ Alertas de desviación
- ✅ Análisis de variaciones

### 5. **Gestión de Franquiciados**
- ✅ Perfiles completos
- ✅ Historial de actividad
- ✅ Asignación de restaurantes
- ✅ Comunicación integrada

## 🎨 Diseño y UX

### Paleta de Colores
```
Primario: #1E40AF (Azul McDonald's)
Secundario: #059669 (Verde éxito)
Acento: #DC2626 (Rojo alerta)
Neutro: #6B7280 (Gris)
```

### Tipografía
```
Títulos: Inter Bold
Cuerpo: Inter Regular
Código: JetBrains Mono
```

### Componentes UI
- ✅ Cards responsivas
- ✅ Tablas con paginación
- ✅ Formularios validados
- ✅ Modales y diálogos
- ✅ Notificaciones toast
- ✅ Loading states

## 📊 Analytics y Reportes

### Métricas Clave
```
📈 Ingresos Totales: €2.4M
🏪 Restaurantes Activos: 156
👥 Franquiciados: 89
💰 Margen Promedio: 18.5%
📊 ROI Promedio: 22.5%
```

### Reportes Automáticos
- 📅 Reporte mensual
- 📊 Análisis financiero
- 💰 Valoraciones DCF
- 🎯 KPIs por región

## 🔐 Seguridad y Permisos

### Roles de Usuario
```
👑 Admin: Acceso completo
👨‍💼 Advisor: Consultas y reportes
👤 Franchisee: Solo sus restaurantes
```

### Funcionalidades por Rol
- **Admin**: Todas las funciones
- **Advisor**: Dashboard, reportes, valoraciones
- **Franchisee**: Sus restaurantes, presupuestos

## 🚀 Tecnologías Utilizadas

### Frontend
- ⚛️ React 18
- 🔷 TypeScript
- 🎨 Tailwind CSS
- 🧩 shadcn/ui
- 📊 Recharts
- 🗺️ React Router

### Backend
- 🔥 Supabase
- 🗄️ PostgreSQL
- 🔐 Auth
- 📡 Real-time
- 🗂️ Storage

### Herramientas
- ⚡ Vite
- 🧪 Jest
- 📝 ESLint
- 🎯 Prettier
- 📦 npm/yarn

## 📱 Responsive Design

### Breakpoints
```
📱 Mobile: < 768px
💻 Tablet: 768px - 1024px
🖥️ Desktop: > 1024px
```

### Adaptaciones
- ✅ Sidebar colapsable en mobile
- ✅ Tablas con scroll horizontal
- ✅ Cards apiladas en mobile
- ✅ Navegación optimizada

## 🔄 Flujos de Trabajo

### Valoración DCF
```
1. Seleccionar restaurante
2. Cargar datos históricos
3. Ingresar proyecciones
4. Calcular VPN/TIR
5. Generar reporte
6. Guardar valoración
```

### Presupuesto Anual
```
1. Crear presupuesto base
2. Asignar partidas
3. Revisar y aprobar
4. Seguimiento mensual
5. Análisis de desviaciones
6. Ajustes si necesario
```

## 📈 Roadmap de Mejoras

### Fase 1 (Completado)
- ✅ Dashboard básico
- ✅ CRUD restaurantes
- ✅ Valoraciones DCF
- ✅ Presupuestos

### Fase 2 (En Desarrollo)
- 🔄 Analytics avanzados
- 🔄 Reportes automáticos
- 🔄 Integración IA
- 🔄 Notificaciones push

### Fase 3 (Planificado)
- 📋 PWA offline
- 📋 App móvil
- 📋 Integraciones externas
- 📋 Machine Learning

---

**¿Necesitas más detalles sobre alguna funcionalidad específica?** 