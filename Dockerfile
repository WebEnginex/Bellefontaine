# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY server/package*.json ./server/

# Installer les dépendances du serveur
WORKDIR /app/server
RUN npm ci --only=production

# Retourner à la racine
WORKDIR /app

# Copier le reste des fichiers
COPY . .

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./

# Exposer le port
EXPOSE 3000

# Définir les variables d'environnement
ENV NODE_ENV=production

# Démarrer le serveur
CMD ["node", "server/index.js"]
