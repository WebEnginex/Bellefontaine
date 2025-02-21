import express from 'express';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Définir __dirname pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger .env depuis la racine du projet
dotenv.config({ path: join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware pour servir les fichiers statiques du build Vite
app.use(express.static(join(__dirname, '../dist')));

// Middleware CORS et JSON
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configuration de SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY non définie !');
  process.exit(1);
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Route pour envoyer des emails
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('Requête reçue:', req.body);
    
    const { to, templateId, dynamicTemplateData } = req.body;
    
    if (!to || !templateId || !dynamicTemplateData) {
      console.error('Données manquantes:', { to, templateId, dynamicTemplateData });
      return res.status(400).json({ 
        error: 'Données manquantes',
        details: 'to, templateId et dynamicTemplateData sont requis'
      });
    }

    console.log('Préparation de l\'envoi:', {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'contact@circuitdebellefontaine.fr',
      templateId,
      dynamicTemplateData
    });
    
    await sgMail.send({
      to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'contact@circuitdebellefontaine.fr',
        name: 'Circuit de Bellefontaine'
      },
      templateId,
      dynamicTemplateData
    });

    console.log('Email envoyé avec succès à:', to);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur détaillée SendGrid:', {
      message: error.message,
      code: error.code,
      response: error.response?.body
    });
    
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message,
      code: error.code,
      response: error.response?.body
    });
  }
});

// Route pour toutes les autres requêtes - Sert l'app React
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Démarrage du serveur
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log('Variables d\'environnement chargées:');
  console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Définie' : 'Non définie');
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('Signal SIGTERM reçu: fermeture du serveur HTTP');
  server.close(() => {
    console.log('Serveur HTTP fermé');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Signal SIGINT reçu: fermeture du serveur HTTP');
  server.close(() => {
    console.log('Serveur HTTP fermé');
    process.exit(0);
  });
});
