import express, { Request, Response, Router } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from 'path';
import { createServer } from 'net';

// Charger les variables d'environnement
const result = dotenv.config();
console.log(' Résultat du chargement .env:', result);
console.log(' Variables d\'environnement chargées:', {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? ' Définie' : ' Non définie',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? ' Définie' : ' Non définie'
});

// Gestionnaire d'erreurs global
process.on('uncaughtException', (err) => {
  console.error(' Erreur non interceptée:', err);
});

// Initialisation de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Types pour la route d'inscription
interface SignUpBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SignUpResponse {
  message?: string;
  user?: any;
  error?: string;
}

// Création de l'application Express
const app = express();

// Configuration de CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://bellefontaine.railway.app' : 'http://localhost:8081',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques du build frontend
const __dirname = new URL('.', import.meta.url).pathname;
app.use(express.static(path.join(__dirname, '../dist')));

// Création du routeur
const router = Router();

// Test du serveur
router.get("/", (_req: Request, res: Response) => {
  res.send(" API Express fonctionne !");
});

// Route d'inscription (sécurisée)
router.post<ParamsDictionary, SignUpResponse, SignUpBody>(
  "/signup",
  async (req: Request<ParamsDictionary, SignUpResponse, SignUpBody>, res: Response<SignUpResponse>) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      if (!email || !password || !firstName || !lastName) {
        res.status(400).json({ 
          error: "Tous les champs sont requis (email, mot de passe, prénom, nom)" 
        });
        return;
      }

      console.log(' Tentative d\'inscription:', { email, firstName, lastName });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      });

      if (error) {
        console.error(" Erreur lors de l'inscription:", error);
        res.status(400).json({ error: error.message });
        return;
      }

      if (!data.user) {
        res.status(400).json({ error: "Erreur lors de la création de l'utilisateur" });
        return;
      }

      // Création du profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            email: email,
          }
        ]);

      if (profileError) {
        console.error(" Erreur lors de la création du profil:", profileError);
        res.status(400).json({ error: "Erreur lors de la création du profil" });
        return;
      }

      res.json({ 
        message: " Utilisateur inscrit avec succès", 
        user: data.user 
      });

    } catch (error: any) {
      console.error(" Erreur inattendue:", error);
      res.status(500).json({ 
        error: "Une erreur inattendue est survenue" 
      });
    }
  }
);

// Utiliser le routeur pour les routes API
app.use('/api', router);

// Toutes les autres routes renvoient vers l'index.html
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Fonction pour trouver un port disponible
const findAvailablePort = async (startPort: number): Promise<number> => {
  const isPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server = createServer();
      
      server.once('error', () => {
        resolve(false);
      });
      
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      
      server.listen(port);
    });
  };
  
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  
  return port;
};

// Démarrer le serveur
const startServer = async () => {
  const defaultPort = parseInt(process.env.PORT || '5000');
  const port = await findAvailablePort(defaultPort);
  
  // Mettre à jour la variable d'environnement PORT
  process.env.PORT = port.toString();
  
  app.listen(port, () => {
    console.log(` Serveur démarré sur http://localhost:${port}`);
    if (port !== defaultPort) {
      console.log(` Le port ${defaultPort} était occupé, utilisation du port ${port} à la place`);
    }
  });
};

startServer().catch(err => {
  console.error(' Erreur lors du démarrage du serveur:', err);
  process.exit(1);
});
