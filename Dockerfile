# Multi-stage build para optimizar el tamaño de la imagen
FROM node:18-alpine AS base

# Instalar dependencias necesarias
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Instalar dependencias
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Etapa de build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para build
ARG REACT_APP_API_URL
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY
ARG REACT_APP_VALUATION_API_URL
ARG REACT_APP_BUDGET_API_URL
ARG REACT_APP_ANALYTICS_API_URL
ARG REACT_APP_NOTIFICATIONS_API_URL
ARG REACT_APP_AI_API_URL
ARG REACT_APP_REPORTS_API_URL
ARG REACT_APP_INTEGRATIONS_API_URL

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL
ENV REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY
ENV REACT_APP_VALUATION_API_URL=$REACT_APP_VALUATION_API_URL
ENV REACT_APP_BUDGET_API_URL=$REACT_APP_BUDGET_API_URL
ENV REACT_APP_ANALYTICS_API_URL=$REACT_APP_ANALYTICS_API_URL
ENV REACT_APP_NOTIFICATIONS_API_URL=$REACT_APP_NOTIFICATIONS_API_URL
ENV REACT_APP_AI_API_URL=$REACT_APP_AI_API_URL
ENV REACT_APP_REPORTS_API_URL=$REACT_APP_REPORTS_API_URL
ENV REACT_APP_INTEGRATIONS_API_URL=$REACT_APP_INTEGRATIONS_API_URL

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine AS runner

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copiar archivos buildados
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Copiar archivos estáticos
COPY --from=builder --chown=nextjs:nodejs /app/public /usr/share/nginx/html

# Crear directorio para logs
RUN mkdir -p /var/log/nginx && \
    chown -R nextjs:nodejs /var/log/nginx

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Usuario no-root
USER nextjs

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]

# Etapa de desarrollo (opcional)
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para desarrollo
ENV NODE_ENV=development
ENV VITE_DEV_SERVER_HOST=0.0.0.0
ENV VITE_DEV_SERVER_PORT=3000

# Exponer puerto de desarrollo
EXPOSE 3000

# Comando de desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Etapa de testing
FROM base AS test
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variables de entorno para testing
ENV NODE_ENV=test
ENV CI=true

# Comando de testing
CMD ["npm", "run", "test"]

# Etapa de linting
FROM base AS lint
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Comando de linting
CMD ["npm", "run", "lint"]

# Etapa de type checking
FROM base AS type-check
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Comando de type checking
CMD ["npm", "run", "type-check"] 