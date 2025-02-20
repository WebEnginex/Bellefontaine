# Build stage
FROM node:18-alpine AS builder

# Installation des dépendances système nécessaires pour la compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copie des fichiers package*.json
COPY package*.json ./

# Installation des dépendances
RUN npm config set network-timeout 60000
RUN npm ci --only=production --legacy-peer-deps

# Copie du reste des fichiers du projet
COPY . .

# Build de l'application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copie des fichiers nécessaires depuis le stage de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port (Railway ignorera cette valeur et utilisera son propre port)
EXPOSE ${PORT}

# Script de démarrage
CMD ["node", "server/dist/index.js"]
