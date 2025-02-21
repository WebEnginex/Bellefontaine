# Étape de build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY server/package*.json ./server/
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build du front-end
RUN npm run build

# Build du serveur
WORKDIR /app/server
RUN npm ci --only=production

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server ./server

# Exposer le port
EXPOSE 3000

# Définir l'environnement de production
ENV NODE_ENV=production

# Lancer le serveur
CMD ["node", "server/index.js"]
