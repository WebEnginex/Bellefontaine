# Utilisation de Node.js 18 comme base
FROM node:18-alpine

# Définition des variables d'environnement par défaut
ENV NODE_ENV=production

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers du projet
COPY . .

# Build du frontend et du backend
RUN npm run build

# Exposition du port (Railway gèrera la variable PORT)
EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"]
