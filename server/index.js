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

// Vérifier les variables d'environnement requises
const requiredEnvVars = ['SENDGRID_API_KEY', 'SENDGRID_FROM_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variables d\'environnement manquantes:', missingEnvVars);
  process.exit(1);
}

// Vérifier que la clé API SendGrid est valide
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY?.trim();
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL?.trim();

if (!SENDGRID_API_KEY || SENDGRID_API_KEY.length < 50) {
  console.error('SENDGRID_API_KEY invalide ou trop courte');
  process.exit(1);
}

// Configuration de SendGrid
sgMail.setApiKey(SENDGRID_API_KEY);

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

// Route pour vérifier la configuration SendGrid
app.get('/api/check-config', async (req, res) => {
  try {
    await sgMail.send({
      to: SENDGRID_FROM_EMAIL,
      from: SENDGRID_FROM_EMAIL,
      subject: 'Test de configuration SendGrid',
      text: 'Si vous recevez cet email, la configuration SendGrid fonctionne correctement.'
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      error: 'Erreur de configuration SendGrid',
      details: error.message,
      code: error.code
    });
  }
});

// Route pour envoyer des emails
app.post('/api/send-email', async (req, res) => {
  try {
    console.log('Requête reçue:', req.body);
    console.log('API Key utilisée:', `${SENDGRID_API_KEY.substring(0, 10)}...`);
    
    const { to, templateId, dynamicTemplateData } = req.body;
    
    if (!to || !templateId || !dynamicTemplateData) {
      console.error('Données manquantes:', { to, templateId, dynamicTemplateData });
      return res.status(400).json({ 
        error: 'Données manquantes',
        details: 'to, templateId et dynamicTemplateData sont requis'
      });
    }

    const msg = {
      to,
      from: {
        email: SENDGRID_FROM_EMAIL,
        name: 'Circuit de Bellefontaine'
      },
      templateId,
      dynamicTemplateData
    };

    console.log('Configuration email:', {
      ...msg,
      from: SENDGRID_FROM_EMAIL,
      apiKeyLength: SENDGRID_API_KEY.length
    });

    const [response] = await sgMail.send(msg);
    console.log('Email envoyé avec succès:', {
      statusCode: response.statusCode,
      headers: response.headers
    });
    
    res.json({ 
      success: true,
      messageId: response?.headers['x-message-id']
    });
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
  console.log('Configuration:');
  console.log('- PORT:', PORT);
  console.log('- NODE_ENV:', process.env.NODE_ENV);
  console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('- SENDGRID_FROM_EMAIL:', SENDGRID_FROM_EMAIL);
  console.log('- SENDGRID_API_KEY:', `${SENDGRID_API_KEY.substring(0, 10)}...`);
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
