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
