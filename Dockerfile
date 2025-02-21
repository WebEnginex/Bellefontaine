# Étape de construction
FROM node:18-alpine AS builder

WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./
COPY server/package*.json ./server/
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.ts ./
COPY . .

# Installer toutes les dépendances
RUN npm install

# Compiler le projet TypeScript et builder le front
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers depuis l'étape de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port
EXPOSE 3000

# Définir l'environnement de production
ENV NODE_ENV=production

# Lancer l'application
CMD ["serve", "-s", "dist"]
