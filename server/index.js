import express from 'express';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration de CORS pour accepter les requêtes du frontend
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Configuration de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Route pour envoyer des emails
app.post('/send-email', async (req, res) => {
  try {
    const { to, templateId, dynamicTemplateData } = req.body;

    const msg = {
      to,
      from: {
        email: 'contact@circuitdebellefontaine.fr',
        name: 'Circuit de Bellefontaine'
      },
      templateId,
      dynamicTemplateData
    };

    try {
      await sgMail.send(msg);
      res.json({ success: true });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error('Erreur lors de la préparation de l\'email:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route de test pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.json({ message: 'Serveur Circuit de Bellefontaine opérationnel' });
});

const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
