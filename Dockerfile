# Utilisation de Node.js 18 comme base
FROM node:18-alpine

# Définition des variables d'environnement par défaut
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error

# Installation des dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package*.json
COPY package*.json ./

# Installation des dépendances
RUN npm config set network-timeout 60000 && \
    npm install --no-optional --legacy-peer-deps

# Copie du reste des fichiers du projet
COPY . .

# Build du frontend et du backend
RUN npm run build

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"]
