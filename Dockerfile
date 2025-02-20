# Build stage
FROM node:18-alpine AS builder

# Installation des dépendances système nécessaires pour la compilation
RUN apk add --no-cache python3 make g++ wget

WORKDIR /app

# Copie des fichiers package*.json
COPY package*.json ./

# Installation des dépendances en mode production seulement
RUN npm install --production --frozen-lockfile

# Copie du reste des fichiers du projet
COPY . .

# Installation des dépendances de développement pour le build
RUN npm install --frozen-lockfile
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Installation de wget pour le healthcheck
RUN apk add --no-cache wget

# Copie des fichiers nécessaires depuis le stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/package*.json ./

# Installation des dépendances de production uniquement
COPY --from=builder /app/node_modules ./node_modules

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port (Railway ignorera cette valeur et utilisera son propre port)
EXPOSE ${PORT}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

# Script de démarrage
CMD ["node", "server/dist/index.js"]
